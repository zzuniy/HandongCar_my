// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App';
// import reportWebVitals from './reportWebVitals';

// const script = document.createElement('script');
// script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_APP_KEY}&libraries=services`;



import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';

// ⚠️ Add a parameter 'autoload=false' and a 'callback'
const script = document.createElement('script');
script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_APP_KEY}&libraries=services&autoload=false`; 

script.onload = () => {
  // ⭐️ This is the new, crucial part: Manually bootstrap the map API
  window.kakao.maps.load(() => {
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  });
};
document.head.appendChild(script);

reportWebVitals();
