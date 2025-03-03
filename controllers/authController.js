const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

// دالة إنشاء وإرسال توكن JWT
const sendTokenResponse = (user, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30d"
  });
  const options = {
    // تحديد انتهاء صلاحية الكوكيز بعد 30 يوم
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true
  };
  res.cookie("token", token, options);
};

// عرض صفحة تسجيل الدخول
exports.loginPage = (req, res) => {
  res.render("auth/login", {
    title: "تسجيل الدخول",
    errors: []
  });
};

// عرض صفحة التسجيل
exports.registerPage = (req, res) => {
  res.render("auth/register", {
    title: "تسجيل حساب جديد",
    errors: []
  });
};

// تسجيل مستخدم جديد
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()){
    return res.render("auth/register", {
      title: "تسجيل حساب جديد",
      errors: errors.array()
    });
  }
  try {
    const { name, email, password } = req.body;
    // التحقق مما إذا كان المستخدم موجودًا بالفعل
    let user = await User.findOne({ email });
    if (user) {
      return res.render('auth/register', {
        title: 'تسجيل حساب جديد',
        errors: [{ msg: 'البريد الإلكتروني مسجل بالفعل' }]
      });
    }
    // إنشاء مستخدم جديد
    user = await User.create({ name, email, password });
    // إنشاء التوكن وإرساله للعميل
    sendTokenResponse(user, res);
    // إعادة التوجيه إلى صفحة المهام (todos)
    res.redirect('/todos');
  } catch (error) {
    console.error(error);
    res.render('auth/register', {
      title: 'تسجيل حساب جديد',
      errors: [{ msg: 'حدث خطأ أثناء إنشاء الحساب' }]
    });
  }
};

// تسجيل الدخول
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('auth/login', {
      title: 'تسجيل الدخول',
      errors: errors.array()
    });
  }
  try {
    const { email, password } = req.body;
    // البحث عن المستخدم والتحقق من كلمة المرور
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.render('auth/login', {
        title: 'تسجيل الدخول',
        errors: [{ msg: 'بيانات الاعتماد غير صحيحة' }]
      });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.render('auth/login', {
        title: 'تسجيل الدخول',
        errors: [{ msg: 'بيانات الاعتماد غير صحيحة' }]
      });
    }
    // إنشاء التوكن وإرساله للعميل
    sendTokenResponse(user, res);
    // إعادة التوجيه إلى صفحة المهام (todos)
    res.redirect('/todos');
  } catch (error) {
    console.error(error);
    res.render('auth/login', {
      title: 'تسجيل الدخول',
      errors: [{ msg: 'حدث خطأ أثناء تسجيل الدخول' }]
    });
  }
};

// تسجيل الخروج
exports.logout = (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.redirect('/');
};
