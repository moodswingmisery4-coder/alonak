(() => {
  'use strict';
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const API = (...args) => window.alonakAuth.api(...args);
  const STAYS = window.ALONAK_STAYS || [];
  const BY_ID = new Map(STAYS.map(s => [s.id, s]));
  const FAV_KEY = 'alonak_favorites';

  const fa = v => String(v ?? '').replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
  const money = v => fa(String(Math.round(Number(v) || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, ','));
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const isoDate = iso => {
    if (!iso) return '—';
    try { return new Intl.DateTimeFormat('fa-IR-u-ca-persian', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(String(iso).slice(0, 10) + 'T00:00:00')); }
    catch { return iso; }
  };
  const shortDate = iso => {
    if (!iso) return '—';
    try { return new Intl.DateTimeFormat('fa-IR-u-ca-persian', { day: 'numeric', month: 'short' }).format(new Date(String(iso).slice(0, 10) + 'T00:00:00')); }
    catch { return iso; }
  };
  const todayIso = () => new Date(Date.now() + 3.5 * 3600 * 1000).toISOString().slice(0, 10);
  const nightsOf = b => Number(b.nights) || Math.max(1, Math.round((new Date(b.check_out) - new Date(b.check_in)) / 86400000));
  const isUpcoming = b => b.status !== 'cancelled' && String(b.check_out).slice(0, 10) >= todayIso();
  const isPast = b => String(b.check_out).slice(0, 10) < todayIso();
  const daysUntil = iso => Math.round((new Date(String(iso).slice(0, 10) + 'T00:00:00') - new Date(todayIso() + 'T00:00:00')) / 86400000);
  const stayOf = b => BY_ID.get(String(b.stay_id)) || null;
  const photoOf = b => { const s = stayOf(b); return s && s.img ? s.img : ''; };
  const stayLink = b => 'stay.html?id=' + encodeURIComponent(b.stay_id);
  const toast = t => { const el = $('#toast'); if (!el) return; el.textContent = t; el.classList.remove('hidden'); clearTimeout(window.__toast); window.__toast = setTimeout(() => el.classList.add('hidden'), 3000); };

  const STATUS = {
    pending: { label: 'در انتظار تایید', cls: 'chip chip-wait' },
    confirmed: { label: 'تایید شده', cls: 'chip chip-ok' },
    cancelled: { label: 'لغو شده', cls: 'chip chip-muted' }
  };
  const chip = b => { const s = STATUS[b.status] || STATUS.pending; return `<span class="${s.cls}">${s.label}</span>`; };

  let user = null;
  let bookings = [];
  let tickets = [];
  let emailReady = false;
  let route = 'overview';
  let bookingFilter = 'all';

  const views = ['overview', 'bookings', 'favorites', 'profile', 'security', 'support'];

  function readFavorites() {
    try {
      const list = JSON.parse(localStorage.getItem(FAV_KEY) || localStorage.getItem('makanak_favorites') || '[]');
      return new Set((Array.isArray(list) ? list : []).map(Number).filter(n => Number.isInteger(n) && n >= 0 && n < STAYS.length));
    } catch { return new Set(); }
  }
  function writeFavorites(set) {
    try { localStorage.setItem(FAV_KEY, JSON.stringify(Array.from(set))); } catch {}
  }

  function show(view) {
    if (!views.includes(view)) view = 'overview';
    route = view;
    views.forEach(v => { const el = $('#view-' + v); if (el) el.classList.toggle('hidden', v !== view); });
    $$('#acctNav button').forEach(b => b.setAttribute('aria-current', String(b.dataset.view === view)));
    if (location.hash !== '#' + view) history.replaceState(null, '', '#' + view);
    render();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function render() {
    if (route === 'overview') renderOverview();
    if (route === 'bookings') renderBookings();
    if (route === 'favorites') renderFavorites();
    if (route === 'profile') renderProfile();
    if (route === 'security') renderSecurity();
    if (route === 'support') renderSupport();
    paintCounters();
  }

  function paintCounters() {
    const nb = $('#navBookingsCount'), nf = $('#navFavCount');
    if (nb) nb.textContent = fa(bookings.filter(b => b.status !== 'cancelled').length);
    if (nf) nf.textContent = fa(readFavorites().size);
    if ($('#acctName')) $('#acctName').textContent = user ? (user.name || 'کاربر آلونک') : '—';
    if ($('#acctEmail')) $('#acctEmail').textContent = user ? user.email : '—';
    if ($('#acctAvatar')) $('#acctAvatar').textContent = user && (user.name || user.email) ? String(user.name || user.email).trim().charAt(0) : '—';
  }

  /* ---------------- views ---------------- */

  function renderOverview() {
    const active = bookings.filter(b => b.status !== 'cancelled');
    const upcoming = active.filter(isUpcoming).sort((a, b) => String(a.check_in).localeCompare(String(b.check_in)));
    const next = upcoming[0] || null;
    const nights = active.filter(isUpcoming).reduce((sum, b) => sum + nightsOf(b), 0);
    const total = active.reduce((sum, b) => sum + Number(String(b.price || 0).replace(/[^\d.-]/g, '') || 0), 0);
    const favs = readFavorites().size;
    const name = (user && user.name) ? String(user.name).split(' ')[0] : 'مسافر';

    const hero = next ? (() => {
      const stay = stayOf(next);
      const img = photoOf(next) || 'assets/images/photo-1600607687939-ce8a6c25118c-large.jpg';
      const d = daysUntil(next.check_in);
      const when = d > 0 ? `${fa(d)} روز مانده تا سفر` : d === 0 ? 'امروز وارد می‌شوید' : 'در حال سفر';
      return `<div class="acct-trip"><img class="acct-trip-img" src="${esc(img)}" alt="${esc(next.stay_name)}" loading="lazy"><div class="acct-trip-body"><div class="acct-chips"><button type="button" aria-pressed="true" style="pointer-events:none">${when}</button>${chip(next)}</div><h3>${esc(next.stay_name)}</h3><div class="acct-meta"><span>${esc(next.city || '')}</span><span>${isoDate(next.check_in)} تا ${isoDate(next.check_out)}</span><span><b>${fa(nightsOf(next))}</b> شب · <b>${fa(next.guests)}</b> نفر</span></div><div class="acct-actions"><a class="acct-btn primary" href="${stayLink(next)}">جزئیات اقامتگاه</a><button type="button" class="acct-btn ghost" data-goto="bookings">مدیریت رزرو</button></div></div></div>`;
    })() : `<div class="acct-card"><h2>سفر بعدی شما</h2><div class="acct-empty"><span class="glyph">🧳</span>هنوز سفر پیش‌رویی ثبت نشده است.<div class="acct-actions" style="justify-content:center;margin-top:12px"><a class="acct-btn primary" href="index.html#stays">جستجوی اقامتگاه</a></div></div></div>`;

    const recent = bookings.slice(0, 3).map(b => `
      <div class="bk-card slim">
        <img class="bk-thumb" src="${esc(photoOf(b) || '')}" alt="" loading="lazy">
        <div class="bk-body"><div class="bk-top"><b>${esc(b.stay_name)}</b>${chip(b)}</div>
        <div class="acct-meta"><span>${esc(b.city || '')}</span><span>${shortDate(b.check_in)} تا ${shortDate(b.check_out)}</span><span><b>${money(b.price)}</b> تومان</span></div></div>
      </div>`).join('') || `<div class="acct-empty"><span class="glyph">📄</span>هنوز رزروی ثبت نکرده‌اید.</div>`;

    $('#view-overview').innerHTML = `
      <div class="acct-head"><div><h1>سلام ${esc(name)} 👋</h1><p>یک نگاه سریع به رزروها و حساب شما</p></div>
        <div class="acct-actions"><a class="acct-btn" href="index.html#stays">رزرو اقامتگاه جدید</a></div></div>
      ${hero}
      <div class="acct-stats">
        <div class="acct-stat"><span>رزرو پیش‌رو</span><b>${fa(upcoming.length)}<em>رزرو</em></b></div>
        <div class="acct-stat"><span>شب‌های رزروشده</span><b>${fa(nights)}<em>شب</em></b></div>
        <div class="acct-stat"><span>مجموع مبلغ رزروها</span><b>${money(total)}<em>تومان</em></b></div>
        <div class="acct-stat"><span>علاقه‌مندی‌ها</span><b>${fa(favs)}<em>اقامتگاه</em></b></div>
      </div>
      <div class="acct-card"><h2>رزروهای اخیر <small>${fa(bookings.length)} رزرو</small></h2>${recent}
        ${bookings.length ? '<div class="acct-actions" style="margin-top:12px"><button type="button" class="acct-btn" data-goto="bookings">مشاهده همه رزروها</button></div>' : ''}
      </div>`;

    $$('[data-goto]', $('#view-overview')).forEach(b => b.onclick = () => show(b.dataset.goto));
  }

  function renderBookings() {
    const counts = {
      all: bookings.length,
      pending: bookings.filter(b => b.status === 'pending').length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length,
      past: bookings.filter(isPast).length
    };
    const filterLabel = { all: 'همه', pending: 'در انتظار تایید', confirmed: 'تایید شده', cancelled: 'لغو شده', past: 'سفرهای گذشته' };
    let list = bookings.slice();
    if (bookingFilter === 'past') list = list.filter(isPast);
    else if (bookingFilter !== 'all') list = list.filter(b => b.status === bookingFilter);
    list.sort((a, b) => String(b.check_in).localeCompare(String(a.check_in)));

    const chips = Object.keys(filterLabel).map(k =>
      `<button type="button" data-filter="${k}" aria-pressed="${bookingFilter === k}">${filterLabel[k]} (${fa(counts[k])})</button>`).join('');

    const cards = list.map(b => {
      const n = nightsOf(b);
      const perNight = n ? Math.round(Number(String(b.price || 0).replace(/[^\d.-]/g, '') || 0) / n) : 0;
      const canCancel = b.status === 'pending' && !isPast(b);
      const canReview = b.status === 'confirmed' && isPast(b);
      return `<div class="bk-card" data-booking="${esc(b.id)}">
        <img class="bk-thumb" src="${esc(photoOf(b) || '')}" alt="${esc(b.stay_name)}" loading="lazy">
        <div class="bk-body">
          <div class="bk-top"><div><b>${esc(b.stay_name)}</b><div class="bk-code">کد رزرو: ${esc(String(b.id).slice(0, 8).toUpperCase())}</div></div>${chip(b)}</div>
          <div class="acct-meta"><span>${esc(b.city || '')}</span><span>${isoDate(b.check_in)} تا ${isoDate(b.check_out)}</span><span><b>${fa(n)}</b> شب · <b>${fa(b.guests)}</b> نفر</span></div>
          <div class="acct-actions">
            <b style="font-size:.9rem">${money(b.price)} تومان</b>
            <a class="acct-btn ghost" href="${stayLink(b)}">مشاهده اقامتگاه</a>
            <button type="button" class="acct-btn ghost" data-detail="${esc(b.id)}">جزئیات رزرو</button>
            ${canCancel ? `<button type="button" class="acct-btn ghost" data-cancel="${esc(b.id)}" style="color:#dc2626;border-color:#fecaca">لغو رزرو</button>` : ''}
            ${canReview ? `<button type="button" class="acct-btn ghost" data-review="${esc(b.id)}">ثبت نظر</button>` : ''}
          </div>
          <div class="bk-detail hidden" id="detail-${esc(b.id)}">
            <div><span>تاریخ ورود</span><b>${isoDate(b.check_in)}</b></div>
            <div><span>تاریخ خروج</span><b>${isoDate(b.check_out)}</b></div>
            <div><span>مدت اقامت</span><b>${fa(n)} شب</b></div>
            <div><span>تعداد مهمان</span><b>${fa(b.guests)} نفر</b></div>
            <div><span>میانگین هر شب</span><b>${money(perNight)} تومان</b></div>
            <div><span>مبلغ کل</span><b>${money(b.price)} تومان</b></div>
            <div><span>وضعیت</span><b>${(STATUS[b.status] || STATUS.pending).label}</b></div>
            <div><span>تاریخ ثبت</span><b>${isoDate(b.created_at)}</b></div>
          </div>
          <div class="hidden" id="review-${esc(b.id)}"></div>
        </div>
      </div>`;
    }).join('') || `<div class="acct-card"><div class="acct-empty"><span class="glyph">📄</span>رزروی در این دسته وجود ندارد.<div class="acct-actions" style="justify-content:center;margin-top:12px"><a class="acct-btn primary" href="index.html#stays">جستجوی اقامتگاه</a></div></div></div>`;

    $('#view-bookings').innerHTML = `
      <div class="acct-head"><div><h1>رزروهای من</h1><p>وضعیت، جزئیات و مدیریت رزروها</p></div></div>
      <div class="acct-chips">${chips}</div>
      <div>${cards}</div>`;

    $$('[data-filter]', $('#view-bookings')).forEach(b => b.onclick = () => { bookingFilter = b.dataset.filter; renderBookings(); });
    $$('[data-detail]', $('#view-bookings')).forEach(b => b.onclick = () => {
      const box = $('#detail-' + b.dataset.detail);
      if (!box) return;
      box.classList.toggle('hidden');
      b.textContent = box.classList.contains('hidden') ? 'جزئیات رزرو' : 'بستن جزئیات';
    });
    $$('[data-cancel]', $('#view-bookings')).forEach(b => b.onclick = () => cancelBooking(b));
    $$('[data-review]', $('#view-bookings')).forEach(b => b.onclick = () => openReview(b));
  }

  function renderFavorites() {
    const favs = readFavorites();
    const items = Array.from(favs).map(i => ({ idx: i, stay: STAYS[i] })).filter(x => x.stay);
    const grid = items.map(({ idx, stay }) => `
      <div class="fav-card">
        <button type="button" class="fav-del" data-unfav="${idx}" aria-label="حذف ${esc(stay.name)} از علاقه‌مندی‌ها"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"/></svg></button>
        <a href="stay.html?id=${encodeURIComponent(stay.id)}"><img src="${esc(stay.img)}" alt="${esc(stay.name)}" loading="lazy"></a>
        <div class="fav-body">
          <h3><a href="stay.html?id=${encodeURIComponent(stay.id)}">${esc(stay.name)}</a></h3>
          <p>${esc(stay.city || '')}</p>
          <p style="margin-top:6px"><b style="color:var(--ink)">${money(stay.price)} تومان</b> / هر شب</p>
        </div>
      </div>`).join('');

    $('#view-favorites').innerHTML = `
      <div class="acct-head"><div><h1>علاقه‌مندی‌ها</h1><p>اقامتگاه‌هایی که ذخیره کرده‌اید</p></div></div>
      ${items.length ? `<div class="fav-grid">${grid}</div>` : `<div class="acct-card"><div class="acct-empty"><span class="glyph">♡</span>هنوز اقامتگاهی را ذخیره نکرده‌اید.<div class="acct-actions" style="justify-content:center;margin-top:12px"><a class="acct-btn primary" href="index.html#stays">دیدن اقامتگاه‌ها</a></div></div></div>`}`;

    $$('[data-unfav]', $('#view-favorites')).forEach(b => b.onclick = () => {
      const set = readFavorites();
      set.delete(Number(b.dataset.unfav));
      writeFavorites(set);
      toast('از علاقه‌مندی‌ها حذف شد');
      renderFavorites(); paintCounters();
    });
  }

  function renderProfile() {
    const rawPhone = user && user.phone ? String(user.phone) : '';
    const phoneValue = /[۰-۹]/.test(rawPhone) ? rawPhone : fa(rawPhone);
    $('#view-profile').innerHTML = `
      <div class="acct-head"><div><h1>اطلاعات حساب</h1><p>نام و شماره تماس خود را به‌روز نگه دارید</p></div></div>
      <div class="acct-card">
        <h2>مشخصات</h2>
        <form id="profileForm">
          <div class="acct-field"><label for="pfName">نام و نام خانوادگی</label><input id="pfName" name="name" value="${esc(user.name || '')}" placeholder="مثلاً سهیل محمدی" required minlength="2" maxlength="60"></div>
          <div class="acct-field"><label for="pfPhone">شماره موبایل</label><input id="pfPhone" name="phone" value="${esc(phoneValue)}" placeholder="۰۹۱۲۱۲۳۴۵۶۷" inputmode="numeric" dir="ltr"></div>
          <div class="acct-field"><label for="pfEmail">ایمیل (نام کاربری)</label><input id="pfEmail" value="${esc(user.email || '')}" dir="ltr" disabled></div>
          <div class="acct-hint">ایمیل حساب قابل تغییر نیست؛ برای تغییر آن با پشتیبانی در ارتباط باشید.${user.created_at ? ' عضویت از ' + isoDate(user.created_at) + '.' : ''}</div>
          <div class="acct-actions"><button type="submit" class="acct-btn primary">ذخیره تغییرات</button></div>
          <p class="acct-msg" id="profileMsg"></p>
        </form>
      </div>`;

    const form = $('#profileForm'), msg = $('#profileMsg');
    form.onsubmit = async e => {
      e.preventDefault();
      const btn = form.querySelector('button[type=submit]');
      btn.disabled = true; btn.textContent = 'در حال ذخیره…';
      msg.className = 'acct-msg'; msg.textContent = '';
      try {
        const d = await API('/auth/me', { method: 'PATCH', body: JSON.stringify({ name: form.name.value.trim(), phone: form.phone.value.trim() }) });
        user = d.user || user;
        window.alonakAuth.refresh();
        paintCounters();
        msg.className = 'acct-msg ok'; msg.textContent = 'اطلاعات حساب ذخیره شد.';
        toast('اطلاعات حساب ذخیره شد');
      } catch (err) {
        msg.className = 'acct-msg err'; msg.textContent = err.message || 'ذخیره نشد؛ دوباره تلاش کنید.';
      } finally { btn.disabled = false; btn.textContent = 'ذخیره تغییرات'; }
    };
  }

  function renderSecurity() {
    const verified = Boolean(user && Number(user.verified));
    const verifyBox = verified
      ? `<div class="acct-note ok">✓ ایمیل <span dir="ltr">${esc(user.email)}</span> تایید شده است.</div>`
      : `<div class="acct-note warn">! ایمیل شما هنوز تایید نشده است. با تایید ایمیل، امنیت حساب و پیگیری رزروها ساده‌تر می‌شود.</div>
         ${emailReady ? '' : '<div class="acct-hint" style="margin-top:8px">سرویس ارسال ایمیل در حال حاضر در دسترس نیست؛ ارسال کد تایید موقتاً غیرفعال است.</div>'}
         <div class="acct-actions" style="margin-top:10px">
           <button type="button" class="acct-btn primary" id="verifyRequest" ${emailReady ? '' : 'disabled'}>ارسال کد تایید</button>
         </div>
         <div id="verifyForm" class="hidden" style="margin-top:10px">
           <div class="acct-field"><label for="verifyCode">کد ۶ رقمی ارسال‌شده به ایمیل</label><input id="verifyCode" inputmode="numeric" maxlength="6" dir="ltr" placeholder="------"></div>
           <div class="acct-actions"><button type="button" class="acct-btn primary" id="verifyConfirm">تایید ایمیل</button></div>
         </div>
         <p class="acct-msg" id="verifyMsg"></p>`;

    $('#view-security').innerHTML = `
      <div class="acct-head"><div><h1>امنیت حساب</h1><p>ایمیل و رمز عبور خود را مدیریت کنید</p></div></div>
      <div class="acct-card"><h2>تایید ایمیل</h2>${verifyBox}</div>
      <div class="acct-card">
        <h2>تغییر رمز عبور</h2>
        <form id="passwordForm">
          <div class="acct-field"><label for="pwCurrent">رمز فعلی</label><input id="pwCurrent" name="current" type="password" required dir="ltr" autocomplete="current-password"></div>
          <div class="acct-field"><label for="pwNext">رمز جدید (حداقل ۸ کاراکتر)</label><input id="pwNext" name="next" type="password" required minlength="8" dir="ltr" autocomplete="new-password"></div>
          <div class="acct-field"><label for="pwRepeat">تکرار رمز جدید</label><input id="pwRepeat" name="repeat" type="password" required minlength="8" dir="ltr" autocomplete="new-password"></div>
          <div class="acct-actions"><button type="submit" class="acct-btn primary">تغییر رمز</button></div>
          <p class="acct-msg" id="passwordMsg"></p>
          <div class="acct-hint">بعد از تغییر رمز، سایر دستگاه‌ها از حساب خارج می‌شوند.</div>
        </form>
      </div>`;

    const verifyBtn = $('#verifyRequest');
    if (verifyBtn) {
      const msg = $('#verifyMsg');
      verifyBtn.onclick = async () => {
        verifyBtn.disabled = true; verifyBtn.textContent = 'در حال ارسال…';
        try {
          const d = await API('/auth/verify/request', { method: 'POST', body: JSON.stringify({}) });
          msg.className = 'acct-msg ok'; msg.textContent = d.message || 'کد تایید ارسال شد.';
          $('#verifyForm').classList.remove('hidden');
        } catch (err) {
          msg.className = 'acct-msg err'; msg.textContent = err.message;
          verifyBtn.disabled = false;
        } finally { verifyBtn.textContent = 'ارسال کد تایید'; }
      };
      $('#verifyConfirm').onclick = async e => {
        const btn = e.currentTarget;
        btn.disabled = true;
        try {
          await API('/auth/verify/confirm', { method: 'POST', body: JSON.stringify({ code: $('#verifyCode').value.trim() }) });
          user.verified = 1;
          toast('ایمیل شما تایید شد');
          renderSecurity();
        } catch (err) { msg.className = 'acct-msg err'; msg.textContent = err.message; }
        finally { btn.disabled = false; }
      };
    }

    const form = $('#passwordForm'), msg = $('#passwordMsg');
    form.onsubmit = async e => {
      e.preventDefault();
      msg.className = 'acct-msg'; msg.textContent = '';
      if (form.next.value !== form.repeat.value) { msg.className = 'acct-msg err'; msg.textContent = 'رمز جدید و تکرار آن یکسان نیست.'; return; }
      const btn = form.querySelector('button[type=submit]');
      btn.disabled = true; btn.textContent = 'در حال تغییر…';
      try {
        await API('/auth/password', { method: 'POST', body: JSON.stringify({ current: form.current.value, next: form.next.value }) });
        form.reset();
        msg.className = 'acct-msg ok'; msg.textContent = 'رمز عبور تغییر کرد.';
        toast('رمز عبور تغییر کرد');
      } catch (err) { msg.className = 'acct-msg err'; msg.textContent = err.message; }
      finally { btn.disabled = false; btn.textContent = 'تغییر رمز'; }
    };
  }

  function renderSupport() {
    const tks = tickets.map(t => {
      const label = t.status === 'answered' ? 'پاسخ داده شده' : t.status === 'closed' ? 'بسته شده' : 'در انتظار پاسخ';
      const cls = t.status === 'answered' ? 'chip chip-ok' : t.status === 'closed' ? 'chip chip-muted' : 'chip chip-wait';
      return `<div class="ticket">
        <div class="ticket-head"><span>${esc(t.subject)}</span><span class="${cls}">${label}</span></div>
        <p>${esc(t.body)}</p>
        <div class="acct-hint">ارسال: ${isoDate(t.created_at)}</div>
        ${t.reply ? `<div class="reply"><b>پاسخ پشتیبانی:</b><br>${esc(t.reply)}</div>` : ''}
      </div>`;
    }).join('') || `<div class="acct-empty"><span class="glyph">💬</span>هنوز پیامی برای پشتیبانی نفرستاده‌اید.</div>`;

    $('#view-support').innerHTML = `
      <div class="acct-head"><div><h1>پشتیبانی</h1><p>سؤال یا مشکلی دارید؟ برایمان بنویسید</p></div></div>
      <div class="acct-card">
        <h2>ارسال پیام به پشتیبانی</h2>
        <form id="supportForm">
          <div class="acct-field"><label for="spSubject">موضوع</label><input id="spSubject" name="subject" required minlength="3" maxlength="80" placeholder="مثلاً مشکل در رزرو"></div>
          <div class="acct-field"><label for="spBody">متن پیام</label><textarea id="spBody" name="body" rows="4" required minlength="5" maxlength="1000" placeholder="جزئیات را بنویسید…"></textarea></div>
          <div class="acct-actions"><button type="submit" class="acct-btn primary">ارسال پیام</button></div>
          <p class="acct-msg" id="supportMsg"></p>
        </form>
      </div>
      <div class="acct-card"><h2>پیام‌های من <small>${fa(tickets.length)} پیام</small></h2>${tks}</div>
      <div class="acct-card"><h2>پرسش‌های پرتکرار</h2>
        <details class="faq"><summary>چطور رزرو خود را لغو کنم؟</summary><p>از بخش «رزروهای من» و روی کارت رزرو، دکمه «لغو رزرو» را بزنید. رزروهای در انتظار تایید تا قبل از تاریخ ورود قابل لغو هستند.</p></details>
        <details class="faq"><summary>پرداخت چگونه انجام می‌شود؟</summary><p>در نسخه فعلی آلونک، رزروها به‌صورت درخواست ثبت می‌شوند و تیم پشتیبانی برای هماهنگی پرداخت و تایید نهایی با شما تماس می‌گیرد.</p></details>
        <details class="faq"><summary>چرا باید ایمیل‌ام را تایید کنم؟</summary><p>تایید ایمیل از بخش «امنیت حساب» انجام می‌شود و برای بازیابی رمز عبور و دریافت اطلاع‌رسانی رزروها لازم است.</p></details>
        <details class="faq"><summary>چطور نظر ثبت کنم؟</summary><p>پس از پایان سفر، در کارت رزرو دکمه «ثبت نظر» فعال می‌شود و می‌توانید امتیاز و تجربه خود را ثبت کنید.</p></details>
      </div>`;

    const form = $('#supportForm'), msg = $('#supportMsg');
    form.onsubmit = async e => {
      e.preventDefault();
      const btn = form.querySelector('button[type=submit]');
      btn.disabled = true; btn.textContent = 'در حال ارسال…';
      msg.className = 'acct-msg'; msg.textContent = '';
      try {
        await API('/support', { method: 'POST', body: JSON.stringify({ subject: form.subject.value.trim(), body: form.body.value.trim() }) });
        form.reset();
        tickets = (await API('/support')).tickets || tickets;
        renderSupport();
        toast('پیام شما ثبت شد؛ به‌زودی پاسخ می‌دهیم');
      } catch (err) {
        msg.className = 'acct-msg err'; msg.textContent = err.message || 'ارسال نشد؛ دوباره تلاش کنید.';
        btn.disabled = false; btn.textContent = 'ارسال پیام';
      }
    };
  }

  /* ---------------- actions ---------------- */

  async function cancelBooking(btn) {
    const id = btn.dataset.cancel;
    if (!confirm('این رزرو لغو شود؟ این کار قابل بازگشت نیست.')) return;
    btn.disabled = true; btn.textContent = 'در حال لغو…';
    try {
      await API('/bookings/' + encodeURIComponent(id), { method: 'DELETE' });
      bookings = bookings.map(b => b.id === id ? { ...b, status: 'cancelled' } : b);
      toast('رزرو لغو شد');
      renderBookings(); paintCounters();
    } catch (err) {
      toast(err.message);
      btn.disabled = false; btn.textContent = 'لغو رزرو';
    }
  }

  function openReview(btn) {
    const id = btn.dataset.review;
    const booking = bookings.find(b => b.id === id);
    const box = $('#review-' + id);
    if (!booking || !box) return;
    if (!box.classList.contains('hidden')) { box.classList.add('hidden'); return; }
    let rating = 5;
    box.classList.remove('hidden');
    box.innerHTML = `<div style="border-top:1px dashed var(--line);margin-top:10px;padding-top:10px">
      <div class="acct-field"><label>امتیاز شما به این اقامتگاه</label><div class="stars" id="stars-${esc(id)}">${[1,2,3,4,5].map(n => `<button type="button" data-star="${n}" aria-pressed="${n <= rating}" aria-label="${n} ستاره">★</button>`).join('')}</div></div>
      <div class="acct-field"><label>تجربه‌تان را بنویسید (اختیاری)</label><textarea id="reviewBody-${esc(id)}" rows="3" maxlength="700" placeholder="نظافت، برخورد میزبان، موقعیت…"></textarea></div>
      <div class="acct-actions"><button type="button" class="acct-btn primary" id="reviewSend-${esc(id)}">ارسال نظر</button></div>
      <p class="acct-msg" id="reviewMsg-${esc(id)}"></p></div>`;
    const stars = $$('[data-star]', box);
    stars.forEach(s => s.onclick = () => {
      rating = Number(s.dataset.star);
      stars.forEach(x => x.setAttribute('aria-pressed', String(Number(x.dataset.star) <= rating)));
    });
    $('#reviewSend-' + id).onclick = async () => {
      const sendBtn = $('#reviewSend-' + id), msg = $('#reviewMsg-' + id);
      sendBtn.disabled = true; sendBtn.textContent = 'در حال ارسال…';
      try {
        await API('/reviews', { method: 'POST', body: JSON.stringify({ stay_id: booking.stay_id, rating: rating, body: $('#reviewBody-' + id).value.trim() }) });
        msg.className = 'acct-msg ok'; msg.textContent = 'نظر شما ثبت شد. ممنون!';
        sendBtn.textContent = 'ثبت شد';
        toast('نظر شما ثبت شد');
      } catch (err) {
        msg.className = 'acct-msg err'; msg.textContent = err.message;
        sendBtn.disabled = false; sendBtn.textContent = 'ارسال نظر';
      }
    };
  }

  async function logout() {
    try { await API('/auth/logout', { method: 'POST' }); } catch {}
    try { localStorage.removeItem('alonak_token'); } catch {}
    location.href = 'index.html';
  }

  /* ---------------- boot ---------------- */

  function showGate() {
    $('#acctSkeleton').classList.add('hidden');
    $('#acctApp').classList.add('hidden');
    $('#acctGate').classList.remove('hidden');
    $('#gateLogin').onclick = () => {
      window.alonakAuth.requireLogin(() => { $('#acctGate').classList.add('hidden'); $('#acctSkeleton').classList.remove('hidden'); boot(); });
    };
  }

  function fillSide() {
    paintCounters();
    const toggle = $('#navToggle');
    const menu = $('#acctMenu');
    const isMobile = () => window.matchMedia('(max-width:1023px)').matches;
    const setMenu = open => {
      if (!toggle || !menu) return;
      menu.dataset.open = String(open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'بستن منوی حساب کاربری' : 'باز کردن منوی حساب کاربری');
    };
    if (toggle && menu) {
      menu.dataset.open = 'false';
      toggle.onclick = () => setMenu(menu.dataset.open !== 'true');
      document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu.dataset.open === 'true') setMenu(false); });
    }
    $$('#acctNav button').forEach(b => b.onclick = () => { show(b.dataset.view); if (isMobile()) setMenu(false); });
    $('#acctLogout').onclick = logout;
  }

  async function boot() {
    const me = await API('/auth/me').catch(() => null);
    user = me && me.user ? me.user : null;
    if (!user) { showGate(); return; }
    $('#acctGate').classList.add('hidden');
    $('#acctSkeleton').classList.remove('hidden');

    const [bk, tk, health] = await Promise.all([
      API('/bookings').then(d => d.bookings || []).catch(() => []),
      API('/support').then(d => d.tickets || []).catch(() => []),
      API('/health').then(d => Boolean(d && d.email)).catch(() => false)
    ]);
    bookings = bk; tickets = tk; emailReady = health;

    $('#acctSkeleton').classList.add('hidden');
    $('#acctApp').classList.remove('hidden');
    fillSide();
    const initial = (location.hash || '').replace('#', '');
    show(views.includes(initial) ? initial : 'overview');
  }

  const start = () => {
    if (!window.alonakAuth) return;
    const initial = (location.hash || '').replace('#', '');
    if (views.includes(initial)) route = initial;
    window.addEventListener('hashchange', () => {
      const h = (location.hash || '').replace('#', '');
      if (views.includes(h) && h !== route) show(h);
    });
    boot();
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
