import { Link, Outlet, useLocation } from "react-router-dom";

export default function UserInfoDashBoardPage() {
    const location = useLocation();

    return (
        <div>
            <div className="max-w-5xl mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold mb-6">내 정보</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                    {/* <Link
                        to="/user/infos/settings"
                        className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition"
                    >
                        <h3 className="text-lg font-semibold mb-2">설정</h3>
                        <p className="text-sm text-gray-600">계정 수정, 비밀번호 변경, 탈퇴</p>
                    </Link> */}

                    {/* 즐겨찾기 */}
                    <Link
                        to="/user/infos/favorites"
                        className={`rounded-2xl shadow p-6 hover:shadow-lg transition 
                            ${location.pathname === "/user/infos/favorites"
                                ? "bg-blue-100 border border-blue-400" // ✅ 활성 상태 스타일
                                : "bg-white"
                            }`}
                    >
                        <h3 className="text-lg font-semibold mb-2">즐겨찾기</h3>
                        <p className="text-sm text-gray-600">관광지 즐겨찾기 목록 관리</p>
                    </Link>

                    {/* 게시글 */}
                    <Link
                        to="/user/infos/posts"
                        className={`rounded-2xl shadow p-6 hover:shadow-lg transition 
                            ${location.pathname === "/user/infos/posts"
                                ? "bg-blue-100 border border-blue-400" // ✅ 활성 상태 스타일
                                : "bg-white"
                            }`}
                    >
                        <h3 className="text-lg font-semibold mb-2">게시글</h3>
                        <p className="text-sm text-gray-600">내가 남긴 후기 및 글 관리</p>
                    </Link>


                </div>

                <Outlet />
            </div>
        </div>
    );
}
