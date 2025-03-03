const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { protect } = require("../middleware/authMiddleware");
const {
  getTodos,
  createTodoForm,
  createTodo,
  editTodoForm,
  updateTodo,
  deleteTodo,
  toggleStatus
} = require("../controllers/todoController");

// حماية جميع المسارات (يتطلب تسجيل الدخول)
router.use(protect);

// الحصول على جميع المهام
router.get("/", getTodos);

// عرض نموذج إنشاء مهمة جديدة
router.get("/create", createTodoForm);

// إنشاء مهمة جديدة
router.post(
  "/",
  [
    check("title", "عنوان المهمة مطلوب").not().isEmpty(),
    check("title", "عنوان المهمة لا يمكن أن يتجاوز 100 حرف").isLength({ max: 100 })
  ],
  createTodo
);

// عرض نموذج تعديل مهمة
router.get("/:id/edit", editTodoForm);

// تحديث مهمة
router.put(
  "/:id",
  [
    check("title", "عنوان المهمة مطلوب").not().isEmpty(),
    check("title", "عنوان المهمة لا يمكن أن يتجاوز 100 حرف").isLength({ max: 100 })
  ],
  updateTodo
);

// حذف مهمة
router.delete("/:id", deleteTodo);

// تغيير حالة المهمة (مكتملة/معلقة)
router.put("/:id/toggle", toggleStatus);

module.exports = router;
