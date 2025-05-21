import React from 'react';
import { Link } from 'react-router-dom';

const AccessDenied = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">403: Access Denied</h1>
      <p className="text-lg text-gray-600 mb-8">You do not have permission to access this page.</p>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        <Link to="/">Return to Home</Link>
      </button>
    </div>
  );
};

export default AccessDenied;