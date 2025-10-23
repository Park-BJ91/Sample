import { useNavigate } from "react-router-dom"
import QuillEditor from "@components/QuillEditor";
import { createBoardPostAPI } from "@/api/board/boardApi";
import useBoardHandler from "@/hooks/useBoardHandler";

export default function TravelBoardWritePage() {

    const navigate = useNavigate();


    const {
        quillRef,
        title, setTitle,
        handleImage,
        handleImageUpload,
        handleSave,
        handleCancel
    } = useBoardHandler({
        onSave: async (postData) => {
            // 게시글 저장 API 호출
            const newPost = await createBoardPostAPI(postData);
            if (newPost && newPost.bno) {
                alert("게시물이 저장되었습니다.");
                navigate(`/board/detail/${newPost.bno}`, { replace: true });
            } else {
                alert("게시물 저장에 실패했습니다.");
            }
        },
        onCancel: async () => {
            navigate("/board", { replace: true });
        }
    });

    return (
        <div className="max-w-3xl mx-auto p-6">

            <h1 className="text-2xl font-bold mb-6">게시물 작성</h1>

            {/* 타이틀 */}
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요"
                className="w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <QuillEditor
                ref={quillRef}
                onImageHandler={handleImage}
                onImageUpload={handleImageUpload}
            />

            <div className="mt-12 flex justify-end gap-3">
                <button
                    onClick={handleCancel}
                    className="bg-gray-400 text-white px-6 py-2 rounded hover:bg-gray-500"
                >
                    취소
                </button>
                <button
                    onClick={handleSave}
                    className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                >
                    저장하기
                </button>
            </div>
        </div>
    );
}
