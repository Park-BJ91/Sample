import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from '@pages/LoginPage';
import HomePage from '@pages/HomePage';
import FilterableProductTable from '@components/b/FilterableProductTable';



export default function Main() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/" element={<HomePage />} />
                <Route path="/pass/:id" element={<HomePage />} />
                <Route path="/products" element={<FilterableProductTable />} />
            </Routes>
        </Router>
    );
}