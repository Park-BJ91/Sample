import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Home, UserCircle, LogIn, LogOut, FileText } from "lucide-react";
import { useAuth } from "@contexts/AuthContext";
import { userLogoutAPI } from "@api/auth/authApi";

// export default function Topbar({ isLoggedIn, onLogout }) {
export default function Topbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { isLogin, setIsLogin } = useAuth();

    const navigate = useNavigate();
    const location = useLocation(); // 현재 경로 정보
    const menuRef = useRef(); // 메뉴 외부 클릭 감지용 ref


    // 현재 경로가 변경될 때마다 메뉴 닫기
    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname]);

    // 메뉴 외부 클릭 시 메뉴 닫기
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuRef]);

    // 로그아웃 핸들러
    const handleLogout = () => {
        userLogoutAPI()
            .then((response) => {
                if (response.status === 200) {
                    setIsLogin(false);
                    navigate("/");
                }
            })
            .catch((error) => {
                console.error("Logout error:", error);
            });
    }

    return (
        <nav className="fixed top-0 left-0 right-0 bg-white shadow z-50">
            {/* <nav className="bg-white shadow z-50"> */}
            <div className="px-6 h-14 flex items-center justify-between">

                {/* 왼쪽: 홈 아이콘 */}
                <Link to="/" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600">
                    <Home className="w-6 h-6" />
                    <span className="hidden md:block font-bold">홈</span>
                </Link>

                {/* 가운데: 메뉴 */}
                <div className="hidden md:flex items-center space-x-6 text-gray-700">
                    <Link to="/board" className="flex items-center hover:text-blue-600">
                        <FileText className="w-5 h-5 mr-1" /> 게시판
                    </Link>
                </div>

                {/* 오른쪽: 로그인 / 유저 */}
                <div className="relative">
                    {!isLogin ? (
                        <Link to="/login" className="flex items-center text-gray-700 hover:text-blue-600">
                            <LogIn className="w-6 h-6 mr-1" /> 로그인
                        </Link>
                    ) : (
                        <button
                            className="flex items-center space-x-2 text-gray-700 hover:text-blue-600"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            <UserCircle className="w-7 h-7" />
                        </button>
                    )}

                    {/* 유저 드롭다운 */}
                    {isLogin && menuOpen && (
                        <div
                            className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg py-2"
                            ref={menuRef}
                        >
                            <Link to="/user/infos/settings" className="block px-4 py-2 hover:bg-gray-100">
                                내 정보
                            </Link>
                            <Link to="/user/infos/favorites" className="block px-4 py-2 hover:bg-gray-100">
                                즐겨찾기
                            </Link>
                            <Link to="/user/infos/posts" className="block px-4 py-2 hover:bg-gray-100">
                                내 게시글
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center w-full text-left px-4 py-2 hover:bg-gray-100 text-red-500"
                            >
                                <LogOut className="w-4 h-4 mr-2" /> 로그아웃
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}