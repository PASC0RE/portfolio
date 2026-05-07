import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const sql = neon(process.env.POSTGRES_URL);

  try {
    if (req.method === 'POST') {
      const { name, email, message } = req.body;
      await sql`
        INSERT INTO contacts (name, email, message)
        VALUES (${name}, ${email}, ${message})
      `;
      return res.status(201).json({ success: true });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}