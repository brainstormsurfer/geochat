import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import { ToastContainer } from "react-toastify";
import { store } from "./store.js";
import { Provider } from "react-redux";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
    <ToastContainer position="top-center" />
  </Provider>
);

// // import { AuthProvider } from './context/AuthContext.jsx';
// // import { HelperProvider } from './context/HelperContext.jsx';

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     {/* <HelperProvider> */}
//       {/* <AuthProvider> */}
//         <App />
//       {/* </AuthProvider> */}
//     {/* </HelperProvider> */}
//   </React.StrictMode>,
// );
