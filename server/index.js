const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: userMessage },
        ],
      }),
    });

    const data = await response.json();
    console.log("🔎 OpenAI 응답:", data);

    if (!data.choices || !data.choices[0]) {
      return res.status(500).json({ reply: '⚠️ OpenAI 응답이 비정상입니다.' });
    }

    res.json({ reply: data.choices[0].message.content });

  } catch (error) {
    console.error('🔥 OpenAI 통신 에러:', error);
    res.status(500).json({ reply: 'Error communicating with OpenAI API' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`);
});
