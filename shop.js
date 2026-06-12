/* C.L Khanna Jewellers — shop backend (cart + accounts)
   ====================================================
   ACCOUNTS: paste your Supabase project values below.
   Get them from: supabase.com -> your project -> Settings -> API
*/
const SUPABASE_URL = "https://amqmojrqifsfuhnrabdc.supabase.co";        // e.g. "https://abcdefgh.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtcW1vanJxaWZzZnVobnJhYmRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExMjE2NjEsImV4cCI6MjA5NjY5NzY2MX0.nIjlTO2uIgiaPKnWA3SYXTCglkmDZ1KbS8kPmm9S0vg";   // the long "anon public" key

/* ---------------- cart (works for everyone, saved in browser) ---------------- */
function getCart(){
  try { return JSON.parse(localStorage.getItem("clj_cart") || "[]"); } catch(e){ return []; }
}
function setCart(items){
  localStorage.setItem("clj_cart", JSON.stringify(items));
  updateCartBadge();
  cloudSaveCart(items);
}
function addToCart(id){
  const items = getCart();
  const hit = items.find(i => i.id === id);
  if (hit) hit.qty += 1; else items.push({id, qty:1});
  setCart(items);
  toast("Added to your cart");
}
function removeFromCart(id){
  setCart(getCart().filter(i => i.id !== id));
  if (document.getElementById("cart-list")) renderCartPage();
}
function changeQty(id, d){
  const items = getCart();
  const hit = items.find(i => i.id === id);
  if (!hit) return;
  hit.qty = Math.max(1, hit.qty + d);
  setCart(items);
  renderCartPage();
}
function updateCartBadge(){
  const n = getCart().reduce((s,i) => s + i.qty, 0);
  const el = document.getElementById("cartn");
  if (el){ el.textContent = n || ""; el.style.display = n ? "flex" : "none"; }
}
function toast(msg){
  let t = document.getElementById("toast");
  if (!t){
    t = document.createElement("div");
    t.id = "toast"; t.className = "toast";
    document.body.appendChild(t);
  }
  t.textContent = msg; t.classList.add("show");
  clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 2200);
}

/* ---------------- cart page ---------------- */
function renderCartPage(){
  const box = document.getElementById("cart-list");
  if (!box) return;
  const items = getCart();
  if (!items.length){
    box.innerHTML = `<p class="cart-empty">Your cart is empty. <a href="/#collections">Explore the collections →</a></p>`;
    document.getElementById("cart-actions").style.display = "none";
    return;
  }
  document.getElementById("cart-actions").style.display = "";
  box.innerHTML = items.map(i => {
    const p = PRODUCTS.find(x => x.img === i.id);
    if (!p) return "";
    return `
    <div class="cart-row">
      <a href="product.html?id=${p.img}"><img src="${imgURL(p)}" alt="${p.name}"></a>
      <div class="ci">
        <a href="product.html?id=${p.img}"><h3>${p.name}</h3></a>
        <small>${CAT_TITLES[p.cat]} · ${p.metal}</small>
        <span class="price-note">Price on request</span>
      </div>
      <div class="cq">
        <button onclick="changeQty('${i.id}',-1)">−</button>
        <b>${i.qty}</b>
        <button onclick="changeQty('${i.id}',1)">+</button>
      </div>
      <button class="cx" onclick="removeFromCart('${i.id}')" title="Remove">×</button>
    </div>`;
  }).join("");
}
function sendCartEnquiry(){
  const items = getCart();
  if (!items.length) return;
  const note = (document.getElementById("cart-note") || {}).value || "";
  let msg = "Hello C.L Khanna Jewellers, I would like to enquire about these pieces from your website:\n";
  items.forEach((i, n) => {
    const p = PRODUCTS.find(x => x.img === i.id);
    if (p) msg += `\n${n+1}. ${p.name} (${CAT_TITLES[p.cat]})${i.qty > 1 ? " × " + i.qty : ""}`;
  });
  if (note.trim()) msg += "\n\nNote: " + note.trim();
  window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(msg), "_blank");
}

/* ---------------- accounts (Supabase) ---------------- */
let sb = null, sbUser = null;
function sbReady(){ return !!(SUPABASE_URL && SUPABASE_ANON_KEY); }
function initSupabase(){
  if (!sbReady()) return;
  const s = document.createElement("script");
  s.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
  s.onload = async () => {
    sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data } = await sb.auth.getSession();
    if (data && data.session){ sbUser = data.session.user; afterLogin(); }
    refreshAuthUI();
  };
  document.head.appendChild(s);
}
function openAuth(){
  if (!sbReady()){
    alert("Accounts are launching soon.\nYour cart is already saved on this device — and you can send it to us on WhatsApp any time.");
    return;
  }
  document.getElementById("auth").classList.add("open");
  refreshAuthUI();
}
function refreshAuthUI(){
  const inBox = document.getElementById("auth-forms"), outBox = document.getElementById("auth-signed");
  if (!inBox) return;
  if (sbUser){
    inBox.style.display = "none"; outBox.style.display = "block";
    document.getElementById("auth-email-show").textContent = sbUser.email;
  } else {
    inBox.style.display = "block"; outBox.style.display = "none";
  }
}
async function doAuth(mode){
  if (!sb){ toast("Connecting…"); return; }
  const email = document.getElementById("au-email").value.trim();
  const pass  = document.getElementById("au-pass").value;
  const errEl = document.getElementById("au-err");
  errEl.textContent = "";
  if (!email || pass.length < 6){ errEl.textContent = "Enter a valid email and a password of 6+ characters."; return; }
  const fn = mode === "up"
    ? sb.auth.signUp({ email, password: pass })
    : sb.auth.signInWithPassword({ email, password: pass });
  const { data, error } = await fn;
  if (error){ errEl.textContent = error.message; return; }
  if (mode === "up" && data.user && !data.session){
    errEl.textContent = "Check your email to confirm your account, then sign in.";
    return;
  }
  sbUser = data.user;
  afterLogin();
  refreshAuthUI();
  toast("Welcome to C.L Khanna");
}
async function doLogout(){
  if (sb) await sb.auth.signOut();
  sbUser = null;
  refreshAuthUI();
  toast("Signed out");
}
async function afterLogin(){
  /* merge cloud cart with local cart */
  if (!sb || !sbUser) return;
  try {
    const { data } = await sb.from("carts").select("items").eq("user_id", sbUser.id).maybeSingle();
    const cloud = (data && data.items) || [];
    const local = getCart();
    const merged = [...local];
    cloud.forEach(c => { if (!merged.find(m => m.id === c.id)) merged.push(c); });
    localStorage.setItem("clj_cart", JSON.stringify(merged));
    updateCartBadge();
    if (document.getElementById("cart-list")) renderCartPage();
    cloudSaveCart(merged);
  } catch(e){}
}
async function cloudSaveCart(items){
  if (!sb || !sbUser) return;
  try {
    await sb.from("carts").upsert({ user_id: sbUser.id, items, updated_at: new Date().toISOString() });
  } catch(e){}
}

/* auth modal shell — injected on every page */
function buildAuthShell(){
  document.body.insertAdjacentHTML("beforeend", `
  <div class="modal" id="auth">
    <div class="box">
      <button class="x" onclick="document.getElementById('auth').classList.remove('open')">×</button>
      <h3>Your Account</h3>
      <p class="sub">Save your cart and enquiries across devices.</p>
      <div id="auth-forms">
        <label>Email</label><input id="au-email" type="email" placeholder="you@example.com">
        <label>Password</label><input id="au-pass" type="password" placeholder="6+ characters">
        <p id="au-err" class="au-err"></p>
        <div class="auth-btns">
          <button class="btn solid" onclick="doAuth('in')">Sign In</button>
          <button class="btn ghost" onclick="doAuth('up')">Create Account</button>
        </div>
      </div>
      <div id="auth-signed" style="display:none">
        <p class="signed">Signed in as <b id="auth-email-show"></b></p>
        <div class="auth-btns">
          <a class="btn ghost" href="cart.html">View My Cart</a>
          <button class="btn solid" onclick="doLogout()">Sign Out</button>
        </div>
      </div>
    </div>
  </div>`);
}

document.addEventListener("DOMContentLoaded", () => {
  buildAuthShell();
  updateCartBadge();
  initSupabase();
});
