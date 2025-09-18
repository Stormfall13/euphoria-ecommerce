require("dotenv").config();
require('./models/associations');

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");

const sequelize = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const imageRoutes = require("./routes/imageRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const qnaRoutes = require("./routes/qna");
const commentsRoutes = require("./routes/comments");

const authMiddleware = require("./middlewares/authMiddleware");

const app = express();

app.use('/static', (req, res, next) => {
  // Устанавливаем заголовки кэширования для ВСЕХ статических файлов
  if (req.url.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|webp|avif|woff2|woff|ttf|eot)$/)) {
    res.setHeader('Cache-Control', 'public, immutable, max-age=31536000');
  }
  next();
}, express.static(path.join(__dirname, 'client/build/static')));

// ✅ Для остальных файлов из build
app.use(express.static(path.join(__dirname, 'client/build'), {
  setHeaders: (res, path) => {
    if (path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|webp|avif|woff2|woff|ttf|eot)$/)) {
      res.setHeader('Cache-Control', 'public, immutable, max-age=31536000');
    }
  }
}));

const staticOptions = {
  maxAge: '365d', // Максимальное время кэширования
  setHeaders: (res, filePath) => {
      // Определяем тип файла по расширению
      const ext = path.extname(filePath).toLowerCase();
      
      // Для неизменяемых ресурсов (изображения, шрифты, CSS, JS)
      if (/\.(js|css|png|jpg|jpeg|gif|ico|svg|webp|avif|woff2|woff|ttf|eot)$/.test(ext)) {
          res.setHeader('Cache-Control', 'public, immutable, max-age=31536000'); // 1 год
      } 
      // Для HTML и манифестов - короткое кэширование
      else if (ext === '.html' || ext === '.webmanifest') {
          res.setHeader('Cache-Control', 'no-cache, max-age=0, must-revalidate');
      } 
      // Для остальных файлов - 30 дней
      else {
          res.setHeader('Cache-Control', 'public, max-age=2592000');
      }
      
      // CORS заголовки
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  }
};

app.use(cors({
    origin: "*",
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization"
}));

// app.use(helmet());
app.use(helmet({
  contentSecurityPolicy: false, // Можно настроить отдельно
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(express.json());

app.use("/assets", express.static(path.join(__dirname, "assets"), staticOptions));
app.use(express.static('assets', staticOptions));
app.use(express.static('assets', {
  setHeaders: (res, path) => {
      if (path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|webp|avif|woff2|woff|ttf|eot)$/)) {
          res.setHeader('Cache-Control', 'public, immutable, max-age=31536000');
      }
  }
}));

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/images", imageRoutes);
// app.use("/assets", (req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", "*"); 
//     res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
//     res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//     res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
//     next();
// }, express.static(path.join(__dirname, "assets"))); 
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use('/api/qna', qnaRoutes);
app.use('/api/comments', commentsRoutes);


// Защищённый маршрут (пример)
app.get("/api/protected", authMiddleware, (req, res) => {
    res.json({ message: "Доступ разрешён", user: req.user });
});


// Глобальный обработчик ошибок
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Внутренняя ошибка сервера" });
});

app.use((req, res, next) => {
    res.setHeader("Content-Security-Policy", "default-src 'self'");
    next();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));


sequelize
    .sync({ alter: true })
    // .sync({ force: true }) // Удаляет старые таблицы
    .then(() => console.log("📦 DB updated with models"))
    .catch((err) => console.error("❌ Database sync error:", err));
