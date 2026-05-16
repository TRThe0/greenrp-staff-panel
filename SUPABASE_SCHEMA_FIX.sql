-- Run this in Supabase SQL editor to fix missing columns in the existing table schema.
-- It adds the fields used by the app seed and by runtime logic.

ALTER TABLE staffs
  ADD COLUMN IF NOT EXISTS comissaoTotal DECIMAL(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS valorGerado DECIMAL(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS usos INTEGER DEFAULT 0;

-- If the counters row is missing, initialize it too.
INSERT INTO counters (key, nextId, nextLogId, nextAvisoId, nextCupomId)
SELECT 'default', 8, 2, 2, 1
 WHERE NOT EXISTS (SELECT 1 FROM counters WHERE key = 'default');
