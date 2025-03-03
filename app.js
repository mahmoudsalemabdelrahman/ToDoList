const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');
const { isLoggedIn } = require('./middleware/authMiddleware');

// تحميل المتغيرات البيئية
dotenv.config();

// الاتصال بقاعدة البيانات
connectDB();

// إنشاء تطبيق Express
const app = express();

// middleware لتحليل البيانات
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// middleware لاستخدام PUT و DELETE في النماذج
app.use(methodOverride('_method'));

// المجلدات الثابتة
app.use(express.static(path.join(__dirname, 'public')));

// إعداد محرك قوالب EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// middleware للتحقق من تسجيل الدخول
app.use(isLoggedIn);

// المسارات
app.use('/auth', require('./routes/authRoutes'));
app.use('/todos', require('./routes/todoRoutes'));

// المسار الرئيسي
app.get('/', (req, res) => {
  res.render('index', {
    title: 'الرئيسية'
  });
});

// معالجة المسارات غير الموجودة
app.use((req, res) => {
  res.status(404).render('index', {
    title: 'الصفحة غير موجودة'
  });
});

// تشغيل الخادم
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});