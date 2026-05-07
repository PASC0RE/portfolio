import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const sql = neon(process.env.POSTGRES_URL);

  try {
    if (req.method === 'GET') {
      const data = await sql`SELECT * FROM projects ORDER BY created_at ASC`;
      return res.status(200).json({ data });
    }
    if (req.method === 'POST') {
      const { icon, color, title, desc, tags, tags2, github, demo } = req.body;
      const result = await sql`
        INSERT INTO projects (icon, color, title, description, tags, tags2, github_url, demo_url)
        VALUES (${icon}, ${color}, ${title}, ${desc}, ${JSON.stringify(tags)}, ${JSON.stringify(tags2)}, ${github}, ${demo})
        RETURNING *
      `;
      return res.status(201).json({ data: result[0] });
    }
    if (req.method === 'DELETE') {
      const { id } = req.query;
      await sql`DELETE FROM projects WHERE id = ${id}`;
      return res.status(200).json({ success: true });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}