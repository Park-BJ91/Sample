import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '@pages/HomePage';

import TourDetail from '@pages/tour/detail/TourDetail';
import SearchContent from '@pages/tour/search/SearchContent';

import LoginPage from '@pages/login/LoginPage';
import LoginSuccess from '@pages/login/LoginSuccess';

import '../main.css';

export default function Main() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/login/success" element={<LoginSuccess />} />
                <Route path="/login/fail" element={<LoginPage />} />

                <Route path="/tour/*" element={<HomePage />}>
                    <Route path="search" element={<SearchContent />} />
                    <Route path="detail/:id" element={<TourDetail />} />
                </Route>

                <Route />
            </Routes>
        </Router>
    );
}

/* 
    <Route path="/user/delete"
        element={
            <ProtectedRoute>
                <UserDelete />
            </ProtectedRoute>
        } />

    <Route path="/dashboard"
        element={
            <ProtectedRoute>
                <DashBoard />
            </ProtectedRoute>
        } />
*/