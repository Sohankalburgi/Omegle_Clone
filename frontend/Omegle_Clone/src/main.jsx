
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Room from './Components/Room.jsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
  },
  {
    path : '/room',
    element : <Room/>
  }
]);

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router}/>
  
)
