import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
  // CORS тохируулах
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const sql = neon(process.env.DATABASE_URL);

    if (req.method === 'GET') {
      const data = await sql`SELECT * FROM users LIMIT 10`;
      return res.status(200).json({ success: true, data });
    }

    if (req.method === 'POST') {
      const { name, email } = req.body;
      const result = await sql`
        INSERT INTO users (name, email) 
        VALUES (${name}, ${email}) 
        RETURNING *
      `;
      return res.status(201).json({ success: true, data: result[0] });
    }

  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
}