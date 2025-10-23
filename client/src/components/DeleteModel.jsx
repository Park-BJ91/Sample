// ConfirmModal.js
import React from "react";

const ConfirmModal = ({ onConfirm, onCancel }) => {
    const overlayStyle = {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        zIndex: 999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        animation: "fadeIn 0.2s ease-in-out",
    };

    const modalStyle = {
        backgroundColor: "#fff",
        borderRadius: "12px",
        padding: "28px 32px",
        width: "360px",
        textAlign: "center",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
        zIndex: 1000,
        animation: "scaleIn 0.25s ease-in-out",
    };

    const titleStyle = {
        fontSize: "1.3rem",
        fontWeight: "600",
        marginBottom: "10px",
        color: "#333",
    };

    const messageStyle = {
        fontSize: "0.95rem",
        color: "#555",
        marginBottom: "24px",
        lineHeight: 1.5,
    };

    const buttonContainerStyle = {
        display: "flex",
        justifyContent: "center",
        gap: "12px",
    };

    const buttonBase = {
        border: "none",
        borderRadius: "6px",
        padding: "10px 20px",
        fontSize: "0.9rem",
        fontWeight: "500",
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
    };

    const confirmButton = {
        ...buttonBase,
        backgroundColor: "#e63946",
        color: "#fff",
    };

    const cancelButton = {
        ...buttonBase,
        backgroundColor: "#6c757d",
        color: "#fff",
    };

    return (
        <>
            <style>
                {`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes scaleIn {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }

                button:hover {
                    transform: translateY(-1px);
                    filter: brightness(1.1);
                }

                button:active {
                    transform: translateY(1px);
                    filter: brightness(0.9);
                }
                `}
            </style>

            <div style={overlayStyle} onClick={onCancel}>
                <div
                    style={modalStyle}
                    onClick={(e) => e.stopPropagation()} // 배경 클릭 시 닫히지만 모달 내부 클릭은 무시
                >
                    <h3 style={titleStyle}>게시물 삭제</h3>
                    <p style={messageStyle}>정말로 이 게시물을 삭제하시겠습니까?</p>

                    <div style={buttonContainerStyle}>
                        <button style={confirmButton} onClick={onConfirm}>
                            삭제
                        </button>
                        <button style={cancelButton} onClick={onCancel}>
                            취소
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ConfirmModal;
