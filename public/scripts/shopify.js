/* global ShopifyBuy */

/*<![CDATA[*/
document.onload = (function () {
  var scriptURL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
  if (window.ShopifyBuy) {
    if (window.ShopifyBuy.UI) {
      ShopifyBuyInit();
    } else {
      setTimeout(function(){ loadScript(); }, 5000);
    }
  } else {
    setTimeout(function(){ loadScript(); }, 5000);
  }
  function loadScript() {
    //var d = document.getElementById('product-component-1574115873219');
    var d = document.getElementById('shopify-product-embed');
    if (d) {
      var script = document.createElement('script');
      script.async = true;
      script.src = scriptURL;
      (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);
      script.onload = ShopifyBuyInit;
    }
  }
  function ShopifyBuyInit() {
    var client = ShopifyBuy.buildClient({
      domain: 'nanowrimo-store.myshopify.com',
      storefrontAccessToken: '3b08abc6ab30b8a4ba17cf6303ab3945',
    });
    ShopifyBuy.UI.onReady(client).then(function (ui) {
      ui.createComponent('product', {
        id: '3938727002135',
        node: document.getElementById('product-component-1574115873219'),
        moneyFormat: '%24%7B%7Bamount%7D%7D',
        options: {
  "product": {
    "styles": {
      "product": {
        "@media (min-width: 601px)": {
          "max-width": "calc(25% - 20px)",
          "margin-left": "20px",
          "margin-bottom": "50px"
        }
      },
      "button": {
        "font-weight": "bold",
        "font-size": "16px",
        "padding-top": "16px",
        "padding-bottom": "16px",
        "color": "#fdf8df",
        ":hover": {
          "color": "#fdf8df",
          "background-color": "#1869a8"
        },
        "background-color": "#1b75bb",
        ":focus": {
          "background-color": "#1869a8"
        },
        "border-radius": "4px",
        "padding-left": "26px",
        "padding-right": "26px"
      },
      "quantityInput": {
        "font-size": "16px",
        "padding-top": "16px",
        "padding-bottom": "16px"
      }
    },
    "contents": {
      "button": false,
      "buttonWithQuantity": true
    },
    "text": {
      "button": "Add to cart"
    }
  },
  "productSet": {
    "styles": {
      "products": {
        "@media (min-width: 601px)": {
          "margin-left": "-20px"
        }
      }
    }
  },
  "modalProduct": {
    "contents": {
      "img": false,
      "imgWithCarousel": true,
      "button": false,
      "buttonWithQuantity": true
    },
    "styles": {
      "product": {
        "@media (min-width: 601px)": {
          "max-width": "100%",
          "margin-left": "0px",
          "margin-bottom": "0px"
        }
      },
      "button": {
        "font-weight": "bold",
        "font-size": "16px",
        "padding-top": "16px",
        "padding-bottom": "16px",
        "color": "#fdf8df",
        ":hover": {
          "color": "#fdf8df",
          "background-color": "#1869a8"
        },
        "background-color": "#1b75bb",
        ":focus": {
          "background-color": "#1869a8"
        },
        "border-radius": "4px",
        "padding-left": "26px",
        "padding-right": "26px"
      },
      "quantityInput": {
        "font-size": "16px",
        "padding-top": "16px",
        "padding-bottom": "16px"
      }
    }
  },
  "cart": {
    "styles": {
      "button": {
        "font-weight": "bold",
        "font-size": "16px",
        "padding-top": "16px",
        "padding-bottom": "16px",
        "color": "#fdf8df",
        ":hover": {
          "color": "#fdf8df",
          "background-color": "#1869a8"
        },
        "background-color": "#1b75bb",
        ":focus": {
          "background-color": "#1869a8"
        },
        "border-radius": "4px"
      },
      "title": {
        "color": "#4c4c4c"
      },
      "header": {
        "color": "#4c4c4c"
      },
      "lineItems": {
        "color": "#4c4c4c"
      },
      "subtotalText": {
        "color": "#4c4c4c"
      },
      "subtotal": {
        "color": "#4c4c4c"
      },
      "notice": {
        "color": "#4c4c4c"
      },
      "currency": {
        "color": "#4c4c4c"
      },
      "close": {
        "color": "#4c4c4c",
        ":hover": {
          "color": "#4c4c4c"
        }
      },
      "empty": {
        "color": "#4c4c4c"
      },
      "noteDescription": {
        "color": "#4c4c4c"
      },
      "discountText": {
        "color": "#4c4c4c"
      },
      "discountIcon": {
        "fill": "#4c4c4c"
      },
      "discountAmount": {
        "color": "#4c4c4c"
      }
    },
    "text": {
      "title": "Winner Cart",
      "notice": ""
    }
  },
  "toggle": {
    "styles": {
      "toggle": {
        "font-weight": "bold",
        "background-color": "#1b75bb",
        ":hover": {
          "background-color": "#1869a8"
        },
        ":focus": {
          "background-color": "#1869a8"
        }
      },
      "count": {
        "font-size": "16px",
        "color": "#fdf8df",
        ":hover": {
          "color": "#fdf8df"
        }
      },
      "iconPath": {
        "fill": "#fdf8df"
      }
    }
  },
  "lineItem": {
    "styles": {
      "variantTitle": {
        "color": "#4c4c4c"
      },
      "title": {
        "color": "#4c4c4c"
      },
      "price": {
        "color": "#4c4c4c"
      },
      "fullPrice": {
        "color": "#4c4c4c"
      },
      "discount": {
        "color": "#4c4c4c"
      },
      "discountIcon": {
        "fill": "#4c4c4c"
      },
      "quantity": {
        "color": "#4c4c4c"
      },
      "quantityIncrement": {
        "color": "#4c4c4c",
        "border-color": "#4c4c4c"
      },
      "quantityDecrement": {
        "color": "#4c4c4c",
        "border-color": "#4c4c4c"
      },
      "quantityInput": {
        "color": "#4c4c4c",
        "border-color": "#4c4c4c"
      }
    }
  }
},
      });
    });
  }
})();
/*]]>*/
