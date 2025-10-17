import React, { useImperativeHandle, forwardRef, useRef, useMemo, useEffect } from "react";
import ReactQuill, { Quill } from "react-quill";
import ImageResize from "@looop/quill-image-resize-module-react";
import "react-quill/dist/quill.snow.css";

Quill.register("modules/imageResize", ImageResize);

const QuillEditor = forwardRef(({ onImageUpload, onImageDelete, onImageRestore }, ref) => {
    const quillRef = useRef(null);

    // 부모에서 getHtml() 가능하게 ref 노출
    useImperativeHandle(ref, () => ({
        getHtml: () => quillRef.current?.getEditor().root.innerHTML || "",
    }));

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

            const editor = quillRef.current?.getEditor();
            const range = editor.getSelection(true);
            const imageUrl = await onImageUpload(file);
            editor.insertEmbed(range.index, "image", imageUrl); // 이미지 삽입
            editor.setSelection(range.index + 1); // 커서를 이미지 뒤로 이동
        };
    };

    /** 이미지 삭제 감지 */
    useEffect(() => {
        const editor = quillRef.current?.getEditor();
        if (!editor) return;

        const handleTextChange = (delta, oldDelta, source) => {
            if (source !== "user") return;

            delta.ops.forEach((op) => {

                // 삭제된 블롯(이미지) 감지
                if (op.delete) {
                    let index = 0;
                    oldDelta.ops.forEach((oldOp) => {
                        const len = typeof oldOp.insert === "string" ? oldOp.insert.length : 1;
                        const start = index;
                        const end = index + len;
                        const overlaps = start < (op.retain || 0) + op.delete && end > (op.retain || 0);
                        if (
                            overlaps &&
                            oldOp.insert &&
                            typeof oldOp.insert === "object" &&
                            oldOp.insert.image
                        ) {
                            console.log("이미지 삭제 감지:", oldOp.insert.image);
                            onImageDelete(oldOp.insert.image);
                        }
                        index += len;
                    });
                }

                // 이미지 복원 감지
                if (op.insert && typeof op.insert === "object" && op.insert.image) {
                    const imageUrl = op.insert.image;
                    onImageRestore(imageUrl); // 부모에 복원 요청
                }

            });
        };

        editor.on("text-change", handleTextChange);
        return () => editor.off("text-change", handleTextChange);
    }, [onImageDelete]);

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
            style={{ height: "600px" }}
        />
    );
});

export default QuillEditor;
