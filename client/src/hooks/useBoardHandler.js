import { useRef, useState, useCallback, useMemo, useEffect } from "react";
import { boardTempImageUploadAPI, boardTempImageDeleteAPI, boardPermanentImageDeleteAPI } from "@/api/board/boardApi";

export default function useBoardHandler({ onSave, onCancel }) {
    const quillRef = useRef(null);

    const [uploadedImages, setUploadedImages] = useState([]);
    const [deletedImages, setDeletedImages] = useState([]);
    const [pendingImageInsert, setPendingImageInsert] = useState(null); // 이미지 삽입 대기 상태
    const [title, setTitle] = useState("");


    /** 에디터 이미지 변화 핸들러 */
    const handleImage = useCallback((currentPaths) => {

        // 이미지 삭제 감지
        // const deleteImgInfo = uploadedImagesRef.current.filter(info => !currentPaths.includes(info.url));
        const deleteImgInfo = uploadedImages.filter(info => !currentPaths.includes(info.url));
        if (deleteImgInfo.length > 0) {
            deleteImgInfo.forEach(async (imgInfo) => {
                handleImageDelete(imgInfo);
            });
        }

        // 이미지 복원 감지
        // const restoreImgInfo = deletedImagesRef.current.filter(info => currentPaths.includes(info.url));
        const restoreImgInfo = deletedImages.filter(info => currentPaths.includes(info.url));
        if (restoreImgInfo.length > 0) {
            restoreImgInfo.forEach(async (imgInfo) => {
                handleImageRestore(imgInfo);
            });
        }

    }, [uploadedImages, deletedImages]);

    /** 이미지 업로드 콜백 (QuillEditor → 부모) */
    const handleImageUpload = useCallback(async (file) => {
        const res = await boardTempImageUploadAPI(file);
        // ⭐️ Pathname만 추출하여 상태에 저장 (자식의 getCurrentImageUrls 함수와 통일)
        setUploadedImages((prev) => [...prev, { id: res.id, url: res.url }]);
        setPendingImageInsert(res.url); // => useEffect에서 감지하여 삽입 처리
        return res; // 에디터 삽입을 위해 전체 URL 반환
    }, []);

    /** 이미지 삭제 콜백 (QuillEditor → 부모) */
    const handleImageDelete = useCallback((imageInfo) => {
        // 1. ⭐️ 서버에서 삭제할 목록(deletedImages)에 Pathname 추가 (중복 방지)
        setDeletedImages((prev) => {
            if (!prev.find(img => img.id === imageInfo.id)) {
                return [...prev, imageInfo];
            }
            return prev;
        });

        // 2. ⭐️ 핵심: '현재 에디터가 추적해야 할 목록' (uploadedImages)에서 즉시 제거
        // 이 업데이트가 Prop을 통해 자식에게 전달되어 다음 비교의 기준이 됩니다.
        setUploadedImages((prev) => prev.filter((img) => img.id !== imageInfo.id));

    }, []);

    /** 이미지 복원 콜백 (QuillEditor → 부모) */
    const handleImageRestore = useCallback((imageInfo) => {

        // ⭐️ deletedImages 목록에서 Pathname 제거
        setDeletedImages((prev) => prev.filter((info) => info.id !== imageInfo.id));

        setUploadedImages((prev) => {
            // 복원된 이미지를 uploadedImages에 다시 추가
            // 단, 중복 추가는 방지
            if (!prev.find(img => img.id === imageInfo.id)) {
                return [...prev, { id: imageInfo.id, url: imageInfo.url }];
            }
            return prev;
        });
    }, [uploadedImages, deletedImages]);

    /** 이미지 삽입 시점을 부모의 setUploadedImages저장 후 진행 */
    useEffect(() => {
        if (pendingImageInsert) {
            const range = quillRef.current.getQuillSelection();
            // 이미지 삽입
            quillRef.current.insertImage(pendingImageInsert, range);
            // 삽입 후 상태 초기화
            setPendingImageInsert(null);
        }
    }, [pendingImageInsert]);


    /** 저장 처리 */
    const handleSave = async () => {
        const html = quillRef.current?.getHtml();
        if (!title.trim()) {
            alert("제목을 입력하세요.");
            return;
        }

        if (deletedImages.length > 0) {
            for (const info of deletedImages) {
                try {
                    if (info.url.includes("uploads/temp/")) {
                        console.log("저장 시 임시 이미지 삭제!!!!!!!!!! : ", info);
                        await boardTempImageDeleteAPI(info);
                    }
                    if (info.url.includes("uploads/permanent/")) {
                        console.log("저장시 영구 이미지 삭제@@@@@@@@@@@ :", info);
                        await boardPermanentImageDeleteAPI(info);
                    }

                } catch (error) {
                    console.error("이미지 삭제 중 오류 발생:", error);
                }
            }
        }

        const postData = {
            title: title,
            content: html,
            images: uploadedImages.map((img) => img),
        };

        await onSave(postData);
    };


    /** 취소 or 뒤로 가기 시 정리 */
    const handleCancel = async () => {
        if (uploadedImages.find(img => img.url.includes("uploads/temp/")) == null) {
            console.log("임시 이미지가 없어 정리할 것이 없습니다.");
            await onCancel();
            return;
        }

        for (const img of uploadedImages) {
            if (img.url.includes("uploads/temp/")) {
                console.log("삭제할 임시(TEMP) 이미지:", img);
                await boardTempImageDeleteAPI(img);
            }
        }

        setDeletedImages([]);
        setUploadedImages([]);

        await onCancel();
    };



    return {
        // state
        title,
        uploadedImages,
        deletedImages,
        quillRef,

        // handlers
        setTitle,
        setUploadedImages,
        handleImage,
        handleImageUpload,
        handleImageDelete,
        handleImageRestore,
        handleSave,
        handleCancel,
    };
}