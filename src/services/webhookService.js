const axios = require("axios");

const sendWebhook = async (data, retries = 3) => {
  try {
    await axios.post(process.env.WEBHOOK_URL, data);
    console.log("✅ Webhook sent");
  } catch (err) {
    console.log("❌ Webhook failed, retrying...");

    if (retries > 0) {
      setTimeout(
        () => {
          sendWebhook(data, retries - 1);
        },
        (4 - retries) * 1000,
      );
    } else {
      console.log("💀 Webhook failed after retries");
    }
  }
};

module.exports = sendWebhook;
