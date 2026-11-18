# -*- coding: utf-8 -*-
"""Builds the Alonak info-center pages (shared shell, per-topic content)."""
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

TG = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z"/></svg>'
IG = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.05 2 .25 2.5.45.6.24 1.1.56 1.6 1.05.5.5.8.99 1.05 1.6.2.5.4 1.3.45 2.5.07 1.3.07 1.7.07 4.9s0 3.6-.07 4.9c-.05 1.2-.25 2-.45 2.5a4.4 4.4 0 0 1-1.05 1.6 4.4 4.4 0 0 1-1.6 1.05c-.5.2-1.3.4-2.5.45-1.3.07-1.7.07-4.9.07s-3.6 0-4.9-.07c-1.2-.05-2-.25-2.5-.45a4.4 4.4 0 0 1-1.6-1.05 4.4 4.4 0 0 1-1.05-1.6c-.2-.5-.4-1.3-.45-2.5C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.9c.05-1.2.25-2 .45-2.5.24-.61.56-1.1 1.05-1.6.5-.49.99-.8 1.6-1.05.5-.2 1.3-.4 2.5-.45C8.4 2.2 8.8 2.2 12 2.2zm0 3.3a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zm0 2.3a4.2 4.2 0 1 1 0 8.4 4.2 4.2 0 0 1 0-8.4zm6.8-2.6a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/></svg>'
YT = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23 12s0-3.2-.4-4.7a2.5 2.5 0 0 0-1.8-1.8C19.3 5 12 5 12 5s-7.3 0-8.8.5A2.5 2.5 0 0 0 1.4 7.3C1 8.8 1 12 1 12s0 3.2.4 4.7a2.5 2.5 0 0 0 1.8 1.8C4.7 19 12 19 12 19s7.3 0 8.8-.5a2.5 2.5 0 0 0 1.8-1.8C23 15.2 23 12 23 12zM9.8 15.2V8.8l6 3.2-6 3.2z"/></svg>'

ICONS = {
    'about': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.8V20h5v-6h4v6h5V9.8"/></svg>',
    'magazine': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16v14H4z"/><path d="M4 9h16M9 9v10"/></svg>',
    'careers': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="3"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></svg>',
    'support': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8.5 8.5 0 0 1-12.3 7.6L4 21l1.4-4.4A8.5 8.5 0 1 1 21 12Z"/></svg>',
    'rules': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h9l4 4v14H6z"/><path d="M9 12h7M9 16h5"/></svg>',
    'privacy': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7.5 3v6c0 4.4-3 7.6-7.5 9-4.5-1.4-7.5-4.6-7.5-9V6Z"/><path d="m9 12 2 2 4-4"/></svg>',
    'faq': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9.6 9.2a2.5 2.5 0 1 1 3.9 2.1c-.9.6-1.5 1-1.5 2.2M12 17h.01"/></svg>',
    'contact': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8.5 8.5 0 0 1-12.3 7.6L4 21l1.4-4.4A8.5 8.5 0 1 1 21 12Z"/></svg>',
}

NAV = [
    ('about', 'about.html', 'درباره ما'),
    ('magazine', 'magazine.html', 'مجله سفر'),
    ('careers', 'careers.html', 'فرصت‌های شغلی'),
    ('support', 'support.html', 'پشتیبانی'),
    ('rules', 'rules.html', 'قوانین و مقررات'),
    ('privacy', 'privacy.html', 'حریم خصوصی'),
    ('faq', 'faq.html', 'سوالات متداول'),
    ('contact', 'contact.html', 'ارتباط با ما'),
]

ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>'

def tabs(active):
    out = []
    for key, href, label in NAV:
        cur = ' aria-current="true"' if key == active else ''
        out.append(f'<a href="{href}"{cur}>{label}</a>')
    return ''.join(out)

def footer():
    links = ''.join(f'<a href="{href}">{label}</a>' for key, href, label in NAV)
    return ('<footer class="inf-footer"><div class="inf-footer-in"><p>© ۱۴۰۵ آلونک؛ همه حقوق محفوظ است.</p>'
            f'<nav aria-label="مرکز اطلاعات">{links}</nav></div></footer>')

def shell(fname, title, desc, kicker_icon, highlight, lead, content, active, hero_extra='', crumb=True):
    crumb_html = '<b>' + title + '</b>'
    page = f'''<!doctype html>
<html lang="fa" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{title} | آلونک</title>
<meta name="description" content="{desc}">
<meta name="theme-color" content="#ffffff">
<script src="https://cdn.tailwindcss.com"></script>
<script>tailwind.config={{theme:{{extend:{{fontFamily:{{sans:['Vazirmatn','Tahoma']}},colors:{{ink:'#182338',coral:'#ff5c5c',sand:'#fff8f3'}}}}}}}}</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/theme.css?v=25">
<link rel="stylesheet" href="assets/info.css?v=3">
<script src="assets/theme.js?v=4"></script>
</head>
<body class="bg-white">
<header class="inf-header">
  <nav class="inf-nav">
    <a href="index.html" class="inf-brand">آلونک<span>.</span></a>
    <a href="index.html#stays" class="inf-cta">رزرو اقامتگاه</a>
    <a href="index.html#about" class="back-home" aria-label="بازگشت"><span class="bh-label">بازگشت</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 4.5H9.1a2 2 0 0 0-1.6.8L2.4 12l5.1 6.7a2 2 0 0 0 1.6.8H21a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 21 4.5Z"/><path d="m11.6 9.4 5.2 5.2M16.8 9.4l-5.2 5.2"/></svg></a>
  </nav>
</header>
<main class="inf-shell">
  <div class="inf-crumbs"><a href="index.html">خانه</a><span class="sep">/</span>{crumb_html}</div>
  <section class="inf-hero">
    <span class="inf-kicker">{kicker_icon}{title}</span>
    <h1 style="margin-top:14px">{highlight}</h1>
    <p>{lead}</p>
    {hero_extra}
  </section>
  <section class="inf-sec" style="padding-top:26px">
{content}
  </section>
</main>
{footer()}
</body>
</html>
'''
    with open(os.path.join(ROOT, fname), 'w', encoding='utf-8', newline='') as f:
        f.write(page)
    return fname


def acc(n, q, answer, open_=False):
    o = ' open' if open_ else ''
    return (f'<details class="inf-acc"{o}><summary><span class="n">{n}</span><span>{q}</span>'
            f'<span class="pm" aria-hidden="true"></span></summary><div class="ans">{answer}</div></details>')


NOTE = lambda txt: ('<div class="inf-note" style="margin-top:14px"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8h.01M11 12h1v4h1"/></svg>'
                    f'<span>{txt}</span></div>')

files = []

# ---------------- about ----------------
files.append(shell(
    'about.html', 'درباره ما',
    'درباره آلونک: داستان، اعداد، اصول کاری و مسیر رشد پلتفرم رزرو اقامتگاه در ایران.',
    ICONS['about'],
    'سفر خوب، از انتخاب <em>جای خوب</em> شروع می‌شود',
    'آلونک یک پلتفرم فارسی برای پیدا کردن اقامتگاه‌های خاص در سراسر ایران است؛ از ویلاهای شمال تا خانه‌های سنتی و کلبه‌های جنگلی. هدف ما ساده کردن مسیر انتخاب، ارائه اطلاعات شفاف و ساختن تجربه‌ای مطمئن برای مسافران و میزبان‌هاست.',
    f'''    <div class="inf-grid c4" style="margin-bottom:16px">
      <div class="inf-stat"><b>۸۴</b><span>اقامتگاه فعال با گالری واقعی</span><i>در حال رشد</i></div>
      <div class="inf-stat"><b>۱٬۶۲۸</b><span>شهر و روستا با تفکیک محله</span><i>سراسر ایران</i></div>
      <div class="inf-stat"><b>۲۴</b><span>استان زیر پوشش</span><i>شمال تا جنوب</i></div>
      <div class="inf-stat"><b>۹۶٪</b><span>رضایت مهمانان از اقامت</span><i>بر اساس بازخورد ثبت‌شده</i></div>
    </div>
    <h2>اصولی که کنارش نمی‌گذاریم</h2>
    <div class="inf-grid c3">
      <div class="inf-card inf-value">
        <span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M5 8h9a3 3 0 0 1 0 6H6"/></svg></span>
        <b>قیمت شفاف، بدون هزینه پنهان</b>
        <p>مبلغ هر شب، هزینه رفت‌وروب و مالیات از ابتدا مشخص است. چیزی خارج از مبلغ اعلام‌شده از شما گرفته نمی‌شود.</p>
      </div>
      <div class="inf-card inf-value">
        <span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.4"/><path d="M5 20a7 7 0 0 1 14 0"/></svg></span>
        <b>میزبان محلی، تأییدشده</b>
        <p>هر میزبان پیش از انتشار، هویت و اقامتگاهش را ثبت می‌کند. نظراتی که ثبت می‌شود فقط از مهمانان واقعی است.</p>
      </div>
      <div class="inf-card inf-value">
        <span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8.5 8.5 0 0 1-12.3 7.6L4 21l1.4-4.4A8.5 8.5 0 1 1 21 12Z"/></svg></span>
        <b>پشتیبانی انسانی</b>
        <p>در تمام مسیر رزرو یک نفر از تیم پشتیبانی پاسخ‌گوی شماست — از انتخاب اقامتگاه تا بعد از تسویه.</p>
      </div>
    </div>
    <h2 style="margin-top:34px">مسیر کوتاه ما</h2>
    <div class="inf-card">
      <div class="inf-tl">
        <div class="inf-tl-item"><span>۱۴۰۱</span><b>شروع با ده اقامتگاه در شمال</b><p>اولین نسخه آلونک با تمرکز روی ویلاهای غرب مازندران و گالری تصاویر واقعی منتشر شد.</p></div>
        <div class="inf-tl-item"><span>۱۴۰۳</span><b>پوشش سراسری و تفکیک محله</b><p>فهرست شهرها به ۱٬۶۲۸ مورد رسید و جست‌وجو بر اساس محله و منطقه اضافه شد.</p></div>
        <div class="inf-tl-item"><span>۱۴۰۴</span><b>پنل کاربری و رزرو آنلاین</b><p>مدیریت رزرو، لغو، نظرات و علاقه‌مندی‌ها به حساب کاربری مهمان منتقل شد.</p></div>
        <div class="inf-tl-item"><span>۱۴۰۵</span><b>مرکز اطلاعات و شفاف‌سازی قوانین</b><p>قوانین رزرو، حریم خصوصی و پشتیبانی به صفحات مستقل و قابل ارجاع تبدیل شدند.</p></div>
      </div>
    </div>
    <div class="inf-cta-row"><a class="inf-mini-btn solid" href="index.html#stays">دیدن اقامتگاه‌ها</a><a class="inf-mini-btn" href="careers.html">همکاری با ما</a></div>''',
    'about'))

# ---------------- magazine ----------------
def post(img, alt, tag, h3, p, read, link):
    return f'''<article class="inf-card inf-post">
        <img src="{img}" alt="{alt}" loading="lazy">
        <div class="body"><span class="tag">{tag}</span><h3>{h3}</h3><p>{p}</p>
        <div class="foot"><span>{read}</span><a href="{link}">دیدن مقصد</a></div></div>
      </article>'''

files.append(shell(
    'magazine.html', 'مجله سفر',
    'مجله سفر آلونک: راهنماها، مسیرها و یادداشت‌های سفر برای انتخاب بهتر اقامتگاه در ایران.',
    ICONS['magazine'],
    'راهنمای سفر، از کسانی که <em>رفته‌اند</em>',
    'مسیرها، آداب محلی و بهترین زمان سفر. یادداشت‌های کوتاه و کاربردی برای انتخاب مقصد و اقامتگاه درست — بدون توصیه‌های تبلیغاتی.',
    '''    <div class="inf-grid c3">
''' + post('assets/images/photo-1601918774946-25832a4be0d6.jpg', 'کلبه جنگلی در مه جنگل‌های شمال', 'شمال ایران',
           'سه روز در غرب مازندران؛ مسیری که کمتر دیده‌اید',
           'از کتالم و رامسر تا ناهارخوران گرگان؛ برای هر شب یک اقامتگاه دنج و برای هر روز یک چرای محلی.',
           '۶ دقیقه مطالعه', 'destinations.html?destination=north') + post('assets/stays/421804.jpg', 'حیاط اقامتگاه سنتی خشتی در شب', 'کویر و مرکز ایران',
           'شب‌مانی در کویر: چه چیزی را باید از قبل بدانید',
           'انتخاب بین اقامتگاه خشتی و کمپ، بهترین فصل آسمان پرستاره، و وسایلی که کمتر کسی یادش می‌ماند.',
           '۸ دقیقه مطالعه', 'destinations.html?destination=desert') + post('assets/images/photo-1533105079780-92b9be482077.jpg', 'کوچه‌های سفید و دریای آبی در جنوب', 'جزایر جنوب',
           'کیش بدون هتل؛ راهنمای اقامت‌های خانگی',
           'چطور در جزیره سوئیت مناسب پیدا کنیم، چه ساعتی پرواز بگیریم و چرا فاصله از ساحل مهم‌تر از قیمت است.',
           '۵ دقیقه مطالعه', 'destinations.html?destination=kish') + '''    </div>
    ''' + NOTE('همه مقاله‌ها توسط تیم محتوا و با بازبینی میزبان‌های محلی نوشته می‌شوند. اگر تجربه‌ای برای انتشار دارید، به <b style="color:var(--ink)">magazine@alonak.ir</b> بفرستید.'),
    'magazine'))

# ---------------- careers ----------------
def job(title, p, tags, subject):
    tg = ''.join(f'<span>{t}</span>' for t in tags)
    return f'''<div class="inf-card inf-job">
        <div class="inf-job-top"><div><h3>{title}</h3><p>{p}</p></div>
          <a class="inf-mini-btn solid" href="mailto:jobs@alonak.ir?subject={subject}">ارسال رزومه</a></div>
        <div class="inf-tags">{tg}</div>
      </div>'''

files.append(shell(
    'careers.html', 'فرصت‌های شغلی',
    'موقعیت‌های شغلی باز در آلونک و روش ارسال رزومه برای همکاری دورکار.',
    ICONS['careers'],
    'با ما بسازید؛ <em>دورکار</em> و بدون مرز',
    'آلونک تیمی کوچک با محصولی زنده است. تمرکز ما نتیجه است نه حضور در دفتر؛ اگر سفر، میزبانی و تجربه کاربری برایتان موضوع مهمی است، این موقعیت‌ها را ببینید.',
    '''    <div class="inf-grid" style="gap:12px">
''' + job('کارشناس پشتیبانی مهمان',
          'پاسخ به تیکت‌های رزرو و پیگیری درخواست‌های تغییر و لغو، هماهنگی با میزبان‌ها.',
          ['تمام‌وقت', 'دورکاری', 'حداقل ۱ سال تجربه'], 'رزومه%20-%20کارشناس%20پشتیبانی') + job('توسعه‌دهنده فرانت‌اند',
          'کار روی تجربه رزرو، سرعت صفحه و دسترس‌پذیری. HTML/CSS مدرن و JavaScript، آشنایی با طراحی واکنش‌گرا الزامی است.',
          ['پروژه‌ای / تمام‌وقت', 'دورکاری', 'نمونه‌کار الزامی'], 'رزومه%20-%20فرانت‌اند') + job('مدیر محتوا و شبکه‌های اجتماعی',
          'تولید محتوای مجله سفر، مدیریت تلگرام و اینستاگرام آلونک و همکاری با میزبان‌ها برای روایت اقامتگاه‌ها.',
          ['پاره‌وقت', 'دورکاری', 'قدرت نویسندگی'], 'رزومه%20-%20محتوا') + '''    </div>
    <h2 style="margin-top:30px">چه چیزی برایمان مهم است</h2>
    <div class="inf-grid c3">
      <div class="inf-card inf-value"><span class="ic">''' + ICONS['support'] + '''</span><b>مالکیت کار</b><p>هر نفر مسئول حوزه‌اش است و مستقیم با تصمیم‌ها درگیر می‌شود؛ بوروکراسی کم، بازخورد سریع.</p></div>
      <div class="inf-card inf-value"><span class="ic">''' + ICONS['magazine'] + '''</span><b>یادگیری مستمر</b><p>بودجه سالانه کتاب و دوره، و زمان کاری برای آزمایش ایده‌های جدید در محصول.</p></div>
      <div class="inf-card inf-value"><span class="ic">''' + ICONS['privacy'] + '''</span><b>تعادل و انعطاف</b><p>ساعت کاری منعطف، جلسه‌های کوتاه و تمرکز روی خروجی به‌جای حضور آنلاین.</p></div>
    </div>
    ''' + NOTE('اگر موقعیت مناسبی در فهرست نیست، رزومه‌تان را با موضوع «همکاری» به jobs@alonak.ir بفرستید؛ در اولین فرصت بررسی می‌کنیم.'),
    'careers'))

# ---------------- support ----------------
files.append(shell(
    'support.html', 'پشتیبانی',
    'راه‌های تماس با پشتیبانی آلونک، ساعات پاسخ‌گویی و پیگیری تیکت رزرو.',
    ICONS['support'],
    'کمک لازم دارید؟ <em>سه راه</em> داریم',
    'برای سوال درباره رزرو، تغییر تاریخ یا مشکل در پرداخت، از هر کانالی که راحت‌تر است پیام بدهید. میانگین پاسخ‌گویی زیر ۲۴ ساعت است.',
    '''    <div class="inf-grid c3">
      <a class="inf-card inf-help" href="account.html#support">
        <span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16v12H8l-4 4z"/></svg></span>
        <b>تیکت در پنل کاربری</b>
        <p>سریع‌ترین راه برای پیگیری رزروهای ثبت‌شده؛ تاریخچه گفتگو ذخیره می‌شود.</p>
        <em>account.html → پشتیبانی</em>
      </a>
      <a class="inf-card inf-help" href="mailto:support@alonak.ir">
        <span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/></svg></span>
        <b>ایمیل پشتیبانی</b>
        <p>مناسب ارسال مدارک، فیش پرداخت یا توضیح کامل مشکل.</p>
        <em>support@alonak.ir</em>
      </a>
      <a class="inf-card inf-help" href="tel:+982191000000">
        <span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h3l2 5-2.5 1.5a12 12 0 0 0 6 6L16 13l5 2v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4 5.2 2 2 0 0 1 6 3Z"/></svg></span>
        <b>تماس تلفنی</b>
        <p>برای موارد فوری مانند ورود در همان روز یا مشکل در محل اقامتگاه.</p>
        <em>۰۲۱-۹۱۰۰۰۰۰۰</em>
      </a>
    </div>
    <h2 style="margin-top:30px">قبل از تماس، این سه مورد را چک کنید</h2>
    <div class="inf-grid" style="gap:10px">
''' + acc('۱', 'کد رزرو را آماده داشته باشید', '<p>کد رزرو در پنل کاربری، بخش «رزروهای من» و در پیام تأیید رزرو دیده می‌شود. با این کد، پیگیری چند برابر سریع‌تر است.</p>')
      + acc('۲', 'وضعیت رزرو را ببینید', '<p>اگر وضعیت «در انتظار تأیید» است، میزبان تا ۱۲ ساعت فرصت دارد. تا پایان این بازه نیازی به پیگیری نیست.</p>')
      + acc('۳', 'قوانین لغو را بخوانید', '<p>بازه‌های بازگشت وجه در صفحه <a href="rules.html" style="color:var(--accent);font-weight:800">قوانین و مقررات</a> آمده است؛ بسیاری از سوال‌ها همان‌جا پاسخ دارد.</p>') + '''    </div>
    ''' + NOTE('ساعات پاسخ‌گویی: شنبه تا پنجشنبه، ۹ صبح تا ۱۰ شب. پیام‌های ارسالی خارج از این بازه، صبح روز بعد پاسخ داده می‌شوند.'),
    'support'))

# ---------------- rules ----------------
files.append(shell(
    'rules.html', 'قوانین و مقررات',
    'شرایط رزرو، پرداخت، لغو و مسئولیت میزبان و مهمان در آلونک.',
    ICONS['rules'],
    'شرایط رزرو، <em>پرداخت</em> و لغو',
    'ثبت درخواست رزرو در آلونک به معنی پذیرش این شرایط است. جزئیات اختصاصی هر اقامتگاه (ساعت ورود، تعداد مهمان مجاز و قوانین میزبان) در صفحه همان اقامتگاه اعلام می‌شود.',
    '''    <div style="margin-top:4px">
''' + acc('۱', 'ثبت و تأیید رزرو', '<p>درخواست شما ابتدا با وضعیت «در انتظار تأیید» ثبت می‌شود. میزبان حداکثر تا ۱۲ ساعت فرصت دارد آن را تأیید یا رد کند. پس از تأیید، رزرو قطعی است و جزئیات تماس میزبان در پنل کاربری نمایش داده می‌شود.</p><p>اگر رزرو تأیید نشود، هیچ مبلغی از شما کسر نمی‌شود و می‌توانید اقامتگاه دیگری انتخاب کنید.</p>', True)
      + acc('۲', 'پرداخت و پیش‌پرداخت', '<p>برای قطعی‌شدن رزرو، پیش‌پرداخت ۳۰٪ مبلغ کل لازم است. مانده مبلغ هنگام ورود و به میزبان پرداخت می‌شود، مگر آنکه در صفحه اقامتگاه شرط دیگری ذکر شده باشد.</p><p>مبلغ اعلام‌شده شامل هزینه اقامت است؛ هزینه‌های جانبی مانند ورود حیوان خانگی یا سرویس اضافه، پیش از رزرو به‌صورت شفاف نمایش داده می‌شود.</p>')
      + acc('۳', 'لغو رزرو و بازگشت وجه', '<p>لغو تا ۷۲ ساعت قبل از ورود: بازگشت کامل پیش‌پرداخت. لغو بین ۷۲ تا ۲۴ ساعت قبل: بازگشت ۵۰٪ پیش‌پرداخت. لغو در کمتر از ۲۴ ساعت مانده به ورود: پیش‌پرداخت قابل بازگشت نیست.</p><p>بازگشت وجه حداکثر تا ۷۲ ساعت کاری به همان حساب پرداخت‌کننده انجام می‌شود.</p>')
      + acc('۴', 'ورود، خروج و تعداد مهمان', '<p>ساعت ورود به‌طور معمول از ۱۴:۰۰ و ساعت خروج تا ۱۲:۰۰ است؛ زمان دقیق در صفحه اقامتگاه مشخص شده است. ورود زودتر یا خروج دیرتر فقط با هماهنگی میزبان امکان‌پذیر است.</p><p>افزایش تعداد مهمان از سقف اعلام‌شده مجاز نیست و می‌تواند به لغو رزرو بدون بازگشت وجه منجر شود.</p>')
      + acc('۵', 'مسئولیت میزبان و مهمان', '<p>میزبان مسئول تطابق اقامتگاه با توضیحات و تصاویر منتشرشده است. مهمان نیز متعهد به رعایت قوانین محل، آرامش همسایگان و نگهداری اموال اقامتگاه است.</p><p>آلونک واسط معرفی و رزرو است؛ در صورت بروز اختلاف، تیم پشتیبانی برای بررسی و حل‌وفصل وارد می‌شود.</p>') + '''    </div>
    ''' + NOTE('آخرین بازنگری این صفحه: آبان ۱۴۰۵. تغییرات مهم قوانین، پیش از اعمال به مهمانان دارای رزرو فعال اطلاع داده می‌شود.'),
    'rules'))

# ---------------- privacy ----------------
files.append(shell(
    'privacy.html', 'حریم خصوصی',
    'سیاست حریم خصوصی آلونک: چه داده‌ای جمع می‌شود، چگونه استفاده و چه زمانی حذف می‌شود.',
    ICONS['privacy'],
    'اطلاعات شما، فقط برای <em>انجام رزرو</em>',
    'ما فقط اطلاعاتی را نگه می‌داریم که برای ثبت رزرو، هماهنگی با میزبان و پشتیبانی لازم است — نه بیشتر. این صفحه دقیقاً می‌گوید چه چیزی، چرا و تا چه زمانی.',
    '''    <div class="inf-grid c3">
      <div class="inf-card inf-privacy"><h3>چه چیزی جمع می‌کنیم</h3><p>نام، شماره تماس، ایمیل و تاریخ‌های سفر. اطلاعات پرداخت در درگاه بانکی انجام می‌شود و شماره کارت روی سرورهای ما ذخیره نمی‌شود.</p></div>
      <div class="inf-card inf-privacy"><h3>چطور استفاده می‌کنیم</h3><p>فقط برای تأیید رزرو، اطلاع‌رسانی وضعیت سفر و پاسخ به درخواست پشتیبانی. هیچ اطلاعاتی برای تبلیغات به شخص ثالث فروخته نمی‌شود.</p></div>
      <div class="inf-card inf-privacy"><h3>با چه کسی به اشتراک می‌گذاریم</h3><p>فقط با میزبان همان رزرو (نام و شماره تماس) و در صورت لزوم با درگاه پرداخت. خارج از این موارد، دسترسی وجود ندارد.</p></div>
    </div>
    <h2 style="margin-top:30px">مدت نگهداری داده‌ها</h2>
    <div class="inf-table-wrap"><div class="scroll"><table class="inf-table">
      <thead><tr><th>دسته داده</th><th>مدت نگهداری</th><th>دلیل</th></tr></thead>
      <tbody>
        <tr><td><b>حساب کاربری</b></td><td>تا زمان حذف حساب</td><td>دسترسی به رزروها و علاقه‌مندی‌ها</td></tr>
        <tr><td><b>سوابق رزرو</b></td><td>۱۸ ماه پس از سفر</td><td>پیگیری، پشتیبانی و حل اختلاف</td></tr>
        <tr><td><b>فاکتور و سوابق مالی</b></td><td>طبق الزام قانونی</td><td>تکالیف مالیاتی و حسابداری</td></tr>
        <tr><td><b>گفتگوهای پشتیبانی</b></td><td>۱۲ ماه</td><td>کیفیت پاسخ‌گویی و پیگیری</td></tr>
      </tbody>
    </table></div></div>
    <h2 style="margin-top:30px">امنیت و حقوق شما</h2>
    <div class="inf-grid c2">
      <div class="inf-card inf-privacy"><h3>دسترسی محدود</h3><p>دسترسی به داده‌های شخصی فقط برای تیم عملیات و پشتیبانی و در حد نیاز هر نقش است. ارتباط سایت با سرورها روی HTTPS انجام می‌شود.</p></div>
      <div class="inf-card inf-privacy"><h3>مشاهده، اصلاح و حذف</h3><p>می‌توانید اطلاعات حساب را در پنل ویرایش کنید. برای حذف کامل داده‌ها یا دریافت نسخه‌ای از اطلاعات ذخیره‌شده، از privacy@alonak.ir استفاده کنید؛ حداکثر تا ۳۰ روز انجام می‌شود.</p></div>
    </div>
    ''' + NOTE('این صفحه با آخرین بازنگری آبان ۱۴۰۵ منتشر شده است. برای هر پرسش درباره داده‌ها، پیش از هر اقدامی با ما تماس بگیرید.'),
    'privacy'))

# ---------------- faq ----------------
files.append(shell(
    'faq.html', 'سوالات متداول',
    'پاسخ پرتکرارترین سوال‌های مهمانان و میزبانان آلونک درباره رزرو، پرداخت، لغو و اقامتگاه.',
    ICONS['faq'],
    'پاسخ کوتاه به <em>پرتکرارترین</em> پرسش‌ها',
    'اگر پاسخ سوال‌تان اینجا نبود، از بخش پشتیبانی پیام بدهید؛ پاسخ را به همین صفحه هم اضافه می‌کنیم.',
    '''    <div style="margin-top:4px">
''' + acc('۱', 'رزرو چقدر زمان می‌برد تا تأیید شود؟', '<p>معمولاً کمتر از یک ساعت. میزبان حداکثر ۱۲ ساعت فرصت دارد؛ وضعیت رزرو در پنل کاربری و از طریق پیام برای شما به‌روزرسانی می‌شود.</p>', True)
      + acc('۲', 'امکان پرداخت در محل وجود دارد؟', '<p>برای قطعی‌شدن رزرو، پیش‌پرداخت آنلاین لازم است. مانده مبلغ را می‌توانید هنگام ورود به میزبان پرداخت کنید، مگر آنکه در صفحه اقامتگاه شرط دیگری نوشته شده باشد.</p>')
      + acc('۳', 'تاریخ‌ها را می‌توانم تغییر دهم؟', '<p>تغییر تاریخ تا ۷۲ ساعت قبل از ورود و در صورت موجود بودن اقامتگاه امکان‌پذیر است. برای هماهنگی، تیکت پشتیبانی با کد رزرو ثبت کنید.</p>')
      + acc('۴', 'آیا با حیوان خانگی می‌توانم بیایم؟', '<p>به قوانین هر اقامتگاه بستگی دارد؛ در فهرست امکانات صفحه اقامتگاه مشخص شده است. در صورت نبود این گزینه، پیش از رزرو با پشتیبانی هماهنگ کنید.</p>')
      + acc('۵', 'میزبان هستم؛ چطور اقامتگاهم را ثبت کنم؟', '<p>با ایمیل host@alonak.ir درخواست بدهید. پس از بررسی مدارک و بازدید تصاویر، صفحه اقامتگاه شما با گالری واقعی منتشر می‌شود. کارمزد آلونک از هر رزرو، پیش از انتشار به‌صورت شفاف اعلام می‌شود.</p>')
      + acc('۶', 'اگر اقامتگاه با تصاویر مطابقت نداشت چه کنم؟', '<p>همان‌جا با پشتیبانی تماس بگیرید و مستندات (عکس یا ویدئو) ارسال کنید. در صورت تأیید مغایرت، برای جابه‌جایی به اقامتگاه جایگزین یا بازگشت وجه اقدام می‌کنیم.</p>')
      + acc('۷', 'هزینه‌ی خدمات یا کمیسیون دارد؟', '<p>برای مهمان، قیمتی که در صفحه اقامتگاه می‌بینید همان مبلغ نهایی قابل پرداخت است؛ کارمزد آلونک از سهم میزبان کسر می‌شود و به مهمان اضافه نمی‌شود.</p>')
      + acc('۸', 'چطور از رزرو مطمئن شوم که کلاهبرداری نیست؟', '<p>همه پرداخت‌ها فقط از مسیر همین سایت و درگاه بانکی انجام می‌شود. هیچ‌گاه مبلغی را به حساب شخصی خارج از پنل واریز نکنید؛ در صورت چنین درخواستی، به پشتیبانی اطلاع دهید.</p>') + '''    </div>
    <div class="inf-cta-row"><a class="inf-mini-btn solid" href="support.html">رفتن به پشتیبانی</a><a class="inf-mini-btn" href="rules.html">خواندن قوانین</a></div>''',
    'faq'))

# ---------------- contact ----------------
files.append(shell(
    'contact.html', 'ارتباط با ما',
    'آدرس شبکه‌های اجتماعی رسمی آلونک و ایمیل‌های ارتباطی برای پشتیبانی، همکاری و میزبانی.',
    ICONS['contact'],
    'آلونک را در <em>شبکه‌های اجتماعی</em> دنبال کنید',
    'عکس اقامتگاه‌های تازه، پیشنهادهای آخر هفته و راهنمای سفر را در کانال‌های رسمی ما ببینید. برای کارهای اداری و همکاری هم ایمیل‌های مستقیم پایین صفحه است.',
    f'''    <div class="inf-socials">
      <a class="inf-social tg" href="https://t.me/alonak" target="_blank" rel="noopener noreferrer" aria-label="آلونک در تلگرام"><span class="ic">{TG}</span><div><b>تلگرام آلونک</b><span>@alonak</span></div></a>
      <a class="inf-social ig" href="https://instagram.com/alonak" target="_blank" rel="noopener noreferrer" aria-label="آلونک در اینستاگرام"><span class="ic">{IG}</span><div><b>اینستاگرام آلونک</b><span>@alonak</span></div></a>
      <a class="inf-social yt" href="https://youtube.com/@alonak" target="_blank" rel="noopener noreferrer" aria-label="آلونک در یوتیوب"><span class="ic">{YT}</span><div><b>یوتیوب آلونک</b><span>@alonak</span></div></a>
    </div>
    <h2 style="margin-top:30px">ایمیل‌های مستقیم</h2>
    <div class="inf-grid c3">
      <a class="inf-card inf-help" href="mailto:support@alonak.ir"><span class="ic">{ICONS['support']}</span><b>پشتیبانی مهمان</b><p>سوال، تغییر یا لغو رزرو.</p><em>support@alonak.ir</em></a>
      <a class="inf-card inf-help" href="mailto:host@alonak.ir"><span class="ic">{ICONS['about']}</span><b>میزبانی و ثبت اقامتگاه</b><p>درخواست همکاری و بررسی مدارک میزبان.</p><em>host@alonak.ir</em></a>
      <a class="inf-card inf-help" href="mailto:hello@alonak.ir"><span class="ic">{ICONS['magazine']}</span><b>همکاری و تبلیغات</b><p>پیشنهاد کسب‌وکار، رسانه و همکاری برند.</p><em>hello@alonak.ir</em></a>
    </div>
    ''' + NOTE('پاسخ‌گویی در روزهای کاری، حداکثر تا ۲۴ ساعت. برای موارد فوری همان روز ورود، تماس تلفنی سریع‌ترین راه است: ۰۲۱-۹۱۰۰۰۰۰۰') + '''
    <div class="inf-cta-row"><a class="inf-mini-btn solid" href="support.html">راه‌های پشتیبانی</a><a class="inf-mini-btn" href="faq.html">سوالات متداول</a></div>''',
    'contact'))

print("\n".join(files))
