/* ════════════════════════════════════════════
   VaultDesk — main.js
   harshwalteam.github.io/Vaultdesk/
   ════════════════════════════════════════════ */

/* ── GLOBAL STATE ── */
var radioState = {};   // { groupId: selectedValue }
var userTags   = [];   // Q12 people tags

/* ══════════════════════════════════════════════
   NAVIGATION
══════════════════════════════════════════════ */

function goTo(toStep, fromStep, validatorFn) {
  if (!validatorFn()) {
    document.getElementById('err-' + fromStep).classList.add('show');
    return;
  }
  document.getElementById('err-' + fromStep).classList.remove('show');

  document.getElementById('step-' + fromStep).classList.remove('active');
  document.getElementById('step-' + toStep).classList.add('active');

  var fromNav = document.getElementById('snav-' + fromStep);
  var toNav   = document.getElementById('snav-' + toStep);
  if (fromNav) { fromNav.classList.remove('active'); fromNav.classList.add('done'); }
  if (toNav)   { toNav.classList.remove('done');     toNav.classList.add('active'); }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goBack(toStep, fromStep) {
  document.getElementById('step-' + fromStep).classList.remove('active');
  document.getElementById('step-' + toStep).classList.add('active');

  var fromNav = document.getElementById('snav-' + fromStep);
  var toNav   = document.getElementById('snav-' + toStep);
  if (fromNav) { fromNav.classList.remove('active'); fromNav.classList.remove('done'); }
  if (toNav)   { toNav.classList.remove('done');     toNav.classList.add('active'); }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ══════════════════════════════════════════════
   RADIO HELPER
══════════════════════════════════════════════ */

function pickRadio(groupId, el, value) {
  radioState[groupId] = value;
  var group = document.getElementById(groupId);
  if (!group) return;
  group.querySelectorAll('.radio-opt').forEach(function(o) {
    o.classList.remove('selected');
  });
  el.classList.add('selected');
}

/* ══════════════════════════════════════════════
   STEP A — TOOL DETAILS
══════════════════════════════════════════════ */

/* Q2 Department: show/hide "other" input */
document.getElementById('q2_dept').addEventListener('change', function () {
  var other = document.getElementById('q2_dept_other');
  other.style.display = (this.value === 'other') ? 'block' : 'none';
  if (this.value !== 'other') other.value = '';
  validateA();
});

/* Q3 Cost warning */
function checkCost() {
  var val  = parseFloat(document.getElementById('q3_cost').value) || 0;
  var warn = document.getElementById('warn_cost');
  warn.style.display = val > 5000 ? 'flex' : 'none';
}

function isStepAValid() {
  if (!document.getElementById('q1_tool_name').value.trim()) return false;

  var dept = document.getElementById('q2_dept').value;
  if (!dept) return false;
  if (dept === 'other' && !document.getElementById('q2_dept_other').value.trim()) return false;

  if (!document.getElementById('q4_category').value) return false;

  var cost = document.getElementById('q3_cost').value.trim();
  if (cost === '' || parseFloat(cost) < 0) return false;

  if (!document.getElementById('q7_priority').value) return false;
  if (!document.getElementById('q5_justification').value.trim()) return false;

  return true;
}

function validateA() {
  if (isStepAValid()) document.getElementById('err-a').classList.remove('show');
}

/* ══════════════════════════════════════════════
   STEP B — PROJECT & USERS
══════════════════════════════════════════════ */

/* Q8 Project Name */
function handleQ8Change() {
  var sel   = document.getElementById('q8_project').value;
  var other = document.getElementById('q8_project_other');
  other.style.display = (sel === 'other') ? 'block' : 'none';
  if (sel !== 'other') other.value = '';
}

/* Q9 Project Owner */
function handleQ9Change() {
  var sel   = document.getElementById('q9_owner').value;
  var other = document.getElementById('q9_owner_other');
  other.style.display = (sel === 'other') ? 'block' : 'none';
  if (sel !== 'other') other.value = '';
}

/* Q11 Primary User */
function handleQ11Change() {
  var sel   = document.getElementById('q11_primary_user').value;
  var other = document.getElementById('q11_primary_other');
  other.style.display = (sel === 'other') ? 'block' : 'none';
  if (sel !== 'other') other.value = '';
}

/* Q13 Cost per user badge */
function updateCostBadge() {
  var q3 = parseFloat(document.getElementById('q3_cost').value) || 0;
  var n  = parseInt(document.getElementById('q13_num_users').value) || 0;
  var el = document.getElementById('cost_per_user');
  if (n > 0 && q3 > 0) {
    el.textContent = '₹' + Math.round(q3 / n).toLocaleString('en-IN') + '/month';
  } else {
    el.textContent = '—';
  }
}

/* Q12 User tags */
function addUserTag() {
  var inp = document.getElementById('q12_user_input');
  var val = inp.value.trim();
  if (!val) return;
  userTags.push(val);
  inp.value = '';
  renderUserTags();
  validateB();
}

function removeUserTag(i) {
  userTags.splice(i, 1);
  renderUserTags();
  validateB();
}

function renderUserTags() {
  var wrap = document.getElementById('q12_tags');
  wrap.innerHTML = userTags.map(function (name, i) {
    return (
      '<span class="tag">' +
        escapeHtml(name) +
        '<span class="tag-x" onclick="removeUserTag(' + i + ')" title="Remove">×</span>' +
      '</span>'
    );
  }).join('');
}

function isStepBValid() {
  var proj = document.getElementById('q8_project').value;
  if (!proj) return false;
  if (proj === 'other' && !document.getElementById('q8_project_other').value.trim()) return false;

  var owner = document.getElementById('q9_owner').value;
  if (!owner) return false;
  if (owner === 'other' && !document.getElementById('q9_owner_other').value.trim()) return false;

  if (!radioState['rg_scope']) return false;

  var pUser = document.getElementById('q11_primary_user').value;
  if (!pUser) return false;
  if (pUser === 'other' && !document.getElementById('q11_primary_other').value.trim()) return false;

  var n = parseInt(document.getElementById('q13_num_users').value);
  if (!n || n < 1) return false;

  if (userTags.length === 0) return false;

  if (!radioState['rg_usage']) return false;

  return true;
}

function validateB() {
  if (isStepBValid()) document.getElementById('err-b').classList.remove('show');
}

/* ══════════════════════════════════════════════
   STEP C — BUSINESS CASE
══════════════════════════════════════════════ */

function isStepCValid() {
  if (!document.getElementById('q16_outcome').value.trim()) return false;
  if (!radioState['rg_roi']) return false;
  return true;
}

function validateC() {
  if (isStepCValid()) document.getElementById('err-c').classList.remove('show');
}

/* ══════════════════════════════════════════════
   STEP D — APPROVAL DETAILS
══════════════════════════════════════════════ */

function handleQ6Change() {
  var sel   = document.getElementById('q6_requested_by').value;
  var other = document.getElementById('q6_requested_other');
  other.style.display = (sel === 'other') ? 'block' : 'none';
  if (sel !== 'other') other.value = '';

  var emailMap = {
    lokesh: 'lokesh@harshwal.com',
    priya:  'priya@harshwal.com',
    amit:   'amit@harshwal.com',
    sanwar: 'sanwar@harshwal.com'
  };
  document.getElementById('q6_email_display').textContent =
    emailMap[sel] || (sel === 'other' ? '(enter name above)' : '—');
  validateD();
}

function handleQ20Change() {
  var sel   = document.getElementById('q20_manager').value;
  var other = document.getElementById('q20_manager_other');
  other.style.display = (sel === 'other') ? 'block' : 'none';
  if (sel !== 'other') other.value = '';
  validateD();
}

function handleQ18Change() {
  var sel   = document.getElementById('q18_sub_manager').value;
  var other = document.getElementById('q18_sub_other');
  other.style.display = (sel === 'other') ? 'block' : 'none';
  if (sel !== 'other') other.value = '';
  validateD();
}

/* Set minimum date = 5 working days from today */
(function setMinDate() {
  var d = new Date();
  var added = 0;
  while (added < 5) {
    d.setDate(d.getDate() + 1);
    var day = d.getDay();
    if (day !== 0 && day !== 6) added++;
  }
  var el = document.getElementById('q19_date');
  if (el) el.min = d.toISOString().split('T')[0];
})();

function isStepDValid() {
  var reqBy = document.getElementById('q6_requested_by').value;
  if (!reqBy) return false;
  if (reqBy === 'other' && !document.getElementById('q6_requested_other').value.trim()) return false;

  var mgr = document.getElementById('q20_manager').value;
  if (!mgr) return false;
  if (mgr === 'other' && !document.getElementById('q20_manager_other').value.trim()) return false;

  var sub = document.getElementById('q18_sub_manager').value;
  if (!sub) return false;
  if (sub === 'other' && !document.getElementById('q18_sub_other').value.trim()) return false;

  if (!document.getElementById('q19_date').value) return false;

  return true;
}

function validateD() {
  if (isStepDValid()) document.getElementById('err-d').classList.remove('show');
}

/* ══════════════════════════════════════════════
   STEP E — DECLARATIONS
══════════════════════════════════════════════ */

function updateDeclare() {
  var boxes   = document.querySelectorAll('.declare-check');
  var checked = 0;
  boxes.forEach(function (b) { if (b.checked) checked++; });
  document.getElementById('declare-count').textContent = checked;
  document.getElementById('submitBtn').disabled = (checked < boxes.length);
}

/* ══════════════════════════════════════════════
   SUBMIT
══════════════════════════════════════════════ */

function handleSubmit() {
  var toolName = document.getElementById('q1_tool_name').value.trim();
  var reqBy    = document.getElementById('q6_requested_by').value;
  var reqOther = document.getElementById('q6_requested_other').value.trim();
  var reqName  = (reqBy === 'other') ? reqOther : reqBy;

  document.getElementById('success-meta').textContent =
    '"' + toolName + '" requested by ' + reqName;

  document.querySelectorAll('.step-panel').forEach(function (p) {
    p.classList.remove('active');
  });
  document.getElementById('successScreen').classList.add('active');

  document.querySelectorAll('.step-nav-item').forEach(function (n) {
    n.classList.remove('active');
    n.classList.add('done');
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ══════════════════════════════════════════════
   RESET
══════════════════════════════════════════════ */

function resetForm() {
  document.querySelectorAll('.field-input').forEach(function (el) { el.value = ''; });
  document.querySelectorAll('select').forEach(function (el) { el.value = ''; });
  document.querySelectorAll('.other-input').forEach(function (el) { el.style.display = 'none'; });
  document.querySelectorAll('.declare-check').forEach(function (el) { el.checked = false; });
  document.querySelectorAll('.radio-opt').forEach(function (el) { el.classList.remove('selected'); });
  document.querySelectorAll('.error-toast').forEach(function (el) { el.classList.remove('show'); });

  var warnCost = document.getElementById('warn_cost');
  if (warnCost) warnCost.style.display = 'none';

  radioState = {};
  userTags   = [];
  renderUserTags();
  updateCostBadge();
  updateDeclare();

  document.getElementById('successScreen').classList.remove('active');
  document.getElementById('step-a').classList.add('active');

  document.querySelectorAll('.step-nav-item').forEach(function (n) {
    n.classList.remove('active', 'done');
  });
  document.getElementById('snav-a').classList.add('active');

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ══════════════════════════════════════════════
   UTILITY
══════════════════════════════════════════════ */

function escapeHtml(str) {
  return str
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#39;');
}
