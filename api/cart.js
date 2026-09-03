export default async function handler(req, res) {
  const token =
    process.env.FOURTHWALL_TOKEN;

  if (!token) {
    return res.status(500).json({
      error: "Fourthwall token is not configured"
    });
  }

  const API_BASE =
    "https://storefront-api.fourthwall.com/v1";


  /* create a new cart */

  if (
    req.method === "POST" &&
    req.body.action === "create"
  ) {
    try {
      const response = await fetch(
        `${API_BASE}/carts?storefront_token=${encodeURIComponent(token)}`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            items: []
          })
        }
      );


      const text =
        await response.text();


      if (!response.ok) {
        console.error(
          "Fourthwall cart create error:",
          response.status,
          text
        );

        return res
          .status(response.status)
          .json({
            error: "Could not create cart"
          });
      }


      const cart =
        JSON.parse(text);


      return res
        .status(200)
        .json(cart);

    } catch (error) {
      console.error(
        "Cart create error:",
        error
      );

      return res.status(500).json({
        error: "Server error"
      });
    }
  }


  /* add an item */

  if (
    req.method === "POST" &&
    req.body.action === "add"
  ) {
    const {
      cartId,
      variantId,
      quantity = 1
    } = req.body;


    if (!cartId || !variantId) {
      return res.status(400).json({
        error: "Missing cart or variant"
      });
    }


    try {
      const response = await fetch(
        `${API_BASE}/carts/${encodeURIComponent(cartId)}/add` +
        `?storefront_token=${encodeURIComponent(token)}`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            items: [
              {
                variantId,
                quantity
              }
            ]
          })
        }
      );


      const text =
        await response.text();


      if (!response.ok) {
        console.error(
          "Fourthwall add error:",
          response.status,
          text
        );

        return res
          .status(response.status)
          .json({
            error: "Could not add item"
          });
      }


      const cart =
        JSON.parse(text);


      return res
        .status(200)
        .json(cart);

    } catch (error) {
      console.error(
        "Add to cart error:",
        error
      );

      return res.status(500).json({
        error: "Server error"
      });
    }
  }


  return res.status(405).json({
    error: "Unsupported action"
  });
}
