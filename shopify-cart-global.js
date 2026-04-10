/**
 * Site-wide Shopify Buy Button cart + bag toggle (navbar #shopify-cart-host).
 * Loads after buy-button-storefront.min.js (include that script in <head> first).
 */
(function () {
  var HOST_ID = "shopify-cart-host";

  var cartOptions = {
    cart: {
      contents: {
        title: true,
        lineItems: true,
        footer: true,
        discounts: true,
        note: false,
      },
      styles: {
        cart: {
          width: "calc(100% - 10px)",
          "max-width": "440px",
        },
        cartScroll: {
          "padding-top": "64px",
          "padding-bottom": "152px",
          "box-sizing": "border-box",
        },
        lineItems: {
          "min-height": "200px",
          "max-height": "min(58vh, 560px)",
          "overflow-y": "auto",
          "overflow-x": "hidden",
          "box-sizing": "border-box",
          "-webkit-overflow-scrolling": "touch",
        },
        button: {
          ":hover": {
            "background-color": "#8329b3",
          },
          "background-color": "#922dc7",
          ":focus": {
            "background-color": "#8329b3",
          },
        },
      },
      text: {
        title: "Cart",
        total: "Subtotal",
        button: "Checkout",
        empty: "Your cart is empty.",
      },
    },
    lineItem: {
      contents: {
        image: true,
        variantTitle: true,
        title: true,
        /* Only one of price / priceWithDiscounts — both true renders two nodes (e.g. $5.99$5.99). */
        price: false,
        priceWithDiscounts: true,
        quantity: true,
        quantityIncrement: true,
        quantityDecrement: true,
        quantityInput: true,
      },
      styles: {
        lineItem: {
          "min-height": "72px",
        },
      },
    },
    toggle: {
      sticky: false,
      styles: {
        toggle: {
          "background-color": "#1a1a1a",
          "border-radius": "4px",
          border: "1px solid rgba(196, 181, 253, 0.35)",
          ":hover": {
            "background-color": "#252525",
            "border-color": "rgba(196, 181, 253, 0.5)",
          },
          ":focus": {
            "background-color": "#252525",
          },
        },
      },
    },
  };

  function mount() {
    if (!window.ShopifyBuy || !window.ShopifyBuy.UI) return;
    var host = document.getElementById(HOST_ID);
    if (!host || host.getAttribute("data-shopify-cart-mounted") === "1") return;

    var client = window.__LAYTONS_SHOPIFY_CLIENT;
    if (!client) {
      client = ShopifyBuy.buildClient({
        domain: "6i3wir-s4.myshopify.com",
        storefrontAccessToken: "5d8f32e6a0f8a5c8acc9f6ca11aa47ab",
      });
      window.__LAYTONS_SHOPIFY_CLIENT = client;
    }

    ShopifyBuy.UI.onReady(client).then(function (ui) {
      if (host.getAttribute("data-shopify-cart-mounted") === "1") return;
      host.setAttribute("data-shopify-cart-mounted", "1");
      ui.createComponent("cart", {
        node: host,
        moneyFormat: "%24%7B%7Bamount%7D%7D",
        options: cartOptions,
      });
    });
  }

  mount();
})();
