const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: false,
  },

  donationType: { 
    type: String,  
    required: false },

  Amount: {
    type: String,
    required: false,
  },


  dropOff: {
    type: String,
    required: false,
  },
  mobileNumber:{
    type: String,
    required:false,
  },
  status: {
    type: String,
    required: true,
  },
  arrivedAtDestination:{
    type: String,
    required: false,
    default: false,
  }
  // Add more fields as needed
}, { timestamps: true });

const Donation = mongoose.model('Donation', donationSchema);

module.exports = Donation;



