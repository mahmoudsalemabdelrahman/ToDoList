const User = require("../models/User");
const jwt = require("jsonwebtoken");
const {  validationResult } = require("express-validator");

// انشاء وارسال توكن jwt
const sendTokenResponse = (user, res) => {
  // انشاء توكن jwt
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  const options = {
    expires: new Date(Date.new() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  res.cookie("token ", token, options);
};

//@desc  عرض صفحة تسجيل الدخول
//@route GET /auth/register
exports.registerPage = (req, res) => {
  res.render("auth/register", {
    title: "Register",
    error: [],
  });
};
//@desc  تسجيل مستخدم جديد
//@route POST /auth/register
exports.register = async (req,res) =>{
    const errors =validationResult(req);
    if (!errors.isEmpty()){
        return res.render("auth/register", {
            title: "Register",
            error: errors.array(),
        });
    }
    try{
        const {name, email, password} = req.body;
        //  التحقق مما اذا كا المستخدم موجود بالفعل
        let user = await User.findOne({ email });

    if (user) {
      return res.render('auth/register', {
        title: 'إنشاء حساب جديد',
        errors: [{ msg: 'البريد الإلكتروني مسجل بالفعل' }]
      });
    }

    // إنشاء مستخدم جديد
    user = await User.create({
      name,
      email,
      password
    });

    // إنشاء التوكن وإرسال الاستجابة
    sendTokenResponse(user, res);

    // إعادة التوجيه إلى الصفحة الرئيسية
    res.redirect('/todos');
  } catch (error) {
    console.error(error);
    res.render('auth/register', {
      title: 'إنشاء حساب جديد',
      errors: [{ msg: 'حدث خطأ في إنشاء الحساب' }]
    });
  }
};

// @desc    تسجيل الدخول
// @route   POST /auth/login
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

    // التحقق من وجود المستخدم
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.render('auth/login', {
        title: 'تسجيل الدخول',
        errors: [{ msg: 'بيانات الاعتماد غير صحيحة' }]
      });
    }

    // التحقق من تطابق كلمة المرور
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.render('auth/login', {
        title: 'تسجيل الدخول',
        errors: [{ msg: 'بيانات الاعتماد غير صحيحة' }]
      });
    }

    // إنشاء التوكن وإرسال الاستجابة
    sendTokenResponse(user, res);

    // إعادة التوجيه إلى الصفحة الرئيسية
    res.redirect('/todos');
  } catch (error) {
    console.error(error);
    res.render('auth/login', {
      title: 'تسجيل الدخول',
      errors: [{ msg: 'حدث خطأ في تسجيل الدخول' }]
    });
  }
};

// @desc    تسجيل الخروج
// @route   GET /auth/logout
exports.logout = (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.redirect('/');
};
    

