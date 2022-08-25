import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Welcome from './pages/Welcome';

function App(): JSX.Element {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Welcome />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
