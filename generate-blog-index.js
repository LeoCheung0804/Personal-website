const fs = require('fs');
const path = require('path');

const postsDir = path.join(__dirname, 'posts');
const outputFile = path.join(__dirname, 'assets', 'data', 'posts.json');

// Ensure data directory exists
const dataDir = path.dirname(outputFile);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));

const posts = files.map(file => {
  const content = fs.readFileSync(path.join(postsDir, file), 'utf-8');
  
  // Basic front matter parser
  const frontMatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  
  let metadata = {};
  if (frontMatterMatch) {
    const yaml = frontMatterMatch[1];
    yaml.split('\n').forEach(line => {
      const parts = line.split(':');
      if (parts.length >= 2) {
        const key = parts[0].trim();
        let value = parts.slice(1).join(':').trim();
        // Remove quotes if present
        value = value.replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
        metadata[key] = value;
      }
    });
  }
  
  // Try to use a summary if not mapped
  let summary = metadata.summary;
  if (!summary) {
      if (metadata.description) {
          summary = metadata.description;
      } else {
        const bodyMatch = content.split('---');
        if (bodyMatch.length >= 3) {
            let body = bodyMatch.slice(2).join('---').trim();
            // remove headers and empty lines
            body = body.replace(/^#+.*$/gm, '').trim();
            const lines = body.split('\n').filter(l => l.trim().length > 0);
            if (lines.length > 0) {
                summary = lines[0].replace(/<[^>]*>?/gm, '').substring(0, 150);
                if (lines[0].length > 150) summary += '...';
            }
        }
      }
  }
  metadata.summary = summary || '';
  
  return {
    filename: file.replace('.md', ''),
    ...metadata
  };
});

// Sort by date descending
posts.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

fs.writeFileSync(outputFile, JSON.stringify(posts, null, 2));
console.log(`Generated index for ${posts.length} posts at ${outputFile}`);