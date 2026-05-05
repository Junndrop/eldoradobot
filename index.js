const axios = require('axios');

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
    const res = await axios.get(
  'https://www.eldorado.gg/api/orders/me/seller/orders?orderState=PendingDelivery&displayFilter=DisplaySellingOrders',
  {
    headers: {
      'User-Agent': 'Mozilla/5.0',
      'Accept': 'application/json',
      'Cookie': COOKIE,
      'Referer': 'https://www.eldorado.gg/dashboard/orders/sold'
    }
  }
);

    const orders = res.data.data || [];

    console.log('TOTAL ORDERS:', orders.length);

    const formattedOrders = orders.map(o => {
  const name = o.productName || o.title || 'Unknown';
  const price = o.price || o.totalPrice || 0;
  const status = o.orderState || o.status || 'Unknown';

  return `${name} | $${price} | ${status}`;
});

    if (lastOrders.length === 0) {
  lastOrders = formattedOrders;
  return;
}

const newOrders = formattedOrders.filter(o => !lastOrders.includes(o));

if (newOrders.length > 0) {
  for (let o of newOrders) {
    await sendMessage(`🔥 ORDER BARU\n${o}`);
  }
}

lastOrders = formattedOrders;

  } catch (err) {
    console.log('Error:', err.message);
  }
}

setInterval(checkOrders, 60000);

sendMessage('Bot aktif 🚀');
