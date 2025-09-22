const express = require("express");

const router = express.Router();

const { createCategory, getCategories } = require("../controllers/categoryController");

router.route("/createCategory").post(createCategory)
router.route("/categories").get(getCategories)

module.exports = router;