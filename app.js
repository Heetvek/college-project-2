/* ──────────────────────────────────────────
   ThreadOS — app.js
   ────────────────────────────────────────── */

// ── Data ──────────────────────────────────
const threads = [
  { code:'JLY-1054', name:'Dark Red',       brand:'Jolly',   type:'Rayon',    hex:'#910C16', cones:2,  total:10, min:5, loc:'Rack A-4', status:'warn'   },
  { code:'JLY-0010', name:'Black',          brand:'Jolly',   type:'Rayon',    hex:'#1A1A1A', cones:18, total:20, min:5, loc:'Rack A-1', status:'ok'     },
  { code:'JLY-1200', name:'Royal Blue',     brand:'Jolly',   type:'Rayon',    hex:'#2155A0', cones:7,  total:12, min:5, loc:'Rack B-2', status:'ok'     },
  { code:'DMC-3865', name:'Winter White',   brand:'DMC',     type:'Cotton',   hex:'#F5F0E8', cones:0,  total:8,  min:3, loc:'Rack C-1', status:'danger' },
  { code:'JLY-0580', name:'Forest Green',  brand:'Jolly',   type:'Polyester',hex:'#2E6B3E', cones:11, total:15, min:5, loc:'Rack B-5', status:'ok'     },
  { code:'MAD-4015', name:'Gold Metallic', brand:'Madeira', type:'Metallic', hex:'#C9A227', cones:1,  total:6,  min:4, loc:'Rack D-1', status:'warn'   },
  { code:'JLY-0221', name:'Cream',         brand:'Jolly',   type:'Rayon',    hex:'#FAF0D7', cones:14, total:14, min:3, loc:'Rack A-3', status:'ok'     },
  { code:'DMC-3750', name:'Navy Blue',     brand:'DMC',     type:'Cotton',   hex:'#1F2D5A', cones:0,  total:5,  min:3, loc:'Rack C-3', status:'danger' },
  { code:'JLY-1410', name:'Coral',         brand:'Jolly',   type:'Rayon',    hex:'#E8634A', cones:3,  total:8,  min:5, loc:'Rack A-6', status:'warn'   },
  { code:'MAD-1800', name:'Silver Metal.', brand:'Madeira', type:'Metallic', hex:'#B8B8B8', cones:5,  total:10, min:5, loc:'Rack D-2', status:'ok'     },
];

const estData = [
  { stop:1, hex:'#910C16', code:'JLY-1054', name:'Dark Red',      stitches:8420,  req:1500, avail:2000, shortage:0,    buy:0, status:'ok'       },
  { stop:2, hex:'#F7C842', code:'JLY-0890', name:'Sun Yellow',    stitches:6200,  req:900,  avail:500,  shortage:400,  buy:1, status:'purchase' },
  { stop:3, hex:'#1A1A1A', code:'JLY-0010', name:'Black',         stitches:9100,  req:1250, avail:3000, shortage:0,    buy:0, status:'ok'       },
  { stop:4, hex:'#2E6B3E', code:'JLY-0580', name:'Forest Green',  stitches:7300,  req:600,  avail:1000, shortage:0,    buy:0, status:'ok'       },
  { stop:5, hex:'#C9A227', code:'MAD-4015', name:'Gold Metallic', stitches:5800,  req:2200, avail:500,  shortage:1700, buy:2, status:'purchase' },
  { stop:6, hex:'#F5F0E8', code:'DMC-3865', name:'Winter White',  stitches:5990,  req:400,  avail:1200, shortage:0,    buy:0, status:'ok'       },
];

const alertData = [
  { code:'DMC-3865', name:'Winter White',   hex:'#F5F0E8', avail:0, min:3, loc:'Rack C-1', type:'danger' },
  { code:'DMC-3750', name:'Navy Blue',      hex:'#1F2D5A', avail:0, min:3, loc:'Rack C-3', type:'danger' },
  { code:'JLY-1054', name:'Dark Red',       hex:'#910C16', avail:2, min:5, loc:'Rack A-4', type:'warn'   },
  { code:'MAD-4015', name:'Gold Metallic',  hex:'#C9A227', avail:1, min:4, loc:'Rack D-1', type:'warn'   },
  { code:'JLY-1410', name:'Coral',          hex:'#E8634A', avail:3, min:5, loc:'Rack A-6', type:'warn'   },
];

// ── Render helpers ─────────────────────────
function statusBadge(status) {
  if (status === 'ok')     return `<span class="badge badge-ok"><i class="ti ti-check"></i>In stock</span>`;
  if (status === 'warn')   return `<span class="badge badge-warn"><i class="ti ti-alert-triangle"></i>Low stock</span>`;
  if (status === 'danger') return `<span class="badge badge-danger"><i class="ti ti-circle-x"></i>Out of stock</span>`;
  return '';
}

function meterColor(status) {
  if (status === 'ok')     return '#1A9E74';
  if (status === 'warn')   return '#C07D18';
  if (status === 'danger') return '#C0392B';
  return '#94A0B8';
}

// ── Render inventory table ─────────────────
function renderTable(data) {
  const body = document.getElementById('table-body');
  if (!body) return;

  if (data.length === 0) {
    body.innerHTML = `<tr><td colspan="9" style="text-align:center;padding:40px;color:var(--muted)">
      <i class="ti ti-mood-empty" style="font-size:28px;display:block;margin-bottom:8px"></i>
      No threads match this filter
    </td></tr>`;
    return;
  }

  body.innerHTML = data.map(t => {
    const pct = t.total > 0 ? Math.min(100, Math.round((t.cones / t.total) * 100)) : 0;
    const fill = meterColor(t.status);
    return `<tr>
      <td>
        <div class="thread-cell">
          <span class="swatch" style="background:${t.hex}" title="${t.name}"></span>
          <div>
            <div class="thread-name">${t.name}</div>
            <div class="thread-code">${t.code}</div>
          </div>
        </div>
      </td>
      <td>${t.brand}</td>
      <td><span style="color:var(--text-2)">${t.type}</span></td>
      <td>
        <span style="font-weight:600">${t.cones}</span>
        <span style="color:var(--muted)"> / ${t.total}</span>
      </td>
      <td style="color:var(--text-2)">${(t.cones * 5000).toLocaleString('en-IN')} m</td>
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          <span class="meter-bar">
            <span class="meter-fill" style="width:${pct}%;background:${fill}"></span>
          </span>
          <span style="font-size:11px;color:var(--muted);width:26px">${pct}%</span>
        </div>
      </td>
      <td>
        <span style="display:inline-flex;align-items:center;gap:4px;color:var(--muted);font-size:12px">
          <i class="ti ti-map-pin" style="font-size:12px"></i>${t.loc}
        </span>
      </td>
      <td>${statusBadge(t.status)}</td>
      <td>
        <button class="btn" style="padding:5px 10px;font-size:12px" onclick="showToast('Editing ${t.code} — ${t.name}')">
          <i class="ti ti-edit" aria-hidden="true"></i>
        </button>
      </td>
    </tr>`;
  }).join('');
}

// ── Render estimation table ────────────────
function renderEstTable() {
  const body = document.getElementById('est-table-body');
  if (!body) return;
  body.innerHTML = estData.map(r => {
    const badge = r.status === 'ok'
      ? `<span class="badge badge-ok"><i class="ti ti-check"></i>OK</span>`
      : `<span class="badge badge-warn"><i class="ti ti-shopping-cart"></i>Purchase</span>`;
    return `<tr>
      <td>
        <div class="thread-cell">
          <span class="swatch" style="background:${r.hex}"></span>
          <span style="font-weight:500">Stop ${r.stop}</span>
        </div>
      </td>
      <td>
        <div class="thread-name">${r.name}</div>
        <div class="thread-code">${r.code}</div>
      </td>
      <td>${r.stitches.toLocaleString('en-IN')}</td>
      <td>${r.req.toLocaleString('en-IN')} m</td>
      <td>${r.avail.toLocaleString('en-IN')} m</td>
      <td style="color:${r.shortage > 0 ? 'var(--red)' : 'var(--muted)'};font-weight:${r.shortage > 0 ? 600 : 400}">
        ${r.shortage > 0 ? r.shortage.toLocaleString('en-IN') + ' m' : '—'}
      </td>
      <td style="font-weight:${r.buy > 0 ? 600 : 400};color:${r.buy > 0 ? 'var(--red)' : 'var(--muted)'}">
        ${r.buy > 0 ? r.buy : '—'}
      </td>
      <td>${badge}</td>
    </tr>`;
  }).join('');
}

// ── Render alerts ──────────────────────────
function renderAlerts() {
  const el = document.getElementById('alerts-list');
  if (!el) return;
  el.innerHTML = alertData.map(a => {
    const isDanger = a.type === 'danger';
    const shortfall = a.min - a.avail;
    const typeLabel = isDanger ? 'CRITICAL' : 'WARNING';
    return `<div class="alert-card ${isDanger ? 'alert-danger' : 'alert-warn'}">
      <div class="alert-icon ${isDanger ? 'alert-icon-danger' : 'alert-icon-warn'}">
        <i class="ti ti-alert-triangle" aria-hidden="true"></i>
      </div>
      <div style="flex:1;min-width:0">
        <div class="alert-title" style="display:flex;align-items:center;gap:8px">
          <span class="badge ${isDanger ? 'badge-danger' : 'badge-warn'}">${typeLabel}</span>
          ${a.code}
          <span class="swatch" style="background:${a.hex};width:14px;height:14px;border-radius:3px;vertical-align:middle"></span>
          ${a.name}
        </div>
        <div class="alert-desc" style="margin-top:4px">
          Available: <strong>${a.avail}</strong> cones &nbsp;·&nbsp;
          Minimum: <strong>${a.min}</strong> cones &nbsp;·&nbsp;
          Shortfall: <strong style="color:${isDanger ? 'var(--red)' : 'var(--amber)'}">${shortfall}</strong> cones &nbsp;·&nbsp;
          ${a.loc}
        </div>
      </div>
      <button class="btn btn-primary" style="font-size:12px;padding:6px 14px;white-space:nowrap" onclick="showView('receive')">
        <i class="ti ti-plus" aria-hidden="true"></i>Restock
      </button>
    </div>`;
  }).join('');
}

// ── Filter + search ────────────────────────
let activeFilter = 'all';
let activeTab    = 'all';
let searchQuery  = '';

function getFilteredData() {
  return threads.filter(t => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      t.code.toLowerCase().includes(q) ||
      t.name.toLowerCase().includes(q) ||
      t.brand.toLowerCase().includes(q) ||
      t.type.toLowerCase().includes(q);

    const matchBrand =
      activeFilter === 'all'      ||
      (activeFilter === 'jolly'   && t.brand === 'Jolly')   ||
      (activeFilter === 'dmc'     && t.brand === 'DMC')     ||
      (activeFilter === 'madeira' && t.brand === 'Madeira');

    const matchType =
      activeFilter === 'all'      ||
      (activeFilter === 'rayon'   && t.type === 'Rayon')    ||
      (activeFilter === 'poly'    && t.type === 'Polyester')||
      (activeFilter === 'metallic'&& t.type === 'Metallic');

    const matchTab =
      activeTab === 'all'      ||
      (activeTab === 'low'  && t.status === 'warn')   ||
      (activeTab === 'out'  && t.status === 'danger')  ||
      (activeTab === 'reserved' && false);

    return matchSearch && (matchBrand || matchType) && matchTab;
  });
}

function filterTable(q) {
  searchQuery = q;
  renderTable(getFilteredData());
}

function setFilter(el, val) {
  activeFilter = val;
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  renderTable(getFilteredData());
}

function setTab(el, val) {
  activeTab = val;
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  renderTable(getFilteredData());
}

// ── View switching ─────────────────────────
function showView(v) {
  ['inventory', 'alerts', 'estimation', 'receive'].forEach(id => {
    const el = document.getElementById('view-' + id);
    if (el) el.style.display = id === v ? 'flex' : 'none';
  });

  // Sync sidebar nav
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const navEl = document.getElementById('nav-' + v);
  if (navEl) navEl.classList.add('active');

  // Sync mobile bottom nav
  document.querySelectorAll('.mbn-item').forEach(n => n.classList.remove('active'));
  const mbnEl = document.getElementById('mbn-' + v);
  if (mbnEl) mbnEl.classList.add('active');

  // Close sidebar drawer on mobile after navigation
  closeSidebar();

  // Scroll to top
  const main = document.getElementById('main-content');
  if (main) main.scrollTop = 0;

  // Reset estimation to step 0 when entering
  if (v === 'estimation') showEstStep(0);
}

// ── Sidebar drawer (mobile) ─────────────────
function toggleSidebar() {
  const sidebar  = document.getElementById('sidebar');
  const overlay  = document.getElementById('sidebar-overlay');
  const isOpen   = sidebar.classList.contains('open');
  if (isOpen) {
    closeSidebar();
  } else {
    sidebar.classList.add('open');
    overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }
}

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (!sidebar) return;
  sidebar.classList.remove('open');
  overlay.classList.remove('visible');
  document.body.style.overflow = '';
}

// ── Estimation steps ───────────────────────
function showEstStep(n) {
  [0, 1, 2].forEach(i => {
    const el = document.getElementById('est-step-' + i);
    if (el) el.style.display = i === n ? 'block' : 'none';
  });
  if (n === 2) renderEstTable();
}

// ── File upload simulation ─────────────────
function simulateUpload() {
  const lbl  = document.getElementById('upload-label');
  const zone = document.getElementById('dropzone');
  if (!lbl || !zone) return;

  lbl.textContent = '✓ floral_v3.dst — ready to analyze';
  zone.style.borderColor = 'var(--green)';
  zone.style.background  = 'var(--green-light)';
  const icon = zone.querySelector('.dropzone-icon');
  if (icon) { icon.style.color = 'var(--green)'; }
  showToast('File loaded: floral_v3.dst (2.1 MB)');
}

// ── Toast ──────────────────────────────────
let _toastTimer = null;
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => t.classList.remove('show'), 2800);
}

// ── Init ───────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderTable(threads);
  renderAlerts();

  // Set today's date as default in receive form
  const dateInput = document.getElementById('r-date');
  if (dateInput) {
    dateInput.value = new Date().toISOString().split('T')[0];
  }

  // Animate progress bars on load
  setTimeout(() => {
    document.querySelectorAll('.progress-fill').forEach(el => {
      const w = el.style.width;
      el.style.width = '0';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => { el.style.width = w; });
      });
    });
  }, 100);

  // Swipe-right-to-close sidebar on mobile
  let _touchStartX = 0;
  document.addEventListener('touchstart', e => {
    _touchStartX = e.touches[0].clientX;
  }, { passive: true });
  document.addEventListener('touchend', e => {
    const dx = _touchStartX - e.changedTouches[0].clientX;
    // Swipe left (dx > 60) while sidebar is open → close it
    const sidebar = document.getElementById('sidebar');
    if (sidebar && sidebar.classList.contains('open') && dx > 60) {
      closeSidebar();
    }
  }, { passive: true });

  // Close sidebar on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeSidebar();
  });
});
