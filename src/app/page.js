import Header from "./Header";
import Footer from "./Footer";
import Register from "./Register";
 import { ToastContainer, toast } from 'react-toastify';
 import { Bounce } from "react-toastify";
 import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  return (
   <div>
    <Header/>
    <Register/>
    <Footer/>
    <ToastContainer
position="top-right"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick={false}
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="light"
transition={Bounce}
/>
   </div>
  );
}
