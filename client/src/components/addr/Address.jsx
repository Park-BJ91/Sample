import React from "react";
import { useDaumPostcodePopup } from "react-daum-postcode";

const DaumPostcodeButton = ({ onComplete, children }) => {
    // 다음 우편번호 팝업 스크립트 URL
    const open = useDaumPostcodePopup();

    // 버튼 클릭 시 실행
    const handleClick = () => {
        open({ onComplete }); // 주소 선택 시 부모에서 전달한 콜백 실행
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
            {children || "주소 찾기"}
        </button>
    );
};

export default DaumPostcodeButton;