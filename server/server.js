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

      var prevQuestion = null;
      var currQuestion = null;
      
      const questionObject = [];

      // Looping through the excel file where we compare each row with the next
      // row to gather the multiple answers that go along with it.
      // This works by using pointers to keep track of currentQuestion and previousQuestion
      // and pushing the previousQuestion variable into our questionObject when both variables
      // don't match anymore meaning we have moved onto a new question and collected all the 
      // necessary answers that go with this question.
      for (let item of jsonData) {
        console.log(item);
        console.log("------");

        // Creating our question Object containing the question and a list of answers with their
        // value.
        currQuestion = {
          Question: item.Question,
          Answers: [{
            Answer: item.Answer,
            two: item.two,
            five: item.five,
            ten: item.ten,
            twenty: item.twenty,
            fifty: item.fifty,
            oneHundred: item.oneHundred,
            oneHundredPlus: item.oneHundredPlus,
            secretEightyEight: item.secretEightyEight,
            secretOne: item.secretOne}]
        };
        
        // Setting our first prevQuestion during the first iteration since it's null be default
        if (prevQuestion == null) {
          prevQuestion = currQuestion;
        }
        else {
          // Checking if questions are the same, if so we collect all the answers from the previous
          // question and appending it to the currQuestion and repeating it till we hit a case
          // where both questions are different
          if (prevQuestion.Question == currQuestion.Question) {
            for (let ans of prevQuestion.Answers) {
              currQuestion.Answers.push(ans)
            }
            
            prevQuestion = currQuestion;
          }
          else {
            questionObject.push(prevQuestion)
            prevQuestion = currQuestion;
          }
        }
      }

      // This is for adding the last item in the list
      questionObject.push(prevQuestion)

      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
      res.json(questionObject); // Send JSON data as response
    } catch (error) {
      console.error('Error reading file:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });