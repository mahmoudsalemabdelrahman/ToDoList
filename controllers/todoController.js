const Todo = require("../models/Todo");
const { validationResult } = require("express-validator");

// عرض الصفحة الرئيسية مع جميع المهام
// @route GET /todos
exports.getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.render("todo/index", { title: "المهام", todos });
  } catch (error) {
    console.error(error);
    res.redirect("/");
  }
};

// عرض نموذج إنشاء مهمة جديدة
// @route GET /todos/create
exports.createTodoForm = (req, res) => {
  res.render("todo/create", { title: "إنشاء مهمة جديدة", errors: [] });
};

// إنشاء مهمة جديدة
// @route POST /todos
exports.createTodo = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render("todo/create", {
      title: "إنشاء مهمة جديدة",
      errors: errors.array(),
    });
  }
  try {
    req.body.user = req.user.id;
    await Todo.create(req.body);
    res.redirect("/todos");
  } catch (error) {
    console.error(error);
    res.render("todo/create", {
      title: "إنشاء مهمة جديدة",
      errors: [{ msg: "حدث خطأ ما" }],
    });
  }
};

// عرض نموذج تعديل مهمة
// @route GET /todos/:id/edit
exports.editTodoForm = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.redirect("/todos");
    }
    // التأكد من ملكية المهمة
    if (todo.user.toString() !== req.user.id) {
      return res.redirect("/todos");
    }
    res.render("todo/edit", { title: "تعديل مهمة", todo, errors: [] });
  } catch (error) {
    console.error(error);
    res.redirect("/todos");
  }
};

// تحديث مهمة
// @route PUT /todos/:id
exports.updateTodo = async (req, res) => {
  try {
    let todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.redirect("/todos");
    }
    if (todo.user.toString() !== req.user.id) {
      return res.redirect("/todos");
    }
    // استخدم findByIdAndUpdate لتحديث المهمة
    todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.redirect("/todos");
  } catch (error) {
    console.error(error);
    res.redirect("/todos");
  }
};

// حذف مهمة
// @route DELETE /todos/:id
exports.deleteTodo = async (req, res) => {
  try {
    let todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.redirect("/todos");
    }
    if (todo.user.toString() !== req.user.id) {
      return res.redirect("/todos");
    }
    await Todo.findByIdAndDelete(req.params.id);
    res.redirect("/todos");
  } catch (error) {
    console.error(error);
    res.redirect("/todos");
  }
};

// تغيير حالة المهمة (مكتملة/معلقة)
// @route PUT /todos/:id/toggle
exports.toggleStatus = async (req, res) => {
  try {
    let todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.redirect("/todos");
    }
    if (todo.user.toString() !== req.user.id) {
      return res.redirect("/todos");
    }
    const newStatus = todo.status === "pending" ? "completed" : "pending";
    todo = await Todo.findByIdAndUpdate(req.params.id, { status: newStatus }, { new: true });
    res.redirect("/todos");
  } catch (error) {
    console.error(error);
    res.redirect("/todos");
  }
};
