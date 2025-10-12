import { useState, useRef, useCallback, useMemo } from "react";
import Quill from "quill";
import ReactQuill from "react-quill";
import ImageResize from "@looop/quill-image-resize-module-react";
import { boardTempImageUploadAPI } from "@/api/board/boardApi";

import "react-quill/dist/quill.snow.css";




Quill.register("modules/imageResize", ImageResize);


/** Quill 에디터 컴포넌트 */
export default function QuillEditor() {
    const quillRef = useRef(null);
    const [content, setContent] = useState("");
    const [uploadedImages, setUploadedImages] = useState([]);
    // [{ id, url }] 형태로 서버 응답 저장

    /** 이미지 업로드 핸들러 */
    const handleImageUpload = useCallback(() => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.multiple = true;
        input.click();

        input.onchange = async () => {
            const files = input.files;
            if (!files || files.length === 0) return;

            /** 이미지 업로드 */
            for (const file of files) {
                const formData = new FormData();
                formData.append("file", file);

                console.log("업로드할 파일:", file);

                const res = await boardTempImageUploadAPI(file);
                console.log("서버 응답:", res);

                const quill = quillRef.current?.getEditor(); // Quill 인스턴스 가져오기
                const range = quill.getSelection(true); // 현재 커서 위치 가져오기

                quill.insertEmbed(range.index, "image", res.url);
                quill.setSelection(range.index + 1);

                setUploadedImages(prev => [...prev, { id: res.id, url: res.url }]);

            }


            // Test용 FileReader 사용 (서버 업로드 대신)
            // const fileReader = new FileReader();
            // const file = files[0];


            // fileReader.onload = () => {
            //     const quill = quillRef.current.getEditor();
            //     const range = quill.getSelection(true);
            //     const url = fileReader.result;

            //     quill.insertEmbed(range.index, "image", url);
            //     quill.setSelection(range.index + 1);
            // };
            // fileReader.readAsDataURL(file);

        };

    }, []);

    /** 모듈 */
    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ size: ["small", false, "large", "huge"] }], // 글자 크기
                ["bold", "italic", "underline", "strike"], // 굵게, 기울임, 밑줄, 취소선
                [{ color: [] }, { background: [] }], // 글자색, 배경색
                ["clean"], // 서식 제거
                [
                    { list: "ordered" },
                    { list: "bullet" },
                    { indent: "-1" },
                    { indent: "+1" },
                    { align: [] }
                ], // 순서 있는 목록, 순서 없는 목록
                ["link", "image"], // 링크, 이미지
            ],
            handlers: {
                image: handleImageUpload,
            },
        },
        imageResize: {
            parchment: Quill.import('parchment'),
            modules: ['Resize', 'DisplaySize', 'Toolbar'],
        },
    }), [handleImageUpload]);

    return (
        <ReactQuill
            ref={quillRef}
            value={content}
            onChange={setContent}
            modules={modules}
            style={{ height: "600px" }}
        />
    );
}