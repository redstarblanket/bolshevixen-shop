export default async function handler(req, res) {
  const { slug } = req.query;

  if (!slug) {
    return res.status(400).json({
      error: "Missing product slug"
    });
  }

  const token =
    process.env.FOURTHWALL_TOKEN;

  if (!token) {
    return res.status(500).json({
      error: "Fourthwall token is not configured"
    });
  }

  try {
    const url =
      `https://storefront-api.fourthwall.com/v1/products/` +
      `${encodeURIComponent(slug)}` +
      `?storefront_token=${encodeURIComponent(token)}`;

    const response =
      await fetch(url);

    const text =
      await response.text();

    if (!response.ok) {
      console.error(
        "Fourthwall API error:",
        response.status,
        text
      );

      return res
        .status(response.status)
        .json({
          error: "Fourthwall request failed",
          status: response.status
        });
    }

    const product =
      JSON.parse(text);

    return res
      .status(200)
      .json(product);

  } catch (error) {
    console.error(
      "Product proxy error:",
      error
    );

    return res.status(500).json({
      error: "Server error"
    });
  }
}
