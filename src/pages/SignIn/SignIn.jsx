import React, { useState } from 'react';
import { Facebook, Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAuth, sendEmailVerification, signInWithEmailAndPassword } from "firebase/auth";
import { handlefacebook, handlegoogle } from '../../utils/Signupsignin.utils';


const SignIn = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    signInWithEmailAndPassword(auth, email, password)
      .then((userInfo) => {
        return sendEmailVerification(auth.currentUser);
      }).then(() => {
        navigate("/")
      })
      .catch((error) => {
        console.log(error);
      });

  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-5">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 border border-gray-300 rounded mb-4">
          {/* Logo and App Name */}
          <div className="flex flex-col items-center mb-8">
            <h1 className="text-5xl font-semibold mb-4 font-serif tracking-wider">Awaaz</h1>
            <p className="text-gray-500 text-sm text-center">
              Sign in to see photos and videos from your friends
            </p>
          </div>

          {/* Social Sign In Options */}
          <div className="space-y-4 mb-6">
            <button onClick={() => handlefacebook(navigate)} className="flex items-center justify-center w-full bg-blue-500 text-white py-2 px-4 rounded font-medium hover:bg-blue-600 transition duration-200 cursor-pointer">
              <Facebook size={20} className="mr-2" />
              Continue with Facebook
            </button>

            <button onClick={() => handlegoogle(navigate)} className="flex items-center justify-center w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded font-medium hover:bg-gray-50 transition duration-200 cursor-pointer">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z" />
                <path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z" />
                <path fill="#4A90E2" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z" />
                <path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z" />
              </svg>
              Continue with Google
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center mb-6">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500 text-sm font-medium">OR</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Email/Password Login */}
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-400" />
              </div>
              <input
                type="email"
                placeholder="Email"
                className="pl-10 w-full border border-gray-300 rounded bg-gray-50 py-2 px-3 text-sm focus:outline-none focus:border-gray-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                type="password"
                placeholder="Password"
                className="pl-10 w-full border border-gray-300 rounded bg-gray-50 py-2 px-3 text-sm focus:outline-none focus:border-gray-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-blue-500 text-white py-2 rounded font-medium hover:bg-blue-600 transition duration-200 cursor-pointer"
            >
              Log In
            </button>

            <div className="text-center">
              <a href="#" className="text-xs text-blue-900 font-medium">
                Forgot password?
              </a>
            </div>
          </div>
        </div>

        {/* Sign Up Option */}
        <div className="bg-white p-6 border border-gray-300 rounded text-center">
          <p className="text-sm">
            Don't have an account?{' '}
            <span className="text-blue-500 font-semibold" onClick={() => navigate('/signup')}>
              Sign up
            </span>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center text-xs text-gray-500">
        <div className="flex justify-center flex-wrap gap-4 mb-4">
          <a href="#" className="hover:underline">About</a>
          <a href="#" className="hover:underline">Blog</a>
          <a href="#" className="hover:underline">Jobs</a>
          <a href="#" className="hover:underline">Help</a>
          <a href="#" className="hover:underline">Privacy</a>
          <a href="#" className="hover:underline">Terms</a>
        </div>
        <p>© 2025 Awaaz</p>
      </footer>
    </div>
  );
};

export default SignIn;