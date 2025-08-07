const express = require("express");
const router = express.Router();
const fetchFn = global.fetch || require("node-fetch");

router.post("/recaptcha", async (req, res) => {
  try {
    const { recaptchaToken } = req.body;
    if (!recaptchaToken) {
      return res.status(400).json({ error: "Missing recaptchaToken" });
    }

    const secret = process.env.RECAPTCHA_SECRET_KEY;
    if (!secret) {
      return res.status(500).json({ error: "Missing secret key" });
    }

    const params = new URLSearchParams();
    params.append("secret", secret);
    params.append("response", recaptchaToken);

    const response = await fetchFn(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      }
    );

    if (!response.ok) {
      return res.status(500).json({ error: "Recaptcha verification failed" });
    }

    const data = await response.json();
    if (!data.success) {
      return res.status(400).json({ error: "Invalid recaptcha token" });
    }

    if (typeof data.score === "number" && recaptcha.action === 'signup' && data.score < 0.5) {
      return res.status(403).json({ error: "Recaptcha score too low" });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
