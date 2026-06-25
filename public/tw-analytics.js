/*
  Third Wave — analytics loader (GA4 + Meta Pixel) with geo-gated consent.

  Behaviour:
    • EU / EEA / UK / Switzerland visitors  → pixels load ONLY after explicit
      opt-in via the consent banner (GDPR / UK-GDPR / ePrivacy / FADP).
    • Everyone else                         → pixels load immediately.
    • The choice is stored in localStorage so the banner is shown at most once.
    • Geo is read from Cloudflare's edge endpoint /cdn-cgi/trace (no extra deps).
    • Fail-safe: if geo lookup fails or the country is unknown, we GATE (treat
      the visitor as opt-in-required) rather than firing without consent.

  GO LIVE: replace the two placeholder IDs below with real ones. Until then the
  loader is completely inert — no banner, no network calls, no pixels.
*/
(function () {
	'use strict';

	// ---- config -------------------------------------------------------------
	var GA4_ID = 'G-MC2JXEF4TR'; // GA4 Measurement ID
	var META_PIXEL_ID = 'XXXXXXXXXXXXXXX'; // TODO: real Meta Pixel ID (~15 digits)

	var STORE_KEY = 'tw-consent'; // value: 'granted' | 'denied'
	var TRACE_URL = '/cdn-cgi/trace'; // Cloudflare edge geo

	// Off-site lead actions: a click on any link whose href contains `match`
	// fires the event. These funnels complete off-site (Tally / the user's mail
	// client), so the click is the trackable intent. Update `match` if the
	// destinations ever change.
	var LEAD_LINKS = [
		{ match: 'tally.so/r/WOoYxP', event: 'dev_kit_interest',
		  params: { lead_type: 'developer', content_name: 'dev_kit_access' } },
		{ match: 'mailto:licensing@thirdwave.fun', event: 'licensing_interest',
		  params: { lead_type: 'venue', content_name: 'licensing' } }
	];

	// Events that map to Meta's "Lead" standard event (the three EOIs).
	var META_LEAD_EVENTS = { sign_up: 1, dev_kit_interest: 1, licensing_interest: 1 };

	// EU-27 + EEA (IS/LI/NO) + UK + Switzerland → opt-in required
	var GATED = {
		AT: 1, BE: 1, BG: 1, HR: 1, CY: 1, CZ: 1, DK: 1, EE: 1, FI: 1, FR: 1,
		DE: 1, GR: 1, HU: 1, IE: 1, IT: 1, LV: 1, LT: 1, LU: 1, MT: 1, NL: 1,
		PL: 1, PT: 1, RO: 1, SK: 1, SI: 1, ES: 1, SE: 1, // EU-27
		IS: 1, LI: 1, NO: 1, // EEA
		GB: 1, CH: 1 // UK, Switzerland
	};

	// ---- helpers ------------------------------------------------------------
	function isPlaceholder(id) { return !id || /X{4,}/.test(id); }
	function store(v) { try { localStorage.setItem(STORE_KEY, v); } catch (e) {} }
	function read() { try { return localStorage.getItem(STORE_KEY); } catch (e) { return null; } }

	var loaded = false;
	function loadPixels() {
		if (loaded) return;
		loaded = true;

		// Google Analytics 4 (gtag.js)
		if (!isPlaceholder(GA4_ID)) {
			var s = document.createElement('script');
			s.async = true;
			s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA4_ID);
			document.head.appendChild(s);
			window.dataLayer = window.dataLayer || [];
			window.gtag = function () { window.dataLayer.push(arguments); };
			window.gtag('js', new Date());
			window.gtag('config', GA4_ID);
		}

		// Meta Pixel
		if (!isPlaceholder(META_PIXEL_ID)) {
			!function (f, b, e, v, n, t, s) {
				if (f.fbq) return; n = f.fbq = function () {
					n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
				};
				if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
				n.queue = []; t = b.createElement(e); t.async = !0; t.src = v;
				s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
			}(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
			window.fbq('init', META_PIXEL_ID);
			window.fbq('track', 'PageView');
		}
	}

	// ---- conversion helper --------------------------------------------------
	// Call window.twTrack('sign_up') from anywhere. Fires to GA4 (and Meta, when
	// its pixel is live) ONLY if pixels actually loaded — i.e. the visitor
	// consented (gated regions) or is in a free region. No-op otherwise, so
	// callers never need to know about consent state.
	window.twTrack = function (name, params) {
		try {
			if (window.gtag && !isPlaceholder(GA4_ID)) {
				window.gtag('event', name, params || {});
			}
			if (window.fbq && !isPlaceholder(META_PIXEL_ID)) {
				// Map our event names to Meta standard events where they differ.
				// All three EOIs (consumer signup, dev kit, licensing) are Leads.
				var metaEvent = META_LEAD_EVENTS[name] ? 'Lead' : name;
				window.fbq('track', metaEvent, params || {});
			}
		} catch (e) {}
	};

	// ---- consent banner (gated regions, no prior decision) ------------------
	function injectStyles() {
		if (document.getElementById('tw-consent-style')) return;
		var css =
			'#tw-consent{position:fixed;left:0;right:0;bottom:0;z-index:9999;' +
			'background:#0a0a0a;border-top:1px solid #2a2a2a;padding:16px 22px;' +
			"font-family:'Schibsted Grotesk',system-ui,sans-serif;color:#b3b3b3}" +
			'#tw-consent .tw-consent-inner{max-width:1100px;margin:0 auto;display:flex;' +
			'align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap}' +
			'#tw-consent p{margin:0;font-size:13px;line-height:1.5;max-width:640px}' +
			'#tw-consent a{color:#fff;text-decoration:underline;text-underline-offset:2px}' +
			'#tw-consent .tw-consent-actions{display:flex;gap:10px;flex-shrink:0}' +
			'#tw-consent button{font-family:inherit;font-size:11px;letter-spacing:.12em;' +
			'text-transform:uppercase;padding:10px 18px;border:1px solid #2a2a2a;cursor:pointer;' +
			'background:transparent;color:#b3b3b3;transition:color .2s ease,border-color .2s ease,background .2s ease}' +
			'#tw-consent button:hover{color:#fff;border-color:#555}' +
			'#tw-consent .tw-consent-accept{background:#fff;color:#0a0a0a;border-color:#fff}' +
			'#tw-consent .tw-consent-accept:hover{opacity:.9;color:#0a0a0a}' +
			'@media(max-width:620px){#tw-consent .tw-consent-inner{flex-direction:column;align-items:flex-start}' +
			'#tw-consent .tw-consent-actions{width:100%}#tw-consent button{flex:1}}';
		var style = document.createElement('style');
		style.id = 'tw-consent-style';
		style.textContent = css;
		document.head.appendChild(style);
	}

	function showBanner() {
		if (document.getElementById('tw-consent')) return;
		injectStyles();
		var bar = document.createElement('div');
		bar.id = 'tw-consent';
		bar.setAttribute('role', 'dialog');
		bar.setAttribute('aria-label', 'Cookie consent');
		bar.innerHTML =
			'<div class="tw-consent-inner">' +
			'<p>We use cookies for analytics and advertising. You can accept or decline. ' +
			'See our <a href="/privacy">Privacy Policy</a>.</p>' +
			'<div class="tw-consent-actions">' +
			'<button id="tw-consent-decline" class="tw-consent-decline">Decline</button>' +
			'<button id="tw-consent-accept" class="tw-consent-accept">Accept</button>' +
			'</div></div>';
		document.body.appendChild(bar);

		function hide() { if (bar.parentNode) bar.parentNode.removeChild(bar); }
		document.getElementById('tw-consent-accept').addEventListener('click', function () {
			store('granted'); loadPixels(); hide();
		});
		document.getElementById('tw-consent-decline').addEventListener('click', function () {
			store('denied'); hide();
		});
	}

	// ---- decide -------------------------------------------------------------
	function decide() {
		// Inert until at least one real ID is configured.
		if (isPlaceholder(GA4_ID) && isPlaceholder(META_PIXEL_ID)) return;

		var prior = read();
		if (prior === 'granted') { loadPixels(); return; }
		if (prior === 'denied') return;

		fetch(TRACE_URL, { cache: 'no-store' })
			.then(function (r) { return r.text(); })
			.then(function (txt) {
				var m = /(?:^|\n)loc=([A-Z]{2})/.exec(txt);
				var loc = m && m[1];
				if (!loc || GATED[loc]) {
					showBanner(); // EU/EEA/UK/CH or unknown → opt-in
				} else {
					store('granted'); // free region → load now
					loadPixels();
				}
			})
			.catch(function () { showBanner(); }); // fail-safe → gate
	}

	// Delegated click tracking for off-site lead links (header + body + anywhere).
	// Capture phase so it fires even if a handler stops propagation, and before
	// navigation. twTrack no-ops if the visitor hasn't consented, so this is safe.
	document.addEventListener('click', function (e) {
		var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
		if (!a) return;
		var href = a.getAttribute('href') || '';
		for (var i = 0; i < LEAD_LINKS.length; i++) {
			if (href.indexOf(LEAD_LINKS[i].match) !== -1) {
				window.twTrack(LEAD_LINKS[i].event, LEAD_LINKS[i].params);
				break;
			}
		}
	}, true);

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', decide);
	} else {
		decide();
	}
})();
