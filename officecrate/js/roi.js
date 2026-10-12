var PLANS = {
  starter: { name: 'Starter', price: 89, pieces: 3, pack: 3, reserve: 5, shipAdd: 0 },
  pro:     { name: 'Professional', price: 149, pieces: 5, pack: 4, reserve: 8, shipAdd: 2 }
};
var PRESETS = {
  comfortable: { b_site:100, b_samples:250, b_content:150, b_ads:350, b_setup:200, b_reserve:450 },
  lean:        { b_site:100, b_samples:200, b_content:50,  b_ads:150, b_setup:200, b_reserve:300 }
};
var DEFAULTS = { garment:14, ship:10, discount:0, mix:20, cpl:6, organic:40, conv:8, rep1:35, rep2:60, adsMo:0, orgMo:15, fixedMo:30 };
var ids = Object.keys(PRESETS.comfortable).concat(Object.keys(DEFAULTS));
var $ = function (id) { return document.getElementById(id); };
var usd = function (v, d) { return (v < 0 ? '−$' : '$') + Math.abs(v).toLocaleString('en-US', { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 }); };

function applyPreset(name) {
  var p = PRESETS[name];
  Object.keys(p).forEach(function (k) { $(k).value = p[k]; });
  document.querySelectorAll('[data-preset]').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.preset === name); });
}
function read() { var v = {}; ids.forEach(function (k) { v[k] = Math.max(0, parseFloat($(k).value) || 0); }); return v; }

function boxEcon(plan, v, discountPct) {
  var price = plan.price * (1 - discountPct / 100);
  var garments = plan.pieces * v.garment;
  var ship = v.ship + plan.shipAdd;
  var proc = price * 0.029 + 0.30;
  return { price: price, garments: garments, ship: ship, pack: plan.pack, proc: proc, reserve: plan.reserve,
       contrib: price - garments - ship - plan.pack - proc - plan.reserve };
}
function maxGarment(plan, v, margin) {
  var proc = plan.price * 0.029 + 0.30;
  return (plan.price * (1 - margin) - (v.ship + plan.shipAdd) - plan.pack - proc - plan.reserve) / plan.pieces;
}

function model(v) {
  var mix = v.mix / 100;
  var s1 = boxEcon(PLANS.starter, v, v.discount), p1 = boxEcon(PLANS.pro, v, v.discount);
  var sR = boxEcon(PLANS.starter, v, 0), pR = boxEcon(PLANS.pro, v, 0);
  var firstC = (1 - mix) * s1.contrib + mix * p1.contrib;   // first box (discount applies)
  var repeatC = (1 - mix) * sR.contrib + mix * pR.contrib;  // refresh boxes at full price
  var q = v.rep1 / 100, r = v.rep2 / 100;
  var refreshProb = [q, q * r, q * r * r];                   // boxes at +3, +6, +9 months
  var ltv = firstC + repeatC * (refreshProb[0] + refreshProb[1] + refreshProb[2]);
  var conv = v.conv / 100;
  var pilotSignups = v.b_ads / v.cpl + v.organic;
  var pilotCust = pilotSignups * conv;
  var paidCAC = conv > 0 ? v.cpl / conv : Infinity;
  var spentPilot = v.b_site + v.b_samples + v.b_content + v.b_ads + v.b_setup;

  // Monthly cash flow, months 0..12
  var cash = new Array(13).fill(0), newCust = new Array(13).fill(0);
  cash[0] -= v.b_site + v.b_setup + v.b_samples;
  cash[1] -= v.b_content + v.b_ads / 2;
  cash[2] -= v.b_ads / 2;
  newCust[2] = pilotCust;
  for (var m = 3; m <= 12; m++) {
cash[m] -= v.adsMo + v.fixedMo;
newCust[m] = (v.adsMo / v.cpl + v.orgMo) * conv;
  }
  var boxes = 0, contribTotal = 0;
  for (m = 0; m <= 12; m++) {
if (!newCust[m]) continue;
cash[m] += newCust[m] * firstC; boxes += newCust[m]; contribTotal += newCust[m] * firstC;
refreshProb.forEach(function (p, i) {
  var mm = m + 3 * (i + 1);
  if (mm <= 12) { cash[mm] += newCust[m] * p * repeatC; boxes += newCust[m] * p; contribTotal += newCust[m] * p * repeatC; }
});
  }
  var cum = [], run = 0, beMonth = null;
  cash.forEach(function (c, i) { run += c; cum.push(run); if (beMonth === null && i > 2 && run >= 0) beMonth = i; });
  var totalSpend = spentPilot + 10 * (v.adsMo + v.fixedMo);
  return { s1: s1, p1: p1, sR: sR, pR: pR, firstC: firstC, repeatC: repeatC, ltv: ltv, pilotSignups: pilotSignups,
       pilotCust: pilotCust, paidCAC: paidCAC, spentPilot: spentPilot, cum: cum, beMonth: beMonth,
       totalSpend: totalSpend, net12: run, roi: run / totalSpend, boxes: boxes,
       beBoxes: spentPilot / Math.max(repeatC, 0.01) };
}

function render() {
  var v = read(), o = model(v);
  $('k_cust').textContent = Math.round(o.pilotCust);
  $('k_cust_s').textContent = Math.round(o.pilotSignups) + ' signups × ' + v.conv + '%';
  var ratio = o.ltv / o.paidCAC;
  $('k_ltv').textContent = isFinite(ratio) ? ratio.toFixed(1) + '×' : '—';
  var cls = ratio >= 3 ? 'st-good' : ratio >= 1 ? 'st-warn' : 'st-bad';
  var word = ratio >= 3 ? 'Ads can scale' : ratio >= 1 ? 'Ads barely pay' : 'Ads lose money';
  $('k_ltv_s').innerHTML = '<span class="status ' + cls + '">' + word + '</span><br>CAC ' + usd(o.paidCAC) + ' · LTV ' + usd(o.ltv);
  $('k_roi').textContent = (o.roi * 100).toFixed(0) + '%';
  $('k_roi_s').textContent = 'Net ' + usd(o.net12) + ' on ' + usd(o.totalSpend) + ' spent';
  $('k_be').textContent = o.beMonth !== null ? 'Month ' + o.beMonth : 'Not in 12 mo';
  $('k_be_s').textContent = Math.ceil(o.beBoxes) + ' full-price boxes to recover the pilot';

  var rows = [['Price', 'price'], ['Garments', 'garments'], ['Shipping', 'ship'], ['Packaging', 'pack'], ['Processing', 'proc'], ['Exchange reserve', 'reserve']];
  var disc = v.discount > 0;
  var h = '<tr><th></th><th>Starter</th><th>Pro</th></tr>';
  rows.forEach(function (r, i) {
var sign = i === 0 ? 1 : -1;
h += '<tr><td>' + r[0] + '</td><td>' + usd(sign * o.s1[r[1]], 2) + '</td><td>' + usd(sign * o.p1[r[1]], 2) + '</td></tr>';
  });
  h += '<tr class="total"><td>Contribution' + (disc ? ' (1st box)' : '') + '</td><td>' + usd(o.s1.contrib, 2) + '</td><td>' + usd(o.p1.contrib, 2) + '</td></tr>';
  h += '<tr><td>Margin</td><td>' + (o.s1.contrib / o.s1.price * 100).toFixed(1) + '%</td><td>' + (o.p1.contrib / o.p1.price * 100).toFixed(1) + '%</td></tr>';
  if (disc) h += '<tr><td>Refresh box (full price)</td><td>' + usd(o.sR.contrib, 2) + '</td><td>' + usd(o.pR.contrib, 2) + '</td></tr>';
  $('unit').innerHTML = h;

  var mh = '<tr><th>Target margin</th><th>Starter</th><th>Pro</th></tr>';
  [0.20, 0.30, 0.40].forEach(function (m) {
mh += '<tr><td>' + (m * 100) + '%</td><td>' + usd(maxGarment(PLANS.starter, v, m), 2) + '</td><td>' + usd(maxGarment(PLANS.pro, v, m), 2) + '</td></tr>';
  });
  $('maxcost').innerHTML = mh;

  var vd = [];
  vd.push(o.pilotCust >= 5 ? '<b>Pilot goal reachable:</b> about ' + Math.round(o.pilotCust) + ' paying customers against the target of 5.'
                       : '<b>Pilot goal at risk:</b> about ' + Math.round(o.pilotCust) + ' customers against the target of 5. Push organic content or raise conversion before adding ads.');
  vd.push('The pilot by itself does not pay back. It buys data. ' + usd(o.spentPilot) + ' of setup needs about ' + Math.ceil(o.beBoxes) + ' full-price boxes to recover.');
  if (ratio < 1) vd.push('<b>Do not scale paid ads at these numbers.</b> Each paid customer costs ' + usd(o.paidCAC) + ' but returns ' + usd(o.ltv) + ' in 12 months. Levers: lower cost per signup, higher waitlist conversion, more Professional mix, cheaper garments.');
  else if (ratio < 3) vd.push('Paid ads are marginal (LTV:CAC ' + ratio.toFixed(1) + '×). Scale slowly and only on the channels with the cheapest signups in your UTM data.');
  else vd.push('Paid ads look healthy (LTV:CAC ' + ratio.toFixed(1) + '×). Scale in steps of about $250/month and re-check the real numbers each step.');
  if (v.discount >= 15) vd.push('A ' + v.discount + '% first-box discount cuts Starter contribution to ' + usd(o.s1.contrib, 2) + '. A free style consult costs your time instead of margin.');
  if (o.s1.contrib < 15) vd.push('<b>Starter margin is thin.</b> Garments need to come in under ' + usd(maxGarment(PLANS.starter, v, 0.25), 2) + ' per piece for a 25% margin.');
  $('verdict').innerHTML = vd.map(function (t) { return '<li>' + t + '</li>'; }).join('');

  drawChart(o.cum);
}

function drawChart(cum) {
  var W = 720, H = 300, L = 64, R = 16, T = 16, B = 36;
  var lo = Math.min(0, Math.min.apply(null, cum)), hi = Math.max(0, Math.max.apply(null, cum));
  var pad = (hi - lo) * 0.08 || 100; lo -= pad; hi += pad;
  var x = function (i) { return L + i * (W - L - R) / 12; };
  var y = function (val) { return T + (hi - val) * (H - T - B) / (hi - lo); };
  var step = niceStep((hi - lo) / 5), s = '';
  for (var g = Math.ceil(lo / step) * step; g <= hi; g += step) {
s += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + y(g) + '" y2="' + y(g) + '" stroke="var(--grid)"/>';
s += '<text x="' + (L - 8) + '" y="' + (y(g) + 4) + '" text-anchor="end" fill="var(--text-muted)" font-size="12" style="font-variant-numeric:tabular-nums">' + usd(g) + '</text>';
  }
  s += '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + y(0) + '" y2="' + y(0) + '" stroke="var(--axis)" stroke-width="1.5"/>';
  for (var i = 0; i <= 12; i++) s += '<text x="' + x(i) + '" y="' + (H - 12) + '" text-anchor="middle" fill="var(--text-muted)" font-size="12">M' + i + '</text>';
  var pts = cum.map(function (c, i) { return x(i) + ',' + y(c); }).join(' ');
  s += '<polygon points="' + x(0) + ',' + y(0) + ' ' + pts + ' ' + x(12) + ',' + y(0) + '" fill="var(--series-1)" opacity=".1"/>';
  s += '<polyline points="' + pts + '" fill="none" stroke="var(--series-1)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>';
  s += '<line id="cross" y1="' + T + '" y2="' + (H - B) + '" stroke="rgba(255,255,255,.25)" visibility="hidden"/>';
  cum.forEach(function (c, i) { s += '<circle cx="' + x(i) + '" cy="' + y(c) + '" r="4" fill="var(--series-1)" stroke="var(--surface-1)" stroke-width="2"/>'; });
  s += '<text x="' + (x(12) - 4) + '" y="' + (y(cum[12]) - 10) + '" text-anchor="end" fill="var(--text-primary)" font-size="13" font-weight="600">' + usd(cum[12]) + '</text>';
  s += '<rect id="hit" x="' + L + '" y="' + T + '" width="' + (W - L - R) + '" height="' + (H - T - B) + '" fill="transparent"/>';
  var svg = $('chart'); svg.innerHTML = s;
  var tip = $('tip'), cross = $('cross');
  $('hit').onmousemove = function (e) {
var box = svg.getBoundingClientRect(), sx = (e.clientX - box.left) * W / box.width;
var i = Math.max(0, Math.min(12, Math.round((sx - L) / ((W - L - R) / 12))));
cross.setAttribute('x1', x(i)); cross.setAttribute('x2', x(i)); cross.setAttribute('visibility', 'visible');
tip.innerHTML = '<b>Month ' + i + '</b><br>Cumulative ' + usd(cum[i]) + '<br>This month ' + usd(cum[i] - (i ? cum[i - 1] : 0));
var px = x(i) * box.width / W, py = y(cum[i]) * box.height / H;
tip.style.left = Math.min(px + 12, box.width - 170) + 'px'; tip.style.top = Math.max(py - 70, 0) + 'px'; tip.style.opacity = 1;
  };
  $('hit').onmouseleave = function () { tip.style.opacity = 0; cross.setAttribute('visibility', 'hidden'); };
}
function niceStep(raw) { var p = Math.pow(10, Math.floor(Math.log10(raw))), n = raw / p; return (n < 1.5 ? 1 : n < 3 ? 2 : n < 7 ? 5 : 10) * p; }

Object.keys(DEFAULTS).forEach(function (k) { $(k).value = DEFAULTS[k]; });
applyPreset('comfortable');
document.querySelectorAll('[data-preset]').forEach(function (b) { b.onclick = function () { applyPreset(b.dataset.preset); render(); }; });
$('inputs').addEventListener('input', render);
render();
