import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from '@components/DeleteModel';

// 가정: 이 함수는 게시물 삭제 API를 호출합니다.
const deleteBoardPostAPI = async (bno) => {
    // 실제 API 호출 로직 (예: axios.delete(`/api/board/${bno}`))
    console.log(`게시물 ${bno} 삭제 API 호출 시뮬레이션`);
    return new Promise(resolve => setTimeout(resolve, 500)); // 0.5초 대기 시뮬레이션
};

// 게시물 삭제 컴포넌트 (예: BoardView.js)
const BoardComponent = ({ bno }) => { // bno는 props로 전달받는다고 가정
    const navigate = useNavigate();

    // 1. 모달 표시 상태 관리
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    // 2. 모달 열기/닫기 함수
    const openModal = () => setShowConfirmModal(true);
    const closeModal = () => setShowConfirmModal(false);

    // 3. 실제 삭제를 처리하는 함수 (모달 내부에서 호출됨)
    const confirmAndDelete = async () => {
        closeModal(); // 모달을 먼저 닫습니다.

        try {
            // 게시물 삭제 API 호출
            await deleteBoardPostAPI(bno);
            navigate('/board', { replace: true });
            console.log("게시물 삭제 처리 완료");
        } catch (error) {
            console.error("게시물 삭제 중 오류 발생:", error);
        }
    };

    // 기존의 handleDelete 로직을 대체하여 모달을 띄우는 함수로 변경
    // 이 함수는 '삭제' 버튼에 연결됩니다.
    const handleDeleteButtonClick = () => {
        openModal(); // 모달 열기
    };

    return (
        <div>
            {/* 삭제 버튼 */}
            <button onClick={handleDeleteButtonClick}>게시물 삭제</button>

            {/* 4. 모달 컴포넌트 렌더링 */}
            {showConfirmModal && (
                <ConfirmModal
                    onConfirm={confirmAndDelete} // '삭제' 버튼 클릭 시 호출될 함수
                    onCancel={closeModal}      // '취소' 버튼 클릭 시 호출될 함수
                />
            )}
        </div>
    );
};

export default BoardComponent;