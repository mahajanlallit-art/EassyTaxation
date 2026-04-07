// EASSY Taxation - Shared Utilities

const ET = {
  // LocalStorage helpers
  get: (key, def = []) => {
    try { return JSON.parse(localStorage.getItem('et_' + key)) || def; } catch { return def; }
  },
  set: (key, val) => localStorage.setItem('et_' + key, JSON.stringify(val)),

  // ID generator
  uid: () => Date.now().toString(36) + Math.random().toString(36).slice(2),

  // Format date
  fmtDate: (d) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),

  // Seed default data if not present
  seedDefaults() {
    if (!localStorage.getItem('et_seeded')) {
      // Sample Tools
      ET.set('tools', [
        { id: ET.uid(), name: 'GST Return Reconciliation Tool', category: 'GST', desc: 'Automatically reconcile GSTR-2A/2B with your purchase register. Identifies mismatches and ITC differences instantly.', usage: '1. Download & open the Excel file\n2. Paste your GSTR-2A data in Sheet 1\n3. Paste your Purchase Register in Sheet 2\n4. Click the "Reconcile" button\n5. Mismatch report generated in Sheet 3', link: '#', icon: '📊', downloads: 428, date: new Date().toISOString() },
        { id: ET.uid(), name: 'Income Tax Calculator FY 2025-26', category: 'Income Tax', desc: 'Compare Old vs New regime tax liability. Includes all deductions, HRA, 80C, 80D, standard deduction calculations.', usage: '1. Enter your gross salary / income\n2. Fill in your investments & deductions\n3. Tool auto-calculates both regimes\n4. Comparison table shows which regime is better for you', link: '#', icon: '💰', downloads: 1204, date: new Date().toISOString() },
        { id: ET.uid(), name: 'TDS Deduction Chart 2025-26', category: 'TDS', desc: 'Complete TDS rate chart for all sections. Includes threshold limits, rates for resident & non-resident payments.', usage: '1. Open the PDF\n2. Refer to payment type column\n3. Check applicable section and rate\n4. Apply to your payment', link: '#', icon: '📋', downloads: 876, date: new Date().toISOString() },
        { id: ET.uid(), name: 'Payroll & PF/ESIC Calculator', category: 'Payroll', desc: 'Calculate employee salary breakup, PF contribution (employee + employer), ESIC, Professional Tax, and net take-home pay.', usage: '1. Enter CTC or gross salary\n2. Enter allowance structure\n3. Tool calculates PF, ESIC, PT automatically\n4. Download salary slip in PDF format', link: '#', icon: '👷', downloads: 312, date: new Date().toISOString() },
      ]);

      // Sample Blogs
      ET.set('blogs', [
        { id: ET.uid(), title: 'New Income Tax Regime vs Old Regime: Which is Better for You in FY 2025-26?', category: 'Income Tax', author: 'Lalit Mahajan', date: new Date().toISOString(), image: '', excerpt: 'With Budget 2025 making the new tax regime the default, many taxpayers are confused. Here is a complete comparison with real examples.', content: '<h3>New vs Old Regime – The Key Differences</h3><p>The Union Budget 2025 has significantly revamped the new tax regime. The most notable change: <strong>No tax on income up to ₹12 lakh</strong> under the new regime due to rebate u/s 87A. Here\'s what you need to know...</p><h3>New Regime Slabs (FY 2025-26)</h3><p>0–3 lakh: Nil | 3–7 lakh: 5% | 7–10 lakh: 10% | 10–12 lakh: 15% | 12–15 lakh: 20% | Above 15 lakh: 30%</p><h3>Who Should Stick with Old Regime?</h3><p>If your total deductions (80C + 80D + HRA + home loan interest) exceed ₹3.75 lakh, the old regime is still better. Use our calculator to compare your specific case.</p>', tags: ['Income Tax', 'Budget 2025', 'Tax Planning'], views: 1240 },
        { id: ET.uid(), title: 'GST Annual Return (GSTR-9): Complete Filing Guide for FY 2024-25', category: 'GST', author: 'Lalit Mahajan', date: new Date(Date.now() - 86400000 * 3).toISOString(), image: '', excerpt: 'GSTR-9 filing deadline is approaching. Here is a step-by-step guide to filing your GST annual return without errors.', content: '<h3>What is GSTR-9?</h3><p>GSTR-9 is the annual return to be filed by all registered taxpayers (except composition dealers, Input Service Distributors, and non-resident taxpayers). It consolidates all monthly/quarterly returns filed during the year.</p><h3>Key Tables in GSTR-9</h3><p>Table 4: Outward supplies | Table 6: ITC availed | Table 8: ITC reconciliation with GSTR-2A | Table 9: Tax paid during the year</p><h3>Common Mistakes to Avoid</h3><p>1. Not reconciling GSTR-1 vs GSTR-3B<br>2. ITC claimed vs ITC as per 2A/2B mismatch<br>3. Wrong HSN summary entries</p>', tags: ['GST', 'Annual Return', 'Compliance'], views: 890 },
        { id: ET.uid(), title: 'TDS on Rent u/s 194-IB: Applicability, Rate, and How to File', category: 'TDS', author: 'Yogesh Mandlik', date: new Date(Date.now() - 86400000 * 7).toISOString(), image: '', excerpt: 'If you pay rent above ₹50,000 per month, TDS deduction is mandatory. Here is everything a tenant needs to know.', content: '<h3>Who Must Deduct TDS on Rent?</h3><p>Any individual or HUF (not liable for audit) paying rent exceeding ₹50,000 per month to a resident landlord must deduct TDS u/s 194-IB.</p><h3>Rate & When to Deduct</h3><p>Rate: 2% (from Budget 2024 onward, earlier 5%). TDS to be deducted at the time of credit or payment of rent for the last month of the previous year or last month of tenancy.</p><h3>How to Pay & File</h3><p>Use Form 26QC to pay TDS on rent. File within 30 days from end of the month in which TDS is deducted. Provide Form 16C to landlord within 15 days of due date of furnishing Form 26QC.</p>', tags: ['TDS', 'Rent', 'Compliance'], views: 654 },
      ]);

      // Sample Jobs
      ET.set('jobs', [
        { id: ET.uid(), title: 'Tax Associate – Income Tax & GST', dept: 'Taxation', location: 'Akurdi, Pune', type: 'Full Time', exp: '1–3 Years', skills: 'GST Filing, ITR, TDS, Income Tax', desc: 'We are looking for a motivated Tax Associate to handle GST return filing, ITR filing, and TDS compliance for our clients. Must have good knowledge of GST law and Income Tax provisions.', date: new Date().toISOString(), active: true },
        { id: ET.uid(), title: 'Accounts Executive', dept: 'Accounts', location: 'Akurdi, Pune', type: 'Full Time', exp: '0–2 Years', skills: 'Tally, MS Excel, Bookkeeping, Bank Reconciliation', desc: 'Handling day-to-day accounting entries, bank reconciliation, ledger maintenance, and financial reporting for our clients using Tally Prime.', date: new Date().toISOString(), active: true },
        { id: ET.uid(), title: 'Manpower Coordinator (Pan India)', dept: 'HR & Staffing', location: 'Remote / Pune', type: 'Full Time', exp: '2–4 Years', skills: 'Recruitment, Staffing, HR Operations, Accounts & Finance Hiring', desc: 'Managing end-to-end recruitment for accounts and finance profiles for our clients across India. Coordinating with clients for requirements and with candidates for placement.', date: new Date().toISOString(), active: true },
      ]);

      ET.set('contacts', []);
      ET.set('applications', []);
      localStorage.setItem('et_seeded', '1');
    }
  },

  // Render nav (returns HTML string)
  nav(active = '') {
    const links = [
      { href: 'index.html', label: 'Home' },
      { href: 'tools.html', label: 'Tools' },
      { href: 'blog.html', label: 'Blog' },
      { href: 'tax-updates.html', label: 'Tax Updates' },
      { href: 'careers.html', label: 'Careers' },
    ];
    return `
    <div class="topbar">
      <div class="container-xl topbar-inner">
        <div class="topbar-contact">
          <span>📞 <a href="tel:+917972136151">+91 7972136151</a></span>
          <span>✉️ <a href="mailto:eassytaxation@gmail.com">eassytaxation@gmail.com</a></span>
          <span>📍 Jai Ganesh Vision, Akurdi, Pune</span>
        </div>
        <a href="#contact" style="color:var(--gold);font-size:13px;">📅 Free Consultation →</a>
      </div>
    </div>
    <nav>
      <div class="container-xl nav-inner">
        <a href="index.html" class="logo">
          <div class="logo-icon">ET</div>
          <div class="logo-text">
            <div class="logo-name">EASSY Taxation</div>
            <div class="logo-tagline">Expert · Efficient · Ethical</div>
          </div>
        </a>
        <button class="hamburger" onclick="document.getElementById('navLinks').classList.toggle('open')" aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
        <ul class="nav-links" id="navLinks">
          ${links.map(l => `<li><a href="${l.href}" class="${active === l.label ? 'active' : ''}">${l.label}</a></li>`).join('')}
          <li><a href="#contact" class="nav-cta">Get Started</a></li>
        </ul>
      </div>
    </nav>`;
  },

  footer() {
    return `
    <footer>
      <div class="container-xl footer-grid">
        <div class="footer-brand">
          <a href="index.html" class="logo" style="text-decoration:none">
            <div class="logo-icon">ET</div>
            <div class="logo-text">
              <div class="logo-name">EASSY Taxation</div>
              <div class="logo-tagline">Expert · Efficient · Ethical</div>
            </div>
          </a>
          <p>Your trusted partner for all taxation, compliance, legal, and financial services. Based in Akurdi, Pune — serving businesses across India.</p>
          <div class="footer-social">
            <a href="#" class="social-btn">in</a>
            <a href="#" class="social-btn">f</a>
            <a href="https://wa.me/917972136151" class="social-btn">💬</a>
          </div>
        </div>
        <div class="footer-col">
          <h4>Our Services</h4>
          <ul class="footer-links">
            <li><a href="index.html#services">ITR Filing</a></li>
            <li><a href="index.html#services">GST Registration & Returns</a></li>
            <li><a href="index.html#services">TDS Returns</a></li>
            <li><a href="index.html#services">PT / PF / ESIC</a></li>
            <li><a href="index.html#services">Audit Services</a></li>
            <li><a href="index.html#services">Bank Loan & Finance</a></li>
            <li><a href="index.html#services">Legal Services</a></li>
            <li><a href="index.html#services">Manpower Services</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Quick Links</h4>
          <ul class="footer-links">
            <li><a href="index.html">Home</a></li>
            <li><a href="tools.html">Free Tools</a></li>
            <li><a href="blog.html">Blog</a></li>
            <li><a href="tax-updates.html">Tax Updates</a></li>
            <li><a href="careers.html">Careers</a></li>
            <li><a href="admin.html">Admin Login</a></li>
          </ul>
        </div>
        <div class="footer-col">
          <h4>Govt. Portals</h4>
          <ul class="footer-links">
            <li><a href="https://www.incometax.gov.in" target="_blank">Income Tax Dept.</a></li>
            <li><a href="https://www.gst.gov.in" target="_blank">GST Portal</a></li>
            <li><a href="https://www.mca.gov.in" target="_blank">MCA / ROC</a></li>
            <li><a href="https://www.epfindia.gov.in" target="_blank">EPFO</a></li>
            <li><a href="https://www.esic.in" target="_blank">ESIC</a></li>
            <li><a href="https://www.tin-nsdl.com" target="_blank">TIN–NSDL</a></li>
            <li><a href="https://maharera.mahaonline.gov.in" target="_blank">MahaRERA</a></li>
          </ul>
        </div>
      </div>
      <div class="container-xl footer-bottom">
        <p>© 2025 <span>EASSY Taxation</span>. All rights reserved. | Jai Ganesh Vision, Akurdi, Pune</p>
        <p>📞 <a href="tel:+917972136151" style="color:var(--gold)">+91 7972136151</a></p>
      </div>
    </footer>
    <a href="https://wa.me/917972136151?text=Hello%2C%20I%20need%20help%20with%20my%20compliance." class="fab">💬</a>`;
  },

  // Common CSS shared across all pages
  css() {
    return `
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&family=Bebas+Neue&display=swap');
    :root{--navy:#0B1B3A;--navy-mid:#112247;--gold:#C9A84C;--gold-light:#E4C97A;--white:#fff;--muted:#8a9bb5;--border:rgba(201,168,76,.2);}
    *{margin:0;padding:0;box-sizing:border-box;}html{scroll-behavior:smooth;}
    body{font-family:'DM Sans',sans-serif;background:var(--navy);color:var(--white);overflow-x:hidden;}
    ::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-track{background:var(--navy);}::-webkit-scrollbar-thumb{background:var(--gold);border-radius:3px;}
    .container-xl{max-width:1280px;margin:0 auto;padding:0 40px;}
    @media(max-width:768px){.container-xl{padding:0 20px;}}
    /* TOPBAR */
    .topbar{background:var(--navy-mid);border-bottom:1px solid var(--border);padding:10px 0;font-size:13px;color:var(--muted);}
    .topbar a{color:var(--gold-light);text-decoration:none;}
    .topbar-inner{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;}
    .topbar-contact{display:flex;gap:20px;flex-wrap:wrap;}
    /* NAV */
    nav{background:var(--navy);border-bottom:1px solid var(--border);position:sticky;top:0;z-index:1000;}
    .nav-inner{display:flex;align-items:center;justify-content:space-between;height:68px;}
    .logo{display:flex;align-items:center;gap:12px;text-decoration:none;}
    .logo-icon{width:42px;height:42px;background:var(--gold);border-radius:10px;display:flex;align-items:center;justify-content:center;font-family:'Bebas Neue';font-size:21px;color:var(--navy);}
    .logo-name{font-family:'Cormorant Garamond',serif;font-size:21px;font-weight:700;color:var(--white);}
    .logo-tagline{font-size:10px;color:var(--gold);letter-spacing:2px;text-transform:uppercase;}
    .nav-links{display:flex;align-items:center;gap:4px;list-style:none;}
    .nav-links a{display:block;padding:8px 14px;color:var(--muted);text-decoration:none;font-size:14px;font-weight:500;border-radius:6px;transition:all .2s;}
    .nav-links a:hover,.nav-links a.active{color:var(--gold);background:rgba(201,168,76,.08);}
    .nav-cta{background:var(--gold)!important;color:var(--navy)!important;font-weight:600!important;border-radius:8px!important;}
    .nav-cta:hover{background:var(--gold-light)!important;}
    .hamburger{display:none;flex-direction:column;gap:5px;cursor:pointer;background:none;border:none;padding:8px;}
    .hamburger span{width:24px;height:2px;background:var(--white);border-radius:2px;}
    /* FOOTER */
    footer{background:var(--navy-mid);border-top:1px solid var(--border);padding:60px 0 32px;}
    .footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1.2fr;gap:50px;margin-bottom:40px;}
    .footer-brand p{font-size:13px;color:var(--muted);line-height:1.8;margin:14px 0 20px;}
    .footer-social{display:flex;gap:10px;}
    .social-btn{width:36px;height:36px;border-radius:8px;border:1px solid var(--border);display:flex;align-items:center;justify-content:center;color:var(--muted);text-decoration:none;font-size:13px;transition:all .2s;}
    .social-btn:hover{border-color:var(--gold);color:var(--gold);}
    .footer-col h4{font-size:12px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:var(--gold);margin-bottom:16px;}
    .footer-links{list-style:none;display:flex;flex-direction:column;gap:9px;}
    .footer-links a{color:var(--muted);text-decoration:none;font-size:13px;transition:color .2s;}
    .footer-links a:hover{color:var(--gold);}
    .footer-bottom{border-top:1px solid var(--border);padding-top:24px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;}
    .footer-bottom p{font-size:12px;color:var(--muted);}
    .footer-bottom span{color:var(--gold);}
    /* FAB */
    .fab{position:fixed;bottom:28px;right:28px;z-index:999;background:var(--gold);color:var(--navy);width:54px;height:54px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:22px;text-decoration:none;box-shadow:0 8px 24px rgba(201,168,76,.4);transition:all .2s;}
    .fab:hover{transform:scale(1.1);}
    /* BUTTONS */
    .btn{display:inline-flex;align-items:center;gap:8px;padding:13px 28px;border-radius:8px;text-decoration:none;font-size:14px;font-weight:600;transition:all .25s;cursor:pointer;border:none;}
    .btn-gold{background:var(--gold);color:var(--navy);}
    .btn-gold:hover{background:var(--gold-light);transform:translateY(-2px);box-shadow:0 10px 28px rgba(201,168,76,.3);}
    .btn-outline{border:1px solid var(--border);color:var(--white);background:transparent;}
    .btn-outline:hover{border-color:var(--gold);color:var(--gold);}
    /* SECTION */
    .section{padding:90px 0;}
    .section-alt{background:var(--navy-mid);}
    .section-label{font-size:11px;letter-spacing:3px;text-transform:uppercase;color:var(--gold);margin-bottom:10px;}
    .section-title{font-family:'Cormorant Garamond',serif;font-size:clamp(30px,4vw,50px);font-weight:700;line-height:1.1;color:var(--white);}
    .section-title em{color:var(--gold);font-style:italic;}
    .section-desc{color:var(--muted);font-size:15px;line-height:1.8;margin-top:12px;}
    .divider{width:50px;height:2px;background:var(--gold);margin:16px 0;}
    /* CARDS */
    .card{background:var(--navy);border:1px solid var(--border);border-radius:14px;padding:28px;transition:all .25s;}
    .card:hover{border-color:rgba(201,168,76,.45);transform:translateY(-3px);box-shadow:0 16px 40px rgba(0,0,0,.4);}
    /* BADGE */
    .badge{display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;background:rgba(201,168,76,.12);color:var(--gold);border:1px solid var(--border);}
    /* FORMS */
    .f-label{display:block;font-size:11px;color:var(--muted);margin-bottom:6px;text-transform:uppercase;letter-spacing:1px;}
    .f-input,.f-select,.f-textarea{width:100%;padding:11px 14px;background:var(--navy);border:1px solid var(--border);border-radius:8px;color:var(--white);font-size:14px;outline:none;font-family:'DM Sans',sans-serif;transition:border-color .2s;}
    .f-input:focus,.f-select:focus,.f-textarea:focus{border-color:var(--gold);}
    .f-select option{background:var(--navy-mid);}
    .f-textarea{height:110px;resize:vertical;}
    /* FADE IN */
    .fi{opacity:0;transform:translateY(20px);transition:opacity .6s ease,transform .6s ease;}
    .fi.v{opacity:1;transform:none;}
    /* RESPONSIVE NAV */
    @media(max-width:900px){
      .nav-links{display:none;flex-direction:column;position:absolute;top:68px;left:0;right:0;background:var(--navy-mid);border-bottom:1px solid var(--border);padding:12px 20px;gap:2px;}
      .nav-links.open{display:flex;}
      .hamburger{display:flex;}
      nav{position:relative;}
      .footer-grid{grid-template-columns:1fr 1fr;gap:32px;}
      .topbar-contact{display:none;}
    }
    @media(max-width:600px){.footer-grid{grid-template-columns:1fr;}}
    </style>`;
  }
};

// Auto-seed on load
document.addEventListener('DOMContentLoaded', () => {
  ET.seedDefaults();
  // Intersection observer for fade-in
  const obs = new IntersectionObserver(entries => entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('v'); }), { threshold: 0.1 });
  document.querySelectorAll('.fi').forEach(el => obs.observe(el));
});
