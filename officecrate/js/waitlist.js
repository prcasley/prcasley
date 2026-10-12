// Paste your Google Apps Script web-app URL (see officecrate/waitlist/README.md)
// or a Formspree endpoint (https://formspree.io/f/xxxx). Until set, the form
// tells visitors the waitlist isn't open instead of faking a success.
var WAITLIST_ENDPOINT = '';

(function () {
  var form = document.getElementById('waitlistForm');
  var success = document.getElementById('successState');
  var reset = document.getElementById('resetForm');
  var btn = document.getElementById('submitBtn');
  var errorEl = document.getElementById('formError');
  var params = new URLSearchParams(location.search);
  var tracking = {
    utm_source: params.get('utm_source') || '',
    utm_medium: params.get('utm_medium') || '',
    utm_campaign: params.get('utm_campaign') || '',
    utm_content: params.get('utm_content') || '',
    referrer: document.referrer || ''
  };

  function showError(msg) { errorEl.textContent = msg; errorEl.hidden = false; }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    errorEl.hidden = true;
    if (!form.reportValidity()) return;
    if (form.company.value) return; // bot filled the honeypot
    if (!WAITLIST_ENDPOINT) {
      showError('The waitlist opens soon. Nothing was submitted; please check back shortly.');
      return;
    }
    var data = new FormData(form);
    data.delete('company');
    Object.keys(tracking).forEach(function (k) { data.append(k, tracking[k]); });
    data.append('submitted_at', new Date().toISOString());
    var isAppsScript = WAITLIST_ENDPOINT.indexOf('script.google.com') !== -1;
    btn.disabled = true;
    fetch(WAITLIST_ENDPOINT, isAppsScript
      ? { method: 'POST', mode: 'no-cors', body: new URLSearchParams(data) }
      : { method: 'POST', body: data, headers: { Accept: 'application/json' } })
      .then(function (res) {
        if (!isAppsScript && !res.ok) throw new Error('HTTP ' + res.status);
        form.style.display = 'none';
        success.classList.add('visible');
        reset.focus();
      })
      .catch(function () {
        showError('Something went wrong. Please try again in a minute.');
      })
      .then(function () { btn.disabled = false; });
  });

  reset.addEventListener('click', function () {
    success.classList.remove('visible');
    form.reset();
    form.style.display = '';
    document.getElementById('name').focus();
  });
})();
