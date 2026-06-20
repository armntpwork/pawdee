// Vercel Serverless Function — dynamic sitemap for /place/:id pages
// ดึงข้อมูลร้านจาก Firestore REST API แล้ว generate XML

module.exports = async function handler(req, res) {
  const PROJECT_ID = 'pawdee-f082e';
  const API_KEY    = 'AIzaSyABryVHH_TrpqXoBfxCLSK0eyxoMltq6pU';

  let urlBlocks = [];

  try {
    let nextPageToken = null;
    do {
      const pageParam = nextPageToken ? `&pageToken=${nextPageToken}` : '';
      const response  = await fetch(
        `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/places?key=${API_KEY}&pageSize=300${pageParam}`
      );
      const data = await response.json();

      if (data.documents) {
        for (const doc of data.documents) {
          const id      = doc.name.split('/').pop();
          const updated = (doc.updateTime || doc.createTime || '').split('T')[0] || new Date().toISOString().split('T')[0];
          urlBlocks.push(
            `  <url>\n    <loc>https://www.pawdeepet.com/place/${id}</loc>\n    <lastmod>${updated}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`
          );
        }
      }
      nextPageToken = data.nextPageToken || null;
    } while (nextPageToken);
  } catch (_) {
    // ถ้า Firestore ตอบไม่ได้ — return sitemap ว่างแทน crash
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlBlocks.join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
  res.status(200).send(xml);
};
