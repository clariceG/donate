const axios = require('axios');
const crypto = require('crypto');
const Donation = require('../models/donation');

// Replace this with your actual credentials
const mpesaCredentials = {
    consumerKey: 'xP9eqHSEk0iqU3sDajpMrfdPOmbMjFRh',
    consumerSecret: '46XEQ5Hy22t7N8Po',
    lipaNaMpesaOnlinePasskey: 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919',
    lipaNaMpesaOnlineShortcode: '174379',
    callbackUrl: 'https://mydomain.com/path',
    baseUrl: 'https://sandbox.safaricom.co.ke',
};

exports.stkPush = async (req, res) => {
  try {
    const requestBody = {
      BusinessShortCode: mpesaCredentials.lipaNaMpesaOnlineShortcode,
      Password: generatePassword(mpesaCredentials),
      Timestamp: generateTimestamp(),
      TransactionType: 'CustomerPayBillOnline',
      Amount: req.body.amount, // Get the amount from the form
      PartyA: req.body.mobileNumber, // Replace with the customer's phone number from the form
      PartyB: mpesaCredentials.lipaNaMpesaOnlineShortcode,
      PhoneNumber: req.body.mobileNumber, // Replace with the customer's phone number from the form
      CallBackURL: mpesaCredentials.callbackUrl,
      AccountReference: 'CompanyXLTD', // Replace with your reference
      TransactionDesc: 'Payment of X', // Replace with the transaction description
    };

    const response = await axios.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', requestBody, {
      headers: {
        Authorization: `Bearer ${await getAccessToken()}`,
      },
    });

    // Extract merchantRequestId and checkoutRequestId from the response
    const { MerchantRequestID, CheckoutRequestID } = response.data;

    // Save the response details to your database or perform any other necessary actions
    const donation = new Donation({
        MerchantRequestID,
        CheckoutRequestID,
        Amount: req.body.amount,
        PhoneNumber: req.body.mobileNumber,
        Reference: 'CompanyXLTD',
        Description: 'Payment of X',
      });
  
      await donation.save();
  
      res.json({ MerchantRequestID, CheckoutRequestID });
    } catch (error) {
      console.error('Error:', error.message);
      res.status(500).send('Internal Server Error');
    }
  };

// Function to generate the Lipa Na M-Pesa Online password
function generatePassword(credentials) {
  const { lipaNaMpesaOnlineShortcode, lipaNaMpesaOnlinePasskey } = credentials;
  const timestamp = generateTimestamp();
  const concatenatedString = `${lipaNaMpesaOnlineShortcode}${lipaNaMpesaOnlinePasskey}${timestamp}`;
  const hashedString = crypto.createHash('sha256').update(concatenatedString, 'utf8').digest('hex');
  const base64EncodedPassword = Buffer.from(hashedString, 'hex').toString('base64');
  return base64EncodedPassword;
}

// Function to generate the timestamp
function generateTimestamp() {
  return new Date().toISOString().replace(/[-:.TZ]/g, '');
}

// Function to get the M-Pesa Daraja API access token
async function getAccessToken() {
  const response = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
    auth: {
      username: mpesaCredentials.consumerKey,
      password: mpesaCredentials.consumerSecret,
    },
  });

  return response.data.access_token;
};
