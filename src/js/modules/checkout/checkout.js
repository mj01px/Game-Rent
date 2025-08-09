// === Checkout (usa o mesmo localStorage.gameCart do modal) ===
const DISCOUNT = 0;

const els = {
    items: document.getElementById('fb-items'),
    summary: document.getElementById('fb-summary-lines'),
    disc: document.getElementById('fb-disc'),
    total: document.getElementById('fb-total'),
    payBtn: document.getElementById('fb-pay'),
    payTotal: document.getElementById('pay-total'),
    okTotal: document.getElementById('ok-total'),

    // overlays / modals
    payOverlay: document.getElementById('pay-overlay'),
    okOverlay: document.getElementById('ok-overlay'),
    emptyOverlay: document.getElementById('empty-overlay'),

    // modal buttons
    payClose: document.getElementById('pay-close'),
    payConfirm: document.getElementById('pay-confirm'),
    okClose: document.getElementById('ok-close'),
    seeTracking: document.getElementById('see-tracking'),
    emptyClose: document.getElementById('empty-close'),
    emptyOk: document.getElementById('empty-ok'),

    // delivery / timeline
    deliveryWrap: document.getElementById('fb-delivery-wrapper'),
    tl: {
        pay:  document.getElementById('tl-pay'),
        pack: document.getElementById('tl-pack'),
        ship: document.getElementById('tl-ship'),
        done: document.getElementById('tl-done'),
    },
    timeline: document.getElementById('fb-timeline'),

    // track
    trackCode: document.getElementById('fb-track-code'),
    copyBtn: document.getElementById('fb-copy'),

    // payment preview bits
    num: document.getElementById('card-number'),
    name: document.getElementById('card-name'),
    exp: document.getElementById('card-exp'),
    cvv: document.getElementById('card-cvv'),
    prevNum: document.getElementById('preview-number'),
    prevName: document.getElementById('preview-name'),
    prevExp: document.getElementById('preview-exp'),
    brand: document.getElementById('card-brand'),
    inlineBrand: document.getElementById('inline-brand'),
};

const usd  = n => `$${Number(n || 0).toFixed(2)}`;
const hhmm = () => new Date().toLocaleTimeString('en-US', { hour:'2-digit', minute:'2-digit' });

// -------- Cart helpers
function getCart(){
    try{
        const raw = localStorage.getItem('gameCart');
        const arr = raw ? JSON.parse(raw) : [];
        return Array.isArray(arr) ? arr : [];
    }catch{
        return [];
    }
}
function calcSubtotal(cart){
    return cart.reduce((t,it)=> t + (Number(it.rentalPrice)*Number(it.quantity)), 0);
}

// -------- Render: items
function renderItems(cart){
    if(!els.items) return;

    if(!cart.length){
        els.items.innerHTML = `
      <div class="empty-cart" style="padding:24px 8px; text-align:center;">
        <strong>Your cart is empty</strong>
      </div>`;
        return;
    }

    els.items.innerHTML = cart.map(item=>{
        const hasPlatform = item.platformName && item.platform;
        return `
      <div class="fb-item" id="game-${item.id}">
        <div class="fb-item__img">
          <img src="../../../assets/images/games/${item.image}" alt="${item.name}" loading="lazy">
          ${item.available===false?'<span class="unavailable-badge">Unavailable</span>':''}
        </div>

        <div class="fb-item__meta">
          <h3 class="fb-item__title">${item.name}</h3>

          ${hasPlatform ? `
            <div class="fb-platform-row">
              <span class="platform ${item.platform}">${item.platformName}</span>
            </div>
          ` : ''}

          <!-- Reuso das classes do modal (se existirem no seu projeto) -->
          <div class="cart-item-controls">
            <button class="quantity-btn minus" data-id="${item.id}">-</button>
            <span class="quantity">${item.quantity}</span>
            <button class="quantity-btn plus" data-id="${item.id}">+</button>
            <button class="remove-btn" data-id="${item.id}">Remove</button>
          </div>
        </div>

        <div class="fb-item__price">${usd(item.rentalPrice*item.quantity)}</div>
      </div>`;
    }).join('');
}

// -------- Render: summary
function renderSummary(cart){
    if(!els.summary) return;

    els.summary.innerHTML = cart.map(item=>`
    <div class="fb-row">
      <span>${item.name} <small style="color:#7f8c8d;">x${item.quantity}</small></span>
      <strong>${usd(item.rentalPrice*item.quantity)}</strong>
    </div>
  `).join('');

    const subtotal = calcSubtotal(cart);
    const discount = DISCOUNT ? -Math.abs(DISCOUNT) : 0;
    const total = subtotal + discount;

    els.disc.textContent  = (discount<0?'-':'') + usd(Math.abs(discount));
    els.total.textContent = usd(total);
    els.payTotal.textContent = usd(total);
    els.okTotal.textContent  = usd(total);

    localStorage.setItem('lastTotalUSD', String(total));
}

// -------- Modal helpers
function open(el){ el?.classList.add('active'); el?.setAttribute('aria-hidden','false'); }
function close(el){ el?.classList.remove('active'); el?.setAttribute('aria-hidden','true'); }

// -------- Timeline animation helpers
function stepsArray(){
    // pega sempre os steps atuais (em caso de re-render não quebra)
    return Array.from(document.querySelectorAll('#fb-timeline .fb-tl-item'));
}

function setProgressTo(stepEl){
    if(!els.timeline) return;
    const steps = stepsArray();
    if(!steps.length) return;
    const idx = Math.max(0, steps.indexOf(stepEl));
    const total = Math.max(1, steps.length - 1);
    const pct = (idx / total) * 100;
    els.timeline.style.setProperty('--tl-progress', pct + '%');
}

function setStep(stepEl, text){
    if(!stepEl) return;
    stepEl.classList.add('active','done');
    const p = stepEl.querySelector('p');
    if(p) p.textContent = text;
    setProgressTo(stepEl);
}

// -------- Delivery flow
function genTrack(){
    const n = Math.floor(Math.random()*1e9).toString().padStart(9,'0');
    return `US${n}XX`;
}

function approveFlow(){
    setStep(els.tl.pay,  `Approved at ${hhmm()}`);
    setTimeout(()=>setStep(els.tl.pack, `Packed at ${hhmm()}`), 700);
    setTimeout(()=>setStep(els.tl.ship, `Sent at ${hhmm()}`),   1400);
    setTimeout(()=>setStep(els.tl.done, `Delivered at ${hhmm()}`), 2100);
    if (els.trackCode) els.trackCode.value = genTrack();
}

function showDelivery(){
    els.deliveryWrap?.classList?.remove('hidden');
    // Reseta progresso antes de rodar de novo (se usuário repetir o fluxo)
    if (els.timeline) els.timeline.style.setProperty('--tl-progress', '0%');
    // remove classes antigas para reanimar
    stepsArray().forEach(s => s.classList.remove('active','done'));
    approveFlow();
    els.deliveryWrap?.scrollIntoView({ behavior:'smooth', block:'start' });
}

// -------- Bind events
function bind(){
    // pagar -> bloqueia se carrinho vazio
    els.payBtn?.addEventListener('click', ()=>{
        const cart = getCart();
        if (!cart.length) {
            open(els.emptyOverlay);
            return;
        }
        open(els.payOverlay);
    });

    // fechar modais (X)
    els.payClose?.addEventListener('click', ()=> close(els.payOverlay));
    els.okClose?.addEventListener('click',  ()=>{
        close(els.okOverlay);
        showDelivery(); // sempre mostra delivery ao fechar o success
    });
    els.emptyClose?.addEventListener('click', ()=> close(els.emptyOverlay));
    els.emptyOk?.addEventListener('click', ()=> close(els.emptyOverlay));

    // confirmar pagamento -> abre success
    els.payConfirm?.addEventListener('click', ()=>{
        close(els.payOverlay);
        open(els.okOverlay);
    });

    // acompanhar (botão)
    els.seeTracking?.addEventListener('click', ()=>{
        close(els.okOverlay);
        showDelivery();
    });

    // copiar rastreio
    els.copyBtn?.addEventListener('click', async ()=>{
        try{
            await navigator.clipboard.writeText(els.trackCode?.value || '');
            els.copyBtn.innerHTML = '<i class="fa-solid fa-check"></i> Copied';
            setTimeout(()=> els.copyBtn.innerHTML = '<i class="fa-regular fa-copy"></i> Copy', 1200);
        }catch{}
    });

    // fechar clicando fora
    window.addEventListener('click', (e)=>{
        if (e.target === els.payOverlay)   close(els.payOverlay);
        if (e.target === els.okOverlay){   close(els.okOverlay); showDelivery(); }
        if (e.target === els.emptyOverlay) close(els.emptyOverlay);
    });

    // ESC fecha e, se for o success, mostra delivery
    window.addEventListener('keydown', (e)=>{
        if(e.key !== 'Escape') return;
        if(els.payOverlay?.classList.contains('active')) close(els.payOverlay);
        if(els.okOverlay?.classList.contains('active')) { close(els.okOverlay); showDelivery(); }
        if(els.emptyOverlay?.classList.contains('active')) close(els.emptyOverlay);
    });

    // nativo entre abas
    window.addEventListener('storage', (e)=>{
        if(e.key === 'gameCart') render(getCart());
    });

    // intra-aba pelo evento do modal
    window.addEventListener('cart:changed', (e)=>{
        render(e.detail?.cart || getCart());
    });

    // ------- Payment live preview / formatters (se o HTML tiver a prévia)
    const detectBrand = (val) => {
        const v = (val || '').replace(/\D/g,'');
        if(/^4/.test(v)) return 'VISA';
        if(/^(5[1-5])/.test(v)) return 'MC';
        if(/^3[47]/.test(v)) return 'AMEX';
        if(/^6(011|5)/.test(v)) return 'DISC';
        return 'CARD';
    };
    const formatCard = (val) => {
        const v = (val || '').replace(/\D/g,'').slice(0,16);
        return v.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
    };
    const formatExp = (val) => {
        const v = (val || '').replace(/\D/g,'').slice(0,4);
        if(v.length <= 2) return v;
        return v.slice(0,2) + '/' + v.slice(2);
    };

    els.num?.addEventListener('input', (e)=>{
        const f = formatCard(e.target.value);
        e.target.value = f;
        if (els.prevNum) els.prevNum.textContent = f || '•••• •••• •••• ••••';
        const b = detectBrand(f);
        if (els.brand) els.brand.textContent = b;
        if (els.inlineBrand) els.inlineBrand.textContent = b === 'CARD' ? '•••' : b;
    });

    els.name?.addEventListener('input', (e)=>{
        if (els.prevName) els.prevName.textContent = e.target.value.trim().toUpperCase() || 'YOUR NAME';
    });

    els.exp?.addEventListener('input', (e)=>{
        const f = formatExp(e.target.value);
        e.target.value = f;
        if (els.prevExp) els.prevExp.textContent = f || 'MM/YY';
    });

    els.cvv?.addEventListener('input', (e)=>{
        e.target.value = e.target.value.replace(/\D/g,'').slice(0,4);
    });
}

// -------- render & init
function render(cart){ renderItems(cart); renderSummary(cart); }
(function init(){ const cart = getCart(); render(cart); bind(); })();
