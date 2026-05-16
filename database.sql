-- GreenRP Staff Panel Database Schema for Supabase

-- Table: staffs (Funcionários)
CREATE TABLE IF NOT EXISTS staffs (
  id BIGSERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  senha TEXT NOT NULL,
  cargo TEXT NOT NULL,
  setor TEXT[] DEFAULT ARRAY['Suporte'],
  carga INTEGER DEFAULT 20,
  perm TEXT DEFAULT 'staff' CHECK (perm IN ('admin', 'staff')),
  cupom TEXT UNIQUE NOT NULL,
  pct DECIMAL(5,2) DEFAULT 10,
  online BOOLEAN DEFAULT FALSE,
  foto TEXT DEFAULT '',
  entrada DATE NOT NULL DEFAULT CURRENT_DATE,
  ultimaPromo DATE,
  ultimoAcesso TIMESTAMP WITH TIME ZONE,
  usos INTEGER DEFAULT 0,
  valorGerado DECIMAL(10,2) DEFAULT 0,
  comissaoTotal DECIMAL(10,2) DEFAULT 0,
  idRp INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: cupons (Histórico de cupons usados)
CREATE TABLE IF NOT EXISTS cupons (
  id BIGSERIAL PRIMARY KEY,
  cupom TEXT NOT NULL,
  staff_id BIGINT REFERENCES staffs(id) ON DELETE SET NULL,
  staff_nome TEXT NOT NULL,
  usadoPor TEXT NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  data TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: avisos (Anúncios do sistema)
CREATE TABLE IF NOT EXISTS avisos (
  id BIGSERIAL PRIMARY KEY,
  tipo TEXT NOT NULL CHECK (tipo IN ('info', 'warning', 'success', 'error')),
  msg TEXT NOT NULL,
  autor TEXT NOT NULL,
  data TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: logs (Registro de atividades)
CREATE TABLE IF NOT EXISTS logs (
  id BIGSERIAL PRIMARY KEY,
  type TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  msg TEXT NOT NULL,
  time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: promovidos (Histórico de promoções)
CREATE TABLE IF NOT EXISTS promovidos (
  id BIGSERIAL PRIMARY KEY,
  staff_id BIGINT REFERENCES staffs(id) ON DELETE SET NULL,
  staff_nome TEXT NOT NULL,
  cargo_anterior TEXT NOT NULL,
  cargo_novo TEXT NOT NULL,
  promotor_nome TEXT NOT NULL,
  data TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: counters (Contadores para IDs)
CREATE TABLE IF NOT EXISTS counters (
  key TEXT PRIMARY KEY,
  nextId BIGINT DEFAULT 8,
  nextLogId BIGINT DEFAULT 2,
  nextAvisoId BIGINT DEFAULT 2,
  nextCupomId BIGINT DEFAULT 1,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes para performance
CREATE INDEX IF NOT EXISTS idx_staffs_username ON staffs(LOWER(username));
CREATE INDEX IF NOT EXISTS idx_staffs_cupom ON staffs(UPPER(cupom));
CREATE INDEX IF NOT EXISTS idx_cupons_data ON cupons(data DESC);
CREATE INDEX IF NOT EXISTS idx_avisos_data ON avisos(data DESC);
CREATE INDEX IF NOT EXISTS idx_logs_data ON logs(time DESC);
CREATE INDEX IF NOT EXISTS idx_promovidos_data ON promovidos(data DESC);

-- Initialize counters
INSERT INTO counters (key, nextId, nextLogId, nextAvisoId, nextCupomId)
VALUES ('default', 8, 2, 2, 1)
ON CONFLICT (key) DO NOTHING;

-- Initial seed data
INSERT INTO staffs (id, nome, username, senha, cargo, setor, carga, perm, cupom, pct, entrada, ultimaPromo, ultimoAcesso)
VALUES
  (1, 'Bruno', 'bruno', 'H91ydho8', 'CEO', ARRAY['Administração'], 30, 'admin', 'BRUNO2024', 15, '2025-09-12', '2026-03-12', '2026-05-12T01:48:11.302Z'),
  (2, 'Souza', 'souza', 'Ht01ub68', 'Administrador', ARRAY['Administração'], 25, 'admin', 'SOUZA10', 10, '2025-10-12', '2026-02-12', NULL),
  (3, 'Veio', 'veio', 'H5oaa657', 'Administrador', ARRAY['Administração'], 20, 'admin', 'VEIO15', 15, '2025-11-12', '2026-01-12', NULL),
  (4, 'Folha', 'folha', 'H4x725y8', 'Diretor', ARRAY['Administração'], 22, 'admin', 'FOLHA20', 20, '2025-12-12', '2026-04-12', NULL),
  (5, 'Leo', 'leo', 'Hiapqck6', 'Administrador', ARRAY['Administração'], 18, 'admin', 'LEO10', 10, '2026-01-12', '2026-03-12', NULL),
  (6, 'Roxy', 'roxy', 'Hmyopys7', 'Administrador', ARRAY['Administração'], 20, 'admin', 'ROXY10', 10, '2026-02-12', '2026-04-12', NULL),
  (7, 'Theo', 'theo', 'Hmbklgs7', 'Moderador', ARRAY['Suporte'], 15, 'staff', 'THEO5', 5, '2026-03-12', '2026-04-12', NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO avisos (id, tipo, msg, autor, data)
VALUES (1, 'info', 'Bem-vindos ao novo painel de gerenciamento da staff!', 'Sistema', NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO logs (id, type, icon, color, msg, time)
VALUES (1, 'login', 'LogIn', 'blue', '<strong>Sistema</strong> inicializado', NOW())
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (RLS) if needed
-- ALTER TABLE staffs ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE cupons ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE avisos ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE logs ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE promovidos ENABLE ROW LEVEL SECURITY;
