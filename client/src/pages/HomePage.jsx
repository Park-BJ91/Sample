import { useNavigate } from 'react-router-dom';

export default function HomePage() {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Perform logout logic here
        navigate('/login'); // Redirect to login page
    };

    const handleProduct = () => {
        navigate('/products'); // Redirect to product page
    }

    return (
        <div>
            <h1>Home Page</h1>
            <p>Welcome to the home page!</p>
            <div>
                <p>
                    <button onClick={handleLogout}>login</button>
                </p>
                <p>
                    <button onClick={handleProduct}>Product</button>
                </p>
            </div>
        </div>
    );
}