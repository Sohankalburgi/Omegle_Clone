import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Landing from './Landing.jsx';
import Room from './Room.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing/>,
  },
  {
    path : '/room',
    element : <Room/>
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
  <RouterProvider router={router}/>
  </StrictMode>,
)
