import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainFramework from './Components/MainFramework';
import AboutPage from './Pages/AboutPage';
import HomePage from './Pages/HomePage';
import LoginPage from './Pages/LoginPage';
import { GlobalProvider } from './Contexts/globalContext';
import RequireAuth from './Components/RequireAuth';

export default function DefaultRouter() {
    return (
        <GlobalProvider>
            <Router>
                <Routes>
                    <Route path="/" element={
                        <RequireAuth>
                            <MainFramework />
                        </RequireAuth>
                    }>
                        <Route path="about" element={<AboutPage />} />
                        <Route path="home" element={<HomePage />} />
                    </Route>
                    <Route path="/login" element={<LoginPage />} />
                </Routes>
            </Router>
        </GlobalProvider>
    )
}
