// gtm.js
export const initGtm = (gtmId) => {
  if (!gtmId) return;

  // Inject GTM script dynamically
  (function (w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
    const f = d.getElementsByTagName(s)[0];
    const j = d.createElement(s);
    const dl = l !== "dataLayer" ? "&l=" + l : "";
    j.async = true;
    j.src = `https://www.googletagmanager.com/gtm.js?id=${i}${dl}`;
    f.parentNode.insertBefore(j, f);
  })(window, document, "script", "dataLayer", gtmId);

  // Inject noscript iframe for non-JS users
  const noscript = document.createElement("noscript");
  noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
  document.body.appendChild(noscript);
};

// Push events to GTM dataLayer
export const pushToDataLayer = (event) => {
  if (!window.dataLayer) window.dataLayer = [];
  window.dataLayer.push(event);
};