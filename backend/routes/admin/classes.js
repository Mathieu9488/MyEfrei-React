const express = require("express");
const router = express.Router();
const { getClasses, addClass, getElevesByClassId, deleteClass, updateClass } = require('../../controllers/admin/classes.js');

router.get("/", getClasses);
router.post("/", addClass);
router.get("/:id", getElevesByClassId);
router.delete("/:id", deleteClass);
router.patch("/:id", updateClass);

module.exports = router;