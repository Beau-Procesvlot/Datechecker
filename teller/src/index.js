// De gezamenlijke "gered"-teller van Datechecker (Cloudflare Worker + D1-database).
//
// GET  /totaal  → { producten, gram }
// POST /gered   → { gram, apparaat }  telt één opgegeten product mee en geeft het nieuwe totaal terug.
// POST /idee    → het feedbackformulier van zonde.app; gecontroleerd en beperkt doorgestuurd naar Make.
//
// Anoniem: er wordt alleen een gewicht en een willekeurig apparaatnummer (dat de app zelf verzint) ontvangen.
// Het apparaatnummer dient alleen om valsspelen te beperken (max. 20 per dag) en wordt na 2 dagen gewist.

const TOEGESTAAN = [
  'https://beau-procesvlot.github.io', // de app op GitHub Pages
  'https://zonde.app',                 // de hoofdsite van Zonde. (toont de teller)
  'http://localhost:8002',             // de hoofdsite testen op de computer
  'http://localhost:8001',             // testen op de computer
  'capacitor://localhost',             // later: de app in de App Store (iOS)
  'https://localhost',                 // later: de app in de Play Store (Android)
];
const MAX_PER_DAG = 20;
const IDEE_SOORTEN = ['Idee', 'Feedback', 'Iets werkt niet'];
const IDEE_APPS = ['Zonde. algemeen', 'Fitchecker', 'Datechecker', 'Nieuwe app'];
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

    // Feedback- en ideeënformulier van de hoofdsite (zonde.app). Controleert het bericht, beperkt hoe vaak
    // er verstuurd mag worden en stuurt het dan door naar Make (MAKE_HOOK is een geheim
    // van de worker en staat nergens in de site). Make mailt het naar Beau.
    if (req.method === 'POST' && pad === '/idee') {
      if (!TOEGESTAAN.includes(origin)) return json({ fout: 'niet toegestaan' }, 403);
      if (!env.MAKE_HOOK) return json({ fout: 'niet ingesteld' }, 503);
      let d;
      try {
        const type = req.headers.get('Content-Type') || '';
        d = type.includes('application/json') ? await req.json() : Object.fromEntries(await req.formData());
      } catch { return json({ fout: 'geen geldige gegevens' }, 400); }
      const tekst = (v, max) => String(v ?? '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, '').trim().slice(0, max);
      // Robotje vulde het verborgen veld in: doe alsof het gelukt is.
      if (tekst(d._honey, 100)) return json({ ok: true });
      const soort = tekst(d.soort, 40);
      const app = tekst(d.app, 40);
      const bericht = tekst(d.bericht, 2000);
      const naam = tekst(d.naam, 80);
      const email = tekst(d.email, 120);
      if (!IDEE_SOORTEN.includes(soort) || !IDEE_APPS.includes(app)) return json({ fout: 'onbekende keuze' }, 400);
      if (bericht.length < 5) return json({ fout: 'bericht te kort' }, 400);
      if (email && !/^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(email)) return json({ fout: 'mailadres klopt niet' }, 400);

      // Hooguit 5 berichten per afzender per dag en 30 in totaal per dag. Het IP-adres wordt niet bewaard,
      // alleen een onleesbare code die elke dag anders is.
      const dag = new Date().toISOString().slice(0, 10);
      const ip = req.headers.get('CF-Connecting-IP') || 'onbekend';
      const hash = [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(dag + ip + env.MAKE_HOOK)))]
        .slice(0, 12).map(b => b.toString(16).padStart(2, '0')).join('');
      const tel = sleutel => env.DB.prepare(
        'INSERT INTO limiet (dag, apparaat, aantal) VALUES (?1, ?2, 1) ON CONFLICT (dag, apparaat) DO UPDATE SET aantal = aantal + 1 RETURNING aantal'
      ).bind(dag, sleutel).first();
      if ((await tel('idee-' + hash)).aantal > 5) return json({ fout: 'te veel vandaag' }, 429);
      if ((await tel('idee-alles')).aantal > 30) return json({ fout: 'te veel vandaag' }, 429);
      const gisteren = new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10);
      await env.DB.prepare('DELETE FROM limiet WHERE dag < ?1').bind(gisteren).run();

      const pagina = origin === 'https://zonde.app' ? 'https://zonde.app' : origin;
      const r = await fetch(env.MAKE_HOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ onderwerp: `Zonde. ${soort}: ${app}`, soort, app, bericht, naam, email, pagina }),
      });
      if (!r.ok) return json({ fout: 'doorsturen mislukt' }, 502);
      return json({ ok: true });
    }

    return json({ fout: 'niet gevonden' }, 404);
  },
};
