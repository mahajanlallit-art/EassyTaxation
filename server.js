/**
 * EASSY Taxation – Full Backend Server
 * Node.js + Express
 * Default admin login: admin / eassy@2025
 */

const express = require('express');
const cors    = require('cors');
const multer  = require('multer');
const jwt     = require('jsonwebtoken');
const bcrypt  = require('bcryptjs');
const RSSParser = require('rss-parser');
const fs   = require('fs');
const path = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'eassy-taxation-secret-key-2025';

// ─── MIDDLEWARE ───────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// ─── FILE UPLOAD CONFIG ───────────────────────────────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, 'public/uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const safe = file.originalname.replace(/\s+/g, '_');
    cb(null, `${Date.now()}-${safe}`);
  }
});
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } }); // 50MB

// ─── DATA HELPERS ─────────────────────────────────────────────
const DATA_DIR = path.join(__dirname, 'data');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readData(file) {
  ensureDataDir();
  const fp = path.join(DATA_DIR, file);
  if (!fs.existsSync(fp)) return [];
  try { return JSON.parse(fs.readFileSync(fp, 'utf8')); }
  catch { return []; }
}

function readDataObj(file, defaults = {}) {
  ensureDataDir();
  const fp = path.join(DATA_DIR, file);
  if (!fs.existsSync(fp)) return defaults;
  try { return JSON.parse(fs.readFileSync(fp, 'utf8')); }
  catch { return defaults; }
}

function writeData(file, data) {
  ensureDataDir();
  fs.writeFileSync(path.join(DATA_DIR, file), JSON.stringify(data, null, 2));
}

// ─── ADMIN CREDENTIALS ────────────────────────────────────────
function getAdmin() {
  const fp = path.join(DATA_DIR, 'admin.json');
  ensureDataDir();
  if (!fs.existsSync(fp)) {
    const defaults = {
      username: 'admin',
      password: bcrypt.hashSync('eassy@2025', 10)
    };
    fs.writeFileSync(fp, JSON.stringify(defaults, null, 2));
    return defaults;
  }
  return JSON.parse(fs.readFileSync(fp, 'utf8'));
}

// ─── AUTH MIDDLEWARE ──────────────────────────────────────────
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'No token provided' });
  const token = header.split(' ')[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// ═══════════════════════════════════════════════════════════════
//  AUTH ROUTES
// ═══════════════════════════════════════════════════════════════

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Fields required' });
  const admin = getAdmin();
  if (username !== admin.username || !bcrypt.compareSync(password, admin.password))
    return res.status(401).json({ error: 'Invalid username or password' });
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, message: 'Login successful' });
});

app.post('/api/admin/change-password', auth, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const admin = getAdmin();
  if (!bcrypt.compareSync(currentPassword, admin.password))
    return res.status(400).json({ error: 'Current password is incorrect' });
  admin.password = bcrypt.hashSync(newPassword, 10);
  writeData('admin.json', admin);
  res.json({ success: true, message: 'Password changed successfully' });
});

// ═══════════════════════════════════════════════════════════════
//  TOOLS ROUTES
// ═══════════════════════════════════════════════════════════════

// Public: list all tools
app.get('/api/tools', (req, res) => {
  const tools = readData('tools.json');
  res.json(tools.filter(t => t.active !== false));
});

// Admin: list all (including inactive)
app.get('/api/admin/tools', auth, (req, res) => {
  res.json(readData('tools.json'));
});

// Admin: create tool
app.post('/api/tools', auth, upload.single('file'), (req, res) => {
  const tools = readData('tools.json');
  const tool = {
    id: Date.now().toString(),
    name: req.body.name || 'Untitled Tool',
    shortDesc: req.body.shortDesc || '',
    description: req.body.description || '',
    howToUse: req.body.howToUse || '',
    category: req.body.category || 'General',
    version: req.body.version || '1.0',
    fileUrl: req.file ? `/uploads/${req.file.filename}` : '',
    externalLink: req.body.externalLink || '',
    tags: req.body.tags ? req.body.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    active: true,
    downloads: 0,
    createdAt: new Date().toISOString()
  };
  tools.unshift(tool);
  writeData('tools.json', tools);
  res.json({ success: true, tool });
});

// Admin: update tool
app.put('/api/tools/:id', auth, upload.single('file'), (req, res) => {
  const tools = readData('tools.json');
  const idx = tools.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Tool not found' });
  const updated = {
    ...tools[idx],
    name: req.body.name || tools[idx].name,
    shortDesc: req.body.shortDesc ?? tools[idx].shortDesc,
    description: req.body.description ?? tools[idx].description,
    howToUse: req.body.howToUse ?? tools[idx].howToUse,
    category: req.body.category ?? tools[idx].category,
    version: req.body.version ?? tools[idx].version,
    externalLink: req.body.externalLink ?? tools[idx].externalLink,
    tags: req.body.tags ? req.body.tags.split(',').map(t => t.trim()).filter(Boolean) : tools[idx].tags,
    active: req.body.active !== undefined ? req.body.active === 'true' : tools[idx].active,
    updatedAt: new Date().toISOString()
  };
  if (req.file) updated.fileUrl = `/uploads/${req.file.filename}`;
  tools[idx] = updated;
  writeData('tools.json', tools);
  res.json({ success: true, tool: updated });
});

// Admin: delete tool
app.delete('/api/tools/:id', auth, (req, res) => {
  let tools = readData('tools.json');
  tools = tools.filter(t => t.id !== req.params.id);
  writeData('tools.json', tools);
  res.json({ success: true });
});

// Track downloads
app.post('/api/tools/:id/download', (req, res) => {
  const tools = readData('tools.json');
  const idx = tools.findIndex(t => t.id === req.params.id);
  if (idx !== -1) { tools[idx].downloads = (tools[idx].downloads || 0) + 1; writeData('tools.json', tools); }
  res.json({ success: true });
});

// ═══════════════════════════════════════════════════════════════
//  BLOG ROUTES
// ═══════════════════════════════════════════════════════════════

app.get('/api/blogs', (req, res) => {
  const blogs = readData('blogs.json');
  const pub = blogs.filter(b => b.published);
  const { limit, category } = req.query;
  let result = category ? pub.filter(b => b.category === category) : pub;
  if (limit) result = result.slice(0, parseInt(limit));
  res.json(result);
});

app.get('/api/blogs/:id', (req, res) => {
  const blogs = readData('blogs.json');
  const blog = blogs.find(b => b.id === req.params.id);
  if (!blog) return res.status(404).json({ error: 'Blog not found' });
  res.json(blog);
});

app.get('/api/admin/blogs', auth, (req, res) => {
  res.json(readData('blogs.json'));
});

app.post('/api/blogs', auth, upload.single('image'), (req, res) => {
  const blogs = readData('blogs.json');
  const content = req.body.content || '';
  const blog = {
    id: Date.now().toString(),
    title: req.body.title || 'Untitled',
    slug: (req.body.title || 'untitled').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    content,
    excerpt: req.body.excerpt || content.replace(/<[^>]+>/g, '').substring(0, 250) + '...',
    category: req.body.category || 'General',
    author: req.body.author || 'Team EASSY Taxation',
    image: req.file ? `/uploads/${req.file.filename}` : (req.body.imageUrl || ''),
    tags: req.body.tags ? req.body.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    published: req.body.published === 'true',
    views: 0,
    createdAt: new Date().toISOString()
  };
  blogs.unshift(blog);
  writeData('blogs.json', blogs);
  res.json({ success: true, blog });
});

app.put('/api/blogs/:id', auth, upload.single('image'), (req, res) => {
  const blogs = readData('blogs.json');
  const idx = blogs.findIndex(b => b.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Blog not found' });
  const content = req.body.content || blogs[idx].content;
  blogs[idx] = {
    ...blogs[idx],
    title: req.body.title ?? blogs[idx].title,
    content,
    excerpt: req.body.excerpt || content.replace(/<[^>]+>/g, '').substring(0, 250) + '...',
    category: req.body.category ?? blogs[idx].category,
    author: req.body.author ?? blogs[idx].author,
    image: req.file ? `/uploads/${req.file.filename}` : (req.body.imageUrl ?? blogs[idx].image),
    tags: req.body.tags ? req.body.tags.split(',').map(t => t.trim()).filter(Boolean) : blogs[idx].tags,
    published: req.body.published !== undefined ? req.body.published === 'true' : blogs[idx].published,
    updatedAt: new Date().toISOString()
  };
  writeData('blogs.json', blogs);
  res.json({ success: true, blog: blogs[idx] });
});

app.delete('/api/blogs/:id', auth, (req, res) => {
  let blogs = readData('blogs.json');
  blogs = blogs.filter(b => b.id !== req.params.id);
  writeData('blogs.json', blogs);
  res.json({ success: true });
});

// ═══════════════════════════════════════════════════════════════
//  CAREERS / JOBS ROUTES
// ═══════════════════════════════════════════════════════════════

app.get('/api/jobs', (req, res) => {
  const jobs = readData('jobs.json');
  res.json(jobs.filter(j => j.active !== false));
});

app.get('/api/admin/jobs', auth, (req, res) => {
  res.json(readData('jobs.json'));
});

app.post('/api/jobs', auth, (req, res) => {
  const jobs = readData('jobs.json');
  const job = {
    id: Date.now().toString(),
    title: req.body.title,
    department: req.body.department || 'General',
    location: req.body.location || 'Pune, Maharashtra',
    type: req.body.type || 'Full Time',
    experience: req.body.experience || 'Fresher',
    salary: req.body.salary || 'As per industry standards',
    description: req.body.description || '',
    requirements: req.body.requirements || '',
    responsibilities: req.body.responsibilities || '',
    active: true,
    applications: 0,
    createdAt: new Date().toISOString()
  };
  jobs.unshift(job);
  writeData('jobs.json', jobs);
  res.json({ success: true, job });
});

app.put('/api/jobs/:id', auth, (req, res) => {
  const jobs = readData('jobs.json');
  const idx = jobs.findIndex(j => j.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Job not found' });
  jobs[idx] = { ...jobs[idx], ...req.body, updatedAt: new Date().toISOString() };
  writeData('jobs.json', jobs);
  res.json({ success: true, job: jobs[idx] });
});

app.delete('/api/jobs/:id', auth, (req, res) => {
  let jobs = readData('jobs.json');
  jobs = jobs.filter(j => j.id !== req.params.id);
  writeData('jobs.json', jobs);
  res.json({ success: true });
});

// ─── JOB APPLICATIONS ────────────────────────────────────────
app.post('/api/apply', upload.single('resume'), (req, res) => {
  const applications = readData('applications.json');
  const jobs = readData('jobs.json');
  const jobIdx = jobs.findIndex(j => j.id === req.body.jobId);
  if (jobIdx !== -1) { jobs[jobIdx].applications = (jobs[jobIdx].applications || 0) + 1; writeData('jobs.json', jobs); }

  const entry = {
    id: Date.now().toString(),
    jobId: req.body.jobId,
    jobTitle: req.body.jobTitle,
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    currentCompany: req.body.currentCompany || '',
    experience: req.body.experience || '',
    currentCTC: req.body.currentCTC || '',
    expectedCTC: req.body.expectedCTC || '',
    coverLetter: req.body.coverLetter || '',
    resumeUrl: req.file ? `/uploads/${req.file.filename}` : '',
    status: 'new',
    appliedAt: new Date().toISOString()
  };
  applications.unshift(entry);
  writeData('applications.json', applications);
  res.json({ success: true, message: 'Application submitted! We will contact you soon.' });
});

app.get('/api/applications', auth, (req, res) => {
  const apps = readData('applications.json');
  const { jobId, status } = req.query;
  let result = apps;
  if (jobId) result = result.filter(a => a.jobId === jobId);
  if (status) result = result.filter(a => a.status === status);
  res.json(result);
});

app.put('/api/applications/:id', auth, (req, res) => {
  const apps = readData('applications.json');
  const idx = apps.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  apps[idx] = { ...apps[idx], ...req.body, updatedAt: new Date().toISOString() };
  writeData('applications.json', apps);
  res.json({ success: true, application: apps[idx] });
});

// ═══════════════════════════════════════════════════════════════
//  CONTACT ENQUIRIES
// ═══════════════════════════════════════════════════════════════

app.post('/api/contact', (req, res) => {
  const contacts = readData('contacts.json');
  const entry = {
    id: Date.now().toString(),
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    city: req.body.city || '',
    service: req.body.service || '',
    message: req.body.message || '',
    read: false,
    createdAt: new Date().toISOString()
  };
  contacts.unshift(entry);
  writeData('contacts.json', contacts);
  res.json({ success: true, message: 'Thank you! We will contact you within 24 hours.' });
});

app.get('/api/contacts', auth, (req, res) => {
  res.json(readData('contacts.json'));
});

app.put('/api/contacts/:id/read', auth, (req, res) => {
  const contacts = readData('contacts.json');
  const idx = contacts.findIndex(c => c.id === req.params.id);
  if (idx !== -1) { contacts[idx].read = true; writeData('contacts.json', contacts); }
  res.json({ success: true });
});

app.delete('/api/contacts/:id', auth, (req, res) => {
  let contacts = readData('contacts.json');
  contacts = contacts.filter(c => c.id !== req.params.id);
  writeData('contacts.json', contacts);
  res.json({ success: true });
});

// ═══════════════════════════════════════════════════════════════
//  TAX NEWS – RSS AUTO-FETCH
// ═══════════════════════════════════════════════════════════════

const rssParser = new RSSParser({
  timeout: 10000,
  headers: { 'User-Agent': 'EASSY-Taxation-News-Fetcher/1.0' }
});

const RSS_FEEDS = [
  { url: 'https://pib.gov.in/RssMain.aspx?ModId=6&Lang=1&Regid=3', source: 'Ministry of Finance', category: 'Finance' },
  { url: 'https://www.cbic.gov.in/resources//htdocs-cbec/press-release/rss.xml', source: 'CBIC', category: 'GST/Customs' },
  { url: 'https://taxguru.in/feed/', source: 'Tax Guru', category: 'Tax Updates' },
  { url: 'https://www.caclubindia.com/feed/', source: 'CA Club India', category: 'Tax & Finance' },
  { url: 'https://blog.saginfotech.com/feed', source: 'SAG Infotech', category: 'Compliance' },
];

let newsCache = { data: [], updatedAt: 0 };
const NEWS_CACHE_MS = 30 * 60 * 1000; // 30 minutes

async function fetchAllNews() {
  const all = [];
  for (const feed of RSS_FEEDS) {
    try {
      const parsed = await rssParser.parseURL(feed.url);
      const items = (parsed.items || []).slice(0, 6).map(item => ({
        id: item.guid || item.link,
        title: item.title || 'No title',
        link: item.link || '#',
        date: item.pubDate || item.isoDate || new Date().toISOString(),
        summary: (item.contentSnippet || item.summary || '').substring(0, 300),
        source: feed.source,
        category: feed.category
      }));
      all.push(...items);
    } catch (err) {
      console.warn(`RSS fetch failed [${feed.source}]:`, err.message);
    }
  }
  all.sort((a, b) => new Date(b.date) - new Date(a.date));
  return all;
}

app.get('/api/news', async (req, res) => {
  const now = Date.now();
  if (newsCache.data.length && now - newsCache.updatedAt < NEWS_CACHE_MS) {
    return res.json(newsCache.data);
  }
  try {
    const data = await fetchAllNews();
    if (data.length) newsCache = { data, updatedAt: now };
    res.json(newsCache.data);
  } catch (err) {
    console.error('News fetch error:', err);
    res.json(newsCache.data);
  }
});

// Manual refresh (admin)
app.post('/api/news/refresh', auth, async (req, res) => {
  try {
    const data = await fetchAllNews();
    newsCache = { data, updatedAt: Date.now() };
    res.json({ success: true, count: data.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ═══════════════════════════════════════════════════════════════
//  DASHBOARD STATS
// ═══════════════════════════════════════════════════════════════

app.get('/api/admin/stats', auth, (req, res) => {
  const tools = readData('tools.json');
  const blogs = readData('blogs.json');
  const jobs = readData('jobs.json');
  const applications = readData('applications.json');
  const contacts = readData('contacts.json');
  res.json({
    tools: { total: tools.length, active: tools.filter(t => t.active !== false).length },
    blogs: { total: blogs.length, published: blogs.filter(b => b.published).length },
    jobs: { total: jobs.length, active: jobs.filter(j => j.active !== false).length },
    applications: {
      total: applications.length,
      new: applications.filter(a => a.status === 'new').length,
      shortlisted: applications.filter(a => a.status === 'shortlisted').length
    },
    contacts: {
      total: contacts.length,
      unread: contacts.filter(c => !c.read).length
    }
  });
});

// ─── FALLBACK ────────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ─── START ────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('');
  console.log('  ╔══════════════════════════════════════════╗');
  console.log('  ║       EASSY Taxation – Server            ║');
  console.log(`  ║   Running at http://localhost:${PORT}       ║`);
  console.log('  ║   Admin: /admin.html                     ║');
  console.log('  ║   Login: admin / eassy@2025              ║');
  console.log('  ╚══════════════════════════════════════════╝');
  console.log('');
});
