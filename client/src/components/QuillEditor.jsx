import React, { useImperativeHandle, forwardRef, useRef, useMemo, useEffect } from "react";
import ReactQuill, { Quill } from "react-quill";
import ImageResize from "@looop/quill-image-resize-module-react";
import "react-quill/dist/quill.snow.css";
import getCurrentImageUrls from "@utils/quilImageUtils";

Quill.register("modules/imageResize", ImageResize);


// forwardRef는 부모 컴포넌트가 자식 컴포넌트의 메서드에 접근할 수 있게 해줌
const QuillEditor = forwardRef(({ onImageHandler, onImageUpload, onReady }, ref) => {
    const quillRef = useRef(null); // ReactQuill 인스턴스 참조는 <ReactQuill>에 설정

    // 부모에서 getHtml() 가능하게 ref 노출
    useImperativeHandle(ref, () => ({
        getHtml: () => quillRef.current?.getEditor().root.innerHTML || "",
        pasteHtml: (html) => {
            const editor = quillRef.current?.getEditor();
            if (!editor) return;
            editor.clipboard.dangerouslyPasteHTML(html || "");
        },
        // ⭐️ 1. 부모가 insertImage를 호출할 때 이미 range를 알고 있다면 이 메서드는 필요 없습니다.
        // ⭐️ 2. 부모가 커서 위치를 알고 싶다면 getSelection을 노출해야 합니다.
        getQuillSelection: () => {
            const editor = quillRef.current?.getEditor();
            return editor?.getSelection(true); // Quill의 getSelection 반환
        },
        insertImage: (url, range) => {
            const editor = quillRef.current?.getEditor();
            if (!editor) return;
            editor.insertEmbed(range.index, "image", url, Quill.sources.USER);
            editor.setSelection(range.index + 1, Quill.sources.SILENT);
        }
    }));

    /** 에디터 준비 완료 시 부모에게 콜백 */
    useEffect(() => {
        console.log("에디터 준비 완료");
        if (onReady && typeof onReady === "function") {
            onReady();
        }
    }, [onReady]);

    useEffect(() => {
        const editorInstance = quillRef.current;
        if (!editorInstance) return;

        const quill = editorInstance.getEditor();
        if (!quill) return; // Quill 객체가 없으면 종료
        console.log("Quill 에디터 인스턴스 준비 완료");

        // ⭐️ 여기서 이벤트 리스너를 등록합니다.
        const handleTextChange = (delta, oldDelta, source) => {
            // value 매개변수가 없으므로, 필요하다면 quill.root.innerHTML를 사용해야 합니다.

            if (source !== 'user') return;

            console.log("텍스트 변경 감지 (사용자 입력)");

            // 1. 현재 에디터에 남아있는 이미지 URL 목록을 가져옵니다.
            const currentPaths = getCurrentImageUrls(quill);
            onImageHandler(currentPaths);

            // ... (기존 삭제 및 복원 감지 로직)
        };

        quill.on('text-change', handleTextChange);

        // 클린업 함수
        return () => {
            quill.off('text-change', handleTextChange);
        };

        // ⭐️ 의존성 배열에 변경 시 리스너를 다시 등록해야 하는 Props만 포함
        // (여기서는 onImageHandler, currentImageUrls 등이 변경될 때 다시 등록되어야 합니다.)
    }, [onImageHandler, onImageUpload]);

    /** 이미지 업로드 핸들러 */
    const handleImageInsert = async () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.multiple = false;
        input.click();

        input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return;

            // 부모에게 업로드 요청만 보냄  부모가 insertImage 메서드를 사용하여 삽입함
            await onImageUpload(file); // 부모에 이미지 업로드 요청
        };
    };

    /** Quill 모듈 설정 */
    const modules = useMemo(
        () => ({
            toolbar: {
                container: [
                    [{ size: ["small", false, "large", "huge"] }],
                    ["bold", "italic", "underline", "strike"],
                    [{ color: [] }, { background: [] }],
                    ["clean"],
                    [{ align: [] }],
                    [{ list: "ordered" }, { list: "bullet" }],
                    ["link", "image"],
                ],
                handlers: {
                    image: handleImageInsert,
                },
            },
            imageResize: {
                parchment: Quill.import("parchment"),
                modules: ["Resize", "DisplaySize"],
            },
        }),
        []
    );

    return (
        <ReactQuill
            ref={quillRef}
            theme="snow"
            modules={modules}
            style={{ height: "1200px" }}
        />
    );
});

export default QuillEditor;
