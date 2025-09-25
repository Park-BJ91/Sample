import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthProvider } from '@contexts/AuthContext';

import HomePage from '@pages/HomePage';
import TourDetail from '@pages/tour/detail/TourDetail';
import SearchContent from '@pages/tour/search/SearchContent';
import LoginPage from '@pages/login/LoginPage';
import LoginSuccess from '@pages/login/LoginSuccess';
import SignupPage from '@pages/signup/SignupPage';

import UserInfoDashBoardPage from '@pages/user/UserInfoDashBoardPage';
import UserSettingsPage from '@pages/user/UserSettingsPage';
import FavoriteListPage from '@pages/user/FavoriteListPage';
import PostListPage from '@pages/user/PostListPage';

import Layout from '@components/Layout';

import '../main.css';

export default function Main() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/signup" element={<SignupPage />} />

                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/login/success" element={<LoginSuccess />} />
                    <Route path="/login/fail" element={<LoginPage />} />

                    <Route element={<Layout />}>
                        <Route path="/" element={<HomePage />}>
                            <Route path="tour/search" element={<SearchContent />} />
                            <Route path="tour/detail/:id" element={<TourDetail />} />
                        </Route>

                        <Route path="/user/infos" element={<UserInfoDashBoardPage />} >
                            <Route path="settings" element={<UserSettingsPage />} />
                            <Route path="favorites" element={<FavoriteListPage />} />
                            <Route path="posts" element={<PostListPage />} />
                        </Route>
                    </Route>


                </Routes>
            </Router>
        </AuthProvider>
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