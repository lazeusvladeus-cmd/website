/* ==========================================================================
   Vike Marketing — shared JavaScript (no dependencies)
   ========================================================================== */

/* ==========================================================================
   >>> SITE CONFIG — edit these values <<<
   --------------------------------------------------------------------------
   TELEGRAM_BOT_TOKEN : token from @BotFather, e.g. '123456789:AA...'
   TELEGRAM_CHAT_IDS  : one or more chat IDs that should receive new leads,
                        e.g. ['123456789', '-1001234567890']
   CONTACT_EMAIL      : address used for the mailto fallback.
   BOOKING_URL        : optional scheduling link (Calendly, Cal.com...). When
                        set, the booking form also offers "Open the calendar".

   If the Telegram values are left empty, or the Telegram request fails,
   the form falls back to opening a pre-filled email to CONTACT_EMAIL —
   so a lead is never lost.

   NOTE: anything in this file is public. A bot token here can be read by
   anyone who views the page source. Use a bot that does nothing except
   post leads, and rotate the token with @BotFather if it is ever abused.
   ========================================================================== */
var VIKE_CONFIG = {
  TELEGRAM_BOT_TOKEN: '',            // <-- paste bot token here
  TELEGRAM_CHAT_IDS: [],             // <-- e.g. ['123456789']
  CONTACT_EMAIL: 'sales@vikemarketing.com',
  BOOKING_URL: ''                    // <-- optional: Calendly / Cal.com link, e.g. 'https://cal.com/vike/intro'
};
/* ======================== end of SITE CONFIG ============================ */

(function(){
  'use strict';
  var doc = document.documentElement;
  doc.classList.remove('no-js');
  doc.classList.add('js');

  /* ---------- reading progress bar ---------- */
  var bar = document.getElementById('progress');
  if(bar){
    var ticking = false;
    var updateBar = function(){
      if(ticking) return;
      ticking = true;
      requestAnimationFrame(function(){
        var h = doc.scrollHeight - window.innerHeight;
        bar.style.transform = 'scaleX(' + (h > 0 ? window.scrollY / h : 0) + ')';
        ticking = false;
      });
    };
    window.addEventListener('scroll', updateBar, {passive:true});
    window.addEventListener('resize', updateBar);
    updateBar();
  }

  /* ---------- scroll reveal ---------- */
  var revealTargets = document.querySelectorAll('main section > .wrap > *, .final .wrap > *');
  if('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, {threshold:.08, rootMargin:'0px 0px -40px 0px'});
    revealTargets.forEach(function(el){
      var r = el.getBoundingClientRect();
      if(r.top < window.innerHeight){ return; } // already visible: don't hide it
      el.classList.add('reveal');
      io.observe(el);
    });
  }

  /* ---------- navigation: dropdowns + mobile menu ---------- */
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  var items = document.querySelectorAll('.nav-item.has-dropdown');
  var desktopHover = window.matchMedia('(hover: hover) and (min-width: 1101px)');

  function closeAll(except){
    items.forEach(function(item){
      if(item === except) return;
      item.classList.remove('open');
      var b = item.querySelector('.nav-link');
      if(b) b.setAttribute('aria-expanded','false');
    });
  }
  items.forEach(function(item){
    var btn = item.querySelector('.nav-link');
    var timer;
    btn.addEventListener('click', function(){
      var open = !item.classList.contains('open');
      closeAll(item);
      item.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    item.addEventListener('mouseenter', function(){
      if(!desktopHover.matches) return;
      clearTimeout(timer); closeAll(item);
      item.classList.add('open'); btn.setAttribute('aria-expanded','true');
    });
    item.addEventListener('mouseleave', function(){
      if(!desktopHover.matches) return;
      timer = setTimeout(function(){ item.classList.remove('open'); btn.setAttribute('aria-expanded','false'); }, 160);
    });
    item.addEventListener('focusout', function(e){
      if(desktopHover.matches && !item.contains(e.relatedTarget)){
        item.classList.remove('open'); btn.setAttribute('aria-expanded','false');
      }
    });
  });
  document.addEventListener('click', function(e){
    if(header && !header.contains(e.target)) closeAll();
  });
  if(toggle){
    toggle.addEventListener('click', function(){
      var open = !document.body.classList.contains('nav-open');
      document.body.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
  }
  function closeMobileNav(){
    if(document.body.classList.contains('nav-open')){
      document.body.classList.remove('nav-open');
      if(toggle){ toggle.setAttribute('aria-expanded','false'); toggle.setAttribute('aria-label','Open menu'); }
    }
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-q').forEach(function(btn){
    btn.addEventListener('click', function(){
      var item = btn.closest('.faq-item');
      var panel = item.querySelector('.faq-a');
      var willOpen = !item.classList.contains('open');
      var list = item.parentElement;
      list.querySelectorAll('.faq-item.open').forEach(function(other){
        other.classList.remove('open');
        other.querySelector('.faq-q').setAttribute('aria-expanded','false');
        other.querySelector('.faq-a').style.maxHeight = null;
      });
      if(willOpen){
        item.classList.add('open');
        btn.setAttribute('aria-expanded','true');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });
  });

  /* ---------- copy email (fallback where mailto is blocked) ---------- */
  document.querySelectorAll('[data-copy-email]').forEach(function(link){
    link.addEventListener('click', function(){
      if(!navigator.clipboard) return;
      navigator.clipboard.writeText(VIKE_CONFIG.CONTACT_EMAIL).then(function(){
        var tip = link.parentElement.querySelector('.copy-tip');
        if(tip){ tip.style.display = 'inline-block'; setTimeout(function(){ tip.style.display = 'none'; }, 1800); }
      }).catch(function(){});
    });
  });

  /* ---------- booking modal ---------- */
  var overlay = document.getElementById('modalOverlay');
  var lastFocus = null;

  function openModal(){
    if(!overlay) return;
    closeMobileNav();
    lastFocus = document.activeElement;
    var form = overlay.querySelector('form');
    form.reset();
    overlay.querySelector('[data-form-state]').hidden = false;
    overlay.querySelector('[data-success-state]').hidden = true;
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(function(){ var f = overlay.querySelector('input[name="name"]'); if(f) f.focus(); }, 30);
  }
  function closeModal(){
    if(!overlay || !overlay.classList.contains('open')) return;
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    if(lastFocus && lastFocus.focus) lastFocus.focus();
  }
  document.querySelectorAll('[data-book]').forEach(function(el){
    el.addEventListener('click', function(e){ e.preventDefault(); openModal(); });
  });
  if(overlay){
    overlay.addEventListener('click', function(e){ if(e.target === overlay) closeModal(); });
    overlay.querySelector('.modal-close').addEventListener('click', closeModal);
    overlay.addEventListener('keydown', function(e){
      if(e.key !== 'Tab') return;
      var f = overlay.querySelectorAll('button, input, a[href]');
      f = Array.prototype.filter.call(f, function(n){ return n.offsetParent !== null; });
      if(!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if(e.shiftKey && document.activeElement === first){ e.preventDefault(); last.focus(); }
      else if(!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
    });
  }
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape'){ closeModal(); closeAll(); closeMobileNav(); }
  });
  if(location.hash === '#book'){ openModal(); }

  /* ---------- lead forms (modal + contact page) ---------- */
  function sendTelegram(text){
    var token = VIKE_CONFIG.TELEGRAM_BOT_TOKEN;
    var ids = VIKE_CONFIG.TELEGRAM_CHAT_IDS || [];
    if(!token || !ids.length || !window.fetch) return Promise.reject(new Error('telegram-not-configured'));
    var url = 'https://api.telegram.org/bot' + token + '/sendMessage';
    return Promise.all(ids.map(function(id){
      return fetch(url, {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({chat_id:id, text:text, disable_web_page_preview:true})
      }).then(function(r){ if(!r.ok) throw new Error('telegram-' + r.status); return r; });
    }));
  }
  function mailtoFallback(name, contact){
    var subject = encodeURIComponent('New call request from ' + name);
    var body = encodeURIComponent('Name: ' + name + '\nEmail/phone: ' + contact + '\n\n(Sent from the vikemarketing.com booking form)');
    window.location.href = 'mailto:' + VIKE_CONFIG.CONTACT_EMAIL + '?subject=' + subject + '&body=' + body;
  }
  function trackLead(source){
    if(typeof window.gtag === 'function'){
      window.gtag('event', 'generate_lead', {form_location: source, page_path: location.pathname});
    }
  }

  document.querySelectorAll('form[data-lead-form]').forEach(function(form){
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var hp = form.querySelector('.hp input');
      if(hp && hp.value){ return; } // spam bot
      var name = form.querySelector('[name="name"]').value.trim();
      var contact = form.querySelector('[name="contact"]').value.trim();
      var err = form.querySelector('.form-error');
      if(!name || !contact){
        if(err){ err.textContent = 'Please fill in both fields.'; err.style.display = 'block'; }
        return;
      }
      if(err) err.style.display = 'none';
      var btn = form.querySelector('[type="submit"]');
      var label = btn.textContent;
      btn.disabled = true; btn.textContent = 'Sending…';

      var text = 'New lead — vikemarketing.com\n\nName: ' + name + '\nEmail/phone: ' + contact +
                 '\nPage: ' + location.pathname + '\nForm: ' + (form.getAttribute('data-lead-form') || 'form');

      var root = form.closest('[data-form-root]');
      function done(){
        trackLead(form.getAttribute('data-lead-form'));
        btn.disabled = false; btn.textContent = label;
        if(root){
          root.querySelector('[data-form-state]').hidden = true;
          var s = root.querySelector('[data-success-state]');
          s.hidden = false;
          var h = s.querySelector('h2'); if(h){ h.setAttribute('tabindex','-1'); h.focus(); }
        }
      }
      sendTelegram(text).then(done).catch(function(){
        mailtoFallback(name, contact);
        done();
      });
    });
  });

  /* ---------- cookie consent (Google Consent Mode v2) ---------- */
  var banner = document.getElementById('cookieBanner');
  var KEY = 'vike_consent';
  function readConsent(){ try{ return localStorage.getItem(KEY); }catch(e){ return null; } }
  function saveConsent(v){ try{ localStorage.setItem(KEY, v); }catch(e){} }
  var gaLoaded = false;
  function loadAnalytics(){
    // gtag.js is only fetched after consent: faster pages for everyone else.
    if(gaLoaded || !window.VIKE_GA_ID || /X{6,}/.test(window.VIKE_GA_ID)) return;
    gaLoaded = true;
    var sc = document.createElement('script');
    sc.async = true;
    sc.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(window.VIKE_GA_ID);
    document.head.appendChild(sc);
  }
  function applyConsent(v){
    if(typeof window.gtag !== 'function') return;
    window.gtag('consent', 'update', {analytics_storage: v === 'granted' ? 'granted' : 'denied'});
    if(v === 'granted') loadAnalytics();
  }
  if(banner){
    var stored = readConsent();
    if(stored){ applyConsent(stored); } else { banner.classList.add('show'); }
    banner.querySelectorAll('[data-consent]').forEach(function(b){
      b.addEventListener('click', function(){
        var v = b.getAttribute('data-consent');
        saveConsent(v); applyConsent(v); banner.classList.remove('show');
      });
    });
    document.querySelectorAll('[data-cookie-settings]').forEach(function(b){
      b.addEventListener('click', function(){ banner.classList.add('show'); });
    });
  }

  /* ---------- optional calendar link ---------- */
  if(VIKE_CONFIG.BOOKING_URL){
    doc.classList.add('has-booking-url');
    document.querySelectorAll('[data-booking-link]').forEach(function(a){ a.href = VIKE_CONFIG.BOOKING_URL; });
  }

  /* ---------- sticky mobile call-to-action ---------- */
  var mcta = document.getElementById('mobileCta');
  if(mcta){
    var foot = document.querySelector('.site-footer');
    var mTick = false;
    var updateMcta = function(){
      if(mTick) return; mTick = true;
      requestAnimationFrame(function(){
        var nearFoot = foot && foot.getBoundingClientRect().top < window.innerHeight;
        mcta.classList.toggle('show', window.scrollY > 500 && !nearFoot);
        mTick = false;
      });
    };
    window.addEventListener('scroll', updateMcta, {passive:true});
  }

  /* ---------- footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(function(el){ el.textContent = new Date().getFullYear(); });
})();
