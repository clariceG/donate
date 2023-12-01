const UserModel = require("../models/userModel");
const DonationModel = require("../models/donation");
const OtpModel = require("../models/emailOtpModel");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const sendEmail = require("../configs/sendEmail");
const jwt = require("jsonwebtoken");

// Sign up user
// @route POST /api/user/signup
// @access public
const signUpUser = asyncHandler(async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    if (!firstName || !lastName || !email || !password || !role) {
      return res.status(400).json({ message: "Please fill in all the fields" });
    }

    const userExists = await UserModel.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
      role: role,
    });

    const userData = {
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    };

    return res.status(200).json(userData);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Send OTP to user email
// @route POST /api/user/sendEmailOTP
// @access public
const sendEmailOTP = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is mandatory" });
  }

  try {
    const userExists = await UserModel.findOne({ email });

    if (!userExists) {
      return res.status(404).json({ message: "Email not found" });
    }

    let digits = "0123456789";
    const OTP = Array.from(
      { length: 6 },
      () => digits[Math.floor(Math.random() * 10)]
    ).join("");
    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + 30);

    const success = await sendEmail({
      subject: "One time OTP - Donation Ninja",
      html: `
                <h3>Welcome back to Donation Ninja!</h3>
                <p>Here is your one time otp: ${OTP}</p>
            `,
      to: email,
      from: process.env.GOOGLE_EMAIL,
    });

    if (success) {
      // Store OTP and expiry date in the database
      const otpResult = await OtpModel.create({
        email: email,
        otp: OTP,
        expiry: expiryDate,
      });

      if (otpResult) {
        return res
          .status(200)
          .json({ message: `OTP sent to ${email} successfully` });
      } else {
        return res
          .status(500)
          .json({ message: "There was an error saving the OTP" });
      }
    } else {
      return res
        .status(500)
        .json({ message: "An error occurred while sending the email" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


//Send email to donors with high income
const sendEmailToDonor = async (req, res, next) => {
  const { email, result } = req.body;

  if (!email || !result) {
    return res.status(400).json({ message: "All fields are mandatory" });
  }

  try {
    const userExists = await UserModel.findOne({ email });

    if (!userExists) {
      return res.status(404).json({ message: "Email not found" });
    }

    // Update the result field in the user model
    await UserModel.updateOne({ email }, { result });


    if (result === "High Income"){
      const success = await sendEmail({
        subject: "Donation Reminder",
        html: `
                  <h3>Welcome back to Donation Ninja!</h3>
                  <p>Do not forget to donate! Your support makes a difference.</p>
              `,
        to: email,
        from: process.env.GOOGLE_EMAIL,
      });

    }


    return res.status(200).json({ message: "Details Stored" });

 
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//verifies the otp sent
const verifyEmailOTP = async (email, otp) => {
  if (!otp || !email) {
    return { status: 400, message: "All fields are mandatory" };
  }

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return { status: 404, message: "Email not found" };
    }

    const otpResult = await OtpModel.findOne(
      { email: user.email },
      {},
      { sort: { expiry: -1 } }
    );

    if (!otpResult || otpResult.otp !== otp) {
      return { status: 400, message: "Invalid OTP" };
    }

    const currentDate = new Date();

    if (currentDate > otpResult.expiry) {
      return { status: 400, message: "OTP has expired" };
    }

    return { status: 200, message: "User OTP is correct" };
  } catch (error) {
    return { status: 500, message: error.message };
  }
};

// Log in to your account
// @route POST /api/user/login
// @access public
const signInUser = async (req, res, next) => {
  const { email, password, otp } = req.body;

  if (!password || !email || !otp) {
    return res.status(400).json({ message: "All fields are mandatory" });
  }

  try {
    // Check if user exists
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Email not found" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    try {
      // Call the verifyEmailOTP function with await
      const verificationResult = await verifyEmailOTP(email, otp);

      if (verificationResult.status === 200) {
        const accessToken = jwt.sign(
          { id: user._id, name: user.name, email: user.email, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: "15m" }
        );
        
        const userData = {
            userId: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
          };

        return res.status(200).json({ data: userData, token: accessToken });
      } else {
        return res
          .status(verificationResult.status)
          .json({ message: verificationResult.message });
      }
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Update user profile
// @route PUT /api/user/
// @access private
const updateUserProfile = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if ( !firstName || !lastName || !email || !password) {
    return res.status(400).json({ message: "All fields are mandatory" });
  }


  try {
    // Check if user exists
    const user = await UserModel.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user data
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.password = hashedPassword;

    // Save the updated user
    await user.save();

    return res
      .status(200)
      .json({ message: "User profile updated successfully", data: user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Store donation details
// @route POST /api/donation/store
// @access public
const storeDonation = asyncHandler(async (req, res) => {

  try {
    const { email, donationType, Amount, dropOff, mobileNumber } = req.body;

    const status = "Not yet picked";

    // if (!email) {
    //   return res.status(400).json({ message: "Please fill in all the fields" });
    // }

    if(donationType === "money"){

      const newDonation = await DonationModel.create({
        email,
        donationType,
        Amount,
        dropOff: "N/A",
        status,
        mobileNumber,
      });

      return res.status(200).json({ message: "Donation stored successfully", data: newDonation });

    }else{

      const newDonation = await DonationModel.create({
        email,
        donationType,
        Amount: "0.0",
        dropOff: "dropOff",
        status,
        mobileNumber,
      });

      return res.status(200).json({ message: "Donation stored successfully", data: newDonation });
    }

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});


//get donations by email
const getDonationsByEmail = asyncHandler(async (req, res) => {
  try {
    const {email} = req.body;

    // Check if email is provided
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Fetch donations by email
    const donations = await DonationModel.find({ email });

    return res.status(200).json({ message: "Donations fetched successfully", data: donations });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});


const getDonations = asyncHandler(async (req, res) => {
  try {
    // Fetch all donations
    const donations = await DonationModel.find();

    return res.status(200).json({ message: "All donations fetched successfully", data: donations });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

//get predictions
const getPredictions = asyncHandler(async (req, res) => {
  try {
    const users = await UserModel.find({}, 'firstName lastName email result');
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Updating donation status
const updateDonationStatus = asyncHandler(async (req, res) => {
  try {
    const { donationId } = req.params; // Extract donationId from URL params
    const { status } = req.body;

    // Check if donationId and status are provided
    if (!donationId || !status) {
      return res.status(400).json({ message: "Donation ID and status are required" });
    }

    // Find the donation by ID
    const donation = await DonationModel.findById(donationId);

    // Check if the donation exists
    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    // Update the status
    donation.status = status;

    // Save the updated donation
    await donation.save();

    return res.status(200).json({ message: "Donation status updated successfully", data: donation });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});


// Updating donation status
const updateArrivalofDonation = asyncHandler(async (req, res) => {
  try {
    const { donationId } = req.params; // Assuming the donation ID is passed in the URL parameters
    const { arrivedAtDestination } = req.body;

    // Check if the donation ID and status are provided
    if (!donationId || !arrivedAtDestination) {
      return res.status(400).json({ message: "Donation ID and status are required" });
    }

    // Find the donation by ID
    const donation = await DonationModel.findById(donationId);

    // Check if the donation exists
    if (!donation) {
      return res.status(404).json({ message: "Donation not found" });
    }

    // Update the status
    donation.arrivedAtDestination = arrivedAtDestination;

    // Save the updated donation
    await donation.save();

    return res.status(200).json({ message: "Donation status updated successfully", data: donation });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});


// Delete user profile
// @route DELETE /api/user/:userId
// @access private
const deleteUserProfile = asyncHandler(async (req, res) => {
  
  const userId = req.user.id

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    // Check if user exists
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the user
    await UserModel.findByIdAndDelete(userId);

    return res
      .status(200)
      .json({ message: "User profile deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});


// Show current user
// @route GET /api/user/
// @access private
const currentUser = asyncHandler(async (req, res) => {
   try {
    const userId = req.user.id;

    // Fetch user data from the database
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send the user data as response
    return res.status(200).json({ message: "User authorized", data: user });
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
});

module.exports = {
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
  getPredictions
};
