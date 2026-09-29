/* "מזמן שמתפזר לעבודה שמתקדמת" — מנגנון האנימציה.
   קו אחד שמסתבך בין המשימות, נמשך ומתיישר לדרך עם שלושה שלבים.
   הפעלה אחת כשהרכיב נכנס למסך, עצירה בסוף, הפעלה חוזרת בכפתור. */
(function () {
  "use strict";

  var PHASES = ["is-a", "is-b", "is-c", "is-d", "is-done"];
  // ציר הזמן (מילישניות)
  var T = { a: 60, drawFrom: 300, drawDur: 2700, b: 3200, morphFrom: 3350, morphDur: 2300,
            c: 5050, progFrom: 5750, progDur: 2300, d: 8300, done: 9900 };
  var N = 72, K = 26;                  // נקודות הקו; מתוכן — נקודות הקשר
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function clamp01(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function easeInOut(p) { return p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; }
  function easeOut(p) { return 1 - Math.pow(1 - p, 3); }
  var TAU = Math.PI * 2;

  // קו חופשי שמסתובב וחוזר על עצמו
  function tangleUV(t) {
    return [
      .78 * Math.sin(TAU * 1.6 * t + .5) + .22 * Math.sin(TAU * 6.2 * t + 1.3),
      .72 * Math.sin(TAU * 2.4 * t + 1.9) + .25 * Math.cos(TAU * 5.1 * t)
    ];
  }
  // אותו קו, מכווץ לקשר קטן
  function knotUV(t) {
    return [
      .8 * Math.sin(TAU * 2 * t + .4) + .2 * Math.sin(TAU * 5 * t),
      .75 * Math.sin(TAU * 3 * t + 1.2) + .2 * Math.cos(TAU * 4 * t)
    ];
  }

  // Catmull-Rom → Bézier: קו חלק שעובר דרך כל הנקודות
  function smoothPath(p) {
    var d = "M" + p[0][0].toFixed(1) + " " + p[0][1].toFixed(1);
    for (var i = 0; i < p.length - 1; i++) {
      var p0 = p[i - 1] || p[i], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] || p2;
      d += " C" + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(1) + " " + (p1[1] + (p2[1] - p0[1]) / 6).toFixed(1) +
           " " + (p2[0] - (p3[0] - p1[0]) / 6).toFixed(1) + " " + (p2[1] - (p3[1] - p1[1]) / 6).toFixed(1) +
           " " + p2[0].toFixed(1) + " " + p2[1].toFixed(1);
    }
    return d;
  }

  function init(root) {
    var stage = root.querySelector(".tfp-stage");
    var svg = root.querySelector(".tfp-lines");
    var thread = root.querySelector(".tfp-thread");
    var progress = root.querySelector(".tfp-progress");
    var chaos = root.querySelector(".tfp-chaos");
    var knot = root.querySelector(".tfp-knot");
    var end = root.querySelector(".tfp-end");
    var steps = [].slice.call(root.querySelectorAll(".tfp-step"));
    var replay = root.querySelector(".tfp-replay");
    var raf = 0, t0 = 0, running = false, alive = true, io = null, ro = null;
    var state = { draw: 1, morph: 1, prog: 1 };

    function center(el, s) {
      var r = el.getBoundingClientRect();
      return [r.left + r.width / 2 - s.left, r.top + r.height / 2 - s.top];
    }

    // כל הגאומטריה נמדדת מה־DOM — ה־CSS קובע את הפריסה, כאן רק מחברים את הנקודות
    function geometry() {
      var s = stage.getBoundingClientRect();
      var c = chaos.getBoundingClientRect(), k = knot.getBoundingClientRect();
      var cx = c.left + c.width / 2 - s.left, cy = c.top + c.height / 2 - s.top;
      var kc = center(knot, s), kr = [k.width / 2, k.height / 2];
      var st = steps.map(function (el) { return center(el, s); });
      var e = center(end, s);

      var dir = [st[0][0] - kc[0], st[0][1] - kc[1]];
      var dl = Math.hypot(dir[0], dir[1]) || 1;
      dir = [dir[0] / dl, dir[1] / dl];
      var exitR = Math.hypot(dir[0] * kr[0], dir[1] * kr[1]) + 8;
      var x0 = [kc[0] + dir[0] * exitR, kc[1] + dir[1] * exitR];

      var tangle = [], fin = [];
      for (var i = 0; i < N; i++) {
        var uv = tangleUV(i / (N - 1));
        tangle.push([cx + uv[0] * c.width * .46, cy + uv[1] * c.height * .45]);
        if (i < K) {
          var kv = knotUV(i / (K - 1));
          fin.push([kc[0] + kv[0] * kr[0], kc[1] + kv[1] * kr[1]]);
        } else {
          var f = (i - K) / (N - K - 1);
          fin.push([x0[0] + (e[0] - x0[0]) * f, x0[1] + (e[1] - x0[1]) * f]);
        }
      }
      var len = Math.hypot(e[0] - x0[0], e[1] - x0[1]) || 1;
      var at = st.map(function (p) { return Math.hypot(p[0] - x0[0], p[1] - x0[1]) / len; });
      return { w: s.width, h: s.height, tangle: tangle, fin: fin, x0: x0, e: e, len: len, at: at };
    }

    function render() {
      var g = geometry();
      svg.setAttribute("viewBox", "0 0 " + g.w + " " + g.h);

      // הקו נמשך מהקצה: הנקודות האחרונות מתיישרות ראשונות
      var pts = g.tangle.map(function (p, i) {
        var start = (N - 1 - i) / (N - 1) * .45;
        var q = easeInOut(clamp01((state.morph - start) / .55));
        return [p[0] + (g.fin[i][0] - p[0]) * q, p[1] + (g.fin[i][1] - p[1]) * q];
      });
      thread.setAttribute("d", smoothPath(pts));
      if (state.draw < 1) {
        var L = thread.getTotalLength();
        thread.style.strokeDasharray = L + " " + L;
        thread.style.strokeDashoffset = L * (1 - state.draw);
      } else {
        thread.style.strokeDasharray = "";
        thread.style.strokeDashoffset = "";
      }

      progress.setAttribute("d", "M" + g.x0[0].toFixed(1) + " " + g.x0[1].toFixed(1) + " L" + g.e[0].toFixed(1) + " " + g.e[1].toFixed(1));
      progress.style.strokeDasharray = g.len + " " + g.len;
      progress.style.strokeDashoffset = g.len * (1 - state.prog);
      steps.forEach(function (el, i) { el.classList.toggle("is-on", state.prog >= g.at[i] - .01); });
    }

    function frame(now) {
      var t = now - t0;
      state.draw = easeOut(clamp01((t - T.drawFrom) / T.drawDur));
      state.morph = clamp01((t - T.morphFrom) / T.morphDur);
      state.prog = easeInOut(clamp01((t - T.progFrom) / T.progDur));
      if (t >= T.a) stage.classList.add("is-a");
      if (t >= T.b) stage.classList.add("is-b");
      if (t >= T.c) stage.classList.add("is-c");
      if (t >= T.d) stage.classList.add("is-d");
      render();
      if (t >= T.done) { stage.classList.add("is-done"); running = false; return; }
      raf = requestAnimationFrame(frame);
    }

    function reset() {
      cancelAnimationFrame(raf);
      running = false;
      stage.classList.add("tfp-instant");
      PHASES.forEach(function (c) { stage.classList.remove(c); });
      state.draw = 0; state.morph = 0; state.prog = 0;
      render();
      void stage.offsetWidth;
      stage.classList.remove("tfp-instant");
    }

    function play() {
      reset();
      running = true;
      t0 = performance.now();
      raf = requestAnimationFrame(frame);
    }

    function showFinal() {
      cancelAnimationFrame(raf);
      running = false;
      ["is-a", "is-b", "is-c", "is-d", "is-done"].forEach(function (c) { stage.classList.add(c); });
      state.draw = 1; state.morph = 1; state.prog = 1;
      render();
    }

    replay.addEventListener("click", function () {
      play();
      stage.setAttribute("tabindex", "-1");
      stage.focus({ preventScroll: true });
    });

    // שינוי גודל: מציירים מחדש את המצב הנוכחי
    if ("ResizeObserver" in window) {
      ro = new ResizeObserver(function () { if (!running) render(); });
      ro.observe(stage);
    }

    function destroy() {
      alive = false;
      cancelAnimationFrame(raf);
      if (io) io.disconnect();
      if (ro) ro.disconnect();
      delete root.__tfp;
    }
    root.__tfp = { destroy: destroy, replay: play };

    if (reduceMotion) {
      stage.classList.add("tfp-static");
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
      render();                                  // מידות סופיות אחרי טעינת הגופן
      if (!("IntersectionObserver" in window)) { play(); return; }
      var inView = false;
      io = new IntersectionObserver(function (entries) {
        var entry = entries[entries.length - 1];
        var visible = entry.isIntersecting && entry.intersectionRatio >= .1;
        if (visible === inView) return;
        inView = visible;
        // Entering the viewport starts a fresh run, without pointer interaction.
        if (visible) play();
        else { cancelAnimationFrame(raf); running = false; }
      }, { threshold: .1 });
      io.observe(stage);
    });

    return destroy;
  }

  // ממשק ציבורי — לאתרים שמרנדרים את הרכיב אחרי טעינת העמוד (React / Next וכו׳)
  window.TimeToProgress = {
    init: function (root) { return root.__tfp ? root.__tfp.destroy : init(root); },
    initAll: boot
  };

  function boot() {
    [].forEach.call(document.querySelectorAll(".tfp"), function (el) { if (!el.__tfp) init(el); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
