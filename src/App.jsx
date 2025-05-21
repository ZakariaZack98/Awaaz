import React from "react";
import SignUp from "./pages/SignUp/SignUp";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./pages/Home";
import CommonLayout from "./pages/CommonLayout";
import Profile from "./pages/Profile/Profile";
import AllUsers from "./pages/Profile/AllUsers";
import Settings from "./pages/Settings/Settings";
import SignIn from "./pages/SignIn/SignIn";
import { auth } from "../Database/Firebase.config";
import AccessDenied from "./pages/Error/AccessDenied";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<CommonLayout />}>
          <Route index element={<Index />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path={`/profile/:userId/saved`} element={<Profile defaultTab="saved"/>} />
          <Route path="/all-users" element={<AllUsers />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/accessdenied" element={<AccessDenied />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
