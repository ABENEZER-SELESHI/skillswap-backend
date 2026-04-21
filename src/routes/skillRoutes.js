// src/routes/skillRoutes.js
const express = require("express");
const router = express.Router();
const {
  create,
  getAll,
  getOne,
  update,
  remove,
} = require("../controllers/skillController");
const { authenticate } = require("../middleware/authMiddleware");

router.post("/", authenticate, create);
router.get("/", getAll);
router.get("/:id", getOne);
router.put("/:id", authenticate, update);
router.delete("/:id", authenticate, remove);

module.exports = router;
