
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
