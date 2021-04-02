import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import loadUser from './components/auth/loadUser';

// s27 ./client/src/components/auth/loadUser.js
loadUser();

ReactDOM.render(<App />, document.getElementById('root'));
