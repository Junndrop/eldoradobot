const axios = require('axios');
const cheerio = require('cheerio');

const TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;
const COOKIE = process.env.COOKIE;

let lastCount = null;

async function sendMessage(text) {
  await axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
    chat_id: CHAT_ID,
    text
  });
}

async function checkOrders() {
  try {
    const res = await axios.get('https://www.eldorado.gg/orders', {
      headers: {
        Cookie: COOKIE,
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const $ = cheerio.load(res.data);
    const count = $('.order-row').length;

    if (lastCount === null) {
      lastCount = count;
      return;
    }

    if (count > lastCount) {
      await sendMessage(`🔥 ORDER BARU! Total: ${count}`);
    }

    lastCount = count;

  } catch (err) {
    console.log('Error:', err.message);
  }
}

setInterval(checkOrders, 60000);