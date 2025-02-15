import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config(); // Загружаем переменные окружения

const app = express();
app.use(express.json());

// Токен и URL API
const TODOIST_API_URL = "https://api.todoist.com/sync/v9/sync"; // Базовый URL для синхронизации
const TODOIST_TOKEN = process.env.TODOIST_API_TOKEN; // Токен для авторизации

// Прокси-сервер для передачи запросов в Todoist API
app.post("/api/todoist/*", async (req, res) => {
  const endpoint = req.url.replace('/api/todoist', ''); // Получаем endpoint из URL запроса

  try {
    // Формируем запрос в Todoist API с добавлением токена в заголовки
    const response = await fetch(`${TODOIST_API_URL}${endpoint}`, {
      method: req.method,  // Используем метод запроса (GET, POST, и т.д.)
      headers: {
        "Authorization": `Bearer ${TODOIST_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: req.method === "POST" ? JSON.stringify(req.body) : undefined, // Если это POST, передаем тело запроса
    });

    // Если запрос успешен, отправляем ответ клиенту
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error proxying request to Todoist:", error);
    res.status(500).json({ error: "Failed to proxy request to Todoist" });
  }
});

// Запуск сервера
const PORT = process.env.PORT || 3030;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
