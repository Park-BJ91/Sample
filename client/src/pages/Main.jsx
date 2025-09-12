import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from '@pages/HomePage';
import FilterableProductTable from '@components/b/FilterableProductTable';
// import LoginPage from '@pages/login/LoginPage';
import LoginPage from '@pages/login/LoginPage';
import LoginSuccess from '@pages/login/LoginSuccess';
import DashBoard from '@pages/DashBoard';
import UserDelete from '@pages/user/UserDelete';
import ProtectedRoute from '@root/config/ProtectedRoute';
import '../main.css';

export default function Main() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/login/success" element={<LoginSuccess />} />

                <Route path="/login/fail" element={<LoginPage />} />
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

                <Route path="/" element={<HomePage />} />
                <Route path="/pass/:id" element={<HomePage />} />
                <Route path="/products" element={<FilterableProductTable />} />
            </Routes>
        </Router>
    );
} 