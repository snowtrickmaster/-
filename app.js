let performRows = [];
let transportRows = [];
let rowId = 0;

// ── 行追加 ──
function addPerformRow() {
  const id = rowId++;
  performRows.push({ id, date:'', name:'', count:'1', from:'', to:'', place:'', scene:'', price:'', note:'' });
  renderPerformEditor();
  renderPreview();
}

function addTransportRow() {
  const id = rowId++;
  transportRows.push({ id, date:'', name:'', count:'', route:'', price:'', note:'' });
  renderTransportEditor();
  renderPreview();
}

// ── 行削除 ──
function removePerformRow(id) {
  performRows = performRows.filter(r => r.id !== id);
  renderPerformEditor();
  renderPreview();
}

function removeTransportRow(id) {
  transportRows = transportRows.filter(r => r.id !== id);
  renderTransportEditor();
  renderPreview();
}

// ── 行更新 ──
function updatePerformRow(id, field, val) {
  const r = performRows.find(r => r.id === id);
  if (r) r[field] = val;
  renderPreview();
}

function updateTransportRow(id, field, val) {
  const r = transportRows.find(r => r.id === id);
  if (r) r[field] = val;
  renderPreview();
}

function esc(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function inp(label, field, id, placeholder, type='text', onchange='updatePerformRow') {
  const rows = onchange === 'updatePerformRow' ? performRows : transportRows;
  const val = rows.find(r => r.id === id)?.[field] || '';
  return `<div class="field-group">
    <label>${label}</label>
    <input type="${type}" value="${esc(val)}" placeholder="${placeholder}"
      oninput="${onchange}(${id},'${field}',this.value)" />
  </div>`;
}

// ── 出演料エディタ ──
function renderPerformEditor() {
  const c = document.getElementById('perform-rows-container');
  c.innerHTML = performRows.map(r => `
    <div class="row-editor">
      <button class="del" onclick="removePerformRow(${r.id})">×</button>
      <div class="row-grid">
        <div>${inp('月日','date',r.id,'10/22')}</div>
        <div>${inp('名前','name',r.id,'古賀 太郎')}</div>
        <div>${inp('人数','count',r.id,'12','number')}</div>
        <div>${inp('開始','from',r.id,'8:30')}</div>
        <div>${inp('終了','to',r.id,'15:30')}</div>
        <div>${inp('場所','place',r.id,'入間基地')}</div>
        <div>${inp('シーン','scene',r.id,'模擬患者')}</div>
        <div>${inp('単価','price',r.id,'24600','number')}</div>
        <div class="wide">${inp('備考','note',r.id,'')}</div>
      </div>
    </div>
  `).join('');
}

// ── 交通費エディタ ──
function renderTransportEditor() {
  const c = document.getElementById('transport-rows-container');
  c.innerHTML = transportRows.map(r => `
    <div class="row-editor">
      <button class="del" onclick="removeTransportRow(${r.id})">×</button>
      <div class="row-grid">
        <div>${inp('月日','date',r.id,'10/22','text','updateTransportRow')}</div>
        <div>${inp('名前','name',r.id,'古賀 太郎','text','updateTransportRow')}</div>
        <div>${inp('人数','count',r.id,'12','number','updateTransportRow')}</div>
        <div class="wide">${inp('経路','route',r.id,'12名（稲荷山公園駅〜池袋）','text','updateTransportRow')}</div>
        <div>${inp('単価','price',r.id,'980','number','updateTransportRow')}</div>
        <div class="wide">${inp('備考','note',r.id,'片道490円','text','updateTransportRow')}</div>
      </div>
    </div>
  `).join('');
}

// ── 日付 ──
function fmtDate() {
  const d = new Date();
  const reiwa = d.getFullYear() - 2018;
  return `令和　${reiwa}　年　　${d.getMonth()+1}　月　${d.getDate()}　日`;
}

// ── プレビュー描画 ──
function renderPreview() {
  const g = id => document.getElementById(id)?.value || '';
  document.getElementById('p-to').textContent = g('to') || '宛先';
  document.getElementById('p-project').textContent = g('project') || '案件名';
  document.getElementById('p-date').textContent = fmtDate();

  const taxrate = parseFloat(document.getElementById('taxrate')?.value) || 10;
  const COLS = 11;
  const empty = () => `<tr>${'<td></td>'.repeat(COLS)}</tr>`;
  const span = (text, cls='') =>
    `<tr><td colspan="${COLS}" class="section-header ${cls}">${text}</td></tr>`;

  // ── 出演料セクション ──
  let performSubtotal = 0;
  let performHtml = span('出演料', 'section-perform');

  performRows.forEach(r => {
    const price = parseFloat(r.price) || 0;
    const count = parseInt(r.count) || 1;
    const total = price * count;
    performSubtotal += total;
    performHtml += `<tr>
      <td>${esc(r.date)}</td>
      <td class="left">${esc(r.name)}</td>
      <td>${esc(r.count)}</td>
      <td>${esc(r.from)}</td>
      <td>〜</td>
      <td>${esc(r.to)}</td>
      <td>${esc(r.place)}</td>
      <td>${esc(r.scene)}</td>
      <td class="right">${price ? price.toLocaleString() : ''}</td>
      <td class="right">${total ? total.toLocaleString() : ''}</td>
      <td class="left">${esc(r.note)}</td>
    </tr>`;
  });

  // 出演料空行（最低3行）
  const pFilled = performRows.length;
  for (let i = pFilled; i < Math.max(pFilled + 1, 3); i++) performHtml += empty();

  const performTax = Math.round(performSubtotal * taxrate / 100);
  const performGrand = performSubtotal + performTax;

  performHtml += `
    <tr><td colspan="8" style="border:none;"></td>
        <td colspan="2" class="ft-label">出演料</td>
        <td class="ft-val">${performSubtotal.toLocaleString()}</td></tr>
    <tr><td colspan="8" style="border:none;"></td>
        <td colspan="2" class="ft-label">消費税　${taxrate} %</td>
        <td class="ft-val">${performTax.toLocaleString()}</td></tr>
    <tr><td colspan="8" style="border:none;"></td>
        <td colspan="2" class="ft-label ft-subtotal">総計 ①</td>
        <td class="ft-val ft-subtotal">¥${performGrand.toLocaleString()}</td></tr>
  `;

  document.getElementById('p-perform-section').innerHTML = performHtml;

  // ── 交通費セクション ──
  let transportSubtotal = 0;
  let transportHtml = span('交通費', 'section-transport');

  transportRows.forEach(r => {
    const price = parseFloat(r.price) || 0;
    const count = parseInt(r.count) || 1;
    const total = price * count;
    transportSubtotal += total;
    transportHtml += `<tr>
      <td>${esc(r.date)}</td>
      <td class="left">${esc(r.name)}</td>
      <td>${esc(r.count)}</td>
      <td class="left" colspan="4">${esc(r.route)}</td>
      <td></td>
      <td class="right">${price ? price.toLocaleString() : ''}</td>
      <td class="right">${total ? total.toLocaleString() : ''}</td>
      <td class="left">${esc(r.note)}</td>
    </tr>`;
  });

  // 交通費：明細後に空行を入れてから以下余白、さらに空行を挟んで集計を右下に表示
  const tFilled = transportRows.length;
  for (let i = tFilled; i < Math.max(tFilled + 1, 3); i++) transportHtml += empty();

  transportHtml += `<tr><td class="left" colspan="${COLS}">以下余白</td></tr>`;
  for (let i = 0; i < 8; i++) transportHtml += empty();

  const transportInnerTax = Math.round(transportSubtotal * taxrate / 100);
  const grand = performGrand + transportSubtotal;

  transportHtml += empty();
  transportHtml += empty();
  transportHtml += `
    <tr><td colspan="8" style="border:none;"></td>
        <td colspan="2" class="ft-label">交通費 ②</td>
        <td class="ft-val">¥${transportSubtotal.toLocaleString()}</td></tr>
    <tr><td colspan="8" style="border:none;"></td>
        <td colspan="2" class="ft-label">内税　${taxrate} %</td>
        <td class="ft-val">${transportInnerTax.toLocaleString()}</td></tr>
    <tr><td colspan="8" style="border:none;"></td>
        <td colspan="2" class="ft-label ft-grand">総計（①＋②）</td>
        <td class="ft-val ft-grand">¥${grand.toLocaleString()}</td></tr>
  `;

  document.getElementById('p-transport-section').innerHTML = transportHtml;
  document.getElementById('p-grand-foot').innerHTML = '';

  document.getElementById('p-total').textContent = `¥${grand.toLocaleString()}`;
}

// ── クリア ──
function clearAll() {
  if (!confirm('宛先・案件名・明細をすべてリセットしますか？')) return;
  document.getElementById('to').value = '';
  document.getElementById('project').value = '';
  performRows = [];
  transportRows = [];
  rowId = 0;
  renderPerformEditor();
  renderTransportEditor();
  renderPreview();
}

// ── PDF ──
async function downloadPDF() {
  const btn = document.getElementById('dl-btn');
  btn.disabled = true;
  btn.textContent = '生成中...';
  try {
    const el = document.getElementById('quote-paper');
    const canvas = await html2canvas(el, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/png');
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const ratio = canvas.width / canvas.height;
    let w = pageW - 10;
    let h = w / ratio;
    if (h > pageH - 10) { h = pageH - 10; w = h * ratio; }
    pdf.addImage(imgData, 'PNG', (pageW - w) / 2, 5, w, h);
    const project = document.getElementById('project')?.value || '見積書';
    pdf.save(`${project}_見積書（出演料＋交通費）.pdf`);
  } catch(e) {
    alert('PDF生成に失敗しました: ' + e.message);
  }
  btn.disabled = false;
  btn.textContent = '↓ PDFをダウンロード';
}

// ── イベント ──
['to','project','taxrate'].forEach(id => {
  document.getElementById(id)?.addEventListener('input', renderPreview);
});

// ── 初期化 ──
addPerformRow();
addTransportRow();
renderPreview();
