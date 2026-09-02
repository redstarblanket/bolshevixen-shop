export default async function handler(req, res) {
  const { slug } = req.query;

  if (!slug) {
    return res.status(400).json({
      error: "Missing product slug"
    });
  }

  try {
    const response = await fetch(
      `https://storefront-api.fourthwall.com/v1/products/${encodeURIComponent(slug)}`,
      {
        headers: {
          Authorization:
            `Bearer ${process.env.FOURTHWALL_TOKEN}`
        }
      }
    );

    const text = await response.text();

    if (!response.ok) {
      console.error(
        "Fourthwall error:",
        response.status,
        text
      );

      return res.status(response.status).json({
        error: "Fourthwall request failed",
        status: response.status
      });
    }

    const product = JSON.parse(text);

    return res.status(200).json(product);

  } catch (error) {
    console.error(
      "API route error:",
      error
    );

    return res.status(500).json({
      error: "Server error"
    });
  }
}
