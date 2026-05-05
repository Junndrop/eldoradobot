const axios = require('axios');
const cheerio = require('cheerio');

let lastOrders = [];

const TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;
const COOKIE = process.env.COOKIE;

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
    const orders = [];

    console.log('TOTAL ELEMENT:', $('.order-row').length);

$('.order-row').each((i, el) => {
  const title = $(el).find('.order-title').text().trim();
  const price = $(el).find('.order-price').text().trim();

  orders.push(`${title} | ${price}`);
});

    if (lastOrders.length === 0) {
  lastOrders = orders;
  return;
    }

    const newOrders = orders.filter(o => !lastOrders.includes(o));

if (newOrders.length > 0) {
  for (let o of newOrders) {
    await sendMessage(`🔥 ORDER BARU\n${o}`);
  }
}

    lastOrders = orders;

  } catch (err) {
    console.log('Error:', err.message);
  }
}

setInterval(checkOrders, 60000);

sendMessage('Bot aktif 🚀');
