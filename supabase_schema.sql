
-- Drop tables if they exist (optional, for clean slate)
-- DROP TABLE IF EXISTS drivers;
-- DROP TABLE IF EXISTS race_rounds;

-- Create Drivers Table
CREATE TABLE drivers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  tier TEXT NOT NULL, -- Enum: 'S', 'A/B', 'C/R'
  points INTEGER DEFAULT 0,
  safety_score INTEGER DEFAULT 0,
  podiums INTEGER DEFAULT 0,
  finished_races INTEGER DEFAULT 0,
  total_races INTEGER DEFAULT 0,
  rank INTEGER NOT NULL,
  trend TEXT NOT NULL -- Enum: 'UP', 'DOWN', 'STABLE'
);

-- Create Race Rounds Table
CREATE TABLE race_rounds (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);

-- Insert Mock Data
INSERT INTO drivers (id, name, tier, points, safety_score, podiums, finished_races, total_races, rank, trend) VALUES
('Sky Cheng', 'Sky Cheng', 'S', 872, 12, 0, 42, 42, 1, 'UP'),
('K. Sato', 'K. Sato', 'S', 856, 14, 12, 41, 42, 2, 'DOWN'),
('Z. Wei', 'Z. Wei', 'S', 842, 10, 8, 42, 42, 3, 'STABLE'),
('M. Rossi', 'M. Rossi', 'S', 810, 11, 5, 40, 42, 4, 'UP'),
('L. Hamilton', 'L. Hamilton', 'S', 795, 15, 15, 38, 42, 5, 'DOWN'),
('A. Senna', 'A. Senna', 'S', 770, 9, 10, 42, 42, 6, 'STABLE'),
('J. Clark', 'J. Clark', 'S', 752, 12, 4, 41, 42, 7, 'UP'),
('S. Vettel', 'S. Vettel', 'S', 730, 11, 3, 42, 42, 8, 'DOWN'),
('N. Lauda', 'N. Lauda', 'S', 715, 13, 6, 40, 42, 9, 'STABLE'),
('F. Alonso', 'F. Alonso', 'S', 698, 10, 2, 42, 42, 10, 'UP'),
('M. Verstappen', 'M. Verstappen', 'A/B', 650, 15, 1, 42, 42, 11, 'UP'),
('C. Leclerc', 'C. Leclerc', 'A/B', 640, 14, 0, 42, 42, 12, 'STABLE');

INSERT INTO race_rounds (id, name) VALUES
(4, '第四轮：总决赛'),
(3, '第三轮：耐力赛'),
(2, '第二轮：冲刺赛'),
(1, '第一轮：资格赛');
