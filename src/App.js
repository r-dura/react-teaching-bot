import React, { useState } from 'react';
import './App.css';
import { sendMessage, testApiConnection } from './services/aiService';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [teachings, setTeachings] = useState([]);
  const [teachingInput, setTeachingInput] = useState('');
  const [apiTestResult, setApiTestResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const response = await sendMessage(input, teachings);
      const botMessage = { text: response.message, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Sorry, there was an error processing your message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTeach = (e) => {
    e.preventDefault();
    if (!teachingInput.trim()) return;

    setTeachings(prev => [...prev, teachingInput]);
    setTeachingInput('');
  };

  const handleApiTest = async () => {
    setApiTestResult(null);
    setIsLoading(true);
    try {
      const result = await testApiConnection();
      setApiTestResult(result);
    } catch (error) {
      setApiTestResult(`API test failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>React Teaching Bot</h1>
      <button onClick={handleApiTest} disabled={isLoading}>
        Test API Connection
      </button>
      {apiTestResult && <p>{apiTestResult}</p>}
      
      <div className="teaching-container">
        <h2>Teach the Bot</h2>
        <form onSubmit={handleTeach}>
          <input
            type="text"
            value={teachingInput}
            onChange={(e) => setTeachingInput(e.target.value)}
            placeholder="Enter a fact to teach the bot..."
          />
          <button type="submit">Teach</button>
        </form>
        <ul>
          {teachings.map((teaching, index) => (
            <li key={index}>{teaching}</li>
          ))}
        </ul>
      </div>
      
      <div className="chat-container">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender}`}>
            {message.text}
          </div>
        ))}
        {isLoading && <div className="message bot loading">Bot is thinking...</div>}
        {error && <div className="error-message">{error}</div>}
      </div>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask the bot something..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
}

export default App;