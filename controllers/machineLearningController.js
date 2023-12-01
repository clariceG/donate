// machineLearningController.js
const nodemailer = require('nodemailer');

// Function to send email reminder
const sendReminderEmail = (emailAddress) => {
  // Configure your email transport (this example uses a Gmail account)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'mariamaramuthoni98@gmail.com', // replace with your email
      pass: 'clarice1stalways', // replace with your password
    },
  });

  // Email options
  const mailOptions = {
    from: 'mariamaramuthoni98@gmail.com', // replace with your email
    to: emailAddress,
    subject: 'Donation Reminder',
    text: 'Do not forget to donate! Your support makes a difference.',
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

// Function to make predictions and send email reminder if income is > $50k
const makePredictions = (formData) => {
  // TODO: Integrate your machine learning model here and return predictions
  // For illustration purposes, return a static prediction
  const predictedIncome = 'High Income'; // Replace this with the actual prediction from your model

  // Assuming formData.email contains the donor's email address
  const donorEmail = formData.email;

  // Check if predicted income is 'High Income'
  if (predictedIncome === 'High Income') {
    // Send an email reminder
    sendReminderEmail(donorEmail);
  }

  return predictedIncome;
};

module.exports = {
  makePredictions,
};
