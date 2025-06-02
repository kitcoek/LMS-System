const express = require("express");
const router = express.Router();
const memberController = require("../controllers/memberController");

router.post("/submitMemberInfo", memberController.submitMemberInfo);
router.put("/saveMemberInfo/:prn", memberController.saveMemberInfo);
router.delete("/deleteMemberInfo/:prn", memberController.deleteMemberInfo);
router.get("/getMemberInfo", memberController.getMemberInfo);
router.get("/getMemberByPrn/:prn", memberController.getMemberByPrn);
router.get("/getAllMembers", memberController.getAllMembers);
router.get("/checkEmail/:email", memberController.checkEmail); // Adjusted to use params

module.exports = router;