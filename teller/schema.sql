-- Database van de gered-teller. Eenmalig uitvoeren: npx wrangler d1 execute datechecker-teller --remote --file=schema.sql
CREATE TABLE IF NOT EXISTS totaal (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  producten INTEGER NOT NULL DEFAULT 0,
  gram INTEGER NOT NULL DEFAULT 0
);
INSERT OR IGNORE INTO totaal (id) VALUES (1);

-- Hoe vaak een (anoniem) apparaat vandaag iets heeft gemeld. Wordt na 2 dagen gewist.
CREATE TABLE IF NOT EXISTS limiet (
  dag TEXT NOT NULL,
  apparaat TEXT NOT NULL,
  aantal INTEGER NOT NULL,
  PRIMARY KEY (dag, apparaat)
);
