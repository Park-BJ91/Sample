import { useEffect, useState } from "react";
import { getUserBoardPostsAPI } from "@api/board/boardApi"
export default function PostListPage() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        // 서버에서 내 게시글 불러오기
        const fetchData = async () => {
            const data = await getUserBoardPostsAPI();
            console.log("내 게시글 데이터:", data);
            setPosts(data);
        };
        fetchData();
    }, []);

    return (
        <div className="max-w-3xl mx-auto px-4 py-6">
            <h2 className="text-2xl font-bold mb-6">내 게시글</h2>

            {posts.length === 0 ? (
                <p className="text-gray-500 text-center">작성한 게시글이 없습니다.</p>
            ) : (
                <ul className="space-y-4">
                    {posts.map((post) => (
                        <li
                            key={post.id}
                            className="bg-white p-4 rounded-xl shadow hover:shadow-md transition"
                        >
                            <h3
                                onClick={() => alert("이동")}
                                className="text-lg font-semibold mb-1 cursor-pointer hover:scale-105 hover:text-blue-600"
                            >
                                {post.title}
                            </h3>
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                <span className="text-blue-500 font-medium">
                                    <button className="text-blue-600 hover:underline">수정</button>
                                    <span className="mx-2">|</span>
                                    <button className="text-blue-600 hover:underline">삭제</button>
                                </span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
