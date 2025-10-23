import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getBoardPostByIdAPI, deleteBoardPostAPI } from '@api/board/boardApi.js';
import ConfirmModal from '@components/DeleteModel';

export default function TravelBoardDetailPage() {
    const { bno } = useParams();
    const [post, setPost] = useState(null);

    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const navigate = useNavigate();

    const serverUrl = "http://localhost:4000"; // 예시

    useEffect(() => {
        // 게시물 상세 정보 조회 API 호출
        const detailBoardPost = async () => {
            try {
                const response = await getBoardPostByIdAPI(bno);
                setPost(response);
            } catch (error) {
                console.error('게시물 상세 정보 조회 에러:', error);
            }
        };
        detailBoardPost();
    }, [bno]);


    // 모달을 닫고 실제 삭제 API를 호출하는 함수
    const confirmAndDelete = async () => {
        setShowConfirmModal(false); // 모달 닫기
        try {
            await deleteBoardPostAPI(bno);
            navigate('/board', { replace: true });
        } catch (error) {
            console.error("게시물 삭제 중 오류 발생:", error);
        }
    };

    const handleDelete = async () => {
        setShowConfirmModal(true); // 모달 열기
    };

    // 로딩 상태 처리
    if (!post) return <div>로딩 중...</div>;

    // contentHtml 처리: content가 있을 때만 replaceAll
    const contentHtml = post.content
        ? post.content.replaceAll('src="/uploads', `src="${serverUrl}/uploads`)
        : "";

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">{post.title}</h1>
            <div className='flex justify-between mb-4'>
                <p className="text-gray-500 text-lg">
                    {post.nickName} · {new Date(post.createdAt).toLocaleString()}
                </p>
                <div>
                    {post.isAuthor === 'Y' && (
                        <div className="text-blue-500 font-medium">
                            <Link to={`/board/edit/${post.bno}`}>수정</Link>
                            <span className="mx-2">|</span>
                            <span className='cursor-pointer' onClick={handleDelete}>삭제</span>
                        </div>
                    )}
                </div>
            </div>

            <hr className="my-6 border-gray-300" />

            <div
                className="ql-editor prose max-w-none"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
            />

            {/* 모달 컴포넌트 조건부 렌더링 */}
            {showConfirmModal && (
                <ConfirmModal
                    onConfirm={confirmAndDelete}
                    onCancel={() => setShowConfirmModal(false)}
                />
            )}


        </div>
    );

}