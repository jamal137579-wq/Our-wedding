CREATE TABLE IF NOT EXISTS WeddingRSVPs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  attending INTEGER NOT NULL CHECK (attending IN (0, 1)),
  guestCount INTEGER NOT NULL CHECK (guestCount BETWEEN 0 AND 20),
  createdAt TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_weddingrsvps_createdAt ON WeddingRSVPs(createdAt);
