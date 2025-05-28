export default async function handler(req, res) {
  const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxYRGg6qrm4N_RTdfH0-BIrVJpMjsEjkSnOO8oX-ZrCUUtsR7qPTUT9xXI-FYudI7Jk/exec";

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const method = req.method;
    const url =
      method === "GET"
        ? `${GOOGLE_SCRIPT_URL}?action=${encodeURIComponent(req.query.action)}`
        : GOOGLE_SCRIPT_URL;

    const fetchOptions = {
      method,
      headers: {
        "Content-Type": "application/json"
      }
    };

    if (method === "POST") {
      fetchOptions.body = JSON.stringify(req.body);
    }

    const response = await fetch(url, fetchOptions);
    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return res.status(200).json(data);
    } else {
      const text = await response.text();
      return res.status(200).send(text);
    }
  } catch (err) {
    return res.status(500).json({ error: err.toString() });
  }
}
