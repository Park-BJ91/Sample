import { useEffect, useState } from "react";
import { getFavoritesAPI, deleteFavoriteAPI } from "@api/favorite/favoriteAPI";

export default function FavoriteListPage() {
    const [favorites, setFavorites] = useState([]);

    // 즐겨찾기 목록 불러오기
    useEffect(() => {
        const fetchFavorites = async () => {
            const data = await getFavoritesAPI();
            setFavorites(data);
        };
        fetchFavorites();
    }, []);

    // 즐겨찾기 삭제
    const handleDelete = async (favId) => {
        if (!window.confirm("정말 삭제하시겠습니까?")) return;

        try {
            const res = await deleteFavoriteAPI(favId);

            if (res.status === 200) {
                // UI에서 즉시 제거
                setFavorites((prev) => prev.filter((f) => f.favId !== favId));
            } else {
                alert("삭제 실패. 다시 시도해주세요.");
            }
        } catch (err) {
            console.error(err);
            alert("서버 오류가 발생했습니다.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            <h2 className="text-2xl font-bold mb-6">내 즐겨찾기</h2>

            {favorites.length === 0 ? (
                <p className="text-gray-500 text-center">
                    즐겨찾기한 관광지가 없습니다.
                </p>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {favorites.map((fav) => (
                        <div
                            key={fav.favId}
                            className="bg-white shadow rounded-2xl overflow-hidden hover:shadow-lg transition"
                        >
                            <img
                                src={fav.imgUrl || "/no_image.png"}
                                alt={fav.title}
                                className="w-full h-40 object-cover"
                            />

                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-gray-800 truncate">
                                    {fav.title}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                    {fav.addr || "주소 정보 없음"}
                                </p>

                                <div className="flex justify-between items-center mt-3">
                                    <span className="text-xs text-blue-600 font-medium">
                                        Type: {fav.contentTypeId}
                                    </span>
                                    <button
                                        onClick={() => handleDelete(fav.favId)}
                                        className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                                    >
                                        삭제
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
