const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema ({
    name:{
        type: String,
        required: [true, 'Please add a name'],
    },
    email:{
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        match: [
            /^\S+@\S+\.\S+$/,
            'Please add a valid email',
        ],
    },
    password:{
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6,
        select: false,

    },
    createdAt:{
        type: Date,
        default: Date.now,
    }
});

// تشفير كلمه المرور يل الحفظ
UserSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// مقارنه كلمه المرور المدخله مع كلمه المرور المحفوظه
UserSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);

