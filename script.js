// =====================================
// FOURTHWALL SETTINGS
// =====================================

const API_BASE =
  "https://storefront-api.fourthwall.com/v1";


// =====================================
// CURRENT PRODUCT
// =====================================

// This will hold whichever Fourthwall
// product is loaded on the current page.

let currentProduct = null;


// =====================================
// LOAD INDIVIDUAL PRODUCT
// =====================================

async function loadFourthwallProduct() {
  const slug =
    document.body.dataset.productSlug;

  // The homepage has no product slug,
  // so nothing needs to happen there.
  if (!slug) {
    return;
  }

  try {
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

    // Save this product so the cart
    // code can access its variant ID.
    currentProduct = product;

    console.log(
      "Fourthwall product:",
      product
    );


    // -----------------------------
    // PAGE ELEMENTS
    // -----------------------------

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


    // -----------------------------
    // TITLE
    // -----------------------------

    if (title) {
      title.textContent =
        product.name;
    }


    // -----------------------------
    // DESCRIPTION
    // -----------------------------

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


    // -----------------------------
    // PRICE
    // -----------------------------

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


    // -----------------------------
    // MAIN IMAGE
    // -----------------------------

    if (
      mainImage &&
      product.images?.length > 0
    ) {
      mainImage.src =
        product.images[0].url;

      mainImage.alt =
        product.name;
    }


    // -----------------------------
    // THUMBNAILS
    // -----------------------------

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

                    thumbnail.classList
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

  } catch (error) {
    console.error(
      "Could not load Fourthwall product:",
      error
    );
  }
}

loadFourthwallProduct();


// =====================================
// FOURTHWALL CART
// =====================================

let cartId =
  localStorage.getItem(
    "fourthwallCartId"
  );


// -----------------------------
// CREATE CART
// -----------------------------

async function createCart() {
  const response = await fetch(
    `${API_BASE}/carts?storefront_token=${STOREFRONT_TOKEN}`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json"
      },

      body: JSON.stringify({
        currency: "USD"
      })
    }
  );


  if (!response.ok) {
    throw new Error(
      `Could not create cart: ${response.status}`
    );
  }


  const cart =
    await response.json();

  cartId =
    cart.id;


  localStorage.setItem(
    "fourthwallCartId",
    cartId
  );


  return cartId;
}


// -----------------------------
// MAKE SURE CART EXISTS
// -----------------------------

async function ensureCart() {

  if (cartId) {

    const response = await fetch(
      `${API_BASE}/carts/${cartId}?storefront_token=${STOREFRONT_TOKEN}`
    );


    if (response.ok) {
      return cartId;
    }


    // Stored cart no longer exists.
    localStorage.removeItem(
      "fourthwallCartId"
    );

    cartId = null;
  }


  return createCart();
}


// -----------------------------
// ADD CURRENT STICKER
// -----------------------------

async function addCurrentProductToCart() {

  if (
    !currentProduct ||
    !currentProduct.variants?.length
  ) {
    throw new Error(
      "Product variant has not loaded."
    );
  }


  // Your sticker products currently
  // have one variant each.
  const variant =
    currentProduct.variants[0];


  const currentCartId =
    await ensureCart();


  const response = await fetch(
    `${API_BASE}/carts/${currentCartId}/items?storefront_token=${STOREFRONT_TOKEN}`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json"
      },

      body: JSON.stringify({
        variantId:
          variant.id,

        quantity: 1
      })
    }
  );


  if (!response.ok) {
    throw new Error(
      `Could not add item: ${response.status}`
    );
  }


  const cart =
    await response.json();

  console.log(
    "Fourthwall cart:",
    cart
  );


  return cart;
}


// =====================================
// ADD TO CART BUTTON
// =====================================

const addToCartButton =
  document.getElementById(
    "add-to-cart"
  );

const cartMessage =
  document.getElementById(
    "cart-message"
  );


if (addToCartButton) {

  addToCartButton.addEventListener(
    "click",
    async () => {

      addToCartButton.disabled =
        true;

      addToCartButton.textContent =
        "Adding...";


      if (cartMessage) {
        cartMessage.textContent =
          "";
      }


      try {

        await addCurrentProductToCart();


        addToCartButton.textContent =
          "Added! ♥";


        if (cartMessage) {
          cartMessage.textContent =
            "Sticker added to your cart.";
        }


        setTimeout(() => {

          addToCartButton.textContent =
            "Add to Cart";

          addToCartButton.disabled =
            false;

        }, 1200);


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
            "Could not add the sticker. Please try again.";
        }

      }

    }
  );
}


// =====================================
// FALLING SYMBOLS
// =====================================

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


// =====================================
// IMAGE LIGHTBOX
// =====================================

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


// =====================================
// ESCAPE KEY CLOSES LIGHTBOX
// =====================================

document.addEventListener(
  "keydown",
  (event) => {

    if (
      event.key ===
        "Escape" &&

      lightbox?.classList.contains(
        "open"
      )
    ) {
      closeLightbox();
    }

  }
);