const express = require("express");
const router = express.Router();
const controller = require("../controllers/member.controller");

router.post("/", controller.createMember);
router.get("/", controller.listMembers);
router.put("/:id", controller.updateMember);
router.delete("/:id", controller.deleteMember);

module.exports = router;
