/* C.L Khanna — CMS loader (safe, non-blocking)
   Each page first renders the built-in catalogue (catalog.js) immediately, so
   the site ALWAYS shows. This then quietly upgrades to the database products
   if they load. Any failure or slowness is ignored — the page is never blocked. */
(function(){
  if (typeof SUPABASE_URL === "undefined" || !SUPABASE_URL || !SUPABASE_ANON_KEY) return;
  var ctrl = new AbortController();
  var timer = setTimeout(function(){ try{ ctrl.abort(); }catch(e){} }, 6000);
  fetch(SUPABASE_URL + "/rest/v1/products?select=*&order=sort.asc", {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: "Bearer " + SUPABASE_ANON_KEY },
    signal: ctrl.signal
  })
  .then(function(r){ return r.ok ? r.json() : null; })
  .then(function(rows){
    clearTimeout(timer);
    if (Array.isArray(rows) && rows.length){
      window.PRODUCTS = rows.map(function(r){ return {
        img:r.img, cat:r.cat, sub:r.sub, name:r.name, desc:r.description||"",
        metal:r.metal||"", work:r.work||"", occasion:r.occasion||"", image_url:r.image_url||""
      };});
      if (typeof window.__cmsRender === "function"){ try{ window.__cmsRender(); }catch(e){} }
    }
  })
  .catch(function(){ clearTimeout(timer); });
})();

/* ---- Editorial / model photos: load from Supabase if any, else keep built-in ---- */
(function(){
  if (typeof SUPABASE_URL === "undefined" || !SUPABASE_URL || !SUPABASE_ANON_KEY) return;
  var track = document.getElementById("editorial-track");
  if (!track) return;
  var ctrl = new AbortController();
  var timer = setTimeout(function(){ try{ ctrl.abort(); }catch(e){} }, 6000);
  fetch(SUPABASE_URL + "/rest/v1/editorial_images?select=*&order=sort.asc", {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: "Bearer " + SUPABASE_ANON_KEY },
    signal: ctrl.signal
  })
  .then(function(r){ return r.ok ? r.json() : null; })
  .then(function(rows){
    clearTimeout(timer);
    if (!Array.isArray(rows) || !rows.length) return;
    function cell(u, hidden){
      var h = hidden ? ' aria-hidden="true" tabindex="-1"' : '';
      return '<a onclick="openLB(\'' + u + '\')"' + h + '><img loading="lazy" src="' + u + '" alt="Editorial photo"></a>';
    }
    var html = rows.map(function(r){ return cell(r.image_url, false); }).join("");
    var dup  = rows.map(function(r){ return cell(r.image_url, true); }).join("");
    track.innerHTML = html + dup;
  })
  .catch(function(){ clearTimeout(timer); });
})();
