import { useEffect, useState } from "react";

export default function PostListPage() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        // 서버에서 내 게시글 불러오기
        fetch("/api/user/posts")
            .then((res) => res.json())
            .then((data) => setPosts(data));
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
                            <h3 className="text-lg font-semibold mb-1">{post.title}</h3>
                            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                {post.content}
                            </p>
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                <button className="text-blue-600 hover:underline">수정</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
