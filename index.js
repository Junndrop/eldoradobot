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
  console.log('CHECKING ORDERS...');
  try {
    const xsrfMatch = (COOKIE || '').match(/__Host-XSRF-TOKEN=([^;]+)/);
const xsrf = xsrfMatch ? decodeURIComponent(xsrfMatch[1]) : '';
    const res = await axios.get(
  'https://www.eldorado.gg/api/orders/me/seller/orders',
      {
    headers: {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
  'Accept': 'application/json',
  'Accept-Language': 'en-US,en;q=0.9',
  'Content-Type': 'application/json',
  'Connection': 'keep-alive',
  'Cookie': COOKIE,
  'Referer': 'https://www.eldorado.gg/dashboard/orders/sold',
  'Origin': 'https://www.eldorado.gg',
  'X-XSRF-TOKEN': xsrf
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
    await sendMessage(`🔥 ORDER BARU\n\n${o}`);
  }
}

lastOrders = formattedOrders;

  } catch (err) {
    console.log('Error:', err.message);
  }
}

setInterval(checkOrders, 60000);

checkOrders();

sendMessage('Bot aktif 🚀');
