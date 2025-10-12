
import QuillEditor from "@components/QuillEditor";

export default function TravelBoardWritePage() {


    // /** 이미지 업로드 */
    // const handleImageUpload = useCallback(() => {
    //     const input = document.createElement("input");
    //     input.type = "file";
    //     input.accept = "image/*";
    //     input.click();

    //     input.onchange = async () => {
    //         const file = input.files?.[0];
    //         if (!file) return;

    //         // 파일을 URL(blob)로 변환
    //         const fileReader = new FileReader();
    //         fileReader.onload = () => {
    //             const quill = quillRef.current?.getEditor();
    //             const range = quill.getSelection(true); // 현재 커서 위치 가져오기
    //             const url = fileReader.result; // base64 문자열

    //             // 현재 커서 위치에 이미지 삽입
    //             quill.insertEmbed(range.index, "image", url);
    //             quill.setSelection(range.index + 1); // 포커스를 이미지 뒤로 이동
    //         };
    //         fileReader.readAsDataURL(file);
    //     };
    // }, []);

    // const modules = useMemo(() => ({
    //     toolbar: {
    //         container: [
    //             [{ size: ["small", false, "large", "huge"] }], // 글자 크기
    //             ["bold", "italic", "underline", "strike"], // 굵게, 기울임, 밑줄, 취소선
    //             [{ color: [] }, { background: [] }], // 글자색, 배경색
    //             ["clean"], // 서식 제거
    //             [
    //                 { list: "ordered" },
    //                 { list: "bullet" },
    //                 { indent: "-1" },
    //                 { indent: "+1" },
    //                 { align: [] }
    //             ], // 순서 있는 목록, 순서 없는 목록
    //             ["link", "image"], // 링크, 이미지
    //         ],
    //         handlers: {
    //             image: handleImageUpload,
    //         },
    //     },
    //     imageResize: {
    //         parchment: Quill.import('parchment'),
    //         modules: ['Resize', 'DisplaySize', 'Toolbar'],
    //     },
    // }), [handleImageUpload]);

    const handleSave = () => {
        const html = quillRef.current.getEditor().root.innerHTML;
        console.log("저장 내용:", html);
        alert("저장 완료!");
    };

    return (
        <div className="max-w-3xl mx-auto p-6">

            <QuillEditor />

            <div className="mt-12 flex justify-end">
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
