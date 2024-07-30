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
  const [currentIndex, setCurrentIndex] = useState(1);
  
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

  const renderCardContent = () => {
    if (fileData == null || fileData.length === 0) {
      return <p>Loading...</p>;
    }

    const currentData = fileData[currentIndex];

    // Using for loop to iterate through Answers array
    const answersList = [];
    for (let i = 0; i < currentData.Answers.length; i++) {
      answersList.push(
        <Col xs={12} key={i}>
          {currentData.Answers[i].Answer}
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
            <Button onClick={handleNext} disabled={currentIndex === fileData.length - 1}>
              Next
            </Button>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </Container>
  );
};

export default App;