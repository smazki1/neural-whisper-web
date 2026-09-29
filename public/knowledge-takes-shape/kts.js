/* "הידע שלכם מקבל צורה" — מנגנון האנימציה.
   מפעיל כל ‎.kts‎ בעמוד: כשנכנס למסך, ומשהה ארבע שניות בסוף לפני הפעלה חוזרת. */
(function () {
  "use strict";

  var PHASES = ["is-raw", "is-threads", "is-fade", "is-gather", "is-join", "is-form", "is-final", "is-done"];
  // ציר הזמן (מילישניות מתחילת ההפעלה)
  var T = { raw: 60, threads: 1300, fade: 3100, gather: 3550, join: 4650, form: 5800,
            demo: 6750, demoDur: 1250, optB: 8250, final: 9000, done: 10400 };
  var V_START = 28, V_END = 72, SEGMENTS = 12;
  var C = 2 * Math.PI * 50;
  var NS = "http://www.w3.org/2000/svg";
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function easeInOut(p) { return p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; }

  function init(root) {
    var stage = root.querySelector(".kts-stage");
    var floats = [].slice.call(root.querySelectorAll(".kts-float"));
    var thread = root.querySelector(".kts-thread");
    var svg = root.querySelector(".kts-threads");
    var arc = root.querySelector(".kts-ring-arc");
    var segGroup = root.querySelector(".kts-seg");
    var num = root.querySelector(".kts-num");
    var result = root.querySelector(".kts-result");
    var range = root.querySelector(".kts-range");
    var opts = [].slice.call(root.querySelectorAll(".kts-opt"));
    var controls = [root.querySelector(".kts-choice"), root.querySelector(".kts-slider")];
    var replay = root.querySelector(".kts-replay");
    var timers = [], rafs = { float: 0, tween: 0 }, segs = [];

    // קשת בשלבים: 12 מקטעים
    var segLen = C * (23 / 360);
    for (var i = 0; i < SEGMENTS; i++) {
      var c = document.createElementNS(NS, "circle");
      c.setAttribute("cx", "60"); c.setAttribute("cy", "60"); c.setAttribute("r", "50");
      c.setAttribute("stroke-dasharray", segLen.toFixed(2) + " " + C.toFixed(2));
      c.setAttribute("transform", "rotate(" + (-90 + i * 30 + 3.5) + " 60 60)");
      segGroup.appendChild(c);
      segs.push(c);
    }

    function setV(v) {
      v = Math.max(0, Math.min(100, v));
      stage.style.setProperty("--v", v.toFixed(2));
      arc.setAttribute("stroke-dasharray", (C * v / 100).toFixed(2) + " " + C.toFixed(2));
      var lit = Math.round(v / 100 * SEGMENTS);
      for (var i = 0; i < segs.length; i++) segs[i].classList.toggle("on", i < lit);
      var r = Math.round(v);
      num.textContent = r;
      result.setAttribute("aria-label", "תוצאה: " + r);
      if (document.activeElement !== range) range.value = r;
    }

    function setOpt(o) {
      stage.setAttribute("data-opt", o);
      opts.forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-opt") === o ? "true" : "false"); });
    }

    function setInteractive(on) {
      controls.forEach(function (el) {
        if (on) el.removeAttribute("inert"); else el.setAttribute("inert", "");
        el.style.pointerEvents = on ? "" : "none";
      });
    }

    function clearAll() {
      timers.forEach(clearTimeout); timers = [];
      cancelAnimationFrame(rafs.float); cancelAnimationFrame(rafs.tween);
      floats.forEach(function (el) { el.style.transform = ""; });
    }

    function at(ms, fn) { timers.push(setTimeout(fn, ms)); }
    function add(cls) { stage.classList.add(cls); }

    // חוט דק שעובר בין שלוש המחשבות
    function drawThread() {
      var s = stage.getBoundingClientRect();
      var p = floats.map(function (el) {
        var r = el.getBoundingClientRect();
        return [r.left + r.width / 2 - s.left, r.top + r.height / 2 - s.top];
      });
      svg.setAttribute("viewBox", "0 0 " + s.width + " " + s.height);
      function ctrl(a, b) { return [(a[0] + b[0]) / 2 + (b[1] - a[1]) * .18, (a[1] + b[1]) / 2 - (b[0] - a[0]) * .18]; }
      var c1 = ctrl(p[0], p[1]), c2 = ctrl(p[1], p[2]);
      thread.setAttribute("d", "M" + p[0] + " Q" + c1 + " " + p[1] + " Q" + c2 + " " + p[2]);
    }

    // ריחוף שקט של הפתקים, נרגע כשהם מתחילים להסתדר
    function startFloat() {
      var t0 = performance.now();
      var seeds = [[0, 1], [1.9, .82], [3.4, 1.12]];
      var calmFrom = T.gather / 1000 - .1, calmDur = .9;
      function tick(now) {
        var t = (now - t0) / 1000;
        var amp = t < calmFrom ? 1 : Math.max(0, 1 - (t - calmFrom) / calmDur);
        amp = amp * amp * (3 - 2 * amp);
        floats.forEach(function (el, i) {
          var y = Math.sin(t * 1.05 * seeds[i][1] + seeds[i][0]) * 4.5 * amp;
          var x = Math.cos(t * .7 * seeds[i][1] + seeds[i][0]) * 2 * amp;
          el.style.transform = "translate3d(" + x.toFixed(2) + "px," + y.toFixed(2) + "px,0)";
        });
        if (amp > 0) rafs.float = requestAnimationFrame(tick);
        else floats.forEach(function (el) { el.style.transform = ""; });
      }
      rafs.float = requestAnimationFrame(tick);
    }

    function tweenV(from, to, dur) {
      var t0 = performance.now();
      function f(now) {
        var p = Math.min(1, (now - t0) / dur);
        setV(from + (to - from) * easeInOut(p));
        if (p < 1) rafs.tween = requestAnimationFrame(f);
      }
      rafs.tween = requestAnimationFrame(f);
    }

    function reset() {
      clearAll();
      stage.classList.add("kts-instant");
      PHASES.forEach(function (c) { stage.classList.remove(c); });
      thread.setAttribute("d", "");
      setOpt("a");
      setV(V_START);
      setInteractive(false);
      void stage.offsetWidth;                 // קיבוע המצב ההתחלתי בלי מעברים
      stage.classList.remove("kts-instant");
    }

    function showFinal() {
      clearAll();
      PHASES.forEach(add);
      setOpt("b");
      setV(V_END);
      setInteractive(true);
    }

    function play() {
      reset();
      at(T.raw, function () { add("is-raw"); startFloat(); });
      at(T.threads, function () { drawThread(); void svg.getBoundingClientRect(); add("is-threads"); });
      at(T.fade, function () { add("is-fade"); });
      at(T.gather, function () { add("is-gather"); });
      at(T.join, function () { add("is-join"); });
      at(T.form, function () { add("is-form"); });
      at(T.demo, function () { tweenV(V_START, V_END, T.demoDur); });
      at(T.optB, function () { setOpt("b"); });
      at(T.final, function () { add("is-final"); setInteractive(true); });
      at(T.done, function () { add("is-done"); });
      at(T.done + 4000, play);
    }

    // אינטראקציה בסיום
    opts.forEach(function (b) {
      b.addEventListener("click", function () { setOpt(b.getAttribute("data-opt")); });
    });
    range.addEventListener("input", function () { setV(+range.value); });
    replay.addEventListener("click", function () {
      play();
      // הכפתור נעלם בזמן ההפעלה — הפוקוס עובר לבמה כדי לא ללכת לאיבוד
      stage.setAttribute("tabindex", "-1");
      stage.focus({ preventScroll: true });
    });

    var io = null, alive = true;
    function destroy() {
      alive = false;
      clearAll();
      if (io) io.disconnect();
      delete root.__kts;
    }
    root.__kts = { destroy: destroy, replay: play };

    if (reduceMotion) {
      stage.classList.add("kts-static");
      showFinal();
      replay.hidden = true;
      return destroy;
    }

    reset();

    var fontsReady = document.fonts && document.fonts.load
      ? Promise.race([
          Promise.all([
            document.fonts.load('500 18px "Noto Sans Hebrew"', "א"),
            document.fonts.load('700 30px "Noto Sans Hebrew"', "א")
          ]),
          new Promise(function (r) { setTimeout(r, 2000); })
        ])
      : Promise.resolve();

    fontsReady.then(function () {
      if (!alive) return;
      if (!("IntersectionObserver" in window)) { play(); return; }
      io = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { io.disconnect(); play(); }
      }, { threshold: .45 });
      io.observe(stage);
    });

    return destroy;
  }

  // ממשק ציבורי — לאתרים שמרנדרים את הרכיב אחרי טעינת העמוד (React / Next וכו׳)
  // KnowledgeTakesShape.init(el) מחזיר פונקציית ניקוי. הפעלה כפולה על אותו אלמנט לא תיצור כפילות.
  window.KnowledgeTakesShape = {
    init: function (root) { return root.__kts ? root.__kts.destroy : init(root); },
    initAll: boot
  };

  function boot() {
    [].forEach.call(document.querySelectorAll(".kts"), function (el) { if (!el.__kts) init(el); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
