# AZ-305 Study Hub

A self-contained website to prepare for **AZ-305: Designing Microsoft Azure Infrastructure Solutions** (Azure Solutions Architect Expert).

Organized by exam domain, each section has **study notes**, **flashcards** for fast recall, and a **randomized practice quiz** that checks your answer, explains *why* it's right or wrong, and gives a **tip on how to pick the correct option** under exam pressure.

## How to run

No build step, no dependencies. Either:

- **Just open it:** double-click `index.html` (works from `file://`), **or**
- **Serve it locally** (recommended):
  ```bash
  cd az-305-prep
  python3 -m http.server 8305
  ```
  then open http://localhost:8305

## Features

- **Sections by domain** — Infrastructure (30–35%), Data Storage (20–25%), Identity/Governance/Monitoring (25–30%), Business Continuity (15–20%).
- **Study Notes** — concise decision tables, "choose when" rules, and exam tips per topic.
- **Flashcards** — click to flip, shuffle the deck, mark cards as known.
- **Quizzes** — pick 5/10/15/20 or all questions; each attempt pulls a **random set from the question bank** and **shuffles answer order**, so retakes are always different.
- **Answer checking** — instant right/wrong, an **explanation** of the reasoning, and a **"how to pick the right answer"** tip (elimination rules, keyword spotting, distractor warnings).
- **Acronym tooltips** — hover or tap any dotted shorthand (NAT, NSG, ASG, …) anywhere in the app for a plain-English definition aimed at newcomers.
- **Glossary page** — a searchable, categorized reference of every acronym used across the hub.
- **Progress tracking** — best score per section and overall average, saved in your browser (localStorage).
- **Light/Dark theme** and responsive layout.

## How to study

1. Read the **Study Notes** for a section.
2. Drill the **Flashcards** until recall is automatic.
3. Take the **Quiz**. Review every explanation and tip.
4. **Retake** for a fresh random set. Aim for **80%+** on every section before exam day (pass mark is 700/1000 = 70%).

## Structure

```
index.html                 App shell + section script tags
css/styles.css             Theme + layout
js/engine.js               Registry, router, flashcards, quiz engine, progress
js/glossary.js             Acronym glossary + auto-tooltip layer (and the Glossary page data)
data/section-*.js          One file per section (notes, flashcards, question bank)
```

Each section file registers itself via `AZ305.registerSection({...})`. To add or edit content, edit the relevant `data/section-*.js` file. To add or refine an acronym definition, edit the `G` map in `js/glossary.js`.

## Content source

Built from the open **[AZ-305 Study Guide](https://github.com/tom600x/AZ-305StudyGuide)** (service comparison tables, SKU/tier trade-offs, and decision rules) and reorganized into interactive notes, flashcards, and exam-style questions.

> Practice exams and hands-on Azure experience significantly raise your pass probability — use this hub alongside Microsoft's free practice assessment.
