const express = require("express");
const { getUserCount, getAllUsers, dalateUser } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware"); 
const router = express.Router();

router.get("/getAllUsers", protect, getAllUsers );  
router.get("/getUsersCount", protect, getUserCount );  
router.delete("/deleteUser/:id", protect, dalateUser );  

module.exports = router;
