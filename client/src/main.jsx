import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {BrowserRouter} from "react-router-dom";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import {Provider} from "react-redux";
import {store} from "./redux/store.js";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <Provider store={store}>
          <BrowserRouter>
              <Header />
              <App />
              <ToastContainer />
              <Footer />
          </BrowserRouter>
      </Provider>
  </React.StrictMode>,
)
