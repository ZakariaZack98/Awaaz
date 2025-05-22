import React from "react";
import SignUp from "./pages/SignUp/SignUp";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Index from "./pages/Home";
import CommonLayout from "./pages/CommonLayout";
import Profile from "./pages/Profile/Profile";
import Settings from "./pages/Settings/Settings";
import SignIn from "./pages/SignIn/SignIn";
import Notifications from "./pages/Notifications/Notifications";
import Explore from "./pages/Explore/Explore";
import AccessDenied from "./pages/Error/AccessDenied";
import AddStory from "./pages/AddStory/AddStory";
import NotFound from "./pages/Error/NotFound";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<CommonLayout />}>
          <Route index element={<Index />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route
            path={`/profile/:userId/saved`}
            element={<Profile defaultTab="saved" />}
          />
          <Route path="/add_story" element={<AddStory />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/explore" element={<Explore />} />
        </Route>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/accessdenied" element={<AccessDenied />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
