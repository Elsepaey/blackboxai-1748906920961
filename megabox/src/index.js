import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';  // Import Tailwind CSS
import App from './App';
import reportWebVitals from './reportWebVitals';

// Handle Branch.io deep links before rendering the app
const handleBranchDeepLink = () => {
  const currentUrl = window.location.href;
  
  if (currentUrl.includes("wzhu2.test-app.link") || currentUrl.includes("wzhu2.app.link")) {
    // Redirect to our handler with the original URL as a parameter
    const redirectUrl = `${window.location.origin}/redirect?url=${encodeURIComponent(currentUrl)}`;
    window.location.replace(redirectUrl);
    return true;
  }
  return false;
};

// Only render the app if we are not handling a Branch.io deep link
if (!handleBranchDeepLink()) {
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
