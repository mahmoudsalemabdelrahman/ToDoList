const Todo = require("../models/Todo");
const { validationResult } = require("express-validator");

//@desc عرض الصفحه الرئيسه مع جميع المهام
//@route GET /todo
exports.getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.render("todo/index", { title: "المهام", todos });
  } catch (error) {
    console.error(error);
    res.redirect("/");
  }
};
// @desc    عرض نموذج إنشاء مهمة جديدة
// @route   GET /todos/create
exports.createTodo = async (req, res) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.render("todo/create", {
      title: "إنشاء مهمة جديدة",
      errors: error.array(),
    });
  }

try {
  req.body.user = req.user.id;
  await Todo.create(req.body);
  res.redirect("/todo");
} catch (error) {
  console.error(error);
  res.redirect("/todo/create", {
    title: "إضافه مهمه جيه",
    errors: [{ msg: "حدث خطأ ما" }],
  });
}
};
