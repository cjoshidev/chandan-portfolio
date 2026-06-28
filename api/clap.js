import { createClient } from '@libsql/client/http';

const db = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

export default async function handler(req, res) {
    const { slug } = req.query;
    if (!slug || typeof slug !== 'string') {
        return res.status(400).json({ error: 'slug required' });
    }

    if (req.method === 'GET') {
        const { rows } = await db.execute({
            sql: 'select count from claps where slug = ?',
            args: [slug],
        });
        return res.status(200).json({ count: rows[0]?.count ?? 0 });
    }

    if (req.method === 'POST') {
        const { rows } = await db.execute({
            sql: `insert into claps (slug, count) values (?, 1)
                  on conflict (slug) do update set count = count + 1
                  returning count`,
            args: [slug],
        });
        return res.status(200).json({ count: rows[0].count });
    }

    return res.status(405).json({ error: 'method not allowed' });
}
