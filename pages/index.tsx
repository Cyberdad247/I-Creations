import React from 'react';
import Layout from '../Layout';

const HomePage: React.FC = () => {
  // Handler for the button click
  const handleClick = () => {
    // Example: You can trigger a toast here via context in the future
    alert('Welcome to I Creations! Your journey starts here.');
  };

  return (
    <Layout>
      <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-gray-900 leading-tight drop-shadow animate-fadeIn">
        Welcome to <span className="text-blue-600">I-Creations</span>
      </h1>
      <p className="mb-8 text-lg md:text-2xl text-gray-700 max-w-2xl mx-auto animate-fadeIn delay-100">
        Your Agent Creation Ecosystem is ready. Experience seamless creation, management, and
        orchestration of intelligent agents. Click below to get started!
      </p>
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 animate-fadeIn delay-200"
        onClick={handleClick}
        aria-label="Get Started"
      >
        Get Started
      </button>
    </Layout>
  );
};

export default HomePage;
