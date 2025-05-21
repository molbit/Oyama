const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());

// reCAPTCHA検証ルート
app.post('/verify', async (req, res) => {
  const token = req.body.token;
  const secret = '6Lc5lEErAAAAAPpNF2hwYuQdr-UrH1i3-6VvKLX1';

  const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `secret=${secret}&response=${token}`
  });

  const data = await response.json();
  res.json(data);
});

// ↓ この行は削除 or コメントアウト！
// app.get("/", (req, res) => {
//   res.send("🟢 reCAPTCHA サーバーは起動中です！");
// });

app.use(express.static('public'));

app.listen(8080, () => console.log('Server running on port 8080'));
