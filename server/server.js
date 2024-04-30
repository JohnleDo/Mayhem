// server.js
const express = require('express');
const XLSX = require('xlsx');
const app = express();
const port = 5000;

// Endpoint to read Excel file from local directory
app.get('/read', (req, res) => {
    try {
      const filePath = './server/example.xlsx'; // Path to your Excel file
      const workbook = XLSX.readFile(filePath);
      const sheetName = workbook.SheetNames[0]; // Assuming first sheet
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
  
      res.json(jsonData); // Send JSON data as response
    } catch (error) {
      console.error('Error reading file:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });