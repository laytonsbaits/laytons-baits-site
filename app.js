(function () {
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  var toggle = document.querySelector(".menu-toggle");
  var mobileNav = document.getElementById("mobile-nav");
  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      toggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
      mobileNav.hidden = open;
    });
    mobileNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
        mobileNav.hidden = true;
      });
    });
  }

  var contactForm = document.getElementById("contact-form");
  var contactFeedback = document.getElementById("contact-form-feedback");
  if (contactForm && contactFeedback) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var nameEl = contactForm.querySelector("#contact-name");
      var emailEl = contactForm.querySelector("#contact-email");
      var messageEl = contactForm.querySelector("#contact-message");
      if (!nameEl || !emailEl || !messageEl) return;
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }
      var name = nameEl.value.trim();
      var email = emailEl.value.trim();
      var message = messageEl.value.trim();
      var body =
        "Name: " + name + "\nEmail: " + email + "\n\n" + message;
      var subject = "Layton's Baits — message from " + name;
      contactFeedback.textContent =
        "Opening your email app… If nothing opens, email laytonsbaits@gmail.com.";
      window.location.href =
        "mailto:laytonsbaits@gmail.com?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(body);
    });
  }

  var FORMSPREE_URL = "https://formspree.io/f/mojpreqj";
  var form = document.getElementById("signup-form");
  var feedback = document.getElementById("signup-feedback");
  if (form && feedback) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var input = form.querySelector("#email");
      var btn = form.querySelector(".signup-submit");
      if (!input || !btn) return;

      feedback.classList.remove("is-success", "is-error");
      feedback.textContent = "";
      void feedback.offsetWidth;

      if (!input.checkValidity()) {
        input.focus();
        input.reportValidity();
        return;
      }

      var email = input.value.trim();
      var submitLabel = "Join Email List";
      btn.textContent = "Submitting...";
      btn.classList.add("is-loading");
      btn.disabled = true;
      form.setAttribute("aria-busy", "true");

      fetch(FORMSPREE_URL, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
      })
        .then(function (res) {
          if (res.ok) {
            input.value = "";
            feedback.textContent = "You're in. Stay ready for the next drop.";
            feedback.classList.add("is-success");
          } else {
            feedback.textContent = "Something went wrong. Try again.";
            feedback.classList.add("is-error");
          }
        })
        .catch(function () {
          feedback.textContent = "Something went wrong. Try again.";
          feedback.classList.add("is-error");
        })
        .finally(function () {
          btn.textContent = submitLabel;
          btn.classList.remove("is-loading");
          btn.disabled = false;
          form.removeAttribute("aria-busy");
        });
    });
  }

  var dropModal = document.getElementById("drop-modal");
  var dropPanel = document.getElementById("drop-modal-panel");
  if (dropModal && dropPanel) {
    var imgEl = document.getElementById("drop-modal-img");
    var stockEl = document.getElementById("drop-modal-stock");
    var titleEl = document.getElementById("drop-modal-title");
    var baitTypeEl = document.getElementById("drop-modal-bait-type");
    var scentEl = document.getElementById("drop-modal-scent");
    var actionEl = document.getElementById("drop-modal-action");
    var skuEl = document.getElementById("drop-modal-sku");
    var priceEl = document.getElementById("drop-modal-price");
    var emailEl = document.getElementById("drop-modal-email");
    var closeBtn = dropModal.querySelector(".drop-modal__close");
    var dropSection = document.getElementById("the-drop");
    var packEl = document.getElementById("drop-modal-pack");

    var lastFocus = null;

    function closeDropModal() {
      dropModal.hidden = true;
      document.body.classList.remove("modal-open");
      if (lastFocus && typeof lastFocus.focus === "function") {
        lastFocus.focus();
      }
      lastFocus = null;
    }

    /**
     * Opens the shared drop detail modal for any product card under #the-drop:
     * stick worms, SWIMMER, and CRAWL (same markup: .product-art, .product-name, etc.).
     */
    function openDropModal(card, trigger) {
      lastFocus = trigger || document.activeElement;
      var img = card.querySelector(".product-art");
      var badge = card.querySelector(".product-stock-badge");
      var flavor = card.getAttribute("data-flavor") || "";

      if (imgEl) {
        imgEl.removeAttribute("srcset");
        imgEl.loading = "eager";
        if (img) {
          var artSrc = img.getAttribute("src") || "";
          imgEl.src = artSrc;
          imgEl.alt = img.getAttribute("alt") || "";
        } else {
          imgEl.removeAttribute("src");
          imgEl.alt = "";
        }
      }
      if (badge && stockEl) {
        stockEl.className = badge.className + " drop-modal__stock";
        stockEl.textContent = badge.textContent;
      } else if (stockEl) {
        stockEl.className = "drop-modal__stock";
        stockEl.textContent = "";
      }
      dropPanel.setAttribute("data-flavor", flavor);

      var nameEl = card.querySelector(".product-name");
      var subNameEl = card.querySelector(".product-subtitle");
      var scentNode = card.querySelector(".product-scent");
      var actionNode = card.querySelector(".product-action");
      var skuNode = card.querySelector(".product-card__sku");
      var priceNode = card.querySelector(".product-price");
      if (titleEl) titleEl.textContent = nameEl ? nameEl.textContent : "";
      if (baitTypeEl) baitTypeEl.textContent = subNameEl ? subNameEl.textContent : "";
      if (scentEl) scentEl.textContent = scentNode ? scentNode.textContent : "";
      if (actionEl) actionEl.textContent = actionNode ? actionNode.textContent : "";
      if (skuEl) skuEl.textContent = skuNode ? skuNode.textContent : "";
      if (priceEl) {
        priceEl.textContent = priceNode && priceNode.textContent.trim()
          ? priceNode.textContent
          : "$5.99";
      }
      var packHint = card.querySelector(".product-card__msrp-hint");
      if (packEl) {
        packEl.textContent = packHint ? packHint.textContent : "";
      }

      if (emailEl) {
        var name = titleEl ? titleEl.textContent : "";
        var typeLine = baitTypeEl ? baitTypeEl.textContent.trim().toUpperCase() : "";
        var typeTag = "";
        if (typeLine === "SWIMMER" || typeLine === "CRAWL") {
          typeTag = " (" + typeLine + ")";
        }
        var subject = "Claim — " + name + typeTag + " (THE DROP)";
        emailEl.href =
          "mailto:laytonsbaits@gmail.com?subject=" + encodeURIComponent(subject);
      }

      dropModal.hidden = false;
      document.body.classList.add("modal-open");
      if (closeBtn && typeof closeBtn.focus === "function") {
        closeBtn.focus();
      }
    }

    if (dropSection) {
      dropSection.addEventListener("click", function (e) {
        var card = e.target.closest(".product-card--clickable");
        if (!card || !dropSection.contains(card)) return;
        openDropModal(card, card);
      });
      dropSection.addEventListener("keydown", function (e) {
        var card = e.target.closest(".product-card--clickable");
        if (!card || !dropSection.contains(card)) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openDropModal(card, card);
        }
      });
    }

    dropModal.querySelectorAll("[data-close-drop]").forEach(function (node) {
      node.addEventListener("click", function (e) {
        var href = node.getAttribute("href");
        if (href && href.charAt(0) === "#" && href.length > 1) {
          e.preventDefault();
          closeDropModal();
          var target = document.querySelector(href);
          if (target) target.scrollIntoView({ behavior: "smooth" });
          return;
        }
        e.preventDefault();
        closeDropModal();
      });
    });

    if (emailEl) {
      emailEl.addEventListener("click", function () {
        closeDropModal();
      });
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !dropModal.hidden) {
        closeDropModal();
      }
    });
  }

  var shopDrop = document.querySelector(".shop-drop");
  if (shopDrop) {
    var DROP_TYPE_BLURBS = {
      "Stick Worm":
        "Hand-poured stick worm with a soft, straight tail and a slow shimmy on slack line. Rig wacky, shaky, Neko, or weightless.",
      "Trick Worm":
        "Trick worm profile with a slightly buoyant tail for extra kick on the fall—ideal for shaky heads, Neko, and light Texas setups.",
      Swimmer:
        "Compact swimmer with a boot tail that pulses at slow rolls—great on swim jigs, vibrating jigs, and light Texas rigs.",
      Craw:
        "Craw-style body with kicking claws and a tidy footprint—use as a jig trailer or flip and pitch into cover.",
    };

    var DROP_FLAVOR_BLURBS = {
      "Strawberry Jam":
        "Strawberry Jam is a vivid red-wine tone with fine glitter for stained water and overcast days.",
      "Melon Jam":
        "Melon Jam blends watermelon-inspired greens and pinks with subtle flake for a natural look.",
      "PB&J":
        "PB&J layers warm brown and grape-jelly purple so your bait stands out without looking gimmicky.",
      Blueberry:
        "Blueberry is a deep purple-blue with micro flake—strong in clear to lightly stained water.",
      Galaxy:
        "Galaxy mixes black, purple, and blue flake for low light, docks, and muddy banks.",
    };

    function dropCardDescriptionFromTitle(title) {
      var sep = " – ";
      var i = title.indexOf(sep);
      if (i === -1) return "";
      var baitType = title.slice(0, i).trim();
      var flavor = title.slice(i + sep.length).trim();
      var typePart = DROP_TYPE_BLURBS[baitType];
      var flavorPart = DROP_FLAVOR_BLURBS[flavor];
      if (!typePart || !flavorPart) return "";
      return typePart + " " + flavorPart + " Five baits per bag.";
    }

    function initShopDropFlipCards() {
      shopDrop.querySelectorAll(".shop-card--flip").forEach(function (card) {
        card.setAttribute("role", "button");
        var backName = card.querySelector(".shop-card__name--back");
        var backDesc = card.querySelector(".shop-card__back-desc");
        if (!backName || !backDesc) return;
        var t = (card.getAttribute("data-drop-title") || "").trim();
        if (!t) {
          var frontName = card.querySelector(
            ".shop-card__face--front .shop-card__name"
          );
          t = frontName ? frontName.textContent.trim() : "";
        }
        if (!t) return;
        backName.textContent = t;
        backDesc.textContent = dropCardDescriptionFromTitle(t);
      });
    }

    function shouldSuppressShopDropFlip(target, card) {
      if (!card.contains(target)) return true;
      /* The Buy Button renders image/title/price inside #product-component-*; suppressing
         that whole node blocked all flips. Only skip actual controls (Add to Bag, variants). */
      if (target.closest("button, .shopify-buy__btn")) return true;
      if (target.closest("input, select, textarea, label")) return true;
      return false;
    }

    function toggleShopDropFlipCard(card) {
      var open = !card.classList.contains("is-flipped");
      card.classList.toggle("is-flipped", open);
      card.setAttribute("aria-expanded", open ? "true" : "false");
    }

    shopDrop.addEventListener("click", function (e) {
      var card = e.target.closest(".shop-card--flip");
      if (!card || !shopDrop.contains(card)) return;
      if (shouldSuppressShopDropFlip(e.target, card)) return;
      toggleShopDropFlipCard(card);
    });

    shopDrop.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" && e.key !== " ") return;
      var t = e.target;
      if (!t || !t.classList || !t.classList.contains("shop-card--flip"))
        return;
      if (!shopDrop.contains(t)) return;
      e.preventDefault();
      toggleShopDropFlipCard(t);
    });

    initShopDropFlipCards();
  }

  var slideshowRoot = document.querySelector("[data-slideshow]");
  if (slideshowRoot) {
    var slides = slideshowRoot.querySelectorAll(".drop-slideshow__slide");
    var prevBtn = slideshowRoot.querySelector("[data-slideshow-prev]");
    var nextBtn = slideshowRoot.querySelector("[data-slideshow-next]");
    var dotsWrap = slideshowRoot.querySelector("[data-slideshow-dots]");
    var n = slides.length;
    var idx = 0;
    var timer = null;
    var intervalMs = 5500;

    function setSlide(i) {
      idx = (i + n) % n;
      slides.forEach(function (slide, j) {
        var on = j === idx;
        slide.classList.toggle("is-active", on);
        slide.setAttribute("aria-hidden", on ? "false" : "true");
      });
      if (dotsWrap) {
        dotsWrap.querySelectorAll(".drop-slideshow__dot").forEach(function (dot, j) {
          dot.classList.toggle("is-active", j === idx);
          dot.setAttribute("aria-pressed", j === idx ? "true" : "false");
        });
      }
    }

    function next() {
      setSlide(idx + 1);
    }

    function prev() {
      setSlide(idx - 1);
    }

    function startAutoplay() {
      stopAutoplay();
      timer = window.setInterval(next, intervalMs);
    }

    function stopAutoplay() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    if (dotsWrap && n > 0) {
      dotsWrap.innerHTML = "";
      for (var d = 0; d < n; d++) {
        (function (j) {
          var b = document.createElement("button");
          b.type = "button";
          b.className = "drop-slideshow__dot" + (j === 0 ? " is-active" : "");
          b.setAttribute("aria-label", "Go to slide " + (j + 1));
          b.setAttribute("aria-pressed", j === 0 ? "true" : "false");
          b.addEventListener("click", function () {
            setSlide(j);
            startAutoplay();
          });
          dotsWrap.appendChild(b);
        })(d);
      }
    }

    if (prevBtn) prevBtn.addEventListener("click", function () {
      prev();
      startAutoplay();
    });
    if (nextBtn) nextBtn.addEventListener("click", function () {
      next();
      startAutoplay();
    });

    slideshowRoot.addEventListener("mouseenter", stopAutoplay);
    slideshowRoot.addEventListener("mouseleave", startAutoplay);
    slideshowRoot.addEventListener("focusin", stopAutoplay);
    slideshowRoot.addEventListener("focusout", function () {
      window.setTimeout(function () {
        if (!slideshowRoot.contains(document.activeElement)) startAutoplay();
      }, 0);
    });

    setSlide(0);
    if (n > 1 && window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
      startAutoplay();
    }
  }
})();
