import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainFramework from './Components/MainFramework';
import AboutPage from './Pages/AboutPage';
import TaskPage from './Pages/TaskPage';
import HistoriesPage from './Pages/HistoriesPage';
import LoginPage from './Pages/LoginPage';
import SettingPage from './Pages/SettingPage';
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
                        <Route index element={<TaskPage />} />
                        <Route path="histories" element={<HistoriesPage />} />
                        <Route path="about" element={<AboutPage />} />
                        <Route path="settings" element={<SettingPage />} />
                    </Route>
                    <Route path="/login" element={<LoginPage />} />
                </Routes>
            </Router>
        </GlobalProvider>
    )
}
