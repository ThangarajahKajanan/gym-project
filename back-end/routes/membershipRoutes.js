const express = require("express");
const { createMemberShip, getAllMembership, updateMembership, deleteMembership , getAllMembershipNames, getMembershipCount} = require('../controllers/memberShipController')
const upload = require("../middleware/multer"); 
const { protect } = require("../middleware/authMiddleware"); 
const router = express.Router();

router.post("/createMembership", protect, upload.single("membershipPhoto"), createMemberShip);
router.put("/updateMembership/:id", protect, upload.single("membershipPhoto"), updateMembership);
router.get("/getAllMembership", protect, getAllMembership);
router.get("/getAllMembershipNames", protect, getAllMembershipNames);
router.delete("/deleteMembership/:id", protect, deleteMembership);
router.get("/getMembershipCount", protect, getMembershipCount);





module.exports = router;
