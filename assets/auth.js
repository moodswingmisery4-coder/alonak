(() => {
  const API_BASES = ['https://makanak-worker.makanak-app.workers.dev/api', 'https://makanak.kdns.fr/api'];
  let apiBase = API_BASES[0];
  const API = () => apiBase;
  const modal = document.querySelector('#modal');
  const loginButton = document.querySelector('#loginBtn');
  if (!modal) return;
  let currentUser = null;
  let pendingResolve = null;
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const show = () => { modal.classList.remove('hidden'); modal.classList.add('flex'); };
  const hide = () => { modal.classList.add('hidden'); modal.classList.remove('flex'); };
  const toast = t => { const x = document.querySelector('#toast'); if (x) { x.textContent = t; x.classList.remove('hidden'); setTimeout(() => x.classList.add('hidden'), 2800); } };
  const TOKEN_KEY = 'makanak_token';
  const getToken = () => { try { return localStorage.getItem(TOKEN_KEY) || ''; } catch { return ''; } };
  const setToken = t => { try { t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY); } catch {} };
  const fa = v => String(v).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);
  const money = v => fa(String(Math.round(Number(v) || 0)).replace(/\B(?=(\d{3})+(?!\d))/g, ','));
  const dateText = iso => { try { return new Intl.DateTimeFormat('fa-IR-u-ca-persian', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso + 'T00:00:00')); } catch { return iso; } };

  async function api(path, options = {}) {
    const order = [apiBase, ...API_BASES.filter(b => b !== apiBase)];
    let lastError = null;
    for (const base of order) {
      let r;
      const auth = getToken();
      const headers = { 'content-type': 'application/json', ...(auth ? { authorization: 'Bearer ' + auth } : {}), ...(options.headers || {}) };
      try { r = await fetch(base + path, { credentials: 'include', headers, ...options }); }
      catch (e) { apiBase = base; lastError = Error('اتصال به سرور برقرار نشد. اینترنت یا فیلترشکن خود را بررسی کنید و دوباره تلاش کنید.'); continue; }
      apiBase = base;
      const d = await r.json().catch(() => ({}));
      if (!r.ok) { const err = Error(d.error || 'خطا در ارتباط با سرویس'); err.status = r.status; err.code = d.code; throw err; }
      return d;
    }
    throw lastError || Error('اتصال به سرور برقرار نشد.');
  }

  function finishLogin(user, token) {
    currentUser = user;
    setToken(token || '');
    hide();
    updateHeader();
    toast('ورود با موفقیت انجام شد');
    if (pendingResolve) { const resolve = pendingResolve; pendingResolve = null; setTimeout(() => resolve(true), 50); }
  }

  function renderAuth(mode = 'login', error = '') {
    modal.querySelector('.bg-white').innerHTML = `
      <button id="closeModal" class="absolute left-5 top-5 text-slate-400 text-2xl" type="button">×</button>
      <div class="text-3xl mb-3">✦</div>
      <h2 class="text-2xl font-black mb-2">${mode === 'login' ? 'ورود به حساب' : 'ثبت‌نام در مکانک'}</h2>
      <p class="text-slate-500 text-sm leading-7 mb-5">${mode === 'login' ? 'برای رزرو، وارد حساب کاربری شوید.' : 'حساب خود را بسازید و رزروهایتان را مدیریت کنید.'}</p>
      <form id="authForm" class="space-y-3">
        ${mode === 'register' ? '<input name="name" required minlength="2" class="w-full bg-slate-50 border rounded-xl p-4" placeholder="نام و نام خانوادگی">' : ''}
        <input name="email" required type="email" class="w-full bg-slate-50 border rounded-xl p-4" placeholder="ایمیل" dir="ltr">
        <input name="password" required minlength="8" type="password" class="w-full bg-slate-50 border rounded-xl p-4" placeholder="رمز عبور (حداقل ۸ کاراکتر)" dir="ltr">
        ${mode === 'register' ? '<input name="phone" class="w-full bg-slate-50 border rounded-xl p-4" placeholder="شماره موبایل (اختیاری)" dir="ltr">' : ''}
        <p id="authError" class="text-red-600 text-sm">${esc(error)}</p>
        <button class="w-full bg-coral text-white rounded-xl p-4 font-bold" type="submit">${mode === 'login' ? 'ورود' : 'ساخت حساب'}</button>
      </form>
      <div class="flex items-center justify-between mt-4 gap-3">
        <button id="authSwitch" class="text-coral text-sm font-bold" type="button">${mode === 'login' ? 'حساب ندارید؟ ثبت‌نام کنید' : 'قبلاً حساب ساخته‌اید؟ وارد شوید'}</button>
        ${mode === 'login' ? '<button id="forgotBtn" class="text-slate-500 text-sm font-bold" type="button">رمز را فراموش کردم</button>' : ''}
      </div>`;
    modal.querySelector('#closeModal').onclick = () => { pendingResolve = null; hide(); };
    modal.querySelector('#authSwitch').onclick = () => renderAuth(mode === 'login' ? 'register' : 'login');
    const forgot = modal.querySelector('#forgotBtn');
    if (forgot) forgot.onclick = () => renderReset();
    modal.querySelector('#authForm').onsubmit = async e => {
      e.preventDefault();
      const b = Object.fromEntries(new FormData(e.target));
      const btn = e.target.querySelector('button[type=submit]');
      const label = btn.textContent;
      btn.disabled = true; btn.textContent = 'کمی صبر کنید…';
      try {
        const d = await api(mode === 'login' ? '/auth/login' : '/auth/register', { method: 'POST', body: JSON.stringify(b) });
        if (mode === 'register' && d.verification && d.verification.email_sent) toast('کد تایید ایمیل برایتان ارسال شد');
        finishLogin(d.user, d.token);
      } catch (err) { renderAuth(mode, err.message); }
      finally { btn.disabled = false; btn.textContent = label; }
    };
  }

  function renderReset() {
    modal.querySelector('.bg-white').innerHTML = `
      <button id="closeModal" class="absolute left-5 top-5 text-slate-400 text-2xl" type="button">×</button>
      <h2 class="text-2xl font-black mb-2">بازیابی رمز عبور</h2>
      <p class="text-slate-500 text-sm leading-7 mb-5">ایمیل حساب را وارد کنید؛ کد ۶ رقمی برایتان ارسال می‌شود.</p>
      <form id="resetForm" class="space-y-3">
        <input name="email" required type="email" class="w-full bg-slate-50 border rounded-xl p-4" placeholder="ایمیل" dir="ltr">
        <input name="code" class="w-full bg-slate-50 border rounded-xl p-4 hidden" placeholder="کد ۶ رقمی دریافتی" dir="ltr" inputmode="numeric" maxlength="6">
        <input name="password" type="password" class="w-full bg-slate-50 border rounded-xl p-4 hidden" placeholder="رمز عبور جدید" dir="ltr" minlength="8">
        <p id="resetMsg" class="text-sm text-slate-500"></p>
        <button class="w-full bg-coral text-white rounded-xl p-4 font-bold" type="submit">ارسال کد بازیابی</button>
      </form>
      <button id="backToLogin" class="text-coral text-sm font-bold mt-4" type="button">بازگشت به ورود</button>`;
    const form = modal.querySelector('#resetForm');
    const msg = modal.querySelector('#resetMsg');
    const codeInput = form.querySelector('input[name=code]');
    const passInput = form.querySelector('input[name=password]');
    let stage = 'request';
    modal.querySelector('#closeModal').onclick = hide;
    modal.querySelector('#backToLogin').onclick = () => renderAuth('login');
    form.onsubmit = async e => {
      e.preventDefault();
      const btn = form.querySelector('button[type=submit]');
      btn.disabled = true;
      try {
        if (stage === 'request') {
          const d = await api('/auth/reset/request', { method: 'POST', body: JSON.stringify({ email: form.email.value }) });
          msg.textContent = d.message || 'کد بازیابی ارسال شد.';
          codeInput.classList.remove('hidden'); passInput.classList.remove('hidden');
          codeInput.required = true; passInput.required = true;
          btn.textContent = 'تغییر رمز عبور';
          stage = 'confirm';
        } else {
          await api('/auth/reset/confirm', { method: 'POST', body: JSON.stringify({ email: form.email.value, code: codeInput.value, password: passInput.value }) });
          toast('رمز عبور تغییر کرد؛ دوباره وارد شوید');
          renderAuth('login');
        }
      } catch (err) { msg.textContent = err.message; }
      finally { btn.disabled = false; }
    };
  }

  function updateHeader() {
    if (!loginButton) return;
    loginButton.textContent = currentUser ? `حساب کاربری: ${currentUser.name || currentUser.email}` : 'ورود / ثبت‌نام';
    loginButton.onclick = () => (currentUser ? renderAccount() : (renderAuth('login'), show()));
  }

  const statusChip = b => {
    if (b.status === 'cancelled') return '<span class="chip chip-muted">لغو شده</span>';
    if (b.status === 'confirmed') return '<span class="chip chip-ok">تایید شده</span>';
    return '<span class="chip chip-wait">در انتظار تایید</span>';
  };

  async function renderAccount() {
    let bookings = [];
    let loadError = '';
    try {
      const d = await api('/bookings');
      bookings = d.bookings || [];
    } catch (e) { loadError = e.message; }

    const bookingCards = bookings.map(b => {
      const nights = b.nights || Math.max(1, Math.round((new Date(b.check_out) - new Date(b.check_in)) / 86400000));
      const canCancel = b.status === 'pending' && new Date(b.check_in + 'T00:00:00') > new Date();
      return `<div class="booking-row">
        <div class="booking-row-head"><b>${esc(b.stay_name || 'اقامتگاه')}</b>${statusChip(b)}</div>
        <p class="booking-meta">${esc(b.city || '')} · ${dateText(b.check_in)} تا ${dateText(b.check_out)}</p>
        <p class="booking-meta">${fa(b.guests)} نفر · ${fa(nights)} شب${b.price ? ' · ' + money(b.price) + ' تومان' : ''}</p>
        ${canCancel ? `<button type="button" class="booking-cancel" data-cancel="${esc(b.id)}">لغو رزرو</button>` : ''}
      </div>`;
    }).join('') || '<p class="text-sm text-slate-500">هنوز رزروی ثبت نکرده‌اید.</p>';

    const verifyBlock = currentUser && !currentUser.verified
      ? `<div class="account-box">
           <div class="account-box-head"><b>ایمیل تایید نشده</b><span class="chip chip-wait">تایید نشده</span></div>
           <p class="account-hint">برای امنیت بیشتر، ایمیل <span dir="ltr">${esc(currentUser.email)}</span> را تایید کنید.</p>
           <button type="button" id="verifyRequest" class="account-btn">ارسال کد تایید</button>
           <div id="verifyForm" class="hidden mt-2 flex gap-2">
             <input id="verifyCode" class="flex-1 border rounded-xl p-3 text-sm" placeholder="کد ۶ رقمی" inputmode="numeric" maxlength="6" dir="ltr">
             <button type="button" id="verifyConfirm" class="bg-coral text-white rounded-xl px-4 text-sm font-bold">تایید</button>
           </div>
           <p id="verifyMsg" class="account-hint mt-2"></p>
         </div>`
      : '';

    modal.querySelector('.bg-white').innerHTML = `
      <button id="closeModal" class="absolute left-5 top-5 text-slate-400 text-2xl" type="button">×</button>
      <h2 class="text-2xl font-black mb-1">پنل کاربری</h2>
      <p class="text-slate-500 mb-4">${esc(currentUser?.name || '')} <span class="text-xs text-slate-400" dir="ltr">${esc(currentUser?.email || '')}</span>
        ${currentUser?.verified ? '<span class="chip chip-ok">ایمیل تایید شده</span>' : ''}</p>
      <h3 class="font-bold mb-3">رزروهای من</h3>
      <div class="account-bookings">${loadError ? `<p class="text-sm text-red-600">${esc(loadError)}</p>` : bookingCards}</div>
      ${verifyBlock}
      <div class="account-box">
        <div class="account-box-head"><b>اطلاعات حساب</b></div>
        <form id="profileForm" class="space-y-2">
          <input name="name" value="${esc(currentUser?.name || '')}" class="w-full border rounded-xl p-3 text-sm" placeholder="نام و نام خانوادگی">
          <input name="phone" value="${esc(currentUser?.phone || '')}" class="w-full border rounded-xl p-3 text-sm" placeholder="شماره موبایل" dir="ltr">
          <button class="account-btn" type="submit">ذخیره تغییرات</button>
        </form>
      </div>
      <div class="account-box">
        <div class="account-box-head"><b>تغییر رمز عبور</b></div>
        <form id="passwordForm" class="space-y-2">
          <input name="current" type="password" required class="w-full border rounded-xl p-3 text-sm" placeholder="رمز فعلی" dir="ltr">
          <input name="next" type="password" required minlength="8" class="w-full border rounded-xl p-3 text-sm" placeholder="رمز جدید (حداقل ۸ کاراکتر)" dir="ltr">
          <button class="account-btn" type="submit">تغییر رمز</button>
        </form>
      </div>
      <button id="logoutBtn" class="w-full mt-3 border border-red-200 text-red-600 rounded-xl p-3 font-bold" type="button">خروج از حساب</button>`;

    show();
    modal.querySelector('#closeModal').onclick = hide;

    modal.querySelectorAll('[data-cancel]').forEach(btn => (btn.onclick = async () => {
      if (!confirm('این رزرو لغو شود؟')) return;
      btn.disabled = true; btn.textContent = 'در حال لغو…';
      try { await api('/bookings/' + encodeURIComponent(btn.dataset.cancel), { method: 'DELETE' }); toast('رزرو لغو شد'); renderAccount(); }
      catch (err) { btn.disabled = false; btn.textContent = 'لغو رزرو'; toast(err.message); }
    }));

    const profileForm = modal.querySelector('#profileForm');
    profileForm.onsubmit = async e => {
      e.preventDefault();
      const btn = e.target.querySelector('button');
      btn.disabled = true;
      try {
        const d = await api('/auth/me', { method: 'PATCH', body: JSON.stringify({ name: profileForm.name.value, phone: profileForm.phone.value }) });
        currentUser = d.user; updateHeader(); toast('اطلاعات حساب ذخیره شد');
      } catch (err) { toast(err.message); }
      finally { btn.disabled = false; }
    };

    const passwordForm = modal.querySelector('#passwordForm');
    passwordForm.onsubmit = async e => {
      e.preventDefault();
      const btn = e.target.querySelector('button');
      btn.disabled = true;
      try {
        await api('/auth/password', { method: 'POST', body: JSON.stringify({ current: passwordForm.current.value, next: passwordForm.next.value }) });
        passwordForm.reset(); toast('رمز عبور تغییر کرد');
      } catch (err) { toast(err.message); }
      finally { btn.disabled = false; }
    };

    const verifyRequest = modal.querySelector('#verifyRequest');
    if (verifyRequest) {
      const verifyMsg = modal.querySelector('#verifyMsg');
      verifyRequest.onclick = async () => {
        verifyRequest.disabled = true;
        try {
          const d = await api('/auth/verify/request', { method: 'POST', body: JSON.stringify({}) });
          verifyMsg.textContent = d.message || 'کد ارسال شد.';
          modal.querySelector('#verifyForm').classList.remove('hidden');
          verifyRequest.classList.add('hidden');
        } catch (err) { verifyMsg.textContent = err.message; verifyRequest.disabled = false; }
      };
      modal.querySelector('#verifyConfirm').onclick = async () => {
        try {
          await api('/auth/verify/confirm', { method: 'POST', body: JSON.stringify({ code: modal.querySelector('#verifyCode').value }) });
          currentUser.verified = 1; toast('ایمیل شما تایید شد'); renderAccount();
        } catch (err) { verifyMsg.textContent = err.message; }
      };
    }

    modal.querySelector('#logoutBtn').onclick = async () => {
      try { await api('/auth/logout', { method: 'POST' }); } catch {}
      setToken(''); currentUser = null; hide(); updateHeader(); toast('از حساب خارج شدید');
    };
  }

  async function check() {
    try { const d = await api('/auth/me'); currentUser = d.user || null; updateHeader(); } catch {}
  }

  window.makanakAuth = {
    api,
    requireLogin: cb => new Promise(resolve => {
      if (currentUser) return resolve(cb ? cb(currentUser) : true);
      pendingResolve = resolve;
      renderAuth('login');
      show();
      toast('برای رزرو ابتدا وارد شوید');
    }),
    user: () => currentUser,
    refresh: check
  };
  loginButton.onclick = () => { if (currentUser) renderAccount(); else { renderAuth('login'); show(); } };
  modal.onclick = e => { if (e.target === modal) { pendingResolve = null; hide(); } };
  check();
})();
