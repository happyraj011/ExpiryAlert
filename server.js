// server/server.js

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cron = require('node-cron');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());

mongoose.connect('mongodb://localhost:27017/Scanner', {

    });

const Product = mongoose.model('Product', new mongoose.Schema({
  productName: String,
  manufactureDate: Date,
  expiryDate: Date,
}));

app.use(bodyParser.json());

const twilioConfig = {
  accountSid: process.env.TWILIO_ACCOUNT_SID,
  authToken: process.env.TWILIO_AUTH_TOKEN,
  twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER,
};

const client = require('twilio')(twilioConfig.accountSid, twilioConfig.authToken);

const sendSMS = (product, phoneNumber) => {
  const messageBody = 
  `Product Details: ${product.productName}, 
  Expiry Date: ${product.expiryDate}`;
  client.messages.create({
    body: messageBody,
    from: twilioConfig.twilioPhoneNumber,
    to: process.env.RECIPIENT_PHONE_NUMBER,
  })
  .then(message => console.log('SMS sent successfully:', message.sid))
  .catch(error => console.error('Error sending SMS:', error));
};

app.post('/api/products', async (req, res) => {
  const { productName, manufactureDate, expiryDate, phoneNumber } = req.body;
  try {
    const newProduct = await new Product({ productName, manufactureDate, expiryDate }).save();
    res.json({ message: 'Product added successfully' });
  } catch (error) {
    console.error('Error saving product:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

cron.schedule('0 0 * * *', async () => {
  try {
    const twoDaysBefore = new Date();
    twoDaysBefore.setDate(twoDaysBefore.getDate() + 2);
    const productsToNotify = await Product.find({ expiryDate: { $lte: twoDaysBefore } });
    productsToNotify.forEach(product => sendSMS(product, 'recipient-phone-number'));
    console.log('Details sent for products two days before expiry');
  } catch (error) {
    console.error('Error sending details two days before expiry:', error);
  }
});

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
