import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// --- 配置区域 (请修改这里) ---
const SERIES_ID = 'monthly'; // 选项: 'monthly', 'zhuzhou', 'rally', 'iracing'
const ROUND_SEQUENCE = 1;    // 轮次: 1, 2, 3, 4
const DATA_FILE = 'data.json'; // 您的数据文件名
// ---------------------------

// 获取当前目录
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 读取 .env 文件获取 Supabase 配置
function getEnvConfig() {
    try {
        const envPath = path.resolve(__dirname, '../.env');
        // 尝试读取 .env (如果存在 .env.local 也可以添加逻辑，这里简单起见读 .env)
        // 注意：Vite 项目通常用 .env.local，我们尝试读取它
        let envContent = '';
        if (fs.existsSync(path.resolve(__dirname, '../.env.local'))) {
            envContent = fs.readFileSync(path.resolve(__dirname, '../.env.local'), 'utf-8');
        } else if (fs.existsSync(envPath)) {
            envContent = fs.readFileSync(envPath, 'utf-8');
        } else {
            console.error('❌ 未找到 .env 或 .env.local 文件，请确保配置了 VITE_SUPABASE_URL 和 VITE_SUPABASE_ANON_KEY');
            process.exit(1);
        }

        const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.*)/);
        const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.*)/);

        if (!urlMatch || !keyMatch) {
            console.error('❌ .env 文件中缺少 VITE_SUPABASE_URL 或 VITE_SUPABASE_ANON_KEY');
            process.exit(1);
        }

        return {
            url: urlMatch[1].trim(),
            key: keyMatch[1].trim()
        };
    } catch (error) {
        console.error('读取配置文件失败:', error);
        process.exit(1);
    }
}

const config = getEnvConfig();
const supabase = createClient(config.url, config.key);

async function importData() {
    console.log(`🚀 开始导入数据...`);
    console.log(`赛事 ID: ${SERIES_ID}`);
    console.log(`轮次: ${ROUND_SEQUENCE}`);

    // 1. 获取 Round ID
    const { data: rounds, error: roundError } = await supabase
        .from('rounds')
        .select('id, name')
        .eq('series_id', SERIES_ID)
        .eq('sequence', ROUND_SEQUENCE)
        .single();

    if (roundError || !rounds) {
        console.error(`❌ 找不到对应的赛段! 请检查 series_id="${SERIES_ID}" 和 sequence=${ROUND_SEQUENCE} 是否正确。`);
        console.error('提示：请先确保数据库中已经运行了 supabase_schema_v2.sql 初始化脚本。');
        return;
    }

    const roundId = rounds.id;
    console.log(`✅ 找到赛段: ${rounds.name} (ID: ${roundId})`);

    // 2. 读取 JSON 数据
    const dataPath = path.resolve(__dirname, DATA_FILE);
    if (!fs.existsSync(dataPath)) {
        console.error(`❌ 数据文件不存在: ${dataPath}`);
        return;
    }

    const rawData = fs.readFileSync(dataPath, 'utf-8');
    let jsonData;
    try {
        jsonData = JSON.parse(rawData);
    } catch (e) {
        console.error('❌ JSON 解析失败，请检查文件格式');
        return;
    }

    if (!Array.isArray(jsonData)) {
        console.error('❌ JSON 数据必须是一个数组 (例如: [{...}, {...}])');
        return;
    }

    console.log(`📦 准备导入 ${jsonData.length} 条数据...`);

    // 3. 转换并插入数据
    const records = jsonData.map(item => {
        // 解析 "完赛｜总场次"
        let finished = 0;
        let total = 0;
        const racesStr = String(item['完赛｜总场次'] || item['display_races'] || '0');
        
        if (racesStr.includes('｜') || racesStr.includes('|')) {
            const parts = racesStr.replace('｜', '|').split('|');
            finished = parseInt(parts[0], 10) || 0;
            total = parseInt(parts[1], 10) || 0;
        } else {
            finished = parseInt(racesStr, 10) || 0;
            total = finished; // 如果只有一个数字，通常假设是完赛数，或者总场次，这里暂定相等
        }

        return {
            round_id: roundId,
            driver_id: item['车手ID'] || item['driver_id'],
            rank: parseInt(item['排名'] || item['rank'], 10),
            tier: item['等级'] || item['tier'] || null,
            points: parseInt(item['积分'] || item['points'] || '0', 10),
            safety_score: parseInt(item['安全分'] || item['safety_score'] || '0', 10),
            podiums: parseInt(item['领奖台'] || item['podiums'] || '0', 10),
            finished_races: finished,
            total_races: total,
            display_races: racesStr
        };
    });

    // 4. 执行插入 (先删除旧的，或者使用 upsert)
    // 这里使用 upsert (insert with onConflict)，因为我们在 database 中设置了 UNIQUE(round_id, driver_id)
    const { error: insertError } = await supabase
        .from('rankings')
        .upsert(records, { onConflict: 'round_id, driver_id' });

    if (insertError) {
        console.error('❌ 插入数据失败:', insertError);
    } else {
        console.log('✅ 数据导入成功！');
    }
}

importData();
