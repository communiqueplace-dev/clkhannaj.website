/* C.L Khanna Jewellers — shared site logic (v4) */
const WA = "919815605373";
const SUBS = {
  gold:   [["necklaces","Necklaces & Harams"],["bangles","Bangles & Kadas"],["bracelets","Bracelets"],["earrings","Earrings"]],
  diamond:[["necklaces","Necklaces & Chokers"],["rings","Rings"],["bangles","Bangles & Bracelets"],["earrings","Earrings"]],
  polki:  [["chokers","Chokers & Sets"],["harams","Necklaces & Malas"],["earrings","Earrings & Studs"],["more","Bracelets & More"]]
};
const CAT_TITLES = {gold:"Gold Jewellery", diamond:"Diamond Jewellery", polki:"Polki Jewellery"};



/* ---------- header: burger left · logo centre · icons right · hairline ---------- */
function buildHeader(active){
  document.getElementById("site-header").innerHTML = `
  <header class="site">
    <div class="bar">
      <button class="burger" aria-label="Menu" onclick="toggleDrawer(true)"><span></span><span></span><span></span></button>
      <a class="brand" href="/"><img src="assets/logo-main.png" alt="C.L Khanna Jewellers"></a>
      <div class="actions">
        <button class="ic" aria-label="Search" onclick="openSearch()" title="Search">
          <svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="1.4"/><line x1="15.4" y1="15.4" x2="21" y2="21" stroke="currentColor" stroke-width="1.4"/></svg>
        </button>
        <span class="country" title="India · INR">IN · ₹</span>
        <button class="ic" aria-label="Account" onclick="openAuth()" title="Account">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>
        </button>
        <button class="ic" aria-label="Cart" onclick="location.href='cart.html'" title="Cart"><span class="cartn" id="cartn"></span>
          <svg viewBox="0 0 24 24"><path d="M6 7h12l-1.2 11a2 2 0 0 1-2 1.8H9.2a2 2 0 0 1-2-1.8L6 7z" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M9 9V6a3 3 0 0 1 6 0v3" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>
        </button>
      </div>
    </div>
  </header>
  <div class="hairline"></div>
  <div class="drawer-veil" id="dveil" onclick="toggleDrawer(false)"></div>
  <aside class="drawer" id="drawer">
    <button class="dx" onclick="toggleDrawer(false)">×</button>
    <a class="d-home" href="/">Home</a>
    <div class="d-group">
      <a class="d-cat" href="javascript:void(0)" onclick="this.parentNode.classList.toggle('openg')">Shop <i>+</i></a>
      ${["gold","diamond","polki"].map(c => `
        <a class="d-sub d-strong" href="${c}.html">${CAT_TITLES[c]}</a>
        ${SUBS[c].map(([k,l]) => `<a class="d-sub d-sub2" href="${c}.html?sub=${k}">${l}</a>`).join("")}
      `).join("")}
    </div>
    <a class="d-cat" href="/#collections">Collections</a>
    <a class="d-cat" href="polki.html?sub=chokers">Bridal</a>
    <a class="d-cat" href="custom.html">Custom Jewellery</a>
    <a class="d-cat" href="#" onclick="openAppt(event);toggleDrawer(false)">Appointment</a>
    <a class="d-cat" href="media.html">Media</a>
    <a class="d-cat" href="about.html">About Us</a>
    <a class="d-cat" href="location.html">Contact</a>
    <a class="d-appt" href="#" onclick="openAppt(event);toggleDrawer(false)">Book an Appointment</a>
  </aside>
  <div class="search-veil" id="sveil">
    <div class="search-box">
      <button class="dx" onclick="closeSearch()">×</button>
      <input id="sq" type="text" placeholder="Search the collection — e.g. choker, ruby, kada…" oninput="runSearch()">
      <div id="sres" class="sres"></div>
    </div>
  </div>`;
}
function toggleDrawer(open){
  document.getElementById("drawer").classList.toggle("open", open);
  document.getElementById("dveil").classList.toggle("open", open);
}
function soon(what){
  alert(what + " are coming soon.\nFor now, we serve you personally — call or WhatsApp +91 98156 05373.");
}

/* ---------- search ---------- */
function openSearch(){
  document.getElementById("sveil").classList.add("open");
  setTimeout(() => document.getElementById("sq").focus(), 50);
}
function closeSearch(){ document.getElementById("sveil").classList.remove("open"); }
function runSearch(){
  const q = document.getElementById("sq").value.trim().toLowerCase();
  const box = document.getElementById("sres");
  if (q.length < 2){ box.innerHTML = ""; return; }
  const hits = PRODUCTS.filter(p =>
    (p.name + " " + p.desc + " " + p.cat + " " + p.work + " " + p.occasion).toLowerCase().includes(q)
  ).slice(0, 8);
  box.innerHTML = hits.length
    ? hits.map(p => `
      <a href="product.html?id=${p.img}">
        <img src="${imgURL(p)}" alt="">
        <span><b>${p.name}</b><small>${CAT_TITLES[p.cat]}</small></span>
      </a>`).join("")
    : `<p class="nores">No pieces found — try "choker", "ring", "polki"…</p>`;
}

/* ---------- footer: Company · Services · Policies · Social + newsletter ---------- */
function buildFooter(){
  document.getElementById("site-footer").innerHTML = `
  <div class="topline"></div>
  <div class="wrap">
    <div class="news">
      <div>
        <h4>Join the List</h4>
        <p>Be the first to see new collections and bridal editorials.</p>
      </div>
      <form onsubmit="return joinNews(event)">
        <input id="nl-email" type="email" placeholder="Your email address" required>
        <button class="btn solid" type="submit">Subscribe</button>
      </form>
    </div>
    <div class="cols">
      <div>
        <h4>Information</h4>
        <a href="about.html">About Us</a>
        <a href="location.html">Contact Us</a>
        <a href="custom.html">Customized Jewellery</a>
        <a href="location.html">Store Location</a>
      </div>
      <div>
        <h4>Policies</h4>
        <a href="privacy.html">Privacy Policy</a>
        <a href="returns.html">Return Policy</a>
        <a href="shipping.html">Shipping Policy</a>
        <a href="terms.html">Terms &amp; Conditions</a>
      </div>
      <div class="git">
        <h4>Get In Touch</h4>
        <a href="https://www.google.com/maps/search/?api=1&query=C.L.+Khanna+Jewellers+Lawrence+Road+Amritsar" target="_blank" rel="noopener"><svg width="15" height="15" viewBox="0 0 24 24"><path d="M12 21s-7-6.1-7-11a7 7 0 0 1 14 0c0 4.9-7 11-7 11z" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="10" r="2.6" fill="none" stroke="currentColor" stroke-width="1.6"/></svg><span>C.L Khanna Jewellers, 8 Dilawari Street,<br>Lawrence Road, Amritsar, Punjab</span></a>
        <a href="tel:+919815605373"><svg width="15" height="15" viewBox="0 0 24 24"><path d="M5 4h4l2 5-2.5 1.5a13 13 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" fill="none" stroke="currentColor" stroke-width="1.6"/></svg><span>+91 98156 05373</span></a>
        <a href="tel:+917717624298"><svg width="15" height="15" viewBox="0 0 24 24"><path d="M5 4h4l2 5-2.5 1.5a13 13 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" fill="none" stroke="currentColor" stroke-width="1.6"/></svg><span>+91 77176 24298</span></a>
        <a href="mailto:clkhannajewellers@gmail.com"><svg width="15" height="15" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M3 7l9 6 9-6" fill="none" stroke="currentColor" stroke-width="1.6"/></svg><span>clkhannajewellers@gmail.com</span></a>
      </div>
      <div>
        <h4>Follow Us</h4>
        <div class="socials">
          <a href="https://www.instagram.com/clkhanna_jewellers/" target="_blank" rel="noopener" aria-label="Instagram" title="Instagram">
            <svg width="14" height="14" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="17.2" cy="6.8" r="1.2" fill="currentColor"/></svg>
          </a>
          <a href="https://wa.me/919815605373" target="_blank" rel="noopener" aria-label="WhatsApp" title="WhatsApp">
            <svg width="14" height="14" viewBox="0 0 32 32"><path d="M16 3C9.4 3 4 8.4 4 15c0 2.1.6 4.2 1.7 6L4 29l8.2-1.6c1.2.6 2.5.9 3.8.9 6.6 0 12-5.4 12-12S22.6 3 16 3zm6.1 16.9c-.3.8-1.6 1.5-2.2 1.6-.6.1-1.3.1-2.1-.1-.5-.2-1.1-.4-1.9-.7-3.3-1.4-5.5-4.8-5.6-5-.2-.2-1.4-1.8-1.4-3.5 0-1.7.9-2.5 1.2-2.8.3-.3.7-.4.9-.4h.7c.2 0 .5-.1.8.6.3.8 1 2.6 1.1 2.8.1.2.2.4 0 .7-.1.3-.2.4-.4.7-.2.2-.4.5-.6.7-.2.2-.4.4-.2.8.2.4 1 1.7 2.2 2.7 1.5 1.3 2.8 1.7 3.2 1.9.4.2.6.2.9-.1.2-.3 1-1.2 1.3-1.6.3-.4.5-.3.9-.2.4.1 2.2 1 2.6 1.2.4.2.6.3.7.5.1.1.1.8-.1 1.6z" fill="currentColor"/></svg>
          </a>
        </div>
        <a class="ig-handle" href="https://www.instagram.com/clkhanna_jewellers/" target="_blank" rel="noopener">@clkhanna_jewellers</a>
      </div>
    </div>
    <div class="base">Copyright © <span id="yr"></span> C.L Khanna Jewellers. All rights reserved.</div>
  </div>`;
  document.getElementById("yr").textContent = new Date().getFullYear();
}

function joinNews(e){
  e.preventDefault();
  const em = document.getElementById("nl-email").value;
  e.target.innerHTML = '<p class="nl-thanks">Thank you — you are on the list.</p>';
  return false;
}

/* ---------- shells ---------- */
function buildShells(){
  document.body.insertAdjacentHTML("beforeend", `
  <a class="wa-float" target="_blank" rel="noopener" aria-label="WhatsApp"
     href="https://wa.me/${WA}?text=${encodeURIComponent('Hello C.L Khanna Jewellers, I would like to make an enquiry.')}">
    <svg viewBox="0 0 32 32"><path d="M16 3C9.4 3 4 8.4 4 15c0 2.1.6 4.2 1.7 6L4 29l8.2-1.6c1.2.6 2.5.9 3.8.9 6.6 0 12-5.4 12-12S22.6 3 16 3zm6.1 16.9c-.3.8-1.6 1.5-2.2 1.6-.6.1-1.3.1-2.1-.1-.5-.2-1.1-.4-1.9-.7-3.3-1.4-5.5-4.8-5.6-5-.2-.2-1.4-1.8-1.4-3.5 0-1.7.9-2.5 1.2-2.8.3-.3.7-.4.9-.4h.7c.2 0 .5-.1.8.6.3.8 1 2.6 1.1 2.8.1.2.2.4 0 .7-.1.3-.2.4-.4.7-.2.2-.4.5-.6.7-.2.2-.4.4-.2.8.2.4 1 1.7 2.2 2.7 1.5 1.3 2.8 1.7 3.2 1.9.4.2.6.2.9-.1.2-.3 1-1.2 1.3-1.6.3-.4.5-.3.9-.2.4.1 2.2 1 2.6 1.2.4.2.6.3.7.5.1.1.1.8-.1 1.6z"/></svg>
  </a>
  <div class="modal" id="appt">
    <div class="box">
      <button class="x" onclick="document.getElementById('appt').classList.remove('open')">×</button>
      <h3>Book an Appointment</h3>
      <p class="sub">Visit us at Lawrence Road without the wait.</p>
      <label>Your name</label><input id="ap-name" type="text" placeholder="Full name">
      <label>Preferred day</label>
      <select id="ap-day"><option>Today</option><option>Tomorrow</option><option>This weekend</option><option>Next week</option></select>
      <label>Preferred time</label>
      <select id="ap-time"><option>11 AM – 1 PM</option><option>1 PM – 3 PM</option><option>3 PM – 5 PM</option><option>5 PM – 8 PM</option></select>
      <label>Interested in</label>
      <select id="ap-int"><option>Bridal / Wedding</option><option>Gold Jewellery</option><option>Diamond Jewellery</option><option>Polki Jewellery</option><option>Customized Jewellery</option><option>General visit</option></select>
      <button class="btn solid send" onclick="sendAppt()">Confirm on WhatsApp</button>
    </div>
  </div>
  <div class="lb" id="lb" style="position:fixed;inset:0;background:rgba(252,250,245,.97);z-index:140;display:none;align-items:center;justify-content:center;padding:4vh 4vw;cursor:zoom-out">
    <img id="lbimg" alt="Jewellery" style="max-height:88vh;max-width:90vw;object-fit:contain;border:1px solid #e6dec9;background:#fff">
  </div>`);
  document.getElementById("lb").addEventListener("click", function(){ this.style.display = "none"; });
}
function openAppt(e){ if(e) e.preventDefault(); document.getElementById("appt").classList.add("open"); }
function sendAppt(){
  const n = document.getElementById("ap-name").value.trim() || "A customer";
  const msg = "Hello C.L Khanna Jewellers, I would like to book an appointment.\nName: " + n +
    "\nDay: " + document.getElementById("ap-day").value +
    "\nTime: " + document.getElementById("ap-time").value +
    "\nInterested in: " + document.getElementById("ap-int").value;
  window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(msg), "_blank");
  document.getElementById("appt").classList.remove("open");
}
function openLB(src){
  const lb = document.getElementById("lb");
  document.getElementById("lbimg").src = src;
  lb.style.display = "flex";
}

function imgURL(p){ return (p && p.image_url) ? p.image_url : 'assets/catalog/'+p.cat+'/'+p.img+'.jpg'; }

/* ---------- product cards / catalogue ---------- */
function cardHTML(p){
  return `
  <a class="card rv in" data-s="${p.sub}" href="product.html?id=${p.img}">
    <div class="ph"><img loading="lazy" src="${imgURL(p)}" alt="${p.name}"></div>
    <div class="info">
      <h3>${p.name}</h3>
      <p>${p.desc}</p>
      <span class="rfp">View Details</span>
    </div>
  </a>`;
}
function renderCatalog(cat){
  const subs = SUBS[cat];
  const bar = document.getElementById("subbar");
  bar.innerHTML = `<button data-s="all" class="active">All</button>` +
    subs.map(([k,l]) => `<button data-s="${k}">${l}</button>`).join("");
  const grid = document.getElementById("grid");
  grid.innerHTML = PRODUCTS.filter(p => p.cat === cat).map(cardHTML).join("");
  const count = document.getElementById("count");
  function apply(s){
    bar.querySelectorAll("button").forEach(b => b.classList.toggle("active", b.dataset.s === s));
    let n = 0;
    grid.querySelectorAll(".card").forEach(c => {
      const show = s === "all" || c.dataset.s === s;
      c.style.display = show ? "" : "none";
      if (show) n++;
    });
    count.textContent = n + " piece" + (n === 1 ? "" : "s");
  }
  bar.querySelectorAll("button").forEach(b => b.addEventListener("click", () => apply(b.dataset.s)));
  const want = new URLSearchParams(location.search).get("sub");
  apply(want && subs.some(([k]) => k === want) ? want : "all");
}

/* ---------- product detail ---------- */
function renderProduct(){
  const id = new URLSearchParams(location.search).get("id");
  const p = PRODUCTS.find(x => x.img === id) || PRODUCTS[0];
  const subLabel = (SUBS[p.cat].find(([k]) => k === p.sub) || ["",""])[1];
  document.title = p.name + " — C.L Khanna Jewellers";
  document.getElementById("pd").innerHTML = `
  <nav class="crumbs"><a href="/">Home</a> / <a href="${p.cat}.html">${CAT_TITLES[p.cat]}</a> / <a href="${p.cat}.html?sub=${p.sub}">${subLabel}</a> / <span>${p.name}</span></nav>
  <div class="pd-grid">
    <div class="pd-photo" id="zoomBox">
      <img id="zoomImg" src="${imgURL(p)}" alt="${p.name}">
    </div>
    <div class="pd-info">
      <p class="eyebrow">${CAT_TITLES[p.cat]} · ${subLabel}</p>
      <h1>${p.name}</h1>
      <p class="pd-desc">${p.desc}</p>
      <div class="pd-specs">
        <div><b>Metal</b><span>${p.metal}</span></div>
        <div><b>Craftsmanship</b><span>${p.work}</span></div>
        <div><b>Occasion</b><span>${p.occasion}</span></div>
        <div><b>Weight &amp; Price</b><span>On request — varies with the day's rate</span></div>
        <div><b>Certification</b><span>BIS hallmarked</span></div>
      </div>
      <div class="cta-row">
        <a class="btn solid" href="#" onclick="addToCart('${p.img}');return false;">Add to Cart</a>
        <a class="btn ghost" target="_blank" rel="noopener"
           href="https://wa.me/${WA}?text=${encodeURIComponent('Hello C.L Khanna Jewellers, I would like to request the price of the "' + p.name + '" (' + CAT_TITLES[p.cat] + ') from your website.')}">Request Price on WhatsApp</a>
        <a class="btn ghost" href="#" onclick="openAppt(event)">See It In Store</a>
      </div>
      <p class="pd-note">Every piece can be customised — sizes, stones and finish. <a href="custom.html">Learn about custom orders →</a></p>
    </div>
  </div>`;
  const box = document.getElementById("zoomBox"), img = document.getElementById("zoomImg");
  box.addEventListener("mousemove", e => {
    const r = box.getBoundingClientRect();
    img.style.transformOrigin = (((e.clientX - r.left) / r.width) * 100) + "% " + (((e.clientY - r.top) / r.height) * 100) + "%";
    img.style.transform = "scale(2)";
  });
  box.addEventListener("mouseleave", () => { img.style.transform = "scale(1)"; });
}

/* ---------- hero slider ---------- */
function startSlider(){
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dots button");
  if (!slides.length) return;
  let i = 0, t;
  function go(n){
    i = (n + slides.length) % slides.length;
    slides.forEach((s, j) => s.classList.toggle("on", j === i));
    dots.forEach((d, j) => d.classList.toggle("on", j === i));
    clearInterval(t); t = setInterval(() => go(i + 1), 5600);
  }
  dots.forEach((d, j) => d.addEventListener("click", () => go(j)));
  go(0);
}

/* ---------- testimonial carousel ---------- */
function startTesti(){
  const cards = document.querySelectorAll(".t-slide");
  const dots = document.querySelectorAll(".t-dots button");
  if (!cards.length) return;
  let i = 0, t;
  function go(n){
    i = (n + cards.length) % cards.length;
    cards.forEach((c, j) => c.classList.toggle("on", j === i));
    dots.forEach((d, j) => d.classList.toggle("on", j === i));
    clearInterval(t); t = setInterval(() => go(i + 1), 6500);
  }
  dots.forEach((d, j) => d.addEventListener("click", () => go(j)));
  go(0);
}

/* ---------- reveal ---------- */
function reveals(){
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); }
  }), {threshold:.1});
  document.querySelectorAll(".rv").forEach(el => io.observe(el));
}


/* ---------- a11y: keyboard support + escape-to-close ---------- */
function enhanceA11y(){
  document.querySelectorAll('a[onclick]:not([href]), .gallery a, .lookbook a, .ed-track a').forEach(el=>{
    if(el.getAttribute('href')) return;
    if(!el.hasAttribute('tabindex')) el.setAttribute('tabindex','0');
    if(!el.getAttribute('role')) el.setAttribute('role','button');
    if(el.dataset.kb) return; el.dataset.kb='1';
    el.addEventListener('keydown', e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); el.click(); } });
  });
}
function closeAllOverlays(){
  const lb=document.getElementById('lb'); if(lb) lb.style.display='none';
  closeSearch&&closeSearch();
  toggleDrawer&&toggleDrawer(false);
  document.querySelectorAll('.modal.open').forEach(m=>m.classList.remove('open'));
}
document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeAllOverlays(); });

function initPage(active){
  try { buildHeader(active); } catch(e){ console.error("buildHeader failed:", e); }
  try { buildFooter(); } catch(e){ console.error("buildFooter failed:", e); }
  try { buildShells(); } catch(e){ console.error("buildShells failed:", e); }
  try { reveals(); } catch(e){}
  try { if (typeof updateCartBadge === "function") updateCartBadge(); } catch(e){}
  try {
    enhanceA11y();
    new MutationObserver(enhanceA11y).observe(document.body,{childList:true,subtree:true});
  } catch(e){}
}
