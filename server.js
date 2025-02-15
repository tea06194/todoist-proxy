import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(express.json());

// Конфиг API
const TODOIST_API_URL = "https://api.todoist.com";
const TODOIST_TOKEN = process.env.TODOIST_API_TOKEN;

// Прокси сервер
app.all("/*", async (req, res) => {
  const apiUrl = `${TODOIST_API_URL}${req.originalUrl}`;

  console.log("Request Headers:", req.headers);

  try {
    const response = await fetch(apiUrl, {
      method: req.method,
      headers: {
        Authorization: `Bearer ${TODOIST_TOKEN}`,
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
