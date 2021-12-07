import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainFramework from './Components/MainFramework';
import AboutPage from './Pages/AboutPage';
import HomePage from './Pages/HomePage';

import { GlobalProvider } from './Contexts/globalContext';

export default function DefaultRouter() {
    return (
        <GlobalProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<MainFramework />} />
                    <Route path="/about" element={<AboutPage />} />
                </Routes>
            </Router>
        </GlobalProvider>
    )
}
