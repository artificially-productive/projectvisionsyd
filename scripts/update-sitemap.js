const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const BASE_URL = 'https://projectvision.com.au';
const ROOT_DIR = path.resolve(__dirname, '..');

const PAGES = [
  { url: '/', file: 'index.html', priority: '1.0', changefreq: 'monthly' },
  { url: '/about', file: 'about.html', priority: '0.8', changefreq: 'monthly' },
  { url: '/capabilities', file: 'capabilities.html', priority: '0.8', changefreq: 'monthly' },
];

function getLastModDate(filePath) {
  const fullPath = path.join(ROOT_DIR, filePath);
  
  // Check if file has unstaged or staged git changes
  try {
    const status = execSync(`git status --porcelain "${filePath}"`, { cwd: ROOT_DIR, encoding: 'utf8' }).trim();
    if (status) {
      // File has local modifications, use current file mtime
      const stat = fs.statSync(fullPath);
      return stat.mtime.toISOString().split('T')[0];
    }
  } catch (e) {}

  // Otherwise query git log for the last commit date of this file
  try {
    const gitDate = execSync(`git log -1 --format="%cs" -- "${filePath}"`, { cwd: ROOT_DIR, encoding: 'utf8' }).trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(gitDate)) {
      return gitDate;
    }
  } catch (e) {}

  // Fallback to file system mtime
  try {
    const stat = fs.statSync(fullPath);
    return stat.mtime.toISOString().split('T')[0];
  } catch (e) {
    return new Date().toISOString().split('T')[0];
  }
}

function generateSitemap() {
  const urlsXml = PAGES.map(p => {
    const lastmod = getLastModDate(p.file);
    const loc = p.url === '/' ? `${BASE_URL}/` : `${BASE_URL}${p.url}`;
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>
`;
}

function update() {
  const sitemapContent = generateSitemap();
  const sitemapPath = path.join(ROOT_DIR, 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemapContent, 'utf8');
  console.log('✓ sitemap.xml updated successfully:');
  console.log(sitemapContent);
}

if (require.main === module) {
  update();
}

module.exports = { update, generateSitemap, getLastModDate };
