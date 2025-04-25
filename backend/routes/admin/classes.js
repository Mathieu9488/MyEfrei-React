const express = require("express");
const router = express.Router();
const { getClasses, addClass, updateClass, getElevesByClassId } = require('../../controllers/admin/classes.js');

router.get("/", getClasses);
router.post("/", addClass);
router.get("/:id", getElevesByClassId);
router.patch("/:id", updateClass);

module.exports = router;