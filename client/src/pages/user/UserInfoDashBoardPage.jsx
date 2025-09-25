import { Link, Outlet } from "react-router-dom";

export default function UserInfoDashBoardPage() {
    return (
        <div>
            <div className="max-w-5xl mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold mb-6">내 정보</h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                    <Link
                        to="/user/infos/settings"
                        className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition"
                    >
                        <h3 className="text-lg font-semibold mb-2">설정</h3>
                        <p className="text-sm text-gray-600">계정 수정, 비밀번호 변경, 탈퇴</p>
                    </Link>

                    <Link
                        to="/user/infos/favorites"
                        className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition"
                    >
                        <h3 className="text-lg font-semibold mb-2">즐겨찾기</h3>
                        <p className="text-sm text-gray-600">관광지 즐겨찾기 목록 관리</p>
                    </Link>

                    <Link
                        to="/user/infos/posts"
                        className="bg-white rounded-2xl shadow p-6 hover:shadow-lg transition"
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
