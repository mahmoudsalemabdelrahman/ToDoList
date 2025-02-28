const mongoose = require('mongoose');
 const TodoSchema = new mongoose.Schema({
    title:{
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [20, 'Title cannot be more than 20 characters'],
    },
    description:{
        type: String,
        trim: true,
    },
    status:{
        type: String,
        enum: ['pending', 'in progress', 'completed'],
        default: pending
    },
    dueDate:{
        type:Date
    },
    user:{
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        require: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }

    
 });
 module.exports = mongoose.model('Todo', TodoSchema);
