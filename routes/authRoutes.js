const express = require('express');
const router = express.Router();
const { check } = require('express-validator');

const {
  loginPage,
  registerPage,
  login,
  register,
  logout
} = require('../controllers/authController');

// عرض صفحة تسجيل الدخول
router.get('/login', loginPage);

// عرض صفحة التسجيل
router.get('/register', registerPage);

// تسجيل مستخدم جديد (POST /auth/register)
router.post(
  '/register',
  [
    check('name', 'الرجاء إدخال الاسم').not().isEmpty(),
    check('email', 'الرجاء إدخال بريد إلكتروني صحيح').isEmail(),
    check('password', 'الرجاء إدخال كلمة مرور بطول 6 أحرف على الأقل').isLength({ min: 6 })
  ],
  register
);

// تسجيل الدخول (POST /auth/login)
router.post(
  '/login',
  [
    check('email', 'الرجاء إدخال بريد إلكتروني صحيح').isEmail(),
    check('password', 'الرجاء إدخال كلمة المرور').exists()
  ],
  login
);

// تسجيل الخروج
router.get('/logout', logout);

module.exports = router;
