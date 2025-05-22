import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">404: Not Found</h1>
        <p className="text-lg mb-8">Sorry, the page you are looking for does not exist.</p>
        <Link to="/" className="text-blue-500 hover:text-blue-700">
          Return to Homepage
        </Link>
      </div>
    </div>
  );
};

export default NotFound;