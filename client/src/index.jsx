import React from 'react';
import ReactDOM from 'react-dom/client';
import Main from '../src/pages/Main';

const containerStyle = {
    maxWidth: '1200px',
    minWidth: '635px',
    margin: '0 auto',
    padding: '0 16px',
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <div className="container" style={containerStyle}>
            {<Main />}
        </div>
    </React.StrictMode>
);

