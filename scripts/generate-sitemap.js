/**
 * Sitemap generator — runs at build time before vite build.
 * Reads src/content/*.md, skips drafts, writes public/sitemap.xml.
 *
 * Usage: node scripts/generate-sitemap.js
 */

import { readdir, readFile, writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const SITE_URL = 'https://chandanjoshi.dev';

/** Minimal frontmatter parser — only needs date and draft fields. */
function parseFrontmatter(content) {
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) return {};
    return Object.fromEntries(
        match[1].split('\n')
            .map(line => line.match(/^(\w+):\s*(.+)$/))
            .filter(Boolean)
            .map(([, key, val]) => [key, val.replace(/^["']|["']$/g, '').trim()])
    );
}

async function run() {
    const contentDir = join(ROOT, 'src/content');
    const files = await readdir(contentDir);

    const posts = [];
    for (const file of files.filter(f => f.endsWith('.md'))) {
        const raw = await readFile(join(contentDir, file), 'utf-8');
        const fm = parseFrontmatter(raw);
        if (fm.draft === 'true') continue;
        posts.push({ slug: file.replace('.md', ''), date: fm.date });
    }

    // Sort newest first
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    const pages = [
        { loc: '/',     priority: '1.0', changefreq: 'monthly',  lastmod: null },
        { loc: '/blog', priority: '0.8', changefreq: 'weekly',   lastmod: posts[0]?.date ?? null },
        ...posts.map(p => ({
            loc: `/blog/${p.slug}`,
            priority: '0.7',
            changefreq: 'never',
            lastmod: p.date,
        })),
    ];

    const xml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...pages.map(p => [
            '  <url>',
            `    <loc>${SITE_URL}${p.loc}</loc>`,
            p.lastmod ? `    <lastmod>${p.lastmod}</lastmod>` : '',
            `    <changefreq>${p.changefreq}</changefreq>`,
            `    <priority>${p.priority}</priority>`,
            '  </url>',
        ].filter(Boolean).join('\n')),
        '</urlset>',
    ].join('\n');

    await mkdir(join(ROOT, 'public'), { recursive: true });
    await writeFile(join(ROOT, 'public/sitemap.xml'), xml, 'utf-8');
    console.log(`✓ sitemap.xml — ${pages.length} URLs (${posts.length} posts)`);
}

run().catch(err => { console.error(err); process.exit(1); });
