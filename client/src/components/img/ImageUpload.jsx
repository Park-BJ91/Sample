import { useRef, useState } from "react";
import { X } from "lucide-react";

/**
 * ImageUpload 컴포넌트
 * @param {string} label - 라벨 텍스트
 * @param {(file: File | null) => void} onChange - 부모로 선택된 파일 전달
 * @param {string} initialPreview - 초기 이미지 (수정 시 기존 프로필 등)
 */
export default function ImageUpload({ label = "이미지 업로드", onChange, initialPreview = null }) {
    const [preview, setPreview] = useState(initialPreview);
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type.startsWith("image/")) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            onChange?.(selectedFile); // 부모로 파일 전달
        } else {
            alert("이미지 파일(png, jpg, jpeg)만 업로드 가능합니다.");
        }
    };

    const handleRemove = () => {
        setFile(null);
        setPreview(null);
        onChange?.(null); // 부모에 파일 제거 알림

        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // 같은 파일 다시 선택 가능하게 초기화
        }
    };

    return (
        <div>
            {label && <label className="block font-medium">{label}</label>}

            <div className="flex items-center justify-around space-x-3 mt-2">
                {/* 파일 선택 버튼 (아이콘) */}
                {!preview && (
                    <button
                        type="button"
                        onClick={() => fileInputRef.current && fileInputRef.current.click()}
                        className="w-20 h-20 flex items-center justify-center border rounded-full bg-gray-100 hover:bg-gray-200 transition"
                        aria-label="이미지 업로드"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-8 h-8 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                )}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/jpg"
                    onChange={handleChange}
                    className="hidden"
                />
                {preview && (
                    <div className="relative w-20 h-20">
                        <img
                            src={preview}
                            alt="이미지 미리보기"
                            className="w-20 h-20 object-cover rounded-full border"
                        />
                        <button
                            onClick={handleRemove}
                            type="button"
                            className="absolute top-0 right-0 bg-black bg-opacity-60 text-white rounded-full p-1 hover:bg-opacity-80"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
