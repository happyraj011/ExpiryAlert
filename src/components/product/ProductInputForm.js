// client/src/components/product/ProductInputForm.js

import React, { useState } from 'react';
import axios from 'axios';

const ProductInputForm = () => {
  const [productName, setProductName] = useState('');
  const [manufactureDate, setManufactureDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const handleSaveProduct = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/products', {
        productName,
        manufactureDate,
        expiryDate,
      });

      // Clear form fields
      setProductName('');
      setManufactureDate('');
      setExpiryDate('');
      
      // Set success message
      setSuccessMessage('Product added successfully');
      
      console.log(response.data);
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  return (
    <div>
      <h2>Product Input Form</h2>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <label>
        Product Name:
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
      </label>
      <br />
      <label>
        Manufacture Date:
        <input
          type="date"
          value={manufactureDate}
          onChange={(e) => setManufactureDate(e.target.value)}
        />
      </label>
      <br />
      <label>
        Expiry Date:
        <input
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
        />
      </label>
      <br />
      <button onClick={handleSaveProduct}>Save Product</button>
    </div>
  );
};

export default ProductInputForm;
