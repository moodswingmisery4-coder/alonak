/* Makanak booking widget — Jalali calendar + guest stepper + live price summary */
(function () {
  const FA = '۰۱۲۳۴۵۶۷۸۹';
  const toFa = v => String(v).replace(/\d/g, d => FA[d]);
  const fromFa = v => String(v).replace(/[۰-۹]/g, d => String(FA.indexOf(d)));
  const MONTHS = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
  const WEEKDAYS = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
  const MAX_NIGHTS = 60;

  const num = v => Number(fromFa(String(v == null ? '' : v)).replace(/[^\d.-]/g, '')) || 0;
  const iso = d => {
    const copy = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
    return copy.toISOString().slice(0, 10);
  };
  const parseIso = value => new Date(value + 'T00:00:00');
  const addDays = (value, n) => {
    const d = parseIso(value);
    d.setDate(d.getDate() + n);
    return iso(d);
  };
  const todayIso = () => iso(new Date());

  function jalaliParts(date) {
    const parts = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { year: 'numeric', month: 'numeric', day: 'numeric' }).formatToParts(date);
    const get = type => Number(fromFa(parts.find(p => p.type === type).value));
    return { y: get('year'), m: get('month'), d: get('day') };
  }
  function firstOfMonth(date) {
    const d = new Date(date.getTime());
    d.setDate(d.getDate() - jalaliParts(d).d + 1);
    return d;
  }
  function shiftMonth(anchor, delta) {
    let d = new Date(anchor.getTime());
    const base = jalaliParts(d).m;
    if (delta > 0) {
      do {
        d.setDate(d.getDate() + 1);
      } while (jalaliParts(d).m === base);
      return firstOfMonth(d);
    }
    do {
      d.setDate(d.getDate() - 1);
    } while (jalaliParts(d).m === base);
    return firstOfMonth(d);
  }
  function formatDate(value) {
    if (!value) return '';
    return new Intl.DateTimeFormat('fa-IR-u-ca-persian', { day: 'numeric', month: 'long', year: 'numeric' }).format(parseIso(value));
  }
  function nightsBetween(a, b) {
    if (!a || !b) return 0;
    return Math.round((parseIso(b) - parseIso(a)) / 86400000);
  }
  function money(value) {
    return toFa(Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','));
  }

  function mount(container, options) {
    const config = Object.assign({ price: 0, capacity: 8, stayId: '', stayName: '', city: '', onBooked: null }, options || {});
    const maxGuests = Math.min(30, Number(config.capacity) || 8);
    const state = { checkIn: '', checkOut: '', guests: Math.min(2, maxGuests), open: '', error: '' };

    container.innerHTML = `
      <div class="bk-widget" dir="rtl">
        <div class="bk-fields">
          <button type="button" class="bk-field" data-open="in">
            <span class="bk-label">تاریخ ورود</span>
            <b class="bk-value" data-value="in">انتخاب تاریخ</b>
          </button>
          <button type="button" class="bk-field" data-open="out">
            <span class="bk-label">تاریخ خروج</span>
            <b class="bk-value" data-value="out">انتخاب تاریخ</b>
          </button>
          <button type="button" class="bk-field" data-open="guests">
            <span class="bk-label">تعداد مهمان</span>
            <b class="bk-value" data-value="guests">${toFa(state.guests)} مهمان</b>
          </button>
        </div>
        <div class="bk-summary" data-summary></div>
        <p class="bk-error" data-error hidden></p>
        <button type="button" class="bk-submit" data-submit>درخواست رزرو</button>
        <p class="bk-note">پرداخت در محل انجام می‌شود؛ رزرو پس از تایید میزبان قطعی است.</p>
        <div class="bk-popup" data-popup hidden></div>
      </div>`;

    const widget = container.querySelector('.bk-widget');
    const popup = widget.querySelector('[data-popup]');
    const summary = widget.querySelector('[data-summary]');
    const errorBox = widget.querySelector('[data-error]');
    const submitBtn = widget.querySelector('[data-submit]');

    function closePopup() {
      state.open = '';
      popup.hidden = true;
      widget.querySelectorAll('.bk-field').forEach(b => b.classList.remove('is-active'));
    }
    function renderSummary() {
      const nights = nightsBetween(state.checkIn, state.checkOut);
      const price = num(config.price);
      if (!nights) {
        summary.innerHTML = `<span class="bk-hint">برای دیدن مبلغ کل، تاریخ ورود و خروج را انتخاب کنید.</span>`;
        return;
      }
      summary.innerHTML = `
        <div class="bk-row"><span>${toFa(nights)} شب × ${money(price)} تومان</span><b>${money(price * nights)} تومان</b></div>
        <div class="bk-row bk-total"><span>مبلغ کل</span><b>${money(price * nights)} تومان</b></div>`;
    }
    function showError(message) {
      state.error = message || '';
      errorBox.textContent = state.error;
      errorBox.hidden = !state.error;
    }
    function renderValues() {
      widget.querySelector('[data-value="in"]').textContent = state.checkIn ? formatDate(state.checkIn) : 'انتخاب تاریخ';
      widget.querySelector('[data-value="out"]').textContent = state.checkOut ? formatDate(state.checkOut) : 'انتخاب تاریخ';
      widget.querySelector('[data-value="guests"]').textContent = toFa(state.guests) + ' مهمان';
      widget.querySelectorAll('.bk-field').forEach(b => b.classList.toggle('has-value', !!state[b.dataset.open === 'guests' ? 'guests' : b.dataset.open]));
      renderSummary();
    }

    function openCalendar(kind) {
      const anchorDate = state[kind === 'in' ? 'checkIn' : 'checkOut'] || (kind === 'out' ? state.checkIn : '');
      let view = firstOfMonth(anchorDate ? parseIso(anchorDate) : new Date());
      const minForKind = () => {
        const today = todayIso();
        if (kind === 'in') return today;
        return state.checkIn ? addDays(state.checkIn, 1) : addDays(today, 1);
      };
      function draw() {
        const jp = jalaliParts(view);
        const first = new Date(view.getTime());
        let cells = '';
        const start = (first.getDay() + 1) % 7;
        for (let i = 0; i < start; i++) cells += '<span class="bk-empty"></span>';
        const daysInMonth = new Date(jp.y, jp.m, 0, 12).getDate();
        const cursor = new Date(first.getTime());
        for (let d = 1; d <= 31; d++) {
          const g = jalaliParts(cursor);
          if (g.m !== jp.m) break;
          const value = iso(cursor);
          const blocked = value < minForKind() || (kind === 'in' && state.checkOut && nightsBetween(value, state.checkOut) > MAX_NIGHTS);
          const selected = state[kind === 'in' ? 'checkIn' : 'checkOut'] === value;
          cells += `<button type="button" class="bk-day${blocked ? ' is-disabled' : ''}${selected ? ' is-selected' : ''}${value === todayIso() ? ' is-today' : ''}" data-day="${value}"${blocked ? ' disabled' : ''}>${toFa(d)}</button>`;
          cursor.setDate(cursor.getDate() + 1);
        }
        popup.innerHTML = `
          <div class="bk-cal-head">
            <button type="button" data-step="1" class="bk-nav" aria-label="ماه بعد">›</button>
            <b>${MONTHS[jp.m - 1]} ${toFa(jp.y)}</b>
            <button type="button" data-step="-1" class="bk-nav" aria-label="ماه قبل">‹</button>
          </div>
          <div class="bk-week">${WEEKDAYS.map(w => `<span>${w}</span>`).join('')}</div>
          <div class="bk-grid">${cells}</div>
          <div class="bk-cal-foot"><span>${kind === 'in' ? 'ورود از امروز به بعد' : 'خروج بعد از ورود'}</span><button type="button" data-close>بستن</button></div>`;
        popup.querySelectorAll('[data-step]').forEach(b => (b.onclick = () => {
          view = shiftMonth(view, Number(b.dataset.step));
          draw();
        }));
        popup.querySelector('[data-close]').onclick = closePopup;
        popup.querySelectorAll('.bk-day').forEach(b => (b.onclick = e => {
          e.stopPropagation();
          const value = b.dataset.day;
          if (kind === 'in') {
            state.checkIn = value;
            if (!state.checkOut || nightsBetween(value, state.checkOut) < 1 || nightsBetween(value, state.checkOut) > MAX_NIGHTS) state.checkOut = '';
          } else {
            state.checkOut = value;
          }
          showError('');
          renderValues();
          closePopup();
          if (kind === 'in' && !state.checkOut) open('out');
        }));
      }
      draw();
    }

    function openGuests() {
      popup.innerHTML = `
        <div class="bk-guests">
          <div><b>تعداد مهمان</b><p>ظرفیت این اقامتگاه ${toFa(maxGuests)} نفر است.</p></div>
          <div class="bk-stepper">
            <button type="button" data-delta="1" aria-label="افزودن مهمان">+</button>
            <b data-count>${toFa(state.guests)}</b>
            <button type="button" data-delta="-1" aria-label="کاهش مهمان">−</button>
          </div>
        </div>
        <div class="bk-cal-foot"><span>بیشتر از ظرفیت قابل انتخاب نیست</span><button type="button" data-close>تایید</button></div>`;
      const count = popup.querySelector('[data-count]');
      popup.querySelectorAll('[data-delta]').forEach(b => (b.onclick = e => {
        e.stopPropagation();
        const next = state.guests + Number(b.dataset.delta);
        if (next < 1 || next > maxGuests) return;
        state.guests = next;
        count.textContent = toFa(next);
        renderValues();
      }));
      popup.querySelector('[data-close]').onclick = closePopup;
    }

    function open(kind) {
      if (state.open === kind) {
        closePopup();
        return;
      }
      state.open = kind;
      popup.hidden = false;
      const anchor = widget.querySelector(`[data-open="${kind}"]`);
      if (anchor) popup.style.top = anchor.offsetTop + anchor.offsetHeight + 8 + 'px';
      widget.querySelectorAll('.bk-field').forEach(b => b.classList.toggle('is-active', b.dataset.open === kind));
      if (kind === 'guests') openGuests();
      else openCalendar(kind);
    }

    widget.querySelectorAll('[data-open]').forEach(b => (b.onclick = e => { e.stopPropagation(); open(b.dataset.open); }));
    document.addEventListener('click', e => {
      if (!widget.contains(e.target)) closePopup();
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closePopup();
    });

    submitBtn.onclick = async () => {
      showError('');
      if (!state.checkIn || !state.checkOut) {
        showError('تاریخ ورود و خروج را انتخاب کنید.');
        open(state.checkIn ? 'out' : 'in');
        return;
      }
      if (nightsBetween(state.checkIn, state.checkOut) < 1) {
        showError('تاریخ خروج باید بعد از تاریخ ورود باشد.');
        return;
      }
      const auth = window.makanakAuth;
      if (auth && auth.requireLogin) {
        const ok = await auth.requireLogin();
        if (!ok) return;
      }
      const label = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'در حال ثبت…';
      try {
        const result = await auth.api('/bookings', {
          method: 'POST',
          body: JSON.stringify({
            stay_id: config.stayId,
            check_in: state.checkIn,
            check_out: state.checkOut,
            guests: state.guests
          })
        });
        const booking = result.booking || {};
        widget.innerHTML = `
          <div class="bk-success">
            <div class="bk-success-icon">✓</div>
            <b>درخواست رزرو ثبت شد</b>
            <p>${config.stayName}</p>
            <ul>
              <li><span>ورود</span><b>${formatDate(state.checkIn)}</b></li>
              <li><span>خروج</span><b>${formatDate(state.checkOut)}</b></li>
              <li><span>مدت اقامت</span><b>${toFa(booking.nights || nightsBetween(state.checkIn, state.checkOut))} شب</b></li>
              <li><span>مبلغ کل</span><b>${money(booking.total || num(config.price) * nightsBetween(state.checkIn, state.checkOut))} تومان</b></li>
            </ul>
            <p class="bk-success-note">وضعیت: در انتظار تایید میزبان. برای پیگیری به پنل کاربری بروید.</p>
            <button type="button" data-panel>مشاهده در پنل کاربری</button>
          </div>`;
        widget.querySelector('[data-panel]').onclick = () => {
          const btn = document.querySelector('#loginBtn');
          if (btn) btn.click();
        };
        if (typeof config.onBooked === 'function') config.onBooked(booking);
      } catch (err) {
        showError(err && err.message ? err.message : 'ثبت رزرو ممکن نشد.');
        submitBtn.disabled = false;
        submitBtn.textContent = label;
      }
    };

    renderValues();
    return {
      state: () => Object.assign({}, state),
      reset: () => {
        state.checkIn = state.checkOut = '';
        state.guests = Math.min(2, maxGuests);
        renderValues();
      }
    };
  }

  window.MakanakBooking = { mount, money, formatDate };
})();
