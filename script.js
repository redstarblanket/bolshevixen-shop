// FOURTHWALL CHECKOUT SETTINGS

const FOURTHWALL_SHOP =
  "https://bolshevixen-shop.fourthwall.com";



// CURRENT PRODUCT

let currentProduct = null;



// LOAD INDIVIDUAL PRODUCT

async function loadFourthwallProduct() {

  const slug =
    document.body.dataset.productSlug;

  // Homepage has no product slug.
  if (!slug) {
    return;
  }


  try {

    // Product data comes through our
    // private Vercel API route.
    const response = await fetch(
      `/api/product?slug=${encodeURIComponent(slug)}`
    );


    if (!response.ok) {

      throw new Error(
        `Fourthwall returned ${response.status}`
      );

    }


    const product =
      await response.json();


    currentProduct = product;


    console.log(
      "Fourthwall product:",
      product
    );


    // PAGE ELEMENTS

    const title =
      document.getElementById(
        "product-title"
      );


    const price =
      document.getElementById(
        "product-price"
      );


    const description =
      document.getElementById(
        "product-description"
      );


    const mainImage =
      document.getElementById(
        "product-main-image"
      );


    const thumbnailContainer =
      document.getElementById(
        "product-thumbnails"
      );


    const testCheckout =
      document.getElementById(
        "test-checkout"
      );


    // TITLE

    if (title) {

      title.textContent =
        product.name;

    }


    // DESCRIPTION

    if (description) {

      const temp =
        document.createElement("div");


      temp.innerHTML =
        product.description || "";


      const cleanText =
        temp.textContent
          .replace(/\s+/g, " ")
          .trim();


      description.textContent =
        cleanText;

    }


    // PRICE

    if (
      price &&
      product.variants?.length > 0
    ) {

      const productPrice =
        product.variants[0].unitPrice;


      if (productPrice) {

        price.textContent =
          new Intl.NumberFormat(
            "en-US",
            {
              style: "currency",
              currency:
                productPrice.currency
            }
          ).format(
            productPrice.value
          );

      }

    }


    // MAIN IMAGE

    if (
      mainImage &&
      product.images?.length > 0
    ) {

      mainImage.src =
        product.images[0].url;


      mainImage.alt =
        product.name;

    }


    // THUMBNAILS

    if (
      thumbnailContainer &&
      mainImage &&
      product.images?.length > 0
    ) {

      thumbnailContainer.innerHTML =
        "";


      product.images.forEach(
        (image, index) => {

          const button =
            document.createElement(
              "button"
            );


          button.type =
            "button";


          button.className =
            index === 0
              ? "thumbnail active"
              : "thumbnail";


          const img =
            document.createElement(
              "img"
            );


          img.src =
            image.url;


          img.alt =
            `${product.name} photo ${index + 1}`;


          button.appendChild(img);


          button.addEventListener(
            "click",
            () => {

              mainImage.src =
                image.url;


              mainImage.alt =
                `${product.name} photo ${index + 1}`;


              thumbnailContainer
                .querySelectorAll(
                  ".thumbnail"
                )
                .forEach(
                  (thumbnail) => {

                    thumbnail
                      .classList
                      .remove(
                        "active"
                      );

                  }
                );


              button.classList.add(
                "active"
              );

            }
          );


          thumbnailContainer
            .appendChild(button);

        }
      );

    }


    // TEST CHECKOUT

    if (
      testCheckout &&
      product.variants?.length > 0
    ) {

      const variantId =
        product.variants[0].id;


      testCheckout.href =
        `${FOURTHWALL_SHOP}/cart/checkout` +
        `?products=${encodeURIComponent(variantId)}:1` +
        `&currency=USD`;

    }


  } catch (error) {

    console.error(
      "Could not load Fourthwall product:",
      error
    );

  }

}


// Load product when page opens.

loadFourthwallProduct();



// CART TEST MODE

const cartTestArea =
  document.getElementById(
    "cart-test-area"
  );


const comingSoon =
  document.getElementById(
    "coming-soon"
  );


const params =
  new URLSearchParams(
    window.location.search
  );


const cartTestMode =
  params.get("testcart") === "1";


if (
  cartTestMode &&
  cartTestArea
) {

  cartTestArea.hidden =
    false;


  if (comingSoon) {

    comingSoon.hidden =
      true;

  }

}


// CART

const addToCartButton =
  document.getElementById(
    "add-to-cart"
  );


const cartMessage =
  document.getElementById(
    "cart-message"
  );


async function createCart() {

  const response = await fetch(
    "/api/cart",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json"
      },

      body: JSON.stringify({
        action: "create"
      })
    }
  );


  if (!response.ok) {

    throw new Error(
      "Could not create cart"
    );

  }


  return response.json();

}


async function addProductToCart() {

  if (
    !currentProduct ||
    !currentProduct.variants?.length
  ) {

    throw new Error(
      "Product has not loaded"
    );

  }


  let cartId =
    localStorage.getItem(
      "fourthwallCartId"
    );


  if (!cartId) {

    const cart =
      await createCart();


    cartId =
      cart.id;


    localStorage.setItem(
      "fourthwallCartId",
      cartId
    );

  }


  const variantId =
    currentProduct.variants[0].id;


  const response = await fetch(
    "/api/cart",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json"
      },

      body: JSON.stringify({
        action: "add",
        cartId,
        variantId,
        quantity: 1
      })
    }
  );


  if (!response.ok) {

    throw new Error(
      "Could not add item"
    );

  }


  return response.json();

}


if (addToCartButton) {

  addToCartButton.addEventListener(
    "click",
    async () => {

      addToCartButton.disabled =
        true;


      addToCartButton.textContent =
        "Adding...";


      try {

        await addProductToCart();


        addToCartButton.textContent =
          "Added! ♥";


        if (cartMessage) {

          cartMessage.textContent =
            "Added to your cart.";

        }


        setTimeout(
          () => {

            addToCartButton.textContent =
              "Add to Cart";


            addToCartButton.disabled =
              false;

          },
          1200
        );


      } catch (error) {

        console.error(
          "Cart error:",
          error
        );


        addToCartButton.textContent =
          "Add to Cart";


        addToCartButton.disabled =
          false;


        if (cartMessage) {

          cartMessage.textContent =
            "Could not add item.";

        }

      }

    }
  );

}

// CART PAGE

const cartItemsContainer =
  document.getElementById(
    "cart-items"
  );


const cartSubtotal =
  document.getElementById(
    "cart-subtotal"
  );


const checkoutButton =
  document.getElementById(
    "checkout-button"
  );


async function getCart(
  cartId
) {

  const response = await fetch(
    `/api/cart?action=get&cartId=${encodeURIComponent(cartId)}`
  );


  if (!response.ok) {

    throw new Error(
      "Could not load cart"
    );

  }


  return response.json();

}


function formatMoney(
  value,
  currency = "USD"
) {

  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency
    }
  ).format(value);

}


function renderCart(
  cart
) {

  if (!cartItemsContainer) {
    return;
  }


  cartItemsContainer.innerHTML =
    "";


  if (
    !cart.items ||
    cart.items.length === 0
  ) {

    cartItemsContainer.innerHTML = `
      <p class="empty-cart">
        Your cart is empty.
      </p>
    `;


    if (cartSubtotal) {

      cartSubtotal.textContent =
        "$0.00";

    }


    return;

  }


  let subtotal =
    0;


  cart.items.forEach(
    (item) => {

      const variant =
        item.variant;


      const quantity =
        item.quantity || 1;


      const unitPrice =
        variant.unitPrice;


      const itemTotal =
        unitPrice.value *
        quantity;


      subtotal +=
        itemTotal;


      const image =
        variant.images?.[0]?.url || "";


      const productName =
        variant.product?.name ||
        variant.name ||
        "Product";


      const article =
        document.createElement(
          "article"
        );


      article.className =
        "cart-item";


      article.innerHTML = `
        <div class="cart-item-image">
          ${
            image
              ? `
                <img
                  src="${image}"
                  alt="${productName}"
                >
              `
              : ""
          }
        </div>

        <div class="cart-item-info">

          <h2>
            ${productName}
          </h2>

          <p class="cart-item-price">
            ${formatMoney(
              unitPrice.value,
              unitPrice.currency
            )}
          </p>

          <div class="cart-item-controls">

            <div class="quantity-control">

              <button
                type="button"
                disabled
                aria-label="Decrease quantity"
              >
                −
              </button>

              <span>
                ${quantity}
              </span>

              <button
                type="button"
                disabled
                aria-label="Increase quantity"
              >
                +
              </button>

            </div>

            <button
              type="button"
              class="remove-item"
              disabled
            >
              Remove
            </button>

          </div>

        </div>
      `;


      cartItemsContainer
        .appendChild(
          article
        );

    }
  );


  if (cartSubtotal) {

    const currency =
      cart.items[0]
        .variant
        .unitPrice
        .currency;


    cartSubtotal.textContent =
      formatMoney(
        subtotal,
        currency
      );

  }


  if (checkoutButton) {

    checkoutButton.href =
      `${FOURTHWALL_SHOP}/cart/checkout` +
      `?cartId=${encodeURIComponent(cart.id)}` +
      `&currency=USD`;

  }

}


async function loadCartPage() {

  if (!cartItemsContainer) {
    return;
  }


  const cartId =
    localStorage.getItem(
      "fourthwallCartId"
    );


  if (!cartId) {

    renderCart({
      items: []
    });


    return;

  }


  try {

    const cart =
      await getCart(
        cartId
      );


    renderCart(
      cart
    );


  } catch (error) {

    console.error(
      "Could not load cart page:",
      error
    );


    cartItemsContainer.innerHTML = `
      <p class="empty-cart">
        Could not load your cart.
      </p>
    `;

  }

}


loadCartPage();

// FALLING SYMBOLS

const symbols = [
  "★",
  "♥",
  "✿",
  "☭",
  "✦"
];


function createFallingSymbol() {

  const symbol =
    document.createElement(
      "span"
    );


  symbol.className =
    "falling-symbol";


  symbol.textContent =
    symbols[
      Math.floor(
        Math.random() *
        symbols.length
      )
    ];


  symbol.style.left =
    Math.random() *
    100 +
    "vw";


  symbol.style.fontSize =
    12 +
    Math.random() *
    18 +
    "px";


  symbol.style.animationDuration =
    7 +
    Math.random() *
    6 +
    "s";


  symbol.style.opacity =
    0.8 +
    Math.random() *
    0.2;


  document.body.appendChild(
    symbol
  );


  setTimeout(
    () => {

      symbol.remove();

    },
    14000
  );

}


setInterval(
  createFallingSymbol,
  500
);



// IMAGE LIGHTBOX

const mainPreview =
  document.getElementById(
    "product-main-image"
  );


const lightbox =
  document.getElementById(
    "imageLightbox"
  );


const lightboxImage =
  lightbox?.querySelector(
    "img"
  );


const lightboxClose =
  lightbox?.querySelector(
    ".lightbox-close"
  );


function closeLightbox() {

  if (!lightbox) {
    return;
  }


  lightbox.classList.remove(
    "open"
  );


  lightbox.setAttribute(
    "aria-hidden",
    "true"
  );

}


if (
  mainPreview &&
  lightbox &&
  lightboxImage &&
  lightboxClose
) {

  mainPreview.addEventListener(
    "click",
    () => {

      lightboxImage.src =
        mainPreview.src;


      lightboxImage.alt =
        mainPreview.alt;


      lightbox.classList.add(
        "open"
      );


      lightbox.setAttribute(
        "aria-hidden",
        "false"
      );

    }
  );


  lightboxClose.addEventListener(
    "click",
    closeLightbox
  );


  lightbox.addEventListener(
    "click",
    (event) => {

      if (
        event.target ===
        lightbox
      ) {

        closeLightbox();

      }

    }
  );

}



// ESCAPE KEY CLOSES LIGHTBOX

document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key === "Escape" &&
      lightbox?.classList.contains(
        "open"
      )
    ) {

      closeLightbox();

    }

  }
);
