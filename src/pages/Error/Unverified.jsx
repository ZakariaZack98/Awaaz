import React from 'react';

const Unverified = () => {
  return (
    <div className="flex items-center justify-center w-full h-screen bg-black">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-yellow-400 mb-4">User is not verified</h1>
        <p className="text-xl text-red-500">Please check your email</p>
      </div>
    </div>
  );
};

export default Unverified;
