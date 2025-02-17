import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(express.json());

// Конфиг API
const userTokens = {
  fil:  process.env.FIL_TODOIST_API_TOKEN,
  tea:  process.env.TEA_TODOIST_API_TOKEN,
};

const TODOIST_API_URL = "https://api.todoist.com";

// Прокси сервер
app.all("/*", async (req, res) => {
  const apiUrl = `${TODOIST_API_URL}${req.originalUrl}`;

  const cookies = req.headers.cookie;
  const userKey = cookies ? cookies.split(';').find(cookie => cookie.trim().startsWith('username=')).split('=')[1] : null;
  const token = userTokens[userKey];

  try {
    const response = await fetch(apiUrl, {
      method: req.method,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body:
        req.method === "POST" || req.method === "PUT"
          ? JSON.stringify(req.body)
          : undefined,
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error("Ошибка при проксировании запроса:", error);
    res.status(500).json({ error: "Ошибка на сервере прокси" });
  }
});

const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log(`Прокси работает на порту ${PORT}`);
});
