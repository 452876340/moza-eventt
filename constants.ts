
import { Driver, DriverTier, RankTrend, RaceRound, Series, SeriesRules } from './types';

export const BACKGROUND_IMAGE_URL = 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=2070&auto=format&fit=crop';

export const SERIES_BANNERS: Record<string, string> = {
  monthly: 'https://29673492.s21i.faimallusr.com/2/1/ABUIABACGAAguqOQzAYosqqWzwIwgA84jgY.jpg',
  zhuzhou: 'https://29673492.s21i.faimallusr.com/2/1/ABUIABACGAAguqOQzAYo36ys8gcwgA84jgY.jpg',
  rally: 'https://29673492.s21i.faimallusr.com/2/1/ABUIABACGAAguaOQzAYogtyw-wEwgA84jgY.jpg',
  iracing: 'https://29673492.s21i.faimallusr.com/2/1/ABUIABACGAAguqOQzAYozv3x7wUw_Ao4kwY.jpg',
};

export const SERIES_LIST: Series[] = [
  { id: 'monthly', name: '月度锦标赛' },
  { id: 'zhuzhou', name: '株洲速度节' },
  { id: 'rally', name: '飞驰拉力赛' },
  { id: 'iracing', name: 'iRacing League' },
];

export const MOCK_DRIVERS_MONTHLY: Driver[] = [
  { id: 'Sky Cheng', name: 'Sky Cheng', tier: DriverTier.S, points: 872, safetyScore: 12, podiums: 0, finishedRaces: 42, totalRaces: 42, rank: 1, trend: RankTrend.UP },
  { id: 'K. Sato', name: 'K. Sato', tier: DriverTier.S, points: 856, safetyScore: 14, podiums: 12, finishedRaces: 41, totalRaces: 42, rank: 2, trend: RankTrend.DOWN },
  { id: 'Z. Wei', name: 'Z. Wei', tier: DriverTier.S, points: 842, safetyScore: 10, podiums: 8, finishedRaces: 42, totalRaces: 42, rank: 3, trend: RankTrend.STABLE },
  { id: 'M. Rossi', name: 'M. Rossi', tier: DriverTier.S, points: 810, safetyScore: 11, podiums: 5, finishedRaces: 40, totalRaces: 42, rank: 4, trend: RankTrend.UP },
  { id: 'L. Hamilton', name: 'L. Hamilton', tier: DriverTier.S, points: 795, safetyScore: 15, podiums: 15, finishedRaces: 38, totalRaces: 42, rank: 5, trend: RankTrend.DOWN },
];

export const MOCK_DRIVERS_ZHUZHOU: Driver[] = [
  { id: 'nicoLi44', name: 'nicoLi44', tier: DriverTier.S, points: 1010, safetyScore: 12, podiums: 0, finishedRaces: 37, totalRaces: 42, rank: 1, trend: RankTrend.UP },
  { id: 'SpeedDemon', name: 'SpeedDemon', tier: DriverTier.A, points: 950, safetyScore: 14, podiums: 5, finishedRaces: 40, totalRaces: 42, rank: 2, trend: RankTrend.STABLE },
  { id: 'RacerX', name: 'RacerX', tier: DriverTier.S, points: 920, safetyScore: 11, podiums: 3, finishedRaces: 42, totalRaces: 42, rank: 3, trend: RankTrend.DOWN },
];

export const MOCK_DRIVERS_RALLY: Driver[] = [
  { id: 'Tuski6', name: 'Tuski6', points: 23600, podiums: 0, displayRaces: '43', rank: 1, trend: RankTrend.UP },
  { id: 'DustMaster', name: 'DustMaster', points: 21500, podiums: 2, displayRaces: '40', rank: 2, trend: RankTrend.STABLE },
  { id: 'GravelKing', name: 'GravelKing', points: 19800, podiums: 1, displayRaces: '38', rank: 3, trend: RankTrend.DOWN },
];

export const MOCK_DRIVERS_IRACING: Driver[] = [
  { id: 'SimPro', name: 'SimPro', tier: DriverTier.S, points: 1200, safetyScore: 15, podiums: 10, finishedRaces: 50, totalRaces: 50, rank: 1, trend: RankTrend.UP },
  { id: 'GridRacer', name: 'GridRacer', tier: DriverTier.B, points: 1150, safetyScore: 13, podiums: 8, finishedRaces: 49, totalRaces: 50, rank: 2, trend: RankTrend.STABLE },
];

// Default export for backward compatibility if needed, though we will switch to map
export const MOCK_DRIVERS = MOCK_DRIVERS_MONTHLY;

export const RACE_ROUNDS: RaceRound[] = [
  { id: 4, name: '第四轮：总决赛' },
  { id: 3, name: '第三轮：耐力赛' },
  { id: 2, name: '第二轮：冲刺赛' },
  { id: 1, name: '第一轮：资格赛' },
];

// Mock rounds for other series
export const MOCK_ROUNDS_MAP: Record<string, RaceRound[]> = {
  monthly: [
    { id: 4, name: '月度赛：总决赛' },
    { id: 3, name: '月度赛：淘汰赛' },
    { id: 2, name: '月度赛：小组赛' },
    { id: 1, name: '月度赛：海选赛' },
  ],
  zhuzhou: [
    { id: 4, name: '株洲站：冠军争夺赛' },
    { id: 3, name: '株洲站：半决赛' },
    { id: 2, name: '株洲站：排位赛' },
    { id: 1, name: '株洲站：练习赛' },
  ],
  rally: [
    { id: 4, name: '拉力赛：超级赛段' },
    { id: 3, name: '拉力赛：长距离赛段' },
    { id: 2, name: '拉力赛：夜间赛段' },
    { id: 1, name: '拉力赛：勘路' },
  ],
  iracing: [
    { id: 4, name: 'iRacing：赛季总决赛' },
    { id: 3, name: 'iRacing：洲际对抗赛' },
    { id: 2, name: 'iRacing：俱乐部杯' },
    { id: 1, name: 'iRacing：季前热身' },
  ]
};

export const SERIES_RULES: Record<string, SeriesRules> = {
  monthly: {
    seriesId: 'monthly',
    title: '月度锦标赛',
    description: '根据车手排名评定等级：S级：排名前5% | A级：排名前10% | B级：排名前30% | C级：排名前50% | Rookie级：其他车手\n等级计算原则：车手等级以最高等级为准，不重复计算。',
    groups: [
      {
        title: '月度积分赛',
        description: '比赛时间：每周一21:00举行\n车手根据排名获得相应积分。',
        weeklyReward: '周常奖励：完赛车手获500 MOZA币',
        seasonReward: {
          first: '20,000 MOZA币',
          second: '15,000 MOZA币',
          third: '10,000 MOZA币'
        }
      },
      {
        title: 'C级 / Rookie 组',
        description: 'C级、Rookie车手参赛。\n升降级规则：月度积分前5名升级至Racing组',
        weeklyReward: '周常奖励：完赛车手获200 MOZA币'
      }
    ]
  },
  zhuzhou: {
    seriesId: 'zhuzhou',
    title: '株洲速度节',
    description: '比赛时间：每周三21:00举行',
    groups: [
      {
        title: 'Racing组',
        description: '仅限S、A、B级车手参赛。采用高难度赛车及赛道组合，车手根据等级获得相应积分。',
        weeklyReward: '周常奖励：完赛车手获500 MOZA币',
        seasonReward: {
          first: '15,000 MOZA币',
          second: '12,000 MOZA币',
          third: '8,000 MOZA币'
        }
      },
      {
        title: 'C级 / Rookie 组',
        description: '仅限C级、Rookie车手参赛。',
        weeklyReward: '周常奖励：完赛车手获200 MOZA币'
      }
    ]
  },
  rally: {
    seriesId: 'rally',
    title: '飞驰拉力赛',
    description: '',
    groups: [
      {
        title: '资格赛周期',
        description: '每季度，末周的周一至周五为资格赛，排名前20的车手晋级当周周末总决赛。',
        weeklyReward: '每周完成比赛的车手可获得300 MOZA币。',
        seasonReward: {
          first: '20,000 MOZA币',
          second: '15,000 MOZA币',
          third: '10,000 MOZA币',
          others: '第 4 - 20 名： 1,000 MOZA币'
        }
      }
    ]
  },
  iracing: {
    seriesId: 'iracing',
    title: 'iRacing League',
    description: '根据车手排名评定等级：S级：排名前5% | A级：排名前10% | B级：排名前30% | C级：排名前50% | Rookie级：其他车手\n等级计算原则：车手等级以最高等级为准，不重复计算。',
    groups: [
      {
        title: '月度积分赛',
        description: '比赛时间：每周一21:00举行\n车手根据排名获得相应积分。',
        weeklyReward: '周常奖励：完赛车手获500 MOZA币',
        seasonReward: {
          first: '20,000 MOZA币',
          second: '15,000 MOZA币',
          third: '10,000 MOZA币'
        }
      },
      {
        title: 'C级 / Rookie 组',
        description: 'C级、Rookie车手参赛。\n升降级规则：月度积分前5名升级至Racing组',
        weeklyReward: '周常奖励：完赛车手获200 MOZA币'
      }
    ]
  }
};
