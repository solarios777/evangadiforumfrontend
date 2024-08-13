
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";
import Layout from "../components/Layout/Layout";
import Home from "../pages/Home/Home";
import Register from "../components/Signup/Signup";
import Question from "../pages/Question/Question";
import UserProfile from "../pages/UserProfile/UserProfile";
import User from "../pages/User/User";
import Answer from "../pages/Answer/Answer";
import Login from "../pages/Signin/Signin";
import PrivateRoute from "../utils/ProtectedRoute/PrivateRoute";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route index element={
        <PrivateRoute>
          <Home />
        </PrivateRoute>
      } />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/question" element={
        <PrivateRoute>
          <Question />
        </PrivateRoute>
      } />
      <Route
        path="/userprofile/:username"
        element={<PrivateRoute> {<UserProfile />} </PrivateRoute>}
      ></Route>
      <Route
        path="/user/:username"
        element={<PrivateRoute> {<User />} </PrivateRoute>}
      ></Route>
      <Route path="/question/:question_id" element={
        <PrivateRoute>
          <Answer />
        </PrivateRoute>
      } />
      <Route path="/question/:question_id/edit" element={ <PrivateRoute>
          <Question />
      </PrivateRoute>} />
      <Route path="/answer/:answer_id/edit" element={
        <PrivateRoute>
          <Answer />
        </PrivateRoute>
      } />
    </Route>
  )
);

export default router;
