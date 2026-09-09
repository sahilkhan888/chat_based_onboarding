/* ============================================================
   Workshop receipt printer
   Click the print key -> the receipt feeds out of the slot.
   ============================================================ */

(function () {
  'use strict';

  var section = document.querySelector('.receipt-section');
  if (!section) return;

  var btn     = section.querySelector('[data-print]');
  var label   = section.querySelector('[data-print-label]');
  var feed    = section.querySelector('[data-feed]');
  var paper   = section.querySelector('[data-paper]');
  var printer = section.querySelector('.printer');

  if (!btn || !feed || !paper) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  var state = 'idle';           // idle | printing | done
  var timer = null;

  function duration() {
    if (reduced.matches) return 0;
    var raw = getComputedStyle(document.documentElement)
      .getPropertyValue('--feed-duration').trim();
    var ms = parseFloat(raw) || 0;
    return raw.indexOf('ms') > -1 ? ms : ms * 1000;
  }

  function print() {
    if (state === 'printing') return;
    window.clearTimeout(timer);

    section.classList.remove('is-done');
    section.classList.add('is-printing');
    btn.setAttribute('aria-expanded', 'true');
    label.textContent = 'Printing…';

    // Feed to the paper's natural height, then release it so the section
    // can still reflow (font loading, resize) once it has landed.
    feed.style.height = paper.offsetHeight + 'px';
    state = 'printing';

    timer = window.setTimeout(function () {
      section.classList.remove('is-printing');
      section.classList.add('is-done');
      feed.style.height = 'auto';
      label.textContent = 'Print again';
      state = 'done';
    }, duration() + 120);
  }

  function reset(then) {
    window.clearTimeout(timer);

    // Pin the current height so the retraction has something to animate from.
    feed.style.height = feed.offsetHeight + 'px';
    void feed.offsetHeight; // flush
    section.classList.remove('is-done', 'is-printing');
    feed.style.height = '0px';
    btn.setAttribute('aria-expanded', 'false');
    label.textContent = 'Print details';
    state = 'idle';

    if (typeof then === 'function') {
      timer = window.setTimeout(then, reduced.matches ? 0 : 380);
    }
  }

  btn.addEventListener('click', function () {
    if (state === 'done') reset(print);
    else print();
  });

  // The whole printer body is a click target too — but never swallow a
  // click that already landed on the key itself.
  if (printer) {
    printer.addEventListener('click', function (event) {
      if (event.target.closest('[data-print]')) return;
      btn.click();
    });
  }

  // Keep the feed window matched to the paper after it has landed.
  if ('ResizeObserver' in window) {
    new ResizeObserver(function () {
      if (state === 'done') feed.style.height = 'auto';
    }).observe(paper);
  }
})();
