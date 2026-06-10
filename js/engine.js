/* ============================================================
   AZ-305 Study Hub — engine
   Self-contained vanilla JS. Works from file:// (no build, no fetch).
   ============================================================ */
(function () {
  "use strict";

  var SECTIONS = [];
  var byId = {};
  var PASS_MARK = 70; // AZ-305 passing score is 700/1000

  // Domain display order + metadata
  var DOMAINS = [
    { key: "Infrastructure Solutions", weight: "30–35%" },
    { key: "Data Storage Solutions", weight: "20–25%" },
    { key: "Identity, Governance & Monitoring", weight: "25–30%" },
    { key: "Business Continuity Solutions", weight: "15–20%" }
  ];

  /* ---------------- Storage ---------------- */
  var STORE_KEY = "az305-progress-v1";
  var progress = loadProgress();

  function loadProgress() {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEY)) || {};
    } catch (e) { return {}; }
  }
  function saveProgress() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(progress)); } catch (e) {}
  }
  function secProgress(id) {
    if (!progress[id]) progress[id] = { best: null, attempts: 0, known: {} };
    return progress[id];
  }

  /* ---------------- Registration ---------------- */
  function registerSection(def) {
    if (!def || !def.id) { console.warn("Section missing id", def); return; }
    if (byId[def.id]) { console.warn("Duplicate section id", def.id); return; }
    def.flashcards = def.flashcards || [];
    def.questions = def.questions || [];
    def.notes = def.notes || [];
    byId[def.id] = def;
    SECTIONS.push(def);
  }

  /* ---------------- Helpers ---------------- */
  function el(html) {
    var t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstChild;
  }
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  // Allow lightweight inline emphasis: **bold**, `code`
  function md(s) {
    return esc(s)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/`(.+?)`/g, "<code>$1</code>");
  }
  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function letter(i) { return String.fromCharCode(65 + i); }
  function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }

  /* ---------------- Routing ---------------- */
  function go(route) {
    location.hash = route;
  }
  function parseHash() {
    var h = location.hash.replace(/^#\/?/, "");
    if (!h) return { name: "home" };
    if (h === "exam") return { name: "exam" };
    if (h === "glossary") return { name: "glossary" };
    var parts = h.split("/");
    return { name: "section", id: parts[0], tab: parts[1] || "notes" };
  }
  function render() {
    var r = parseHash();
    document.body.classList.remove("nav-open");
    if (r.name !== "exam") clearExamTimer();
    if (r.name === "home") renderHome();
    else if (r.name === "exam") renderExamIntro();
    else if (r.name === "glossary") renderGlossary();
    else if (r.name === "section" && byId[r.id]) renderSection(byId[r.id], r.tab);
    else renderHome();
    renderNav();
    updateOverall();
    window.scrollTo(0, 0);
  }

  /* ---------------- Nav ---------------- */
  function renderNav() {
    var nav = document.getElementById("sectionNav");
    var r = parseHash();
    var html = '<button class="nav-item nav-home' + (r.name === "home" ? " active" : "") +
      '" data-route="">🏠 <span>Dashboard</span></button>';
    html += '<button class="nav-item nav-home' + (r.name === "exam" ? " active" : "") +
      '" data-route="exam">🎓 <span>Mock Exam</span></button>';
    html += '<button class="nav-item nav-home' + (r.name === "glossary" ? " active" : "") +
      '" data-route="glossary">📚 <span>Glossary</span></button>';
    DOMAINS.forEach(function (d) {
      var secs = sectionsInDomain(d.key);
      if (!secs.length) return;
      html += '<div class="nav-group-title">' + esc(d.key) + "</div>";
      secs.forEach(function (s) {
        var p = progress[s.id];
        var badge = "";
        if (p && p.best != null) {
          badge = '<span class="nav-score ' + (p.best >= PASS_MARK ? "pass" : "fail") + '">' + p.best + "%</span>";
        }
        var active = r.name === "section" && r.id === s.id ? " active" : "";
        html += '<button class="nav-item' + active + '" data-route="' + s.id + '">' +
          '<span class="nav-icon">' + (s.icon || "📘") + "</span><span>" + esc(s.title) + "</span>" + badge + "</button>";
      });
    });
    nav.innerHTML = html;
    Array.prototype.forEach.call(nav.querySelectorAll(".nav-item"), function (b) {
      b.addEventListener("click", function () { go(b.getAttribute("data-route")); });
    });
  }

  function sectionsInDomain(key) {
    return SECTIONS.filter(function (s) { return s.domain === key; })
      .sort(function (a, b) { return (a.order || 0) - (b.order || 0); });
  }

  function updateOverall() {
    var scored = SECTIONS.filter(function (s) { return progress[s.id] && progress[s.id].best != null; });
    var elp = document.getElementById("overallProgress");
    if (!scored.length) { elp.textContent = "No quizzes taken yet"; return; }
    var avg = Math.round(scored.reduce(function (a, s) { return a + progress[s.id].best; }, 0) / scored.length);
    elp.textContent = scored.length + "/" + SECTIONS.length + " sections · avg " + avg + "%";
  }

  /* ---------------- Home ---------------- */
  function renderHome() {
    var totalQ = SECTIONS.reduce(function (a, s) { return a + s.questions.length; }, 0);
    var totalF = SECTIONS.reduce(function (a, s) { return a + s.flashcards.length; }, 0);
    var v = document.getElementById("view");
    var html = '' +
      '<div class="hero">' +
        '<span class="pill" style="background:rgba(255,255,255,.2);color:#fff">Azure Solutions Architect Expert</span>' +
        '<h1>AZ-305 Study Hub</h1>' +
        '<p>Master every exam domain with focused study notes, flashcards for fast recall, and ' +
        'randomized practice quizzes that explain <em>why</em> each answer is right or wrong — plus ' +
        'a tip on how to pick the correct option under exam pressure.</p>' +
        '<div class="hero-stats">' +
          '<div class="hero-stat"><strong>' + SECTIONS.length + '</strong><span>SECTIONS</span></div>' +
          '<div class="hero-stat"><strong>' + totalF + '</strong><span>FLASHCARDS</span></div>' +
          '<div class="hero-stat"><strong>' + totalQ + '</strong><span>PRACTICE QUESTIONS</span></div>' +
          '<div class="hero-stat"><strong>700/1000</strong><span>PASS SCORE</span></div>' +
        '</div>' +
      '</div>';

    html += '<div class="card" style="display:flex;gap:16px;flex-wrap:wrap;align-items:center;justify-content:space-between">' +
      '<div><strong>How to use this hub</strong><div class="lead" style="margin:4px 0 0;font-size:.92rem">' +
      '1) Read the notes &nbsp;→&nbsp; 2) Drill the flashcards &nbsp;→&nbsp; 3) Take the quiz (questions are randomized each attempt). ' +
      'Aim for 80%+ on every section before exam day.<br>' +
      '<span class="hint-new">New to Azure?</span> Hover or tap any <span class="term-demo">dotted term</span> ' +
      '(like NSG or NAT) for a plain-English definition — or open the <a href="#glossary">full Glossary</a>.' +
      '</div></div></div>';

    var examBest = progress.__exam && progress.__exam.best != null ? progress.__exam.best : null;
    html += '<button class="card" data-route="exam" style="width:100%;text-align:left;cursor:pointer;border:none;' +
      'display:flex;gap:16px;flex-wrap:wrap;align-items:center;justify-content:space-between;' +
      'background:linear-gradient(135deg,var(--primary-soft),var(--bg-elev))">' +
      '<div><div style="font-size:1.1rem;font-weight:800">🎓 Mock Exam — simulate the real thing</div>' +
      '<div class="lead" style="margin:4px 0 0;font-size:.92rem">45 timed questions drawn at random across all domains (weighted like the real exam). ' +
      'Get a per-domain breakdown to find weak spots.' +
      (examBest != null ? ' <strong>Best: ' + examBest + '%</strong>' : '') + '</div></div>' +
      '<span class="btn btn-primary" style="pointer-events:none">Start mock exam →</span></button>';

    DOMAINS.forEach(function (d) {
      var secs = sectionsInDomain(d.key);
      if (!secs.length) return;
      html += '<div class="domain-block"><div class="domain-head"><h2>' + esc(d.key) +
        '</h2><span class="domain-weight">' + d.weight + ' of exam</span></div><div class="card-grid">';
      secs.forEach(function (s) {
        var p = progress[s.id];
        var best = p && p.best != null ? p.best : 0;
        html += '<button class="sec-card" data-route="' + s.id + '">' +
          '<div class="sec-card-icon">' + (s.icon || "📘") + '</div>' +
          '<div class="sec-card-title">' + esc(s.title) + '</div>' +
          '<div class="sec-card-meta"><span>🃏 ' + s.flashcards.length + '</span><span>❓ ' +
          s.questions.length + '</span>' + (p && p.best != null ? '<span>★ best ' + p.best + '%</span>' : '') + '</div>' +
          '<div class="sec-card-bar"><i style="width:' + best + '%;background:' +
          (best >= PASS_MARK ? 'var(--success)' : best > 0 ? 'var(--warn)' : 'var(--bg-soft)') + '"></i></div>' +
          '</button>';
      });
      html += "</div></div>";
    });

    v.innerHTML = html;
    Array.prototype.forEach.call(v.querySelectorAll("[data-route]"), function (b) {
      b.addEventListener("click", function () { go(b.getAttribute("data-route")); });
    });
  }

  /* ---------------- Glossary ---------------- */
  function renderGlossary() {
    var v = document.getElementById("view");
    var G = window.AZ305_GLOSSARY || {};
    var keys = Object.keys(G);

    // Group by category, then sort terms alphabetically (case-insensitive).
    var cats = {};
    keys.forEach(function (k) {
      var cat = G[k][2] || "Other";
      (cats[cat] = cats[cat] || []).push(k);
    });
    var catOrder = ["Networking", "Compute & Containers", "App & Integration", "Storage",
      "Databases", "Data Integration", "Identity & Governance", "Security", "Monitoring",
      "Resilience", "Migration", "Cloud Models"];
    var orderedCats = Object.keys(cats).sort(function (a, b) {
      var ia = catOrder.indexOf(a), ib = catOrder.indexOf(b);
      if (ia === -1) ia = 99; if (ib === -1) ib = 99;
      return ia - ib || a.localeCompare(b);
    });

    var html = '' +
      '<div class="hero hero-glossary"><span class="pill" style="background:rgba(255,255,255,.2);color:#fff">Plain-English reference</span>' +
      '<h1>📚 Glossary</h1>' +
      '<p>Every acronym and shorthand used across this hub, explained for someone seeing it for the first time. ' +
      'Anywhere in the app you can also hover or tap a <span class="term-demo">dotted term</span> to get the same definition inline.</p>' +
      '<div class="gloss-search-wrap"><input id="glossSearch" class="gloss-search" type="search" ' +
      'placeholder="🔎 Search ' + keys.length + ' terms (e.g. NSG, redundancy, identity)…" autocomplete="off" /></div>' +
      '</div>';

    html += '<div id="glossResults">';
    orderedCats.forEach(function (cat) {
      var terms = cats[cat].sort(function (a, b) { return a.toLowerCase().localeCompare(b.toLowerCase()); });
      html += '<div class="gloss-cat" data-cat="' + esc(cat) + '"><h2 class="gloss-cat-title">' + esc(cat) + '</h2><div class="gloss-grid">';
      terms.forEach(function (k) {
        var d = G[k];
        html += '<div class="gloss-item" data-search="' + esc((k + " " + d[0] + " " + d[1]).toLowerCase()) + '">' +
          '<div class="gloss-term">' + esc(k) + '</div>' +
          '<div class="gloss-full">' + esc(d[0]) + '</div>' +
          '<div class="gloss-desc">' + esc(d[1]) + '</div>' +
          '</div>';
      });
      html += '</div></div>';
    });
    html += '</div>';
    html += '<div class="empty gloss-empty" id="glossEmpty" style="display:none">No terms match that search.</div>';

    v.innerHTML = html;

    var search = document.getElementById("glossSearch");
    var results = document.getElementById("glossResults");
    var emptyMsg = document.getElementById("glossEmpty");
    search.addEventListener("input", function () {
      var q = search.value.trim().toLowerCase();
      var anyVisible = false;
      Array.prototype.forEach.call(results.querySelectorAll(".gloss-cat"), function (catEl) {
        var catVisible = false;
        Array.prototype.forEach.call(catEl.querySelectorAll(".gloss-item"), function (it) {
          var match = !q || it.getAttribute("data-search").indexOf(q) !== -1;
          it.style.display = match ? "" : "none";
          if (match) { catVisible = true; anyVisible = true; }
        });
        catEl.style.display = catVisible ? "" : "none";
      });
      emptyMsg.style.display = anyVisible ? "none" : "";
    });
  }

  function renderSection(s, tab) {
    var v = document.getElementById("view");
    var p = progress[s.id];
    var bestTxt = p && p.best != null ? "Best: " + p.best + "% · " + p.attempts + " attempt" + (p.attempts === 1 ? "" : "s") : "Not attempted yet";
    var html = '' +
      '<div class="sec-header">' +
        '<span class="pill pill-muted">' + esc(s.domain) + ' · ' + (s.weight || "") + '</span>' +
        '<h1>' + (s.icon || "📘") + ' ' + esc(s.title) + '</h1>' +
        '<p class="lead">' + md(s.summary || "") + '</p>' +
      '</div>' +
      '<div class="tabs">' +
        tabBtn(s, "notes", "📖 Study Notes", tab) +
        tabBtn(s, "flashcards", "🃏 Flashcards (" + s.flashcards.length + ")", tab) +
        tabBtn(s, "quiz", "✅ Quiz (" + s.questions.length + ")", tab) +
      '</div>' +
      '<div id="tabContent"></div>';
    v.innerHTML = html;
    Array.prototype.forEach.call(v.querySelectorAll(".tab"), function (b) {
      b.addEventListener("click", function () { go(s.id + "/" + b.getAttribute("data-tab")); });
    });
    var tc = document.getElementById("tabContent");
    if (tab === "flashcards") renderFlashcards(s, tc);
    else if (tab === "quiz") renderQuizIntro(s, tc, bestTxt);
    else renderNotes(s, tc);
  }
  function tabBtn(s, key, label, active) {
    return '<button class="tab' + (active === key ? " active" : "") + '" data-tab="' + key + '">' + label + "</button>";
  }

  /* ---------------- Notes ---------------- */
  function renderNotes(s, tc) {
    if (!s.notes.length) { tc.innerHTML = '<div class="empty">No notes for this section.</div>'; return; }
    var html = "";
    s.notes.forEach(function (n) {
      html += '<div class="card notes-block">';
      if (n.heading) html += "<h2 style='margin-top:0'>" + esc(n.heading) + "</h2>";
      if (n.intro) html += "<p>" + md(n.intro) + "</p>";
      if (n.points && n.points.length) {
        html += "<ul>";
        n.points.forEach(function (pt) { html += "<li>" + md(pt) + "</li>"; });
        html += "</ul>";
      }
      if (n.table && n.table.headers) {
        html += "<table class='note-table'><thead><tr>";
        n.table.headers.forEach(function (h) { html += "<th>" + md(h) + "</th>"; });
        html += "</tr></thead><tbody>";
        n.table.rows.forEach(function (row) {
          html += "<tr>";
          row.forEach(function (c) { html += "<td>" + md(c) + "</td>"; });
          html += "</tr>";
        });
        html += "</tbody></table>";
      }
      if (n.tip) html += "<div class='callout tip'>💡 <strong>Exam tip:</strong> " + md(n.tip) + "</div>";
      if (n.callout) html += "<div class='callout'>" + md(n.callout) + "</div>";
      html += "</div>";
    });
    html += '<div class="btn-row"><button class="btn btn-primary" id="toQuiz">Test yourself →</button>' +
      '<button class="btn" id="toFlash">Drill flashcards</button></div>';
    tc.innerHTML = html;
    document.getElementById("toQuiz").addEventListener("click", function () { go(s.id + "/quiz"); });
    document.getElementById("toFlash").addEventListener("click", function () { go(s.id + "/flashcards"); });
  }

  /* ---------------- Flashcards ---------------- */
  function renderFlashcards(s, tc) {
    if (!s.flashcards.length) { tc.innerHTML = '<div class="empty">No flashcards for this section.</div>'; return; }
    var sp = secProgress(s.id);
    var order = shuffle(s.flashcards.map(function (_, i) { return i; }));
    var pos = 0;

    tc.innerHTML = '' +
      '<div class="flash-toolbar">' +
        '<span class="flash-counter" id="flashCounter"></span>' +
        '<div class="btn-row" style="margin:0">' +
          '<button class="btn" id="flashShuffle">🔀 Shuffle</button>' +
          '<button class="btn" id="flashKnown"></button>' +
        '</div>' +
      '</div>' +
      '<div class="flashcard" id="flashcard">' +
        '<div class="flashcard-inner">' +
          '<div class="flash-face flash-front"><div class="flash-label">Prompt</div><div class="flash-content" id="flashFront"></div></div>' +
          '<div class="flash-face flash-back"><div class="flash-label">Answer</div><div class="flash-content" id="flashBack"></div></div>' +
        '</div>' +
      '</div>' +
      '<p class="flash-hint">Click the card to flip · use the buttons to move through the deck</p>' +
      '<div class="btn-row" style="justify-content:center">' +
        '<button class="btn" id="flashPrev">← Previous</button>' +
        '<button class="btn btn-primary" id="flashNext">Next →</button>' +
      '</div>';

    var cardEl = document.getElementById("flashcard");
    var frontEl = document.getElementById("flashFront");
    var backEl = document.getElementById("flashBack");
    var counterEl = document.getElementById("flashCounter");
    var knownBtn = document.getElementById("flashKnown");

    function draw() {
      var idx = order[pos];
      var fc = s.flashcards[idx];
      cardEl.classList.remove("flipped");
      // slight delay so content swap isn't visible mid-flip
      setTimeout(function () {
        frontEl.innerHTML = md(fc.front);
        backEl.innerHTML = md(fc.back);
      }, cardEl.classList.contains("flipped") ? 250 : 0);
      frontEl.innerHTML = md(fc.front);
      backEl.innerHTML = md(fc.back);
      var knownCount = Object.keys(sp.known).filter(function (k) { return sp.known[k]; }).length;
      counterEl.textContent = "Card " + (pos + 1) + " / " + order.length + "  ·  " + knownCount + " marked known";
      knownBtn.textContent = sp.known[idx] ? "✓ Known" : "Mark known";
      knownBtn.classList.toggle("btn-primary", !!sp.known[idx]);
    }
    cardEl.addEventListener("click", function () { cardEl.classList.toggle("flipped"); });
    document.getElementById("flashNext").addEventListener("click", function () {
      pos = (pos + 1) % order.length; draw();
    });
    document.getElementById("flashPrev").addEventListener("click", function () {
      pos = (pos - 1 + order.length) % order.length; draw();
    });
    document.getElementById("flashShuffle").addEventListener("click", function () {
      order = shuffle(order); pos = 0; draw();
    });
    knownBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      var idx = order[pos];
      sp.known[idx] = !sp.known[idx];
      saveProgress();
      draw();
    });
    draw();
  }

  /* ---------------- Quiz intro ---------------- */
  function renderQuizIntro(s, tc, bestTxt) {
    if (!s.questions.length) { tc.innerHTML = '<div class="empty">No questions for this section.</div>'; return; }
    var bank = s.questions.length;
    var defaultN = clamp(bank, 1, bank < 15 ? bank : 15);
    var sizes = [5, 10, 15, 20, bank].filter(function (n, i, arr) {
      return n <= bank && arr.indexOf(n) === i;
    });
    var sizeBtns = sizes.map(function (n) {
      return '<button class="btn quiz-size' + (n === defaultN ? " btn-primary" : "") + '" data-n="' + n +
        '">' + (n === bank ? "All " + bank : n) + "</button>";
    }).join("");

    tc.innerHTML = '' +
      '<div class="card quiz-setup">' +
        '<h2 style="margin-top:0">Practice Quiz</h2>' +
        '<p class="lead">Questions are pulled at random from a bank of <strong>' + bank +
        '</strong> and the answer order is shuffled, so every attempt is different. ' +
        'Each question gives an explanation and a tip after you answer.</p>' +
        '<p style="font-weight:600">Best score: <span style="color:var(--primary)">' + esc(bestTxt) + '</span></p>' +
        '<p style="margin-bottom:6px;font-weight:600">How many questions?</p>' +
        '<div class="btn-row" style="justify-content:center" id="sizeRow">' + sizeBtns + '</div>' +
        '<div class="btn-row" style="justify-content:center;margin-top:18px">' +
          '<button class="btn btn-primary" id="startQuiz" style="padding:12px 30px;font-size:1rem">Start quiz →</button>' +
        '</div>' +
      '</div>';

    var chosen = defaultN;
    var row = document.getElementById("sizeRow");
    Array.prototype.forEach.call(row.querySelectorAll(".quiz-size"), function (b) {
      b.addEventListener("click", function () {
        chosen = parseInt(b.getAttribute("data-n"), 10);
        Array.prototype.forEach.call(row.querySelectorAll(".quiz-size"), function (x) { x.classList.remove("btn-primary"); });
        b.classList.add("btn-primary");
      });
    });
    document.getElementById("startQuiz").addEventListener("click", function () {
      startQuiz(s, chosen, tc);
    });
  }

  /* ---------------- Quiz run ---------------- */
  function startQuiz(s, n, tc) {
    var picked = shuffle(s.questions).slice(0, n).map(function (q) {
      // shuffle options while tracking correct indices
      var idxOrder = shuffle(q.options.map(function (_, i) { return i; }));
      var options = idxOrder.map(function (i) { return q.options[i]; });
      var correct = idxOrder.map(function (origIdx, newIdx) {
        return q.correct.indexOf(origIdx) !== -1 ? newIdx : -1;
      }).filter(function (x) { return x !== -1; });
      return { ref: q, options: options, correct: correct, isMulti: q.correct.length > 1, answered: false, chosen: [], wasRight: false };
    });

    var state = { i: 0, score: 0, items: picked };
    renderQuestion();

    function renderQuestion() {
      var item = state.items[state.i];
      var q = item.ref;
      var pct = Math.round((state.i) / state.items.length * 100);
      var multi = item.isMulti;
      var html = '' +
        '<div class="quiz-progress-bar"><i style="width:' + pct + '%"></i></div>' +
        '<div class="card">' +
          '<div class="q-meta"><span>Question ' + (state.i + 1) + ' of ' + state.items.length + '</span>' +
            '<span>Score: ' + state.score + '/' + state.items.length + '</span></div>' +
          '<div class="q-text">' + md(q.question) + '</div>' +
          '<div class="q-hint">' + (multi ? "Select all that apply (" + item.correct.length + " correct)" : "Select one answer") + '</div>' +
          '<div class="options" id="options"></div>' +
          '<div id="fb"></div>' +
          '<div class="btn-row" id="qActions"></div>' +
        '</div>';
      tc.innerHTML = html;

      var optWrap = document.getElementById("options");
      item.options.forEach(function (opt, i) {
        var o = el('<button class="option" data-i="' + i + '">' +
          '<span class="opt-key">' + letter(i) + '</span><span class="opt-text">' + md(opt) + "</span></button>");
        o.addEventListener("click", function () { onSelect(i); });
        optWrap.appendChild(o);
      });
      renderActions();

      function onSelect(i) {
        if (item.answered) return;
        var pos = item.chosen.indexOf(i);
        if (multi) {
          if (pos === -1) item.chosen.push(i); else item.chosen.splice(pos, 1);
        } else {
          item.chosen = [i];
        }
        Array.prototype.forEach.call(optWrap.children, function (c, ci) {
          c.classList.toggle("selected", item.chosen.indexOf(ci) !== -1);
        });
        renderActions();
        if (!multi) { /* wait for submit to allow review */ }
      }

      function renderActions() {
        var actions = document.getElementById("qActions");
        if (item.answered) {
          var last = state.i === state.items.length - 1;
          actions.innerHTML = '<button class="btn btn-primary" id="nextBtn">' + (last ? "See results →" : "Next question →") + "</button>";
          document.getElementById("nextBtn").addEventListener("click", next);
        } else {
          actions.innerHTML = '<button class="btn btn-primary" id="submitBtn"' +
            (item.chosen.length ? "" : " disabled") + ">Check answer</button>";
          document.getElementById("submitBtn").addEventListener("click", check);
        }
      }

      function check() {
        if (!item.chosen.length) return;
        item.answered = true;
        var correctSet = item.correct.slice().sort().join(",");
        var chosenSet = item.chosen.slice().sort().join(",");
        item.wasRight = correctSet === chosenSet;
        if (item.wasRight) state.score++;

        Array.prototype.forEach.call(optWrap.children, function (c, ci) {
          c.classList.add("disabled");
          var isCorrect = item.correct.indexOf(ci) !== -1;
          var isChosen = item.chosen.indexOf(ci) !== -1;
          if (isCorrect) c.classList.add("correct");
          else if (isChosen) c.classList.add("incorrect");
          c.classList.remove("selected");
        });

        var fb = document.getElementById("fb");
        var correctLetters = item.correct.map(letter).join(", ");
        fb.innerHTML = '<div class="feedback ' + (item.wasRight ? "right" : "wrong") + '">' +
          "<h4>" + (item.wasRight ? "✅ Correct!" : "❌ Not quite — correct answer: " + correctLetters) + "</h4>" +
          '<div class="exp-label">Why</div><p>' + md(q.explanation || "") + "</p>" +
          (q.tip ? '<div class="tip-box"><div class="exp-label" style="color:var(--warn)">💡 How to pick the right answer</div><p>' + md(q.tip) + "</p></div>" : "") +
          "</div>";
        renderActions();
      }

      function next() {
        if (state.i < state.items.length - 1) { state.i++; renderQuestion(); }
        else finish();
      }
    }

    function finish() {
      var pct = Math.round(state.score / state.items.length * 100);
      var sp = secProgress(s.id);
      sp.attempts++;
      if (sp.best == null || pct > sp.best) sp.best = pct;
      saveProgress();

      var pass = pct >= PASS_MARK;
      var ring = pass ? "var(--success)" : (pct >= 50 ? "var(--warn)" : "var(--danger)");
      var html = '' +
        '<div class="card" style="text-align:center">' +
          '<div class="score-ring" style="--pct:' + pct + ';--ring-color:' + ring + '">' +
            '<div class="score-inner"><div><div class="score-pct">' + pct + '%</div>' +
            '<div class="score-sub">' + state.score + ' / ' + state.items.length + ' correct</div></div></div>' +
          '</div>' +
          '<div class="result-verdict ' + (pass ? "pass" : "fail") + '">' +
            (pass ? "Pass — above the 70% bar 🎉" : "Below the 70% pass bar — review and retry") + '</div>' +
          '<p class="lead" style="margin-top:6px">Best score for this section: ' + sp.best + '% · ' + sp.attempts + ' attempts</p>' +
          '<div class="btn-row" style="justify-content:center">' +
            '<button class="btn btn-primary" id="retake">🔀 Retake (new random set)</button>' +
            '<button class="btn" id="reviewNotes">Review notes</button>' +
            '<button class="btn" id="backHome">Dashboard</button>' +
          '</div>' +
        '</div>' +
        '<h2>Review your answers</h2><div id="review"></div>';
      tc.innerHTML = html;

      var rev = document.getElementById("review");
      state.items.forEach(function (item, i) {
        var q = item.ref;
        var your = item.chosen.length ? item.chosen.map(letter).join(", ") : "—";
        var correctLetters = item.correct.map(letter).join(", ");
        var block = '<div class="review-item">' +
          '<div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start">' +
            '<div class="ri-q">' + (i + 1) + ". " + md(q.question) + "</div>" +
            '<span class="ri-tag ' + (item.wasRight ? "right" : "wrong") + '">' + (item.wasRight ? "Correct" : "Wrong") + "</span></div>";
        block += "<ul style='margin:6px 0;padding-left:20px'>";
        item.options.forEach(function (opt, oi) {
          var mark = item.correct.indexOf(oi) !== -1 ? "✅ " : (item.chosen.indexOf(oi) !== -1 ? "❌ " : "");
          var strong = item.correct.indexOf(oi) !== -1;
          block += "<li>" + (strong ? "<strong>" : "") + mark + letter(oi) + ". " + md(opt) + (strong ? "</strong>" : "") + "</li>";
        });
        block += "</ul>";
        block += "<div style='font-size:.86rem;color:var(--text-soft)'>Your answer: " + your + " · Correct: " + correctLetters + "</div>";
        block += "<div class='callout' style='margin-top:8px'>" + md(q.explanation || "") + "</div>";
        if (q.tip) block += "<div class='callout tip'>💡 " + md(q.tip) + "</div>";
        block += "</div>";
        rev.appendChild(el(block));
      });

      document.getElementById("retake").addEventListener("click", function () { renderQuizIntro(s, tc, "Best: " + sp.best + "% · " + sp.attempts + " attempts"); });
      document.getElementById("reviewNotes").addEventListener("click", function () { go(s.id + "/notes"); });
      document.getElementById("backHome").addEventListener("click", function () { go(""); });
      renderNav();
      updateOverall();
    }
  }

  /* ---------------- Mock Exam (cross-domain) ---------------- */
  var EXAM_SIZE = 45;
  var EXAM_MINUTES = 75;
  var examTimer = null;

  function clearExamTimer() {
    if (examTimer) { clearInterval(examTimer); examTimer = null; }
  }

  function buildItem(q, domain, sectionTitle) {
    var idxOrder = shuffle(q.options.map(function (_, i) { return i; }));
    var options = idxOrder.map(function (i) { return q.options[i]; });
    var correct = idxOrder.map(function (origIdx, newIdx) {
      return q.correct.indexOf(origIdx) !== -1 ? newIdx : -1;
    }).filter(function (x) { return x !== -1; });
    return { ref: q, options: options, correct: correct, isMulti: q.correct.length > 1,
      answered: false, chosen: [], wasRight: false, domain: domain, sectionTitle: sectionTitle };
  }

  function renderExamIntro() {
    clearExamTimer();
    var v = document.getElementById("view");
    var totalQ = SECTIONS.reduce(function (a, s) { return a + s.questions.length; }, 0);
    var best = progress.__exam && progress.__exam.best != null ? progress.__exam.best : null;
    var attempts = progress.__exam ? progress.__exam.attempts : 0;
    v.innerHTML = '' +
      '<div class="hero"><span class="pill" style="background:rgba(255,255,255,.2);color:#fff">Exam simulation</span>' +
        '<h1>🎓 AZ-305 Mock Exam</h1>' +
        '<p>' + EXAM_SIZE + ' questions in ' + EXAM_MINUTES + ' minutes, pulled at random from all ' + totalQ +
        ' questions and weighted across the four domains like the real exam. Answer first, then review every explanation. ' +
        'Pass mark is 70%.</p></div>' +
      '<div class="card quiz-setup">' +
        '<h2 style="margin-top:0">Ready?</h2>' +
        '<p class="lead">No feedback is shown between questions in a real exam — but here you still get a full explained review at the end, ' +
        'plus a <strong>per-domain score breakdown</strong> so you know exactly what to revise.</p>' +
        (best != null ? '<p style="font-weight:600">Best mock score: <span style="color:var(--primary)">' + best + '%</span> · ' + attempts + ' attempts</p>' : '') +
        '<div class="btn-row" style="justify-content:center">' +
          '<button class="btn btn-primary" id="startExam" style="padding:12px 30px;font-size:1rem">Start ' + EXAM_SIZE + '-question exam →</button>' +
          '<button class="btn" id="examQuick">Quick 20</button>' +
        '</div>' +
      '</div>';
    document.getElementById("startExam").addEventListener("click", function () { startExam(EXAM_SIZE, EXAM_MINUTES); });
    document.getElementById("examQuick").addEventListener("click", function () { startExam(20, 35); });
  }

  function sampleExamQuestions(n) {
    // proportional targets by domain mid-weight
    var weights = { "Infrastructure Solutions": 0.33, "Identity, Governance & Monitoring": 0.27, "Data Storage Solutions": 0.23, "Business Continuity Solutions": 0.17 };
    var items = [];
    var used = {};
    DOMAINS.forEach(function (d) {
      var pool = [];
      sectionsInDomain(d.key).forEach(function (s) {
        s.questions.forEach(function (q) { pool.push({ q: q, domain: d.key, title: s.title }); });
      });
      pool = shuffle(pool);
      var target = Math.round(n * (weights[d.key] || 0.25));
      pool.slice(0, target).forEach(function (p) {
        used[p.domain + "|" + p.q.id] = true;
        items.push(buildItem(p.q, p.domain, p.title));
      });
    });
    // top up / trim to exactly n
    if (items.length < n) {
      var rest = [];
      SECTIONS.forEach(function (s) {
        s.questions.forEach(function (q) { if (!used[s.domain + "|" + q.id]) rest.push({ q: q, domain: s.domain, title: s.title }); });
      });
      shuffle(rest).slice(0, n - items.length).forEach(function (p) { items.push(buildItem(p.q, p.domain, p.title)); });
    }
    return shuffle(items).slice(0, n);
  }

  function startExam(n, minutes) {
    clearExamTimer();
    var tc = document.getElementById("view");
    var state = { i: 0, score: 0, items: sampleExamQuestions(n), remaining: minutes * 60 };

    examTimer = setInterval(function () {
      state.remaining--;
      var t = document.getElementById("examClock");
      if (t) {
        var m = Math.floor(state.remaining / 60), s = state.remaining % 60;
        t.textContent = "⏱ " + m + ":" + (s < 10 ? "0" : "") + s;
        if (state.remaining <= 60) t.style.color = "var(--danger)";
      }
      if (state.remaining <= 0) { clearExamTimer(); finishExam(state, tc, true); }
    }, 1000);

    renderExamQuestion(state, tc);
  }

  function renderExamQuestion(state, tc) {
    var item = state.items[state.i];
    var q = item.ref;
    var pct = Math.round(state.i / state.items.length * 100);
    var m = Math.floor(state.remaining / 60), s = state.remaining % 60;
    tc.innerHTML = '' +
      '<div class="q-meta" style="margin-bottom:4px"><span><strong>Mock Exam</strong> · Question ' + (state.i + 1) + ' of ' + state.items.length + '</span>' +
        '<span id="examClock" style="font-weight:700">⏱ ' + m + ':' + (s < 10 ? "0" : "") + s + '</span></div>' +
      '<div class="quiz-progress-bar"><i style="width:' + pct + '%"></i></div>' +
      '<div class="card">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">' +
          '<span class="pill pill-muted">' + esc(item.domain) + '</span>' +
          '<span style="font-size:.78rem;color:var(--text-soft)">' + (item.isMulti ? "Select all that apply (" + item.correct.length + ")" : "Select one") + '</span></div>' +
        '<div class="q-text">' + md(q.question) + '</div>' +
        '<div class="options" id="options" style="margin-top:12px"></div>' +
        '<div class="btn-row" id="qActions"></div>' +
      '</div>';

    var optWrap = document.getElementById("options");
    item.options.forEach(function (opt, i) {
      var o = el('<button class="option" data-i="' + i + '"><span class="opt-key">' + letter(i) +
        '</span><span class="opt-text">' + md(opt) + "</span></button>");
      o.addEventListener("click", function () {
        var pos = item.chosen.indexOf(i);
        if (item.isMulti) { if (pos === -1) item.chosen.push(i); else item.chosen.splice(pos, 1); }
        else item.chosen = [i];
        Array.prototype.forEach.call(optWrap.children, function (c, ci) {
          c.classList.toggle("selected", item.chosen.indexOf(ci) !== -1);
        });
        actions();
      });
      optWrap.appendChild(o);
    });

    function actions() {
      var a = document.getElementById("qActions");
      var last = state.i === state.items.length - 1;
      a.innerHTML = '<button class="btn btn-primary" id="examNext"' + (item.chosen.length ? "" : " disabled") + ">" +
        (last ? "Finish exam →" : "Next →") + "</button>" +
        (state.i > 0 ? ' <button class="btn" id="examPrev">← Back</button>' : "");
      document.getElementById("examNext").addEventListener("click", function () {
        if (!item.chosen.length) return;
        if (last) { clearExamTimer(); gradeAndFinish(); }
        else { state.i++; renderExamQuestion(state, tc); }
      });
      var pv = document.getElementById("examPrev");
      if (pv) pv.addEventListener("click", function () { state.i--; renderExamQuestion(state, tc); });
    }
    actions();

    function gradeAndFinish() { finishExam(state, tc, false); }
  }

  function finishExam(state, tc, timedOut) {
    clearExamTimer();
    // grade all
    state.items.forEach(function (item) {
      var correctSet = item.correct.slice().sort().join(",");
      var chosenSet = item.chosen.slice().sort().join(",");
      item.wasRight = item.chosen.length > 0 && correctSet === chosenSet;
    });
    var score = state.items.filter(function (it) { return it.wasRight; }).length;
    var pct = Math.round(score / state.items.length * 100);
    var pass = pct >= PASS_MARK;

    if (!progress.__exam) progress.__exam = { best: null, attempts: 0 };
    progress.__exam.attempts++;
    if (progress.__exam.best == null || pct > progress.__exam.best) progress.__exam.best = pct;
    saveProgress();

    // per-domain breakdown
    var dom = {};
    state.items.forEach(function (it) {
      if (!dom[it.domain]) dom[it.domain] = { c: 0, t: 0 };
      dom[it.domain].t++; if (it.wasRight) dom[it.domain].c++;
    });

    var ring = pass ? "var(--success)" : (pct >= 50 ? "var(--warn)" : "var(--danger)");
    var html = '<div class="card" style="text-align:center">' +
      (timedOut ? '<div class="result-verdict fail">⏱ Time expired — unanswered questions marked wrong</div>' : '') +
      '<div class="score-ring" style="--pct:' + pct + ';--ring-color:' + ring + '">' +
        '<div class="score-inner"><div><div class="score-pct">' + pct + '%</div>' +
        '<div class="score-sub">' + score + ' / ' + state.items.length + '</div></div></div></div>' +
      '<div class="result-verdict ' + (pass ? "pass" : "fail") + '">' +
        (pass ? "Pass — you cleared the 70% bar 🎉" : "Below 70% — focus on the weak domains below") + '</div>' +
      '<p class="lead" style="margin-top:6px">Best mock score: ' + progress.__exam.best + '% · ' + progress.__exam.attempts + ' attempts</p></div>';

    html += '<div class="card"><h2 style="margin-top:0">Score by domain</h2>';
    DOMAINS.forEach(function (d) {
      var x = dom[d.key]; if (!x) return;
      var dp = Math.round(x.c / x.t * 100);
      var col = dp >= PASS_MARK ? "var(--success)" : (dp >= 50 ? "var(--warn)" : "var(--danger)");
      html += '<div style="margin:10px 0"><div style="display:flex;justify-content:space-between;font-size:.9rem;font-weight:600">' +
        '<span>' + esc(d.key) + '</span><span>' + x.c + '/' + x.t + ' · ' + dp + '%</span></div>' +
        '<div class="quiz-progress-bar" style="margin:6px 0 0"><i style="width:' + dp + '%;background:' + col + '"></i></div></div>';
    });
    html += '</div>';

    html += '<div class="btn-row" style="justify-content:center">' +
      '<button class="btn btn-primary" id="examAgain">🔀 New mock exam</button>' +
      '<button class="btn" id="examHome">Dashboard</button></div>' +
      '<h2>Review your answers</h2><div id="review"></div>';
    tc.innerHTML = html;

    var rev = document.getElementById("review");
    state.items.forEach(function (item, i) {
      var q = item.ref;
      var your = item.chosen.length ? item.chosen.map(letter).join(", ") : "— (blank)";
      var correctLetters = item.correct.map(letter).join(", ");
      var block = '<div class="review-item"><div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start">' +
        '<div class="ri-q">' + (i + 1) + ". " + md(q.question) + '</div><span class="ri-tag ' + (item.wasRight ? "right" : "wrong") + '">' +
        (item.wasRight ? "Correct" : "Wrong") + "</span></div>" +
        '<div style="font-size:.72rem;color:var(--text-soft);margin:2px 0 6px">' + esc(item.domain) + ' · ' + esc(item.sectionTitle) + "</div><ul style='margin:6px 0;padding-left:20px'>";
      item.options.forEach(function (opt, oi) {
        var mark = item.correct.indexOf(oi) !== -1 ? "✅ " : (item.chosen.indexOf(oi) !== -1 ? "❌ " : "");
        var strong = item.correct.indexOf(oi) !== -1;
        block += "<li>" + (strong ? "<strong>" : "") + mark + letter(oi) + ". " + md(opt) + (strong ? "</strong>" : "") + "</li>";
      });
      block += "</ul><div style='font-size:.86rem;color:var(--text-soft)'>Your answer: " + your + " · Correct: " + correctLetters + "</div>" +
        "<div class='callout' style='margin-top:8px'>" + md(q.explanation || "") + "</div>" +
        (q.tip ? "<div class='callout tip'>💡 " + md(q.tip) + "</div>" : "") + "</div>";
      rev.appendChild(el(block));
    });
    document.getElementById("examAgain").addEventListener("click", renderExamIntro);
    document.getElementById("examHome").addEventListener("click", function () { go(""); });
    renderNav();
    updateOverall();
  }

  /* ---------------- Theme ---------------- */
  function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem("az305-theme"); } catch (e) {}
    var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    var theme = saved || (prefersDark ? "dark" : "light");
    setTheme(theme);
    document.getElementById("themeToggle").addEventListener("click", function () {
      var cur = document.documentElement.getAttribute("data-theme");
      setTheme(cur === "dark" ? "light" : "dark");
    });
  }
  function setTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    document.getElementById("themeToggle").textContent = t === "dark" ? "☀️" : "🌙";
    try { localStorage.setItem("az305-theme", t); } catch (e) {}
  }

  /* ---------------- Boot ---------------- */
  function start() {
    initTheme();
    document.getElementById("navToggle").addEventListener("click", function () {
      document.body.classList.toggle("nav-open");
    });
    document.getElementById("navScrim").addEventListener("click", function () {
      document.body.classList.remove("nav-open");
    });
    window.addEventListener("hashchange", render);
    // Sort sections by domain order then their own order for stable nav
    render();
  }

  window.AZ305 = { registerSection: registerSection, start: start };
})();
