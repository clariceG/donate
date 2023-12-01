const express = require("express");
const router = express.Router();
const validateToken = require("../middleware/validateToken");

const {
  signUpUser,
  sendEmailOTP,
  signInUser,
  updateUserProfile,
  deleteUserProfile,
  currentUser,
  sendEmailToDonor,
  storeDonation,
  getDonationsByEmail,
  updateDonationStatus,
  updateArrivalofDonation,
  getDonations,
  getPredictions,
} = require("../controllers/userController");

router
  .post("/signup", signUpUser)
  .post("/signin", signInUser)
  .post("/otp", sendEmailOTP)
  .post("/store", sendEmailToDonor)
  .post("/donate", storeDonation)
  .post("/my-donations", getDonationsByEmail)
  .get("/donations", getDonations)
  .get("/predictions", getPredictions)
  .post("/arrival/:donationId", updateArrivalofDonation)  
  .post("/status/:donationId", updateDonationStatus)  
  .put("", validateToken, updateUserProfile)
  .get("", validateToken, currentUser)
  .delete("", validateToken, deleteUserProfile);

module.exports = router;
