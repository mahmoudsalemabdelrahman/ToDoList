const jwt =  require('jsonwebtoken');
const User = require('../models/User');


//حمايه المسارات



exports.protect = async (req,res,next) =>{
    let token;
    
    // التحقق  من وجود التوكن  في ملفات تعريف الارتباط

    if(req.cookies.token) {
        token = req.cookies.token;
    }
    
    // التحقق من وجود توكن
    
    if(!token){
        return res.redirect('/auth/login');
    }
    try{
        // فك تشفير التوكون 
        const decode = jwt.verify(token,process.env.JWT_SECRET);
        // العثور علي المستخدم باستخدام معرف المستخدم المستخرج من التوكن
        req.user = await User.findById(decode.id);
        next();
    }catch (error){
        res.redirect('auth/login');
    }
};
// التحقق مما إذا كان المستخدم قد قام بتسجيل الدخول لعرض/إخفاء أزرار تسجيل الدخول
expoets.isLoggedIn = async (req, res, next) => {
    if(req.cookies.token){
        try{
            const decode = jwt.verify (req.cookies.token, req.process.JWT_SECRET);
            res.loacls.user = await User.findById(decode.id);
        }catch(error){
            res.locals.user = null;
        }
    }else{
        res.locals.user = null;
    }
    next();
    };