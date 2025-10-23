import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import QuillEditor from "@components/QuillEditor";
import useBoardHandler from "@/hooks/useBoardHandler";
import { updateBoardPostAPI, getBoardPostByIdAPI, getBoardPostByIdImages, deleteBoardPostAPI } from "@/api/board/boardApi";
import ConfirmModal from '@components/DeleteModel';

export default function TravelBoardEditPage() {

    const navigate = useNavigate();
    const { bno } = useParams(); // URL에 있는 게시글 번호 ex) /board/edit/:bno

    // 모달 표시 상태 추가
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const {
        quillRef,
        title, setTitle,
        setUploadedImages,
        handleImage,
        handleImageUpload,
        handleSave,
        handleCancel
    } = useBoardHandler({
        onSave: async (postData) => {
            const updated = await updateBoardPostAPI(bno, postData);
            if (updated) {
                alert("게시글이 수정되었습니다.");
                navigate(`/board/detail/${bno}`, { replace: true });
            } else {
                alert("수정에 실패했습니다.");
            }
        },
        onCancel: async () => {
            navigate(`/board/detail/${bno}`, { replace: true });
        }
    });

    useEffect(() => {
        const fetchData = async () => {
            const post = await getBoardPostByIdAPI(bno);
            if (post) {
                setTitle(post.title);

                const images = await getBoardPostByIdImages(bno);
                // 기존 이미지 목록 세팅 (DB에 저장된 이미지)
                setUploadedImages(images.map(img => ({
                    id: img.id,
                    url: img.url
                })));

                quillRef.current?.pasteHtml(post.content || "");
            }
        };
        fetchData();
    }, []);

    // 모달을 닫고 실제 삭제 API를 호출하는 함수
    const confirmAndDelete = async () => {
        setShowConfirmModal(false); // 모달 닫기

        try {
            await deleteBoardPostAPI(bno);
            navigate('/board', { replace: true });
        } catch (error) {
            console.error("게시물 삭제 중 오류 발생:", error);
        }
    };

    const handleDelete = async () => {
        setShowConfirmModal(true); // 모달 열기
    };

    return (
        <div className="max-w-3xl mx-auto p-6">

            <h1 className="text-2xl font-bold mb-6">게시물 수정</h1>

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
                    onClick={handleDelete}
                    className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
                >
                    삭제
                </button>


                <button
                    onClick={handleSave}
                    className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                >
                    수정
                </button>
            </div>


            {/* 모달 컴포넌트 조건부 렌더링 */}
            {showConfirmModal && (
                <ConfirmModal
                    onConfirm={confirmAndDelete}
                    onCancel={() => setShowConfirmModal(false)}
                />
            )}

        </div>
    );
}
