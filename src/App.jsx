
import { createContext } from "react";
import { RouterProvider } from "react-router-dom";
import router from "./Router/Router";
import "./App.css";

// Define a context to share state across components
export const AppState = createContext();

function App() {
  return <RouterProvider router={router} />;
}

export default App;
