<<<<<<< HEAD
import React from "react";
import SignUp from "./pages/SignUp/SignUp";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from "./pages/SignIn/SignIn";
import Index from "./pages/Home";
import CommonLayout from "./pages/CommonLayout";
import Profile from "./pages/Profile/Profile";
import AllUsers from "./pages/Profile/AllUsers";
=======
import React from 'react'
import SignUp from './pages/SignUp/SignUp'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import SignIn from './pages/SignIn/SignIn'
import Index from './pages/Home'
import CommonLayout from './pages/CommonLayout'
import Settings from './pages/Settings/Settings'
>>>>>>> d1e889dce92f782d66ca8de5922cb827806e69ef

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
<<<<<<< HEAD
        <Route path="" element={<CommonLayout />}>
          <Route index element={<Index />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/all-users" element={<AllUsers />} />
=======
        <Route path='' element={<CommonLayout/>}>
          <Route index element={<Index/>}/>
          <Route path='/settings' element={<Settings/>}/>
>>>>>>> d1e889dce92f782d66ca8de5922cb827806e69ef
        </Route>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
