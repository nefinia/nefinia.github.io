# -*- coding: utf-8 -*-
"""Builds the research entries of sofiagallego.com from research_data.py.

    python3 _tools/build_research.py

Writes (all idempotent):
  research/<slug>/index.html, fr/research/<slug>/index.html, es/research/<slug>/index.html
  research/index.html (+ fr, es): small redirects to the research page
  the feed between <!-- research-feed:start --> and <!-- research-feed:end --> in science.html (+ fr/, es/)
  the research block in assets/css/inner.css
  the research lines in sitemap.xml, and the `url` of each paper in publications.json
"""
import html
import json
import os
import re
import sys
import unicodedata

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)
from research_data import ENTRIES, TOPICS, UI, LANGS, ME  # noqa: E402

SITE = "https://sofiagallego.com"
TODAY = "2026-10-14"
SCHOLAR = "https://scholar.google.com/citations?user=2rU-igEAAAAJ"
ORCID = "https://orcid.org/0000-0002-8825-8107"
DEFAULT_OG = "cosmic_web.png"
ABBR = {
    "Astronomy & Astrophysics": "A&A",
    "Monthly Notices of the Royal Astronomical Society": "MNRAS",
    "Monthly Notices of the Royal Astronomical Society: Letters": "MNRAS",
    "The Astrophysical Journal": "ApJ",
    "Nature Astronomy": "Nat. Astron.",
}
SURNAME_FIX = {"J. Marques Oliveira": ("Marques Oliveira", "J.")}

ENTRIES.sort(key=lambda e: e["sort"], reverse=True)
BY_SLUG = {e["slug"]: e for e in ENTRIES}


def esc(s):
    return html.escape(s, quote=True)


def txt(s):
    return html.escape(s, quote=False)


def fixlt(s):
    return s.replace(" < ", " &lt; ").replace(" > ", " &gt; ")


def ascii_lower(s):
    return unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode().lower()


def split_name(name):
    if name in SURNAME_FIX:
        return SURNAME_FIX[name]
    toks = name.split()
    return toks[-1], [t[0] + "." for t in toks[:-1]]


def cite_name(name):
    sur, ini = split_name(name)
    ini = ini if isinstance(ini, str) else " ".join(ini)
    return f"{sur}, {ini}"


def bib_name(name):
    sur, ini = split_name(name)
    ini = ini if isinstance(ini, str) else " ".join(ini)
    full = name.split()
    if name == ME:
        return "Gallego, Sofia G."
    if len(full) > 1 and not full[0].endswith("."):
        given = " ".join(full[:-1])
        return f"{full[-1]}, {given}"
    return f"{sur}, {ini}"


def is_me(name):
    return name.endswith("Gallego")


def url_of(e, lang):
    return f"{UI[lang]['prefix']}/research/{e['slug']}/"


def abs_url(e, lang):
    return SITE + url_of(e, lang)


def authors_html(e, lang):
    """Display string with the site owner in bold (papers only)."""
    a, n = e["authors"], e["n_authors"]

    def fmt(name):
        return f"<b>{esc(name)}</b>" if is_me(name) else esc(name)

    if n <= 8 and len(a) == n:
        if len(a) == 1:
            return fmt(a[0])
        return ", ".join(fmt(x) for x in a[:-1]) + " &amp; " + fmt(a[-1])
    out = fmt(a[0]) + " et al."
    if not is_me(a[0]):
        out += f" (including <b>{esc(e.get('me_short', ME))}</b>)"
    return out


def authors_plain(e):
    a, n = e["authors"], e["n_authors"]
    if n <= 8 and len(a) == n:
        return ", ".join(a)
    s = a[0] + " et al."
    if not is_me(a[0]):
        s += f" (including {e.get('me_short', ME)})"
    return s


def with_line(e, lang):
    ppl = e.get("with_people", [])
    if not ppl:
        return ""
    names = ", ".join(ppl[:-1]) + (" " + {"en": "and", "fr": "et", "es": "y"}[lang] + " " if len(ppl) > 1 else "") + ppl[-1]
    return f"{UI[lang]['with']} {names}."


def citation_text(e):
    a, n = e["authors"], e["n_authors"]
    if n <= 8 and len(a) == n:
        names = [cite_name(x) for x in a]
        auth = ", ".join(names[:-1]) + (", & " if len(names) > 1 else "") + names[-1]
    else:
        auth = cite_name(a[0]) + ", et al."
    ab = ABBR.get(e["venue"], e["venue"])
    if e["status"] == "submitted":
        return f"{auth} {e['year']}, {e['venue']} (submitted), arXiv:{e['arxiv']}"
    vol = f", {e['volume']}" if e.get("volume") else ""
    pg = f", {e['pages']}" if e.get("pages") else ""
    return f"{auth} {e['year']}, {ab}{vol}{pg}, doi:{e['doi']}"


def bibtex(e):
    a, n = e["authors"], e["n_authors"]
    first_sur = ascii_lower(split_name(a[0])[0]).replace(" ", "")
    key = f"{first_sur}{e['year']}"
    if n <= 8 and len(a) == n:
        auth = " and ".join(bib_name(x) for x in a)
    else:
        auth = bib_name(a[0]) + " and others"
    lines = [f"@article{{{key},", f"  author = {{{auth}}},", f"  title = {{{{{e['title']}}}}},"]
    if e["status"] == "submitted":
        lines += ["  journal = {arXiv e-prints},", f"  year = {{{e['year']}}},"]
    else:
        lines += [f"  journal = {{{e['venue']}}},", f"  year = {{{e['year']}}},", f"  volume = {{{e['volume']}}},"]
        if e.get("issue"):
            lines.append(f"  number = {{{e['issue']}}},")
        lines.append(f"  pages = {{{e['pages'].replace('–', '--')}}},")
        lines.append(f"  doi = {{{e['doi']}}},")
    lines += [f"  eprint = {{{e['arxiv']}}},", "  archivePrefix = {arXiv}", "}"]
    return "\n".join(lines)


def venue_line(e, lang):
    u = UI[lang]
    if e["kind"] == "report":
        return f"{e['sprint']} · {u['months'][e['when']]}"
    if e["status"] == "submitted":
        return f"{u['submitted_to'].format(v=e['venue'])} · {e['year']}"
    vol = f", {e['volume']}" if e.get("volume") else ""
    pg = f", {e['pages']}" if e.get("pages") else ""
    return f"{e['venue']}{vol}{pg} · {e['year']}"


def role_label(e, lang):
    u = UI[lang]
    if e["kind"] == "report":
        return u["report"]
    return u["first"] if is_me(e["authors"][0]) else u["co"]


def og_image(e):
    img = e.get("image") or DEFAULT_OG
    return f"{SITE}/assets/images/{img}"


# ------------------------------------------------------------------ shared chrome
def read(path):
    with open(os.path.join(ROOT, path), encoding="utf-8") as f:
        return f.read()


def write(path, text):
    full = os.path.join(ROOT, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w", encoding="utf-8") as f:
        f.write(text)


_science = read("science.html")
BRAND = re.search(r'<svg class="mono-nav".*?</svg>', _science, re.S).group(0)
GA = re.search(r"<!-- Google Analytics -->.*?</script>\s*<script>.*?</script>", _science, re.S).group(0)


def nav_html(lang, current_urls):
    u = UI[lang]
    p = u["prefix"]
    items = []
    for label, f in zip(u["nav"], u["nav_files"]):
        cur = ' aria-current="page"' if f == "science.html" else ""
        items.append(f'      <li><a href="{p}/{f}"{cur}>{label}</a></li>')
    langs = []
    for l in LANGS:
        cur = ' aria-current="true"' if l == lang else ""
        langs.append(f'<a href="{current_urls[l]}" hreflang="{l}" lang="{l}"{cur}>{l.upper()}</a>')
    return f'''<a class="skip" href="#content">{u["skip"]}</a>
<nav class="site" aria-label="Main">
  <div class="navin">
    <a class="brand" href="{p}/index.html">{BRAND}Sofia Gallego</a>
    <ul id="menu">
{chr(10).join(items)}
    </ul>
    <div class="langs" aria-label="Language">{"".join(langs)}</div>
    <button class="burger" id="burger" aria-expanded="false" aria-controls="menu">{u["menu"]}</button>
  </div>
</nav>
'''


def footer_html(lang):
    u = UI[lang]
    p = u["prefix"]
    return f'''<footer><span>© Nefinia · <a class="support" href="https://ko-fi.com/cosmosofia" rel="noopener">{u["support"]}</a></span><a class="flogo" href="{p}/index.html" aria-label="Sofia Gallego"><img src="/assets/images/cosmovision.png" alt="Cosmovision logo" width="64" height="64"></a><span>{u["city"]}</span></footer>
<script>
  document.getElementById('burger').addEventListener('click', function(){{
    var m=document.getElementById('menu'), o=m.classList.toggle('open'); this.setAttribute('aria-expanded', String(o));
  }});
</script>
'''


# ------------------------------------------------------------------ entry pages
def jsonld_for(e, lang):
    me = {"@type": "Person", "@id": f"{SITE}/#sofia-gallego", "name": ME, "url": SITE + "/",
          "sameAs": [ORCID, SCHOLAR]}
    url = abs_url(e, lang)
    crumbs = {"@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Sofia Gallego", "item": SITE + UI[lang]["prefix"] + "/"},
        {"@type": "ListItem", "position": 2, "name": UI[lang]["nav"][1], "item": SITE + UI[lang]["prefix"] + "/science.html"},
        {"@type": "ListItem", "position": 3, "name": e["title"], "item": url}]}
    kw = [TOPICS[t]["en"] for t in e["topics"]]
    if e["kind"] == "paper":
        authors = []
        for nme in e["authors"]:
            authors.append(me if is_me(nme) else {"@type": "Person", "name": nme})
        if e["n_authors"] > len(e["authors"]) and not any(is_me(x) for x in e["authors"]):
            authors.append(me)
        art = {"@type": "ScholarlyArticle", "@id": url + "#article", "name": e["title"], "headline": e["title"], "url": url,
               "inLanguage": "en", "datePublished": e["year"], "author": authors, "description": e["short"][lang],
               "keywords": kw, "mainEntityOfPage": url,
               "citation": citation_text(e), "image": og_image(e),
               "sameAs": ([f"https://doi.org/{e['doi']}"] if e.get("doi") else []) + [f"https://arxiv.org/abs/{e['arxiv']}"],
               "identifier": ([f"https://doi.org/{e['doi']}"] if e.get("doi") else []) + [f"arXiv:{e['arxiv']}"]}
        if e["status"] == "published":
            art["isPartOf"] = {"@type": "PublicationVolume", "volumeNumber": e["volume"],
                               "isPartOf": {"@type": "Periodical", "name": e["venue"]}}
            art["pagination"] = e["pages"]
    else:
        authors = [me] + [{"@type": "Person", "name": n} for n in e["with_people"]]
        art = {"@type": "Report", "@id": url + "#report", "name": e["title"], "headline": e["title"], "url": url,
               "inLanguage": "en", "datePublished": e["when"], "author": authors, "description": e["short"][lang],
               "keywords": kw, "mainEntityOfPage": url, "image": og_image(e),
               "publisher": {"@type": "Organization", "name": "Apart Research", "url": "https://apartresearch.com/"},
               "sameAs": [e["report"]]}
    return json.dumps({"@context": "https://schema.org", "@graph": [art, crumbs]}, ensure_ascii=False)


def entry_page(e, lang, idx):
    u = UI[lang]
    p = u["prefix"]
    url = abs_url(e, lang)
    cur_urls = {l: url_of(e, l) for l in LANGS}
    title = e["title"]
    desc = e["short"][lang]
    alts = "\n".join(f'<link href="{abs_url(e, l)}" hreflang="{l}" rel="alternate"/>' for l in LANGS)
    alts += f'\n<link href="{abs_url(e, "en")}" hreflang="x-default" rel="alternate"/>'
    cite_meta = ""
    if e["kind"] == "paper":
        names = list(e["authors"])
        if e["n_authors"] > len(names) and not any(is_me(x) for x in names):
            names.append(ME)
        cite_meta = "\n".join(f'<meta content="{esc(n)}" name="citation_author"/>' for n in names)
        cite_meta += f'\n<meta content="{esc(title)}" name="citation_title"/>\n<meta content="{e["year"]}" name="citation_publication_date"/>'
        if e["status"] == "published":
            cite_meta += f'\n<meta content="{esc(e["venue"])}" name="citation_journal_title"/>\n<meta content="{e["volume"]}" name="citation_volume"/>'
            cite_meta += f'\n<meta content="{e["pages"].split("–")[0]}" name="citation_firstpage"/>'
            if "–" in e["pages"]:
                cite_meta += f'\n<meta content="{e["pages"].split("–")[1]}" name="citation_lastpage"/>'
            cite_meta += f'\n<meta content="{e["doi"]}" name="citation_doi"/>'
        cite_meta += f'\n<meta content="https://arxiv.org/abs/{e["arxiv"]}" name="citation_abstract_html_url"/>'
        cite_meta += f'\n<meta content="arXiv:{e["arxiv"]}" name="citation_arxiv_id"/>'
    head = f'''<!DOCTYPE html>
<html lang="{lang}">
<head>
{GA}
<meta charset="utf-8"/>
<script src="/assets/js/lang-auto.js"></script>
<meta content="IE=edge" http-equiv="X-UA-Compatible"/>
<meta content="width=device-width,initial-scale=1,viewport-fit=cover" name="viewport"/>
<title>{esc(title)} | Sofia Gallego</title>
<meta content="{esc(desc)}" name="description"/>
<meta content="Sofia Gallego" name="author"/>
<meta content="index,follow,max-image-preview:large" name="robots"/>
<link href="{url}" rel="canonical"/>
{alts}
<meta content="article" property="og:type"/>
<meta content="{esc(title)}" property="og:title"/>
<meta content="{esc(desc)}" property="og:description"/>
<meta content="{url}" property="og:url"/>
<meta content="{og_image(e)}" property="og:image"/>
<meta content="{u["locale"]}" property="og:locale"/>
<meta content="Sofia Gallego" property="og:site_name"/>
<meta content="summary_large_image" name="twitter:card"/>
<meta content="{esc(title)}" name="twitter:title"/>
<meta content="{esc(desc)}" name="twitter:description"/>
<meta content="{og_image(e)}" name="twitter:image"/>
{cite_meta}
<script type="application/ld+json">{jsonld_for(e, lang)}</script>
<link href="/assets/apple-icon-180x180.png" rel="apple-touch-icon" sizes="180x180"/>
<link href="/assets/cosmovision.ico" rel="icon"/>
<link href="https://fonts.googleapis.com" rel="preconnect"/><link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;900&amp;family=Roboto+Mono:wght@300;400;700&amp;display=swap" rel="stylesheet"/>
<link href="/assets/css/home.css" rel="stylesheet"/><link href="/assets/css/inner.css" rel="stylesheet"/><script src="/assets/js/display.js"></script>
</head>
<body class="inner">
'''
    # links row
    links = []
    if e["kind"] == "paper":
        if e.get("doi"):
            links.append(f'<a href="https://doi.org/{e["doi"]}" target="_blank" rel="noopener">{u["paper"]} ↗</a>')
        links.append(f'<a href="https://arxiv.org/abs/{e["arxiv"]}" target="_blank" rel="noopener">{u["arxiv"]} ↗</a>')
        links.append(f'<a href="https://ui.adsabs.harvard.edu/abs/arXiv:{e["arxiv"]}/abstract" target="_blank" rel="noopener">{u["ads"]} ↗</a>')
        if e.get("project"):
            links.append(f'<a href="{p}/{e["project"]}">{u["project"]}</a>')
    else:
        links.append(f'<a href="{e["report"]}" target="_blank" rel="noopener">{u["readreport"].replace(" →", " ↗")}</a>')
        for _, href, labels in e.get("extra", []):
            if href.startswith("/"):
                links.append(f'<a href="{href}">{labels[lang].replace(" →", "")}</a>')
            else:
                links.append(f'<a href="{p}/{href}">{labels[lang].replace(" →", "")}</a>')
    meta = f'<div class="entry-meta"><span class="pill">{role_label(e, lang)}</span><span>{esc(venue_line(e, lang))}</span></div>'
    byline = authors_html(e, lang) if e["kind"] == "paper" else f"<b>{ME}</b>"
    wl = with_line(e, lang)
    if e["kind"] == "report":
        byline = f"<b>{ME}</b>" + (f" · {esc(wl)}" if wl else "")
    found = ""
    if e.get("points"):
        found = f'<h2>{u["found"]}</h2>\n<ul class="found">\n' + "\n".join(f"<li>{fixlt(x)}</li>" for x in e["points"][lang]) + "\n</ul>"
    note = f'<p class="entry-note">{u["general"]}</p>' if e["kind"] == "paper" else f'<p class="entry-note">{u["sprint_kind"]}.</p>'
    cite = ""
    if e["kind"] == "paper":
        cite = f'''<details class="cite"><summary>{u["cite"]}</summary>
<p class="cite-ref">{esc(citation_text(e))}</p>
<pre class="bibtex"><code>{esc(bibtex(e))}</code></pre>
</details>'''
    topics = " ".join(f'<a class="chip" href="{p}/science.html?topic={t}">{TOPICS[t][lang]}</a>' for t in e["topics"])
    pos = idx
    newer = ENTRIES[pos - 1] if pos > 0 else None
    older = ENTRIES[pos + 1] if pos < len(ENTRIES) - 1 else None
    nav = []
    if newer:
        nav.append(f'<a class="prev" href="{url_of(newer, lang)}"><span>← {u["newer"]}</span>{esc(newer["title"])}</a>')
    if older:
        nav.append(f'<a class="next" href="{url_of(older, lang)}"><span>{u["older"]} →</span>{esc(older["title"])}</a>')
    body = f'''{nav_html(lang, cur_urls)}
<main class="page entry-page" id="content">
<a class="back" href="{p}/science.html">{u["back"]}</a>
{meta}
<h1>{esc(title)}</h1>
<p class="byline">{byline}</p>
<p class="entry-lead">{txt(desc)}</p>
<p class="entry-links">{"".join(links)}</p>
{found}
{note}
{cite}
<p class="entry-topics"><span>{u["topics"]}</span> {topics}</p>
<nav class="entry-nav" aria-label="{u["feed_h"]}">{"".join(nav)}</nav>
</main>
{footer_html(lang)}
</body>
</html>
'''
    return head + body


def redirect_page(lang):
    p = UI[lang]["prefix"]
    target = f"{SITE}{p}/science.html"
    return f'''<!DOCTYPE html>
<html lang="{lang}">
<head>
<meta charset="UTF-8">
<title>{UI[lang]["nav"][1]} | Sofia Gallego</title>
<meta name="robots" content="noindex, follow">
<link rel="canonical" href="{target}">
<meta http-equiv="refresh" content="0; url={p}/science.html">
<script>location.replace("{p}/science.html"+location.search+location.hash);</script>
</head>
<body><p><a href="{p}/science.html">{UI[lang]["nav"][1]}</a></p></body>
</html>
'''


# ------------------------------------------------------------------ feed on science.html
FEED_START, FEED_END = "<!-- research-feed:start -->", "<!-- research-feed:end -->"
HEADINGS = {
    "en": ("<h2>Current Projects</h2>", "<h2>Research Journey</h2>"),
    "fr": ("<h2>Projets en cours</h2>", "<h2>Parcours de recherche</h2>"),
    "es": ("<h2>Proyectos actuales</h2>", "<h2>Trayectoria de investigación</h2>"),
}


def feed_html(lang):
    u = UI[lang]
    p = u["prefix"]
    n_p = sum(1 for e in ENTRIES if e["kind"] == "paper" and e["status"] == "published")
    n_s = sum(1 for e in ENTRIES if e["kind"] == "paper" and e["status"] == "submitted")
    n_r = sum(1 for e in ENTRIES if e["kind"] == "report")
    glance = u["glance"].format(p=n_p, s=n_s, r=n_r,
                                scholar=f'<a href="{SCHOLAR}" target="_blank" rel="noopener">Google Scholar</a>',
                                orcid=f'<a href="{ORCID}" target="_blank" rel="noopener">ORCID</a>')
    used = [t for t in TOPICS if any(t in e["topics"] for e in ENTRIES)]
    chips = f'<button type="button" class="chip" data-topic="" aria-pressed="true">{u["all"]}</button>' + "".join(
        f'<button type="button" class="chip" data-topic="{t}" aria-pressed="false">{TOPICS[t][lang]}</button>' for t in used)
    groups = []
    for e in ENTRIES:
        y = e["year"]
        if not groups or groups[-1][0] != y:
            groups.append([y, []])
        groups[-1][1].append(e)
    out = []
    first = True
    for y, items in groups:
        arts = []
        for e in items:
            tags = " ".join(f'<span class="tag">{TOPICS[t][lang]}</span>' for t in e["topics"])
            badge = f'<span class="pill pill-new">{u["latest"]}</span>' if first else ""
            first = False
            if e["kind"] == "paper":
                auth = authors_html(e, lang)
                links = [f'<a href="{url_of(e, lang)}">{u["readentry"]}</a>']
                if e.get("doi"):
                    links.append(f'<a href="https://doi.org/{e["doi"]}" target="_blank" rel="noopener">{u["paper"]} ↗</a>')
                links.append(f'<a href="https://arxiv.org/abs/{e["arxiv"]}" target="_blank" rel="noopener">{u["arxiv"]} ↗</a>')
            else:
                wl = with_line(e, lang)
                auth = f"{esc(wl)}" if wl else ""
                links = [f'<a href="{url_of(e, lang)}">{u["readentry"]}</a>',
                         f'<a href="{e["report"]}" target="_blank" rel="noopener">{u["readreport"].replace(" →", " ↗")}</a>']
            auth_p = f'<p class="entry-authors">{auth}</p>' if auth else ""
            arts.append(f'''<article class="entry" data-topics="{" ".join(e["topics"])}">
<div class="entry-meta"><span class="pill">{role_label(e, lang)}</span>{badge}<span>{esc(venue_line(e, lang))}</span></div>
<h4 class="entry-title"><a href="{url_of(e, lang)}">{esc(e["title"])}</a></h4>
{auth_p}
<p class="entry-sum">{txt(e["short"][lang])}</p>
<p class="entry-tags">{tags}</p>
<p class="entry-links">{"".join(links)}</p>
</article>''')
        out.append(f'<div class="yeargroup"><h3 class="yr">{y}</h3>\n' + "\n".join(arts) + "\n</div>")
    js = r'''<script>
(function(){
  var feed=document.getElementById('papers'); if(!feed) return;
  var bar=document.getElementById('filters'), status=document.getElementById('filterStatus'), note=document.getElementById('topicNote');
  var entries=[].slice.call(feed.querySelectorAll('.entry')), groups=[].slice.call(feed.querySelectorAll('.yeargroup'));
  var chips=[].slice.call(bar.querySelectorAll('button')), tpl=bar.getAttribute('data-shown');
  function show(t,url){
    var n=0;
    entries.forEach(function(e){var ok=!t||(' '+e.getAttribute('data-topics')+' ').indexOf(' '+t+' ')>-1; e.hidden=!ok; if(ok)n++;});
    groups.forEach(function(g){g.hidden=!g.querySelector('.entry:not([hidden])');});
    chips.forEach(function(c){c.setAttribute('aria-pressed',String(c.getAttribute('data-topic')===t));});
    status.textContent=t?tpl.replace('{n}',n).replace('{m}',entries.length):'';
    if(note) note.hidden=(t!=='ai');
    if(url){try{var q=t?'?topic='+t:'';history.replaceState(null,'',location.pathname+q+location.hash);}catch(_){}}
  }
  bar.hidden=false;
  chips.forEach(function(c){c.addEventListener('click',function(){show(c.getAttribute('data-topic'),true);});});
  var m=location.search.match(/[?&]topic=([a-z]+)/), t=m?m[1]:'';
  if(location.hash==='#ai-safety') t='ai';
  if(t&&!bar.querySelector('[data-topic="'+t+'"]')) t='';
  show(t,false);
  if(t||location.hash==='#ai-safety'||location.hash==='#latest') setTimeout(function(){feed.scrollIntoView({behavior:'auto',block:'start'});},60);
})();
</script>'''
    return f'''{FEED_START}
<p class="glance">{glance}</p>
<section class="feed" id="papers" aria-labelledby="papers-h">
<h2 id="papers-h">{u["feed_h"]}</h2>
<p class="feed-intro">{u["feed_intro"]}</p>
<div class="filters" id="filters" role="group" aria-label="{u["filter"]}" data-shown="{u["shown"]}" hidden>{chips}</div>
<p class="filter-status" id="filterStatus" role="status" aria-live="polite"></p>
<p class="topic-note" id="topicNote" hidden>{u["sprint_note"]}</p>
{chr(10).join(out)}
</section>
{js}
{FEED_END}
'''


def rewrite_science(lang):
    path = "science.html" if lang == "en" else f"{lang}/science.html"
    s = read(path)
    u = UI[lang]
    p = u["prefix"]
    feed = feed_html(lang)
    if FEED_START in s:
        s = re.sub(re.escape(FEED_START) + r".*?" + re.escape(FEED_END) + r"\n?", lambda m: feed, s, flags=re.S)
    else:
        h_cur, h_jour = HEADINGS[lang]
        # 1. the "see my list of publications" paragraph is folded into the glance line
        s = re.sub(r'<p><a href="https://scholar\.google\.com/citations\?user=2rU-igEAAAAJ"[^>]*>[^<]*</a></p>\s*', "", s, count=1)
        # 2. latest paper + peer-reviewed list -> feed
        a = s.index('<h2 id="latest">')
        b = s.index(h_cur)
        s = s[:a] + feed + "\n" + s[b:]
        # 3. old AI safety block (now part of the feed)
        c = s.index('<h2 id="ai-safety">')
        d = s.index(h_jour)
        s = s[:c] + s[d:]
    # JSON-LD list: link each paper to its entry
    for e in ENTRIES:
        if e["kind"] != "paper" or not e.get("doi"):
            continue
        pat = f'"@id":"https://doi.org/{e["doi"]}",'
        s = re.sub(re.escape(pat) + r'("url":"[^"]*",)?', lambda m, e=e: pat + f'"url":"{abs_url(e, lang)}",', s)
    # the project card for the latest paper points to the entry
    latest = ENTRIES[0]
    s = re.sub(r'<a class="go" href="https://arxiv\.org/abs/2609\.37445" target="_blank">',
               f'<a class="go" href="{url_of(latest, lang)}">', s)
    write(path, s)


# ------------------------------------------------------------------ css
CSS_START, CSS_END = "/* research entries:start */", "/* research entries:end */"
CSS = CSS_START + r'''
.page > .glance{font-family:var(--mono);font-size:13px;color:var(--dim);margin:6px 0 0}
.page > .glance a{color:var(--glow)}
.page > .feed{max-width:860px}
.feed .feed-intro{color:var(--dim)}
.page .feed > p:first-of-type{font-size:inherit}
.filters{display:flex;flex-wrap:wrap;gap:8px;margin:18px 0 6px}
.filters[hidden],.topic-note[hidden],.entry[hidden],.yeargroup[hidden]{display:none}
.chip{font-family:var(--mono);font-size:12.5px;line-height:1.3;padding:7px 13px;border:1px solid var(--line);border-radius:999px;background:rgba(10,12,26,.6);color:var(--dim);cursor:pointer;text-decoration:none;display:inline-block}
.chip:hover{color:var(--ink);border-color:var(--glow)}
.chip[aria-pressed="true"]{color:var(--ink);border-color:var(--glow);background:rgba(185,198,255,.14)}
.page a.chip{border-bottom:1px solid var(--line);color:var(--dim)}
.page a.chip:hover{color:var(--ink);border-bottom-color:var(--glow)}
.filter-status{font-family:var(--mono);font-size:12px;color:var(--faint);min-height:1.4em;margin:6px 0 0}
.page .topic-note{font-size:15px;color:var(--dim);margin:10px 0 0;max-width:640px}
.yeargroup > .yr{font-family:var(--mono);font-weight:400;font-size:13px;letter-spacing:.02em;color:var(--faint);margin:34px 0 0;padding:0}
.entry{padding:22px 0 20px;border-top:1px solid var(--line);max-width:820px}
.entry-meta{font-family:var(--mono);font-size:12.5px;letter-spacing:.02em;color:var(--dim);display:flex;flex-wrap:wrap;gap:6px 12px;align-items:center;margin:0 0 10px}
.pill{display:inline-block;padding:2px 10px;border:1px solid var(--line);border-radius:999px;color:var(--glow);font-family:var(--mono);font-size:12px}
.pill-new{background:var(--glow);border-color:var(--glow);color:var(--void)}
.entry h4.entry-title{margin:0 0 6px;font-size:21px;line-height:1.3}
.page .entry-title a{color:var(--ink);border-bottom:0}
.page .entry-title a:hover{color:var(--glow)}
.page .entry p{font-size:15.5px;margin:0 0 8px}
.page .entry p.entry-authors{font-size:14px;color:var(--dim)}
.entry-authors b,.byline b{color:var(--ink);font-weight:500}
.page .entry p.entry-sum{color:#cfd3e6}
.page .entry p.entry-tags{margin:2px 0 6px}
.tag{display:inline-block;font-family:var(--mono);font-size:11.5px;color:var(--faint);margin:0 12px 2px 0}
.tag::before{content:"#";opacity:.6}
.entry-links{display:flex;flex-wrap:wrap;gap:6px 22px;margin:4px 0 0}
.page .entry-links a{font-family:var(--mono);font-size:12.5px;letter-spacing:.02em;border-bottom:0}
.page .entry-links a:hover{text-decoration:underline}
/* one entry */
.entry-page h1{font-size:clamp(26px,3.6vw,40px);line-height:1.15;margin:0 0 14px}
.entry-page .entry-meta{margin:0 0 14px}
.page p.byline{font-size:16px;color:var(--dim);margin:0 0 22px}
.page p.entry-lead{font-size:20px;line-height:1.6;color:var(--ink)}
.page p.entry-links{margin:22px 0 4px}
.entry-page p.entry-links a{border:1px solid rgba(190,200,255,.4);border-radius:2px;padding:9px 16px;font-size:12.5px}
.entry-page p.entry-links a:hover{border-color:var(--glow);text-decoration:none}
.entry-page h2{font-size:clamp(22px,2.4vw,28px);margin-top:48px}
.found{padding-left:20px}
.found li{margin-bottom:12px;line-height:1.65}
.page p.entry-note{font-size:14px;color:var(--faint);margin:28px 0 0}
.cite{margin:28px 0 0;border:1px solid var(--line);border-radius:6px;padding:14px 18px;background:rgba(10,12,26,.55)}
.cite summary{cursor:pointer;font-family:var(--mono);font-size:13px;color:var(--glow)}
.page .cite p.cite-ref{font-size:14.5px;color:var(--dim);margin:14px 0 10px}
.bibtex{margin:0;padding:12px 14px;overflow-x:auto;font-family:var(--mono);font-size:12.5px;line-height:1.55;color:#cfd3e6;background:rgba(4,5,11,.7);border:1px solid var(--line);border-radius:4px;white-space:pre-wrap;word-break:break-word}
.page p.entry-topics{margin:34px 0 0;display:flex;flex-wrap:wrap;gap:8px;align-items:center;font-size:13px}
.entry-topics > span{font-family:var(--mono);font-size:12px;color:var(--faint);margin-right:4px}
.entry-nav{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:46px 0 0;padding-top:24px;border-top:1px solid var(--line);max-width:none!important}
.entry-nav a{display:block;padding:14px 16px;border:1px solid var(--line);border-radius:6px;color:var(--ink);font-size:15px;line-height:1.4;border-bottom:1px solid var(--line)}
.entry-nav a:hover{border-color:var(--glow)}
.entry-nav a span{display:block;font-family:var(--mono);font-size:12px;color:var(--glow);margin-bottom:4px}
.entry-nav .next{grid-column:2;text-align:right}
.entry-nav .prev{grid-column:1}
@media (max-width:760px){.entry-nav{grid-template-columns:1fr}.entry-nav .next,.entry-nav .prev{grid-column:1;text-align:left}}
''' + CSS_END


def write_css():
    path = "assets/css/inner.css"
    s = read(path)
    if CSS_START in s:
        s = re.sub(re.escape(CSS_START) + r".*?" + re.escape(CSS_END), lambda m: CSS, s, flags=re.S)
    else:
        s = s.rstrip("\n") + "\n\n" + CSS + "\n"
    write(path, s)


# ------------------------------------------------------------------ sitemap and publications.json
def write_sitemap():
    s = read("sitemap.xml")
    s = re.sub(r"[ \t]*<url><loc>https://sofiagallego\.com(?:/fr|/es)?/research/[^<]*</loc>.*?</url>\n", "", s)
    lines = ""
    for l in LANGS:
        for e in ENTRIES:
            lines += f'  <url><loc>{abs_url(e, l)}</loc><lastmod>{TODAY}</lastmod></url>\n'
    s = s.replace("</urlset>", lines + "</urlset>")
    write("sitemap.xml", s)


def write_publications_json():
    path = "publications.json"
    d = json.loads(read(path))
    pubs = d["publications"]
    by_arxiv = {p.get("arxiv", "").rsplit("/", 1)[-1]: p for p in pubs}
    for e in ENTRIES:
        if e["kind"] != "paper":
            continue
        rec = by_arxiv.get(e["arxiv"])
        if rec:
            rec["url"] = abs_url(e, "en")
        else:
            new = {"@type": "ScholarlyArticle", "name": e["title"], "url": abs_url(e, "en"), "datePublished": e["year"],
                   "arxiv": f"https://arxiv.org/abs/{e['arxiv']}",
                   "ads": f"https://ui.adsabs.harvard.edu/abs/arXiv:{e['arxiv']}/abstract",
                   "publicationStatus": "submitted" if e["status"] == "submitted" else "published",
                   "journal": e["venue"], "keywords": [TOPICS[t]["en"] for t in e["topics"]]}
            if e.get("doi"):
                new["doi"] = f"https://doi.org/{e['doi']}"
            pubs.insert(0, new)
    d["publications"] = pubs
    write(path, json.dumps(d, ensure_ascii=False, indent=2) + "\n")


def main():
    for lang in LANGS:
        for i, e in enumerate(ENTRIES):
            p = UI[lang]["prefix"].lstrip("/")
            write(f"{p + '/' if p else ''}research/{e['slug']}/index.html", entry_page(e, lang, i))
        p = UI[lang]["prefix"].lstrip("/")
        write(f"{p + '/' if p else ''}research/index.html", redirect_page(lang))
        rewrite_science(lang)
    write_css()
    write_sitemap()
    write_publications_json()
    print("built", len(ENTRIES), "entries x", len(LANGS), "languages")


if __name__ == "__main__":
    main()
