/*
  Third Wave — analytics loader (GA4 + Meta Pixel) with geo-gated consent.

  Behaviour:
    • EU / EEA / UK / Switzerland visitors  → pixels load ONLY after explicit
      opt-in via the consent banner (GDPR / UK-GDPR / ePrivacy / FADP).
    • Everyone else                         → pixels load immediately.
    • Global Privacy Control (GPC) on       → pixels never load, anywhere.
    • The choice is stored in localStorage so the banner is shown at most once.
    • Any element with [data-tw-choices] (the footer "Your Privacy Choices"
      link) opens a panel where anyone, anywhere, can change that choice —
      the CCPA/CPRA opt-out of sale/sharing and the GDPR consent withdrawal.
    • Geo is read from Cloudflare's edge endpoint /cdn-cgi/trace (no extra deps).
    • Fail-safe: if geo lookup fails or the country is unknown, we GATE (treat
      the visitor as opt-in-required) rather than firing without consent.
*/
(function () {
	'use strict';

	// ---- config -------------------------------------------------------------
	var GA4_ID = 'G-MC2JXEF4TR'; // GA4 Measurement ID
	var META_PIXEL_ID = '1776201383412689'; // Meta Pixel ID

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
	function gpcOn() { return navigator.globalPrivacyControl === true; }

	// Expire GA4 / Meta first-party cookies on this host and every parent domain.
	function clearCookies() {
		var parts = location.hostname.split('.');
		var domains = [''];
		for (var i = 0; i < parts.length - 1; i++) domains.push('; domain=.' + parts.slice(i).join('.'));
		document.cookie.split(';').forEach(function (c) {
			var name = c.split('=')[0].trim();
			if (!/^(_ga|_gid|_gat|_fbp|_fbc)/.test(name)) return;
			domains.forEach(function (d) {
				document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + d;
			});
		});
	}

	var loaded = false;
	var optedOut = false;
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
	// Call window.twTrack('sign_up') from anywhere. Fires to GA4 and Meta ONLY if
	// pixels actually loaded — i.e. the visitor consented (gated regions) or is
	// in a free region. No-op otherwise, so callers never need to know about
	// consent state.
	window.twTrack = function (name, params) {
		if (optedOut) return; // opted out mid-visit via the choices panel
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

	// ---- opt in / out (choices panel) ----------------------------------------
	function optIn() {
		store('granted');
		optedOut = false;
		if (!loaded) { loadPixels(); return; }
		window['ga-disable-' + GA4_ID] = false;
		if (window.fbq) window.fbq('consent', 'grant');
	}

	function optOut() {
		store('denied');
		optedOut = true;
		window['ga-disable-' + GA4_ID] = true; // GA4's official kill switch
		if (window.fbq) window.fbq('consent', 'revoke'); // Meta stops sending
		clearCookies();
	}

	// ---- styles + motion ----------------------------------------------------
	// Both surfaces build in and build off: the card rises and fades with an
	// ease-out, its children stagger in 60 ms apart; on close the children
	// leave in reverse (40 ms apart, ease-in) and the card drops after them.
	var OUT_MS = 420;

	function injectStyles() {
		if (document.getElementById('tw-consent-style')) return;
		var EASE_OUT = 'cubic-bezier(.22,1,.36,1)';
		var EASE_IN = 'cubic-bezier(.55,0,1,.45)';
		var css =
			'#tw-consent{position:fixed;left:0;right:0;bottom:0;z-index:9999;' +
			'background:#0a0a0a;border-top:1px solid #2a2a2a;padding:16px 22px;' +
			"font-family:'Schibsted Grotesk',system-ui,sans-serif;color:#b3b3b3}" +
			'#tw-consent .tw-consent-inner{max-width:1100px;margin:0 auto;display:flex;' +
			'align-items:center;justify-content:space-between;gap:20px;flex-wrap:wrap}' +
			'#tw-consent p{margin:0;font-size:13px;line-height:1.5;max-width:640px}' +
			'#tw-consent a,#tw-choices a{color:#fff;text-decoration:underline;text-underline-offset:2px}' +
			'#tw-consent .tw-consent-actions{display:flex;gap:10px;flex-shrink:0}' +
			'#tw-consent button,#tw-choices button{font-family:inherit;font-size:11px;letter-spacing:.12em;' +
			'text-transform:uppercase;padding:10px 18px;border:1px solid #2a2a2a;cursor:pointer;' +
			'background:transparent;color:#b3b3b3;transition:color .2s ease,border-color .2s ease,background .2s ease}' +
			'#tw-consent button:hover,#tw-choices button:hover{color:#fff;border-color:#555}' +
			'#tw-consent .tw-consent-accept{background:#fff;color:#0a0a0a;border-color:#fff}' +
			'#tw-consent .tw-consent-accept:hover{opacity:.9;color:#0a0a0a}' +
			'@media(max-width:620px){#tw-consent .tw-consent-inner{flex-direction:column;align-items:flex-start}' +
			'#tw-consent .tw-consent-actions{width:100%}#tw-consent button{flex:1}}' +
			// choices panel
			'#tw-choices{position:fixed;right:22px;bottom:22px;z-index:10000;width:380px;max-width:calc(100vw - 32px);' +
			'box-sizing:border-box;background:#0a0a0a;border:1px solid #2a2a2a;padding:22px;' +
			"font-family:'Schibsted Grotesk',system-ui,sans-serif;color:#b3b3b3}" +
			'#tw-choices h2{margin:0 0 10px;font-size:11px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:#fff}' +
			'#tw-choices p{margin:0 0 16px;font-size:13px;line-height:1.5}' +
			'#tw-choices .tw-gpc{color:#fff}' +
			'.tw-switch{display:flex;align-items:center;gap:12px;margin:0 0 20px;cursor:pointer;color:#fff;font-size:14px}' +
			'.tw-switch input{position:absolute;opacity:0;width:1px;height:1px}' +
			'.tw-track{position:relative;flex-shrink:0;width:36px;height:20px;box-sizing:border-box;border:1px solid #555;' +
			'border-radius:999px;transition:background .2s ease,border-color .2s ease}' +
			'.tw-track::after{content:"";position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;' +
			'background:#b3b3b3;transition:transform .24s ' + EASE_OUT + ',background .2s ease}' +
			'.tw-switch input:checked+.tw-track{background:#fff;border-color:#fff}' +
			'.tw-switch input:checked+.tw-track::after{transform:translateX(16px);background:#0a0a0a}' +
			'.tw-switch input:focus-visible+.tw-track{outline:2px solid #fff;outline-offset:2px}' +
			'.tw-switch.is-locked{cursor:not-allowed;opacity:.5}' +
			'@media(max-width:620px){#tw-choices{left:16px;right:16px;bottom:16px;width:auto;max-width:none}}' +
			// motion
			'#tw-consent,#tw-choices{opacity:0;transform:translateY(16px);' +
			'transition:opacity .32s ' + EASE_OUT + ',transform .32s ' + EASE_OUT + '}' +
			'#tw-consent.is-in,#tw-choices.is-in{opacity:1;transform:none}' +
			'#tw-consent.is-out,#tw-choices.is-out{opacity:0;transform:translateY(12px);' +
			'transition-duration:.22s;transition-timing-function:' + EASE_IN + ';transition-delay:.12s}' +
			'.tw-stg{opacity:0;transform:translateY(8px);transition:opacity .28s ' + EASE_OUT + ',transform .28s ' + EASE_OUT + ';' +
			'transition-delay:calc(var(--i) * 60ms + 80ms)}' +
			'.is-in .tw-stg{opacity:1;transform:none}' +
			'.is-out .tw-stg{opacity:0;transform:translateY(6px);transition-duration:.16s;transition-timing-function:' + EASE_IN + ';' +
			'transition-delay:calc((var(--n) - 1 - var(--i)) * 40ms)}' +
			'@media(prefers-reduced-motion:reduce){#tw-consent,#tw-choices,.tw-stg{transition:none!important}}';
		var style = document.createElement('style');
		style.id = 'tw-consent-style';
		style.textContent = css;
		document.head.appendChild(style);
	}

	function reducedMotion() {
		return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	}

	function buildIn(el) {
		document.body.appendChild(el);
		void el.offsetWidth; // commit the start state so the transition runs
		el.classList.add('is-in');
	}

	function buildOff(el) {
		if (!el || el.classList.contains('is-out')) return;
		el.classList.remove('is-in');
		el.classList.add('is-out');
		if (el.id === 'tw-consent') document.body.style.paddingBottom = '';
		setTimeout(function () {
			if (el.parentNode) el.parentNode.removeChild(el);
		}, reducedMotion() ? 0 : OUT_MS);
	}

	// ---- consent banner (gated regions, no prior decision) ------------------
	function showBanner() {
		if (document.getElementById('tw-consent')) return;
		injectStyles();
		var bar = document.createElement('div');
		bar.id = 'tw-consent';
		bar.setAttribute('role', 'dialog');
		bar.setAttribute('aria-label', 'Cookie consent');
		bar.style.setProperty('--n', '2');
		bar.innerHTML =
			'<div class="tw-consent-inner">' +
			'<p class="tw-stg" style="--i:0">We use cookies for analytics and advertising. You can accept or decline, ' +
			'and change your mind any time under Your Privacy Choices. ' +
			'See our <a href="/privacy">Privacy Policy</a>.</p>' +
			'<div class="tw-consent-actions tw-stg" style="--i:1">' +
			'<button id="tw-consent-decline" class="tw-consent-decline">Decline</button>' +
			'<button id="tw-consent-accept" class="tw-consent-accept">Accept</button>' +
			'</div></div>';
		buildIn(bar);
		// Keep the footer (and its Your Privacy Choices link) reachable above the bar.
		document.body.style.paddingBottom = bar.offsetHeight + 'px';

		document.getElementById('tw-consent-accept').addEventListener('click', function () {
			store('granted'); loadPixels(); buildOff(bar);
		});
		document.getElementById('tw-consent-decline').addEventListener('click', function () {
			store('denied'); buildOff(bar);
		});
	}

	// ---- privacy choices panel (footer link, everyone) ----------------------
	var choicesOpener = null;

	function closeChoices() {
		var panel = document.getElementById('tw-choices');
		if (!panel) return;
		document.removeEventListener('keydown', onChoicesKey);
		buildOff(panel);
		if (choicesOpener && choicesOpener.focus) choicesOpener.focus();
	}

	function onChoicesKey(e) {
		if (e.key === 'Escape') closeChoices();
	}

	function openChoices(opener) {
		var existing = document.getElementById('tw-choices');
		if (existing && !existing.classList.contains('is-out')) return;
		injectStyles();
		choicesOpener = opener || null;
		var gpc = gpcOn();
		var on = !gpc && read() === 'granted';

		var panel = document.createElement('div');
		panel.id = 'tw-choices';
		panel.setAttribute('role', 'dialog');
		panel.setAttribute('aria-labelledby', 'tw-choices-title');
		panel.style.setProperty('--n', '4');
		panel.innerHTML =
			'<h2 id="tw-choices-title" class="tw-stg" style="--i:0">Your privacy choices</h2>' +
			'<p class="tw-stg" style="--i:1">We use Google Analytics and the Meta Pixel to measure visits and for ' +
			'advertising. Under California and other US state privacy laws, that can count as selling or sharing ' +
			'your personal information. Turn it off to opt out. See our <a href="/privacy">Privacy Policy</a>.' +
			(gpc ? ' <span class="tw-gpc">Your browser is sending a Global Privacy Control signal, so this is off ' +
				'and stays off.</span>' : '') +
			'</p>' +
			'<label class="tw-switch tw-stg' + (gpc ? ' is-locked' : '') + '" style="--i:2">' +
			'<input type="checkbox" role="switch" id="tw-choices-toggle"' + (on ? ' checked' : '') +
			(gpc ? ' disabled' : '') + '>' +
			'<span class="tw-track" aria-hidden="true"></span>' +
			'<span>Allow analytics &amp; advertising</span></label>' +
			'<button type="button" id="tw-choices-done" class="tw-stg" style="--i:3">Done</button>';
		buildIn(panel);

		var toggle = document.getElementById('tw-choices-toggle');
		toggle.addEventListener('change', function () {
			if (toggle.checked) optIn(); else optOut();
			buildOff(document.getElementById('tw-consent')); // choice made; banner is moot
		});
		document.getElementById('tw-choices-done').addEventListener('click', closeChoices);
		document.addEventListener('keydown', onChoicesKey);
		(gpc ? document.getElementById('tw-choices-done') : toggle).focus();
	}

	document.addEventListener('click', function (e) {
		var a = e.target && e.target.closest ? e.target.closest('[data-tw-choices]') : null;
		if (!a) return;
		e.preventDefault(); // without JS the link falls through to /privacy
		openChoices(a);
	});

	// ---- decide -------------------------------------------------------------
	function decide() {
		// Inert until at least one real ID is configured.
		if (isPlaceholder(GA4_ID) && isPlaceholder(META_PIXEL_ID)) return;

		// Global Privacy Control is a legal opt-out of sale/sharing (CCPA/CPRA
		// and other US states). It wins over any stored choice, and is not
		// stored itself, so turning GPC off restores the visitor's prior state.
		if (gpcOn()) return;

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
