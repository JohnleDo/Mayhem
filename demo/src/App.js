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
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 1));
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, fileData.length - 1));
  };

  const renderCardContent = () => {
    const content = [];
    if (fileData != null) {
      const headers = fileData[0];
      const currentData = fileData[currentIndex];

      for (const key in headers) {
        if (headers.hasOwnProperty(key)) {
          content.push(
            <Row key={key} className="mb-3">
              <Col xs={4} className="font-weight-bold">
                {headers[key]}:
              </Col>
              <Col xs={8}>{currentData[key]}</Col>
            </Row>
          );
        }
      }
    }
    return content;
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
            <Button onClick={handlePrevious} disabled={currentIndex === 1}>
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