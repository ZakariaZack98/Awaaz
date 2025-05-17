import React from 'react';

const Unverified = () => {
  return (
    <div className="flex items-center justify-center w-full h-screen bg-black">
      <div class="h-screen w-screen bg-gray-50 flex items-center">
        <div class="container flex flex-col md:flex-row items-center justify-between px-5 text-gray-700">
          <div class="w-full lg:w-1/2 mx-8">
            <div class="text-7xl text-green-500 font-dark font-extrabold mb-8">User is not verified</div>
            <p class="text-2xl md:text-3xl font-light leading-normal mb-8">
              Please check your email to verified
            </p>
          </div>
          <div class="w-full lg:flex lg:justify-end lg:w-1/2 mx-5 my-12">
            <img src="https://user-images.githubusercontent.com/43953425/166269493-acd08ccb-4df3-4474-95c7-ad1034d3c070.svg" class="" alt="Page not found" />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Unverified;
