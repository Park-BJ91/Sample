import { useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom"
import QuillEditor from "@components/QuillEditor";
import { boardTempImageUploadAPI, boardTempImageDeleteAPI, createBoardPostAPI } from "@/api/board/boardApi";

export default function TravelBoardWritePage() {
    const quillRef = useRef(null);

    // ✅ 업로드된 이미지 목록 / 삭제 예정 이미지 목록 관리
    const [uploadedImages, setUploadedImages] = useState([]);
    const [deletedImages, setDeletedImages] = useState([]);
    const [title, setTitle] = useState("");

    const navigate = useNavigate();

    /** 이미지 업로드 콜백 (QuillEditor → 부모) */
    const handleImageUpload = useCallback(async (file) => {
        const res = await boardTempImageUploadAPI(file);
        setUploadedImages((prev) => [...prev, { id: res.id, url: res.url }]);
        return res.url; // QuillEditor에 삽입할 URL 반환
    }, []);

    /** 이미지 삭제 콜백 (QuillEditor → 부모) */
    const handleImageDelete = useCallback((url) => {
        console.log("삭제할 이미지 URL:", url);
        setDeletedImages((prev) => [...prev, url]);
    }, []);

    /** 이미지 복원 콜백 (QuillEditor → 부모) */
    const handleImageRestore = useCallback((url) => {
        console.log("복원된 이미지 URL:", url);
        setDeletedImages((prev) => prev.filter((imgUrl) => imgUrl !== url));
    }, []);

    /** 저장 처리 */
    const handleSave = async () => {
        const html = quillRef.current?.getHtml();

        if (!title.trim()) {
            alert("제목을 입력하세요.");
            return;
        }

        console.log("저장할 HTML:", html);

        // 삭제 예정 이미지 서버 삭제
        for (const url of deletedImages) {
            const imgInfo = uploadedImages.find((img) => img.url === url);
            if (imgInfo) {
                await boardTempImageDeleteAPI(imgInfo);
            }
        }

        const postData = {
            title: title,
            content: html,
            images: uploadedImages.map((img) => img),
        };

        // 게시글 저장 API 호출
        const newPost = await createBoardPostAPI(postData);

        if (newPost && newPost.bno) {
            alert("게시물이 저장되었습니다.");
            // navigate(`/board/${newPost.bno}`, { replace: true });
            navigate("/board", { replace: true }); // 기록 남기지 않음

        } else {
            alert("게시물 저장에 실패했습니다.");
        }

    };

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    /** 취소 or 뒤로 가기 시 정리 */
    const handleCancel = async () => {
        for (const img of uploadedImages) {
            await boardTempImageDeleteAPI(img);
        }

        setDeletedImages([]);
        setUploadedImages([]);
        navigate("/board", { replace: true }); // 뒤로 가기

    };

    return (
        <div className="max-w-3xl mx-auto p-6">

            <h1 className="text-2xl font-bold mb-6">게시물 작성</h1>

            {/* 타이틀 */}
            <input
                type="text"
                value={title}
                onChange={handleTitleChange}
                placeholder="제목을 입력하세요"
                className="w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />


            <QuillEditor
                ref={quillRef}
                onImageUpload={handleImageUpload}
                onImageDelete={handleImageDelete}
                onImageRestore={handleImageRestore}
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
