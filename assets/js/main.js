/* Holvana – gemockte Shop-Prozesse (kein Backend).
   Warenkorb, Kasse, Bestellbestätigung, Kontaktformular und Cookie-Einwilligung
   laufen nur im Browser. Gespeichert wird im localStorage des Besuchers. */
(function () {
  "use strict";

  /* ---------- Speicher (mit Rückfall auf Arbeitsspeicher) ---------- */
  var memory = {};
  var store = {
    get: function (key, fallback) {
      try {
        var raw = window.localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      } catch (e) {
        return key in memory ? memory[key] : fallback;
      }
    },
    set: function (key, value) {
      try { window.localStorage.setItem(key, JSON.stringify(value)); }
      catch (e) { memory[key] = value; }
    },
    remove: function (key) {
      try { window.localStorage.removeItem(key); } catch (e) { delete memory[key]; }
    }
  };

  var root = document.documentElement.getAttribute("data-root") || "";

  /* ---------- Produktkatalog (Preise = Platzhalter) ---------- */
  var PRODUCTS = {
    einzel: { name: "Holvana 1 – Einzellizenz", short: "Einzellizenz", price: 49, img: "assets/img/box-einzel.svg",
      desc: "Für eine Person und alle eigenen Geräte" },
    familie: { name: "Holvana 1 – Familienlizenz", short: "Familienlizenz", price: 89, img: "assets/img/box-familie.svg",
      desc: "Für bis zu fünf Personen in einem Haushalt" }
  };
  var VAT = 0.20;
  var euro = new Intl.NumberFormat("de-AT", { style: "currency", currency: "EUR" });

  function getCart() { return store.get("holvana-cart", []); }
  function setCart(cart) { store.set("holvana-cart", cart); updateBadge(); }
  function cartCount(cart) { return cart.reduce(function (n, i) { return n + i.qty; }, 0); }
  function cartTotal(cart) { return cart.reduce(function (s, i) { return s + PRODUCTS[i.id].price * i.qty; }, 0); }

  function addToCart(id, qty) {
    var cart = getCart();
    var line = cart.find(function (i) { return i.id === id; });
    if (line) line.qty = Math.min(10, line.qty + qty); else cart.push({ id: id, qty: qty });
    setCart(cart);
  }

  function updateBadge() {
    var n = cartCount(getCart());
    document.querySelectorAll("[data-cart-count]").forEach(function (el) { el.textContent = n; });
    document.querySelectorAll("[data-cart-link]").forEach(function (el) {
      el.hidden = n === 0 && !el.hasAttribute("aria-current");
    });
    document.querySelectorAll("[data-cart-label]").forEach(function (el) {
      el.textContent = n === 1 ? "1 Artikel" : n + " Artikel";
    });
  }

  /* ---------- Fehleranzeige für Formulare ---------- */
  function setError(field, message) {
    var el = document.getElementById(field.id + "-error");
    if (el) el.textContent = message || "";
    if (message) field.setAttribute("aria-invalid", "true"); else field.removeAttribute("aria-invalid");
  }
  function showSummary(box, errors) {
    if (!box) return;
    if (!errors.length) { box.hidden = true; box.innerHTML = ""; return; }
    var html = '<h2 id="err-title">Bitte prüfen Sie Ihre Eingaben (' + errors.length + ")</h2><ul>";
    errors.forEach(function (e) { html += '<li><a href="#' + e.id + '">' + e.msg + "</a></li>"; });
    box.innerHTML = html + "</ul>";
    box.hidden = false;
    box.focus();
  }
  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  /* ---------- Cookie-Einwilligung (gemockt) ---------- */
  function initConsent() {
    var banner = document.getElementById("consent");
    var consent = store.get("holvana-consent", null);
    if (banner && !consent) banner.hidden = false;
    function save(stats) {
      store.set("holvana-consent", { necessary: true, statistics: stats, date: new Date().toISOString() });
      if (banner) banner.hidden = true;
      if (stats) mockAnalytics();
    }
    document.querySelectorAll("[data-consent]").forEach(function (b) {
      b.addEventListener("click", function () {
        save(b.getAttribute("data-consent") === "all");
        var main = document.getElementById("inhalt");
        if (main) main.focus();
      });
    });
    document.querySelectorAll("[data-open-consent]").forEach(function (b) {
      b.addEventListener("click", function () {
        if (!banner) return;
        banner.hidden = false;
        var first = banner.querySelector("button");
        if (first) first.focus();
      });
    });
    if (consent && consent.statistics) mockAnalytics();

    /* Seite "Cookie-Einstellungen" */
    var form = document.getElementById("cookie-form");
    if (form) {
      var box = document.getElementById("cookie-stats");
      var status = document.getElementById("cookie-status");
      box.checked = !!(consent && consent.statistics);
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        save(box.checked);
        status.innerHTML = "<strong>Gespeichert.</strong> Statistik-Cookies sind jetzt " + (box.checked ? "aktiviert." : "deaktiviert.");
      });
    }
  }
  function mockAnalytics() {
    /* Platzhalter für ein Analyse-Tool. Es werden keine Daten übertragen. */
    if (window.console) console.info("[Demo-Analyse] Seitenaufruf:", location.pathname);
  }

  /* ---------- Produktseite: Bildergalerie und Kauf ---------- */
  function initProduct() {
    var main = document.getElementById("gallery-img");
    if (main) {
      var cap = document.getElementById("gallery-cap");
      document.querySelectorAll("[data-shot]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          main.src = btn.getAttribute("data-shot");
          main.alt = btn.getAttribute("data-alt");
          cap.textContent = btn.getAttribute("data-alt");
          document.querySelectorAll("[data-shot]").forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
        });
      });
    }
    var form = document.getElementById("buy-form");
    if (form) {
      var status = document.getElementById("buy-status");
      var priceEl = document.getElementById("buy-price");
      function refresh() {
        var id = form.querySelector("input[name=lizenz]:checked").value;
        priceEl.textContent = euro.format(PRODUCTS[id].price);
      }
      form.addEventListener("change", refresh);
      refresh();
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var id = form.querySelector("input[name=lizenz]:checked").value;
        var qty = parseInt(document.getElementById("buy-qty").value, 10) || 1;
        addToCart(id, qty);
        if (e.submitter && e.submitter.value === "kasse") {
          location.href = root + "kasse/index.html";
          return;
        }
        status.innerHTML = "<strong>✓ Zum Warenkorb hinzugefügt:</strong> " + qty + " × " + PRODUCTS[id].name +
          '. <a href="' + root + 'warenkorb/index.html">Zum Warenkorb</a>';
      });
    }
    document.querySelectorAll("[data-add]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        addToCart(btn.getAttribute("data-add"), 1);
        location.href = root + "warenkorb/index.html";
      });
    });
  }

  /* ---------- Warenkorb ---------- */
  function initCart() {
    var list = document.getElementById("cart-list");
    if (!list) return;
    var empty = document.getElementById("cart-empty");
    var filled = document.getElementById("cart-filled");
    var status = document.getElementById("cart-status");

    function render() {
      var cart = getCart();
      empty.hidden = cart.length > 0;
      filled.hidden = cart.length === 0;
      list.innerHTML = "";
      cart.forEach(function (item) {
        var p = PRODUCTS[item.id];
        var li = document.createElement("li");
        li.className = "cart-item";
        var opts = "";
        for (var q = 1; q <= 10; q++) opts += '<option value="' + q + '"' + (q === item.qty ? " selected" : "") + ">" + q + "</option>";
        li.innerHTML =
          '<img src="' + root + p.img + '" alt="" width="110" height="69">' +
          "<div><h2 class=\"item-title\">" + p.name + '</h2><p class="muted" style="margin:0">' + p.desc + " · Download, sofort verfügbar</p>" +
          '<div class="controls"><label for="qty-' + item.id + '">Anzahl</label>' +
          '<select id="qty-' + item.id + '" data-qty="' + item.id + '">' + opts + "</select>" +
          '<button type="button" class="linkbtn" data-remove="' + item.id + '">Entfernen<span class="sr-only">: ' + p.name + "</span></button></div></div>" +
          '<p class="line-price">' + euro.format(p.price * item.qty) + "</p>";
        list.appendChild(li);
      });
      var total = cartTotal(cart);
      var net = total / (1 + VAT);
      document.getElementById("sum-count").textContent = cartCount(cart);
      document.getElementById("sum-net").textContent = euro.format(net);
      document.getElementById("sum-vat").textContent = euro.format(total - net);
      document.getElementById("sum-total").textContent = euro.format(total);
    }
    list.addEventListener("change", function (e) {
      var id = e.target.getAttribute("data-qty");
      if (!id) return;
      var cart = getCart();
      cart.forEach(function (i) { if (i.id === id) i.qty = parseInt(e.target.value, 10); });
      setCart(cart);
      render();
      document.getElementById("qty-" + id).focus();
      status.textContent = "Anzahl geändert. Neue Summe: " + euro.format(cartTotal(getCart()));
    });
    list.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-remove]");
      if (!btn) return;
      var id = btn.getAttribute("data-remove");
      setCart(getCart().filter(function (i) { return i.id !== id; }));
      render();
      status.textContent = PRODUCTS[id].name + " wurde entfernt.";
      var h = document.getElementById("cart-title");
      if (h) h.focus();
    });
    render();
  }

  /* ---------- Kasse ---------- */
  var KEY_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; /* ohne I, L, O, 0, 1 */
  function randomBlock(n) {
    var s = "";
    var bytes = new Uint32Array(n);
    (window.crypto || window.msCrypto).getRandomValues(bytes);
    for (var i = 0; i < n; i++) s += KEY_CHARS[bytes[i] % KEY_CHARS.length];
    return s;
  }
  function initCheckout() {
    var form = document.getElementById("checkout-form");
    if (!form) return;
    var cart = getCart();
    var box = document.getElementById("checkout-items");
    if (!cart.length) {
      form.hidden = true;
      document.getElementById("checkout-empty").hidden = false;
      return;
    }
    var html = "";
    cart.forEach(function (i) {
      html += "<dt>" + i.qty + " × " + PRODUCTS[i.id].short + '<br><small class="hint">' + PRODUCTS[i.id].desc + ", nur private Nutzung, unbefristet, Download</small></dt><dd>" + euro.format(PRODUCTS[i.id].price * i.qty) + "</dd>";
    });
    var total = cartTotal(cart);
    html += "<dt>davon 20 % USt.</dt><dd>" + euro.format(total - total / (1 + VAT)) + "</dd>";
    html += '<dt class="total">Gesamt</dt><dd class="total">' + euro.format(total) + "</dd>";
    box.innerHTML = html;

    var summary = document.getElementById("checkout-errors");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var errors = [];
      function need(id, ok, msg) {
        var f = document.getElementById(id);
        setError(f, ok ? "" : msg);
        if (!ok) errors.push({ id: id, msg: msg });
      }
      var name = document.getElementById("co-name").value.trim();
      var mail = document.getElementById("co-email").value.trim();
      need("co-name", name.length > 1, "Geben Sie Ihren vollständigen Namen ein.");
      need("co-email", EMAIL.test(mail), "Geben Sie eine gültige E-Mail-Adresse ein, z. B. name@beispiel.at.");
      need("co-country", document.getElementById("co-country").value !== "", "Wählen Sie Ihr Land aus.");
      var pay = form.querySelector("input[name=zahlung]:checked");
      var payErr = document.getElementById("co-pay-error");
      payErr.textContent = pay ? "" : "Wählen Sie eine Zahlungsart.";
      if (!pay) errors.push({ id: "pay-1", msg: "Wählen Sie eine Zahlungsart." });
      need("co-terms", document.getElementById("co-terms").checked, "Bestätigen Sie die Lizenzbedingungen und AGB.");
      need("co-fagg", document.getElementById("co-fagg").checked, "Bestätigen Sie die sofortige Bereitstellung der Software.");
      showSummary(summary, errors);
      if (errors.length) return;

      var order = {
        nr: "HV-" + new Date().getFullYear() + "-" + randomBlock(6),
        date: new Date().toISOString(),
        email: mail,
        items: cart,
        total: total,
        keys: []
      };
      cart.forEach(function (i) {
        for (var k = 0; k < i.qty; k++) {
          order.keys.push({ product: PRODUCTS[i.id].short, key: [randomBlock(5), randomBlock(5), randomBlock(5), randomBlock(5)].join("-") });
        }
      });
      store.set("holvana-order", order);
      setCart([]);
      location.href = root + "bestellung/index.html";
    });
  }

  /* ---------- Bestellbestätigung ---------- */
  function initOrder() {
    var box = document.getElementById("order");
    if (!box) return;
    var order = store.get("holvana-order", null);
    if (!order) { document.getElementById("order-none").hidden = false; box.hidden = true; return; }
    document.getElementById("order-nr").textContent = order.nr;
    document.getElementById("order-mail").textContent = order.email;
    document.getElementById("order-total").textContent = euro.format(order.total);
    var keys = document.getElementById("order-keys");
    order.keys.forEach(function (k, idx) {
      var div = document.createElement("div");
      div.className = "keybox";
      div.innerHTML = '<div><span class="muted">' + k.product + " – Lizenzschlüssel " + (idx + 1) + '</span><br><code class="mono" id="key-' + idx + '">' + k.key + "</code></div>" +
        '<button type="button" class="btn btn-small" data-copy="key-' + idx + '">Kopieren<span class="sr-only"> (Lizenzschlüssel ' + (idx + 1) + ")</span></button>";
      keys.appendChild(div);
    });
    var status = document.getElementById("order-status");
    keys.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-copy]");
      if (!btn) return;
      var text = document.getElementById(btn.getAttribute("data-copy")).textContent;
      function fallback() {
        var range = document.createRange();
        range.selectNodeContents(document.getElementById(btn.getAttribute("data-copy")));
        var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(range);
        status.textContent = "Schlüssel markiert. Kopieren Sie ihn mit Strg + C.";
      }
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function () { status.textContent = "Lizenzschlüssel kopiert."; }, fallback);
      } else fallback();
    });
  }

  /* ---------- Demo-Downloads ---------- */
  function initDownloads() {
    var status = document.getElementById("download-status");
    document.querySelectorAll("[data-download]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (status) status.innerHTML = "<strong>Demo:</strong> Der Download für " + btn.getAttribute("data-download") +
          " würde jetzt starten. In diesem Studienprojekt gibt es keine echte Installationsdatei.";
      });
    });
  }

  /* ---------- Kontaktformular ---------- */
  function initContact() {
    var form = document.getElementById("contact-form");
    if (!form) return;
    var summary = document.getElementById("contact-errors");
    var status = document.getElementById("contact-status");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var errors = [];
      function need(id, ok, msg) {
        var f = document.getElementById(id);
        setError(f, ok ? "" : msg);
        if (!ok) errors.push({ id: id, msg: msg });
      }
      need("ct-name", document.getElementById("ct-name").value.trim().length > 1, "Geben Sie Ihren Namen ein.");
      need("ct-email", EMAIL.test(document.getElementById("ct-email").value.trim()), "Geben Sie eine gültige E-Mail-Adresse ein, z. B. name@beispiel.at.");
      need("ct-topic", document.getElementById("ct-topic").value !== "", "Wählen Sie ein Thema aus.");
      need("ct-msg", document.getElementById("ct-msg").value.trim().length >= 10, "Ihre Nachricht ist zu kurz (mindestens 10 Zeichen).");
      showSummary(summary, errors);
      if (errors.length) { status.innerHTML = ""; return; }
      form.reset();
      status.innerHTML = "<strong>Vielen Dank für Ihre Nachricht.</strong> Dies ist eine Demo: Es wurde nichts versendet und nichts gespeichert.";
      status.focus();
    });
  }

  /* ---------- Fehlermeldung beim Tippen zurücksetzen ---------- */
  document.addEventListener("input", function (e) {
    if (e.target.getAttribute && e.target.getAttribute("aria-invalid") === "true") setError(e.target, "");
  });

  document.addEventListener("DOMContentLoaded", function () {
    updateBadge();
    initConsent();
    initProduct();
    initCart();
    initCheckout();
    initOrder();
    initDownloads();
    initContact();
  });
})();
