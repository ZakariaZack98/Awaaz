import React from "react";
import SignUp from "./pages/SignUp/SignUp";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from "./pages/SignIn/SignIn";
import Index from "./pages/Home";
import CommonLayout from "./pages/CommonLayout";
import Profile from "./pages/Profile/Profile";
import AllUsers from "./pages/Profile/AllUsers";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<CommonLayout />}>
          <Route index element={<Index />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/all-users" element={<AllUsers />} />
        </Route>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
