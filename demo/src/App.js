import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [fileData, setFileData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/read');
        setFileData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []); // Fetch data once when component mounts

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, fileData.length - 1));
  };

  const handleButtonClick = (value) => {
    setSelectedAnswers((prevSelectedAnswers) => ({
      ...prevSelectedAnswers,
      [currentIndex]: value, // Store the selected answer for the current question
    }));
  };

  const handleSubmit = () => {
    // You can implement the submit logic here, like sending selectedAnswers to the server
    console.log('Submitted answers:', selectedAnswers);
  };

  const renderCardContent = () => {
    if (fileData == null || fileData.length === 0) {
      return <p>Loading...</p>;
    }

    const currentData = fileData[currentIndex];
    const selectedAnswer = selectedAnswers[currentIndex]; // Get the selected answer for the current question

    // Using for loop to iterate through Answers array
    const answersList = [];
    for (let i = 0; i < currentData.Answers.length; i++) {
      const answer = currentData.Answers[i].Answer;
      const isSelected = answer === selectedAnswer; // Check if this answer is the selected one
      answersList.push(
        <Col xs={12} key={i} className="mb-2">
          <Button
            variant={isSelected ? 'success' : 'primary'} // Highlight the selected button
            value={answer}
            onClick={() => handleButtonClick(answer)}
          >
            {answer}
          </Button>
        </Col>
      );
    }

    return (
      <div>
        <Row className="mb-3">
          <Col xs={12} className="font-weight-bold">
            Question:
          </Col>
          <Col xs={12}>{currentData.Question}</Col>
        </Row>
        <Row className="mb-3">
          <Col xs={12} className="font-weight-bold">
            Answers:
          </Col>
          {answersList}
        </Row>
      </div>
    );
  };

  return (
    <Container className="mt-4">
      <h2>Questions Slideshow</h2>
      {fileData != null ? (
        <>
          <Card>
            <Card.Body>
              {renderCardContent()}
            </Card.Body>
          </Card>
          <div className="d-flex justify-content-between mt-3">
            <Button onClick={handlePrevious} disabled={currentIndex === 0}>
              Previous
            </Button>
            {/* Conditionally render the Next or Submit button */}
            {currentIndex === fileData.length - 1 ? (
              <Button onClick={handleSubmit} disabled={!selectedAnswers[currentIndex]}>
                Submit
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!selectedAnswers[currentIndex]} // Disable if no answer selected
              >
                Next
              </Button>
            )}
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </Container>
  );
};

export default App;