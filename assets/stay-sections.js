/* Makanak — stay detail sections (specs, amenities, hours, rules, reviews)
   Data source: assets/stay-data.js (generated from the jabama capture). */
(function () {
  const FA = '۰۱۲۳۴۵۶۷۸۹';
  const toFa = v => String(v).replace(/\d/g, d => FA[d]);
  const money = v => toFa(Math.round(Number(v) || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));

  const TYPE_LABEL = {
    suite: 'سوئیت', apartment: 'آپارتمان', villa: 'ویلا', cottage: 'کلبه', house: 'خانه',
    hut: 'کلبه چوبی', camp: 'اقامتگاه بومی', hotel: 'هتل', hostel: 'هاستل', complex: 'مجتمع', cabin: 'کلبه'
  };
  const typeLabel = t => TYPE_LABEL[t] || 'اقامتگاه';

  const AMENITIES = {
    'water': ['آب', 'droplet'],
    'electric': ['برق', 'bolt'],
    'gas': ['گاز', 'flame'],
    'air-conditioning-system': ['سیستم سرمایشی', 'snow'],
    'heating-system': ['سیستم گرمایشی', 'flame'],
    'refrigerator': ['یخچال', 'fridge'],
    'gas-stove': ['اجاق گاز', 'stove'],
    'food-serving-equipment': ['لوازم سرو غذا', 'food'],
    'sofa': ['مبل', 'sofa'],
    'pwc': ['آبگرمکن', 'droplet'],
    'cooking-appliances': ['لوازم آشپزی', 'food'],
    'tv': ['تلویزیون', 'tv'],
    'parking': ['پارکینگ', 'parking'],
    'kitchen': ['آشپزخانه', 'kitchen'],
    'cabinet': ['کابینت', 'kitchen'],
    'wc': ['سرویس فرنگی', 'wc'],
    'mobile-network-coverage': ['آنتن‌دهی موبایل', 'signal'],
    'dining-table': ['میز غذاخوری', 'table'],
    'ironing-amenities': ['لوازم اتوکشی', 'iron'],
    'iranian-digital-receiver': ['گیرنده دیجیتال', 'tv'],
    'vacuum-cleaner': ['جاروبرقی', 'broom'],
    'wardrobe-drawer': ['کمد و کشو', 'wardrobe'],
    'greenery': ['فضای سبز', 'tree'],
    'balcony': ['بالکن', 'balcony'],
    'barbeque': ['باربیکیو', 'bbq'],
    'swimming-pool': ['استخر', 'pool'],
    'room-yard-view': ['دید به حیاط', 'view'],
    'surveillance-camera': ['دوربین مداربسته', 'camera'],
    'sound-system': ['سیستم صوتی', 'sound'],
    'room-mountain-forest-view': ['دید به کوه و جنگل', 'view'],
    'guard': ['نگهبان', 'shield'],
    'fire-extinguisher': ['کپسول آتش‌نشانی', 'extinguisher'],
    'kettle': ['کتری برقی', 'kettle'],
    'gazebo': ['آلاچیق', 'gazebo'],
    'first-aid-kit': ['جعبهٔ کمک‌های اولیه', 'firstaid'],
    'washing-machine': ['ماشین لباسشویی', 'washer'],
    'table-football': ['فوتبال دستی', 'game'],
    'hairdryer': ['سشوار', 'hairdryer'],
    'billiard': ['بیلیارد', 'game'],
    'internet-wifi': ['اینترنت وای‌فای', 'wifi'],
    'iron': ['اتو', 'iron'],
    'ventilation-system': ['سیستم تهویه', 'fan'],
    'telephone': ['تلفن', 'phone'],
    'atm': ['خودپرداز', 'atm'],
    'dry-cleaning': ['خشکشویی', 'washer'],
    'bathroom': ['حمام', 'bath'],
    'dishwasher': ['ماشین ظرفشویی', 'washer'],
    'electric-pot': ['قابلمهٔ برقی', 'kettle'],
    'home-water-purification-system': ['تصفیهٔ آب', 'droplet'],
    'microwave': ['مایکروویو', 'microwave'],
    'coffee-maker': ['قهوه‌ساز', 'coffee'],
    'restaurant': ['رستوران', 'restaurant'],
    'prayer-room': ['نمازخانه', 'mosque'],
    'lobby': ['لابی', 'house'],
    'elevator': ['آسانسور', 'elevator'],
    'room-city-view': ['دید به شهر', 'view'],
    'room-sea-view': ['دید به دریا', 'view'],
    'console-games': ['بازی کنسول', 'game'],
    'jacuzzi': ['جاکوزی', 'pool'],
    'ping-pong': ['تنیس روی میز', 'game'],
    'sauna': ['سونا', 'sauna'],
    'fire-extinguishing-system': ['سیستم اطفای حریق', 'extinguisher'],
    'coffee-shop': ['کافی‌شاپ', 'coffee'],
    'daily-housekeeping': ['نظافت روزانه', 'broom'],
    'meal-service': ['سرو غذا', 'food'],
    'periodic-spraying': ['سمپاشی دوره‌ای', 'spray'],
    'shop': ['فروشگاه', 'shop'],
    'taxi': ['تاکسی', 'car']
  };

  const TOP_AMENITIES = ['parking', 'air-conditioning-system', 'heating-system', 'swimming-pool', 'internet-wifi',
    'kitchen', 'food-serving-equipment', 'gas-stove', 'washing-machine', 'tv', 'bathroom', 'barbeque'];

  const ICONS = {
    parking: '<rect x="3" y="3" width="18" height="18" rx="4"/><path d="M9 17V7h4a3 3 0 0 1 0 6H9"/>',
    snow: '<path d="M12 3v18M4.5 7.5l15 9M19.5 7.5l-15 9"/>',
    flame: '<path d="M12 3c3 4 5 5.5 5 9a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5 0 2 1 3 2 3 0-3 1-5 1-7.5Z"/>',
    pool: '<path d="M3 16c2 1.5 4 1.5 6 0s4-1.5 6 0 4 1.5 6 0M3 20c2 1.5 4 1.5 6 0s4-1.5 6 0 4 1.5 6 0M8 12V6a2 2 0 0 1 4 0M16 12V6a2 2 0 0 1 4 0"/>',
    food: '<path d="M7 3v8a2 2 0 0 0 4 0V3M9 11v10M17 3c-1.5 2-2 3.5-2 6s.5 3 2 3v9"/>',
    stove: '<rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="8.5" cy="8.5" r="1.5"/><circle cx="15.5" cy="8.5" r="1.5"/><circle cx="8.5" cy="15.5" r="1.5"/><circle cx="15.5" cy="15.5" r="1.5"/>',
    wifi: '<path d="M4 9a14 14 0 0 1 16 0M7 13a9 9 0 0 1 10 0M10 17a4 4 0 0 1 4 0"/><circle cx="12" cy="20" r="1"/>',
    signal: '<path d="M4 20V10M9 20V6M14 20V13M19 20V8"/>',
    tv: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M8 21h8M12 18v3"/>',
    fridge: '<rect x="6" y="3" width="12" height="18" rx="2"/><path d="M6 10h12M9 6.5v1.5M9 13v2"/>',
    washer: '<rect x="4" y="3" width="16" height="18" rx="3"/><circle cx="12" cy="14" r="4"/><path d="M8 6.5h.01M11 6.5h.01"/>',
    bath: '<path d="M3 11h18v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4v-3ZM6 11V6a2 2 0 0 1 4 0"/>',
    wc: '<path d="M7 4h7a3 3 0 0 1 0 6H7zM7 10h9l-1.5 10h-6z"/>',
    tree: '<path d="M12 3 6 12h12L12 3ZM12 12l-4 6h8l-4-6ZM12 18v3"/>',
    balcony: '<path d="M4 21V10h16v11M4 14h16M8 10V6M12 10V6M16 10V6M3 6h18"/>',
    bbq: '<path d="M5 8h14l-2 7H7L5 8ZM12 15v5M8 20h8"/>',
    camera: '<path d="M3 8l13-3 2 7-13 3zM18 9l3-1v6l-3-1"/><circle cx="8" cy="19" r="1.5"/>',
    shield: '<path d="M12 3l7 3v6c0 4-3 7-7 9-4-2-7-5-7-9V6z"/><path d="m9 12 2 2 4-4"/>',
    extinguisher: '<path d="M9 8h4a3 3 0 0 1 3 3v9H6v-9a3 3 0 0 1 3-3ZM11 8V5h4M15 5l3 2"/>',
    kettle: '<path d="M7 9h9v8a3 3 0 0 1-3 3h-3a3 3 0 0 1-3-3V9ZM16 11l3-2M9 6h5"/>',
    gazebo: '<path d="M12 3 3 9h18L12 3ZM6 9v11M18 9v11M3 20h18"/>',
    firstaid: '<rect x="3" y="7" width="18" height="13" rx="3"/><path d="M12 11v5M9.5 13.5h5"/>',
    game: '<rect x="3" y="7" width="18" height="10" rx="4"/><path d="M8 12h4M10 10v4M16 11h.01M18 13h.01"/>',
    hairdryer: '<path d="M4 6h9a5 5 0 0 1 0 10H4zM8 16v4M18 8h2M18 12h2"/>',
    iron: '<path d="M3 16h13a5 5 0 0 0-5-5H6a3 3 0 0 0-3 3v2ZM3 19h18"/>',
    fan: '<circle cx="12" cy="12" r="2"/><path d="M12 10c0-4 5-5 5-1s-3 3-5 3M14 12c4 0 5 5 1 5s-3-3-3-5M12 14c0 4-5 5-5 1s3-3 5-3M10 12c-4 0-5-5-1-5s3 3 3 5"/>',
    phone: '<path d="M6 3h4l2 4-3 2a10 10 0 0 0 5 5l2-3 4 2v4a2 2 0 0 1-2 2A16 16 0 0 1 4 5a2 2 0 0 1 2-2Z"/>',
    atm: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 10h10M7 14h4"/>',
    microwave: '<rect x="3" y="6" width="18" height="12" rx="2"/><rect x="6" y="9" width="8" height="6" rx="1"/><path d="M17 10h.01M17 14h.01"/>',
    coffee: '<path d="M4 8h12v7a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8ZM16 9h3a2 2 0 0 1 0 4h-3M4 21h12"/>',
    restaurant: '<path d="M4 4v7a3 3 0 0 0 6 0V4M7 11v9M17 4c-1 2-2 3-2 5s.5 2 2 2v9"/>',
    mosque: '<path d="M4 21V11l8-6 8 6v10M10 21v-5a2 2 0 0 1 4 0v5"/>',
    house: '<path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/>',
    elevator: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M12 3v18M8.5 9l1.5-2 1.5 2M8.5 15l1.5 2 1.5-2"/>',
    sauna: '<path d="M6 20c0-3 2-4 2-7M12 20c0-3 2-4 2-7M18 20c0-3 2-4 2-7M4 6h16"/>',
    broom: '<path d="M14 4l6 6M16 6l-7 7-2 6 6-2 7-7M9 13l2 2"/>',
    spray: '<path d="M8 8h6v11H8zM11 8V5h3M18 5h.01M20 8h.01M18 11h.01"/>',
    shop: '<path d="M4 9h16l-1 4H5L4 9ZM5 13v7h14v-7M9 20v-4h6v4"/>',
    car: '<path d="M4 15l2-5h12l2 5v3H4zM7 18v2M17 18v2M7 11h10"/>',
    view: '<path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/>',
    sound: '<path d="M4 10v4h3l4 4V6l-4 4H4ZM15 9a4 4 0 0 1 0 6M18 6a8 8 0 0 1 0 12"/>',
    wardrobe: '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M12 3v18M9 11h.01M15 11h.01"/>',
    iron2: '<path d="M3 16h13a5 5 0 0 0-5-5H6a3 3 0 0 0-3 3v2Z"/>',
    table: '<path d="M3 8h18M6 8v12M18 8v12M3 12h18"/>',
    sofa: '<path d="M4 12V9a2 2 0 0 1 4 0v3M16 12V9a2 2 0 0 1 4 0v3M4 12h16v5H4zM7 17v2M17 17v2"/>',
    bolt: '<path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"/>',
    droplet: '<path d="M12 3s6 6.5 6 10.5A6 6 0 0 1 6 13.5C6 9.5 12 3 12 3Z"/>',
    check: '<path d="m5 13 4 4L19 7"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    bed: '<path d="M3 18v-6h13a4 4 0 0 1 4 4v2M3 12V8M3 18h18M7 12V9h5v3"/>',
    users: '<circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0M17 5a3 3 0 0 1 0 6M16 20a5 5 0 0 1 5-5"/>',
    bath2: '<path d="M3 11h18v3a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4z"/>',
    area: '<path d="M4 4h16v16H4zM4 9h5V4M20 15h-5v5"/>',
    key: '<circle cx="8" cy="8" r="4"/><path d="m11 11 8 8M16 16l2-2M18 18l2-2"/>',
    star: '<path d="m12 3 2.9 5.9 6.5.9-4.7 4.6 1.1 6.6L12 18l-5.8 3 1.1-6.6L2.6 9.8l6.5-.9L12 3Z"/>'
  };

  const RULES = {
    smoke: ['استعمال دخانیات', 'ممنوع است'],
    pets: ['ورود حیوانات خانگی', 'ممنوع است'],
    ceremony: ['برگزاری مراسم و مهمانی', 'ممنوع است'],
    single_persons: ['پذیرش گروه‌های مجردی (فقط آقایان یا فقط خانم‌ها)', 'فراهم نیست'],
    intimate: ['پذیرش زوج‌های غیررسمی', 'فراهم نیست'],
    '24h_reception': ['پذیرش ۲۴ ساعته مهمان', 'فراهم است']
  };
  const ALLOWED_RULES = ['smoke', 'pets', 'ceremony'];

  const svg = (name, cls) =>
    `<svg class="${cls || ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.check}</svg>`;

  const amenLabel = key => (AMENITIES[key] ? AMENITIES[key][0] : key);
  const amenIcon = key => (AMENITIES[key] ? AMENITIES[key][1] : 'check');

  function specsBlock(stay, d) {
    const rows = [];
    const area = d && d.a ? `${toFa(d.a)} متر زیربنا${d.b ? ` · بنا ${toFa(d.b)} متر` : ''}` : '';
    if (area) rows.push(['area', 'دربارهٔ اقامتگاه', area]);
    if (d && (d.cb || stay.capacity)) {
      const total = stay.capacity || (d.cb + d.ce);
      const extra = d.ce || Math.max(0, total - (d.cb || 0));
      rows.push(['users', 'ظرفیت', `ظرفیت تا ${toFa(total)} نفر (${toFa(d.cb || total)} نفر پایه${extra ? ` + ${toFa(extra)} نفر اضافه` : ''})`]);
    }
    if (d && (d.br || d.ba || d.wc || d.iwc)) {
      const beds = [];
      if (d.br) beds.push(`${toFa(d.br)} اتاق خواب`);
      rows.push(['bed', 'سرویس‌های خواب', beds.length ? beds.join(' · ') : 'سرویس خواب اختصاصی']);
      const bath = [];
      if (d.iwc) bath.push(`${toFa(d.iwc)} سرویس ایرانی`);
      if (d.wc) bath.push(`${toFa(d.wc)} سرویس فرنگی`);
      if (d.ba) bath.push(`${toFa(d.ba)} حمام`);
      rows.push(['bath', 'سرویس‌های بهداشتی', bath.length ? bath.join(' · ') : 'سرویس بهداشتی مشترک']);
    }
    if (d && d.mn > 1) rows.push(['clock', 'حداقل اقامت', `${toFa(d.mn)} شب`]);
    if (!rows.length) return '';
    return `
      <section class="stay-block" id="secSpecs">
        <h2 class="stay-title">مشخصات کلی ${typeLabel(stay.type)}</h2>
        <div class="spec-list">
          ${rows.map(([icon, label, value]) => `
            <div class="spec-row">
              <span class="spec-icon">${svg(icon)}</span>
              <div><b>${label}</b><p>${value}</p></div>
            </div>`).join('')}
        </div>
      </section>`;
  }

  function amenitiesBlock(stay, d) {
    const all = (d && d.am) || [];
    if (!all.length) return '';
    const top = TOP_AMENITIES.filter(k => all.includes(k)).slice(0, 6);
    const rest = all.filter(k => !top.includes(k)).slice(0, top.length ? 6 - top.length : 6);
    const shown = [...top, ...rest].slice(0, 6);
    return `
      <section class="stay-block" id="secAmenities">
        <h2 class="stay-title">امکانات مهم ${typeLabel(stay.type)}</h2>
        <div class="amen-grid">
          ${shown.map(k => `<div class="amen-item"><span class="amen-icon">${svg(amenIcon(k))}</span><span>${amenLabel(k)}</span></div>`).join('')}
        </div>
        <button type="button" class="amen-more" data-all-amenities>مشاهده همه امکانات (${toFa(all.length)} مورد)</button>
      </section>`;
  }

  function hoursBlock(stay) {
    return `
      <section class="stay-block" id="secHours">
        <h2 class="stay-title">ساعت ورود و خروج</h2>
        <div class="hours-grid">
          <div class="hours-card">
            <span class="hours-icon">${svg('key')}</span>
            <div><small>ساعت ورود</small><b>${toFa('14:00')}</b><em>بعدازظهر</em></div>
          </div>
          <div class="hours-card">
            <span class="hours-icon">${svg('clock')}</span>
            <div><small>ساعت خروج</small><b>${toFa('12:00')}</b><em>ظهر</em></div>
          </div>
        </div>
        <details class="rule-acc">
          <summary>قوانین لغو رزرو</summary>
          <p>تا ۷۲ ساعت قبل از ورود، لغو رزرو بدون جریمه انجام می‌شود. بین ۷۲ تا ۲۴ ساعت قبل، ۳۰٪ مبلغ و کمتر از ۲۴ ساعت، ۵۰٪ مبلغ به‌عنوان جریمه کسر می‌شود. رزرو تأییدشده را فقط پشتیبانی مکانک می‌تواند لغو کند.</p>
        </details>
      </section>`;
  }

  const escText = t => String(t == null ? '' : t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function descBlock(stay) {
    const text = String(stay.desc || '').trim();
    if (!text) return '';
    return `
      <section class="stay-block" id="secDesc">
        <h2 class="stay-title">دربارهٔ این اقامتگاه</h2>
        <p class="desc-text is-clamped" data-desc>${escText(text)}</p>
        <button type="button" class="desc-toggle" data-desc-toggle aria-expanded="false">توضیحات بیشتر<span class="desc-caret" aria-hidden="true">⌄</span></button>
      </section>`;
  }

  function rulesBlock(stay, d) {
    const rules = (d && d.rw) || [];
    const items = Object.keys(RULES)
      .filter(key => key === '24h_reception' || ALLOWED_RULES.includes(key) || rules.includes(key))
      .map(key => {
        const [label, deny] = RULES[key];
        const blocked = rules.includes(key);
        const isReception = key === '24h_reception';
        const ok = isReception ? true : !blocked;
        const text = isReception ? 'پذیرش ۲۴ ساعته مهمان' : ok ? `${label} مجاز است` : `${label} ${deny}`;
        return `<li class="${ok ? 'ok' : 'no'}"><span class="rule-mark">${svg(ok ? 'check' : 'x')}</span>${text}</li>`;
      });
    items.push(`<li class="ok"><span class="rule-mark">${svg('check')}</span>همراه داشتن کارت ملی الزامی است</li>`);
    return `
      <section class="stay-block" id="secRules">
        <h2 class="stay-title">مقررات ${typeLabel(stay.type)}</h2>
        <ul class="rule-list">${items.join('')}</ul>
      </section>`;
  }

  function starsMarkup(score) {
    const pct = Math.max(0, Math.min(100, (Number(score) / 5) * 100));
    return `<span class="stars" aria-hidden="true"><span class="stars-bg">★★★★★</span><span class="stars-fill" style="width:${pct}%">★★★★★</span></span>`;
  }

  function reviewsBlock(stay, d) {
    const count = (d && d.rc) || 0;
    const score = (d && d.sc) || 0;
    const body = count
      ? `<div class="score-card">
           <div class="score-big"><b>${toFa(score.toFixed(1))}</b><span>از ۵</span></div>
           <div class="score-meta">
             ${starsMarkup(score)}
             <p>امتیاز کلی اقامتگاه در مکانک · از ${toFa(count)} نظر</p>
           </div>
         </div>`
      : `<div class="score-card"><div class="score-big"><b>—</b><span>بدون امتیاز</span></div><div class="score-meta"><p>هنوز امتیازی برای این اقامتگاه ثبت نشده است.</p></div></div>`;
    return `
      <section class="stay-block" id="secReviews">
        <h2 class="stay-title">امتیاز و نظرات</h2>
        ${body}
        <h3 class="review-sub">نظرات مهمانان مکانک</h3>
        <div class="review-list" data-review-list><p class="review-empty">در حال دریافت نظرات…</p></div>
        <form class="review-form" data-review-form>
          <b>نظر شما دربارهٔ این اقامتگاه</b>
          <div class="review-stars" data-stars>
            ${[1, 2, 3, 4, 5].map(n => `<button type="button" data-star="${n}" aria-label="${toFa(n)} ستاره">★</button>`).join('')}
          </div>
          <textarea data-review-body rows="3" maxlength="700" placeholder="تجربهٔ اقامت خود را بنویسید (اختیاری)"></textarea>
          <p class="review-msg" data-review-msg hidden></p>
          <button type="submit" class="review-submit" data-review-submit>ثبت نظر</button>
        </form>
      </section>`;
  }

  function amenityModal(d, stay) {
    const all = (d && d.am) || [];
    const groups = {};
    all.forEach(k => {
      const cat = AMENITY_GROUP[k] || 'سایر امکانات';
      (groups[cat] = groups[cat] || []).push(k);
    });
    return `
      <div class="amen-modal" data-amen-modal hidden>
        <div class="amen-modal-backdrop" data-close-amen></div>
        <div class="amen-sheet" role="dialog" aria-modal="true" aria-label="همه امکانات">
          <div class="amen-sheet-head">
            <b>همه امکانات ${typeLabel(stay.type)}</b>
            <button type="button" class="amen-sheet-close" data-close-amen aria-label="بستن">✕</button>
          </div>
          <div class="amen-sheet-body">
            ${Object.keys(groups).map(cat => `
              <div class="amen-group">
                <h4>${cat}</h4>
                <ul>${groups[cat].map(k => `<li><span class="amen-icon">${svg(amenIcon(k))}</span>${amenLabel(k)}</li>`).join('')}</ul>
              </div>`).join('')}
          </div>
        </div>
      </div>`;
  }

  const AMENITY_GROUP = {
    'water': 'رفاه', 'electric': 'رفاه', 'gas': 'رفاه', 'air-conditioning-system': 'رفاه', 'heating-system': 'رفاه',
    'refrigerator': 'آشپزخانه', 'gas-stove': 'آشپزخانه', 'food-serving-equipment': 'آشپزخانه', 'cooking-appliances': 'آشپزخانه',
    'kitchen': 'آشپزخانه', 'cabinet': 'آشپزخانه', 'dining-table': 'آشپزخانه', 'kettle': 'آشپزخانه', 'microwave': 'آشپزخانه',
    'coffee-maker': 'آشپزخانه', 'dishwasher': 'آشپزخانه', 'electric-pot': 'آشپزخانه', 'home-water-purification-system': 'آشپزخانه',
    'tv': 'سرگرمی و رفاه', 'sound-system': 'سرگرمی و رفاه', 'internet-wifi': 'سرگرمی و رفاه', 'sofa': 'سرگرمی و رفاه',
    'billiard': 'سرگرمی و رفاه', 'table-football': 'سرگرمی و رفاه', 'console-games': 'سرگرمی و رفاه', 'ping-pong': 'سرگرمی و رفاه',
    'book': 'سرگرمی و رفاه', 'swimming-pool': 'آب و تفریح', 'jacuzzi': 'آب و تفریح', 'sauna': 'آب و تفریح',
    'bathroom': 'سرویس بهداشتی', 'wc': 'سرویس بهداشتی', 'pwc': 'سرویس بهداشتی', 'washing-machine': 'سرویس بهداشتی',
    'hairdryer': 'سرویس بهداشتی', 'iron': 'سرویس بهداشتی', 'ironing-amenities': 'سرویس بهداشتی',
    'parking': 'ساختمان و محوطه', 'elevator': 'ساختمان و محوطه', 'balcony': 'ساختمان و محوطه', 'barbeque': 'ساختمان و محوطه',
    'greenery': 'ساختمان و محوطه', 'gazebo': 'ساختمان و محوطه', 'lobby': 'ساختمان و محوطه', 'prayer-room': 'ساختمان و محوطه',
    'restaurant': 'ساختمان و محوطه', 'shop': 'ساختمان و محوطه', 'coffee-shop': 'ساختمان و محوطه', 'taxi': 'ساختمان و محوطه',
    'atm': 'ساختمان و محوطه', 'room-city-view': 'ساختمان و محوطه', 'room-sea-view': 'ساختمان و محوطه',
    'room-mountain-forest-view': 'ساختمان و محوطه', 'room-yard-view': 'ساختمان و محوطه',
    'surveillance-camera': 'ایمنی', 'guard': 'ایمنی', 'fire-extinguisher': 'ایمنی', 'fire-extinguishing-system': 'ایمنی',
    'first-aid-kit': 'ایمنی', 'mobile-network-coverage': 'ایمنی',
    'vacuum-cleaner': 'سایر امکانات', 'wardrobe-drawer': 'سایر امکانات', 'ventilation-system': 'سایر امکانات',
    'telephone': 'سایر امکانات', 'dry-cleaning': 'سایر امکانات', 'iranian-digital-receiver': 'سایر امکانات',
    'daily-housekeeping': 'سایر امکانات', 'meal-service': 'سایر امکانات', 'periodic-spraying': 'سایر امکانات'
  };

  function mount(root, stay, d) {
    if (!root || !stay) return;
    root.innerHTML = [
      specsBlock(stay, d),
      amenitiesBlock(stay, d),
      hoursBlock(stay),
      descBlock(stay),
      rulesBlock(stay, d),
      reviewsBlock(stay, d)
    ].join('');

    // ---- description: jabama-style clamp + «توضیحات بیشتر» ----
    const descEl = root.querySelector('[data-desc]');
    const descBtn = root.querySelector('[data-desc-toggle]');
    if (descEl && descBtn) {
      requestAnimationFrame(() => {
        const overflowing = descEl.scrollHeight - descEl.clientHeight > 2;
        if (!overflowing) {
          descEl.classList.remove('is-clamped');
          descBtn.hidden = true;
        }
      });
      descBtn.addEventListener('click', () => {
        const clamped = descEl.classList.toggle('is-clamped');
        descBtn.setAttribute('aria-expanded', String(!clamped));
        descBtn.innerHTML = clamped
          ? 'توضیحات بیشتر<span class="desc-caret" aria-hidden="true">⌄</span>'
          : 'بستن توضیحات<span class="desc-caret" aria-hidden="true">⌃</span>';
      });
    }

    if (d && d.am && d.am.length) {
      document.body.insertAdjacentHTML('beforeend', amenityModal(d, stay));
      const modal = document.querySelector('[data-amen-modal]');
      const openModal = () => { modal.hidden = false; document.body.style.overflow = 'hidden'; };
      const closeModal = () => { modal.hidden = true; document.body.style.overflow = ''; };
      const opener = root.querySelector('[data-all-amenities]');
      if (opener) opener.addEventListener('click', openModal);
      modal.querySelectorAll('[data-close-amen]').forEach(el => el.addEventListener('click', closeModal));
      document.addEventListener('keydown', e => { if (e.key === 'Escape' && !modal.hidden) closeModal(); });
    }

    // ---- reviews ----
    const list = root.querySelector('[data-review-list]');
    const form = root.querySelector('[data-review-form]');
    const msg = root.querySelector('[data-review-msg]');
    const starBox = root.querySelector('[data-stars]');
    let rating = 5;
    const paintStars = () => starBox.querySelectorAll('[data-star]').forEach(b => b.classList.toggle('on', Number(b.dataset.star) <= rating));
    paintStars();
    starBox.querySelectorAll('[data-star]').forEach(b => b.addEventListener('click', () => { rating = Number(b.dataset.star); paintStars(); }));
    const setMsg = (text, kind) => { msg.textContent = text; msg.hidden = !text; msg.className = 'review-msg ' + (kind || ''); };

    const esc = t => String(t == null ? '' : t).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const renderList = payload => {
      const items = (payload && payload.reviews) || [];
      if (!items.length) {
        list.innerHTML = `<p class="review-empty">هنوز نظری از مهمانان مکانک ثبت نشده است. اولین نظر را شما بنویسید.</p>`;
        return;
      }
      list.innerHTML = items.map(r => `
        <article class="review-item">
          <div class="review-head">
            <b>${esc(r.author || 'مهمان مکانک')}</b>
            <span class="review-score">${starsMarkup(Number(r.rating))}<em>${toFa(Number(r.rating).toFixed(1))}</em></span>
          </div>
          ${r.verified_stay ? '<span class="chip chip-ok">اقامت تاییدشده</span>' : ''}
          ${r.body ? `<p>${esc(r.body)}</p>` : ''}
        </article>`).join('');
    };

    const api = window.makanakAuth && window.makanakAuth.api;
    const load = async () => {
      if (!api) { list.innerHTML = '<p class="review-empty">دریافت نظرات ممکن نشد.</p>'; return; }
      try {
        renderList(await api('/reviews?stay_id=' + encodeURIComponent(stay.id)));
      } catch (err) {
        list.innerHTML = '<p class="review-empty">دریافت نظرات ممکن نشد.</p>';
      }
    };
    load();

    form.addEventListener('submit', async e => {
      e.preventDefault();
      setMsg('');
      const body = root.querySelector('[data-review-body]').value.trim();
      if (body && body.length < 10) { setMsg('متن نظر باید حداقل ۱۰ کاراکتر باشد.', 'is-error'); return; }
      const auth = window.makanakAuth;
      if (!auth || !auth.requireLogin) { setMsg('برای ثبت نظر وارد حساب کاربری شوید.', 'is-error'); return; }
      const btn = root.querySelector('[data-review-submit]');
      const label = btn.textContent;
      try {
        const ok = await auth.requireLogin();
        if (!ok) return;
        btn.disabled = true; btn.textContent = 'در حال ثبت…';
        await auth.api('/reviews', { method: 'POST', body: JSON.stringify({ stay_id: stay.id, rating, body }) });
        root.querySelector('[data-review-body]').value = '';
        setMsg('نظر شما ثبت شد. ممنون!', 'is-ok');
        await load();
      } catch (err) {
        setMsg(err && err.message ? err.message : 'ثبت نظر ممکن نشد.', 'is-error');
      } finally {
        btn.disabled = false; btn.textContent = label;
      }
    });
  }

  window.MakanakSections = { mount };
})();
