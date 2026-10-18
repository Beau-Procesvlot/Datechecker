// De gezamenlijke "gered"-teller van Datechecker (Cloudflare Worker + D1-database).
//
// GET  /totaal  → { producten, gram }
// POST /gered   → { gram, apparaat }  telt één opgegeten product mee en geeft het nieuwe totaal terug.
//
// Anoniem: er wordt alleen een gewicht en een willekeurig apparaatnummer (dat de app zelf verzint) ontvangen.
// Het apparaatnummer dient alleen om valsspelen te beperken (max. 20 per dag) en wordt na 2 dagen gewist.

const TOEGESTAAN = [
  'https://beau-procesvlot.github.io', // de app op GitHub Pages
  'http://localhost:8001',             // testen op de computer
  'capacitor://localhost',             // later: de app in de App Store (iOS)
  'https://localhost',                 // later: de app in de Play Store (Android)
];
const MAX_PER_DAG = 20;
const MAX_GRAM = 5000;

export default {
  async fetch(req, env) {
    const origin = req.headers.get('Origin') || '';
    const cors = {
      'Access-Control-Allow-Origin': TOEGESTAAN.includes(origin) ? origin : TOEGESTAAN[0],
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Vary': 'Origin',
    };
    const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { ...cors, 'Content-Type': 'application/json' } });
    if (req.method === 'OPTIONS') return new Response(null, { headers: cors });

    const pad = new URL(req.url).pathname;
    const totaal = async () => {
      const r = await env.DB.prepare('SELECT producten, gram FROM totaal WHERE id = 1').first();
      return { producten: r?.producten || 0, gram: r?.gram || 0 };
    };

    if (req.method === 'GET' && pad === '/totaal') return json(await totaal());

    if (req.method === 'POST' && pad === '/gered') {
      let body;
      try { body = await req.json(); } catch { return json({ fout: 'geen geldige gegevens' }, 400); }
      const gram = Math.round(Number(body.gram));
      const apparaat = String(body.apparaat || '');
      if (!Number.isFinite(gram) || gram < 0 || gram > MAX_GRAM) return json({ fout: 'onmogelijk gewicht' }, 400);
      if (!/^[a-z0-9]{8,40}$/.test(apparaat)) return json({ fout: 'onbekend apparaat' }, 400);

      const dag = new Date().toISOString().slice(0, 10);
      const gisteren = new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10);
      const teller = await env.DB.prepare(
        'INSERT INTO limiet (dag, apparaat, aantal) VALUES (?1, ?2, 1) ON CONFLICT (dag, apparaat) DO UPDATE SET aantal = aantal + 1 RETURNING aantal'
      ).bind(dag, apparaat).first();
      if (teller.aantal > MAX_PER_DAG) return json({ fout: 'te veel vandaag', ...(await totaal()) }, 429);

      await env.DB.batch([
        env.DB.prepare('UPDATE totaal SET producten = producten + 1, gram = gram + ?1 WHERE id = 1').bind(gram),
        env.DB.prepare('DELETE FROM limiet WHERE dag < ?1').bind(gisteren),
      ]);
      return json(await totaal());
    }

    return json({ fout: 'niet gevonden' }, 404);
  },
};
