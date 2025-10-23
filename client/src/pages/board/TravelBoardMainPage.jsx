import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBoardPostsAPI } from '@api/board/boardApi';

export default function TabelBoardMainPage() {
    const navigate = useNavigate();
    const [boardList, setBoardList] = useState([]);
    const [totalCount, setTotalCount] = useState(0);

    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
    const pageLimit = 6; // 한 페이지에 보여줄 게시물 수
    const maxPageButtons = 2; // 한 번에 보여줄 페이지 버튼 수

    const totalPages = Math.ceil(totalCount / pageLimit); // 전체 페이지 수 계산 소수점 올림

    // 페이지 그룹
    const currentGroup = Math.floor((currentPage - 1) / maxPageButtons); // 소수점 버림
    const startPage = currentGroup * maxPageButtons + 1;
    const endPage = Math.min(startPage + maxPageButtons - 1, totalPages);


    useEffect(() => {
        const fetchBoardList = async () => {
            try {
                const response = await getBoardPostsAPI(currentPage, pageLimit);

                setBoardList(response.posts);
                setTotalCount(response.totalCount);

            } catch (error) {
                console.error('게시판 데이터 조회 에러:', error);
            }
        };
        fetchBoardList();
    }, [currentPage]);

    const handleWrite = () => {
        navigate('/board/write');
    }


    return (
        <div className='container mx-auto max-w-4xl min-w-[600px] p-4 my-4'>

            {/* Title */}
            <div className='header-board flex justify-center items-center mb-4'>
                <h1 className='text-2xl'>테이블 게시판 메인 페이지</h1>
            </div>

            {/* 총 게시물 수 */}
            <div className='my-10 ml-4 flex justify-between items-center'>
                <span>총 게시물 수: {totalCount}</span>
                <span className='float-right'>
                    <button
                        onClick={handleWrite}
                        className='px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition'
                    >
                        글쓰기
                    </button>
                </span>
            </div>

            {/* 게시물 목록 */}
            <div className="max-w-5xl mx-auto p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {boardList.map((item) => (
                        <div
                            key={item.bno}
                            onClick={() => navigate(`/board/detail/${item.bno}`)}
                            className="bg-white rounded-lg shadow hover:shadow-lg hover:scale-105 cursor-pointer transition p-4 flex flex-col"
                        >
                            {/* 이미지 영역: 세로 공간의 2/3 차지 */}
                            <div className="flex-2">
                                <img
                                    src={item.thumbnailUrl ? item.thumbnailUrl : '/no_img.jpg'}
                                    alt={item.title}
                                    className="w-full h-full lg:max-h-[200px] lg:min-h-[200px] object-cover p-0.5 rounded-t-lg"
                                />
                            </div>


                            <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                            <p className="text-gray-700 flex-1 mb-2">
                                {item.nickName} | {new Date(item.createdAt).toLocaleDateString()}
                            </p>

                        </div>
                    ))}
                </div>
            </div>


            {/* 페이지 네비게이션 */}
            <div className="flex justify-center items-center my-12 space-x-2">

                {/* Prev 그룹 버튼 */}
                {startPage > 1 && (
                    <button
                        onClick={() => setCurrentPage(startPage - 1)}
                        className="px-3 py-1 rounded bg-gray-200 hover:bg-blue-100 text-gray-700"
                    >
                        Prev
                    </button>
                )}

                {/* 페이지 번호 버튼 */}
                {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
                    const page = startPage + i;
                    return (
                        <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 rounded ${currentPage === page
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-blue-100'
                                }`}
                        >
                            {page}
                        </button>
                    );
                })}

                {/* Next 그룹 버튼 */}
                {endPage < totalPages && (
                    <button
                        onClick={() => setCurrentPage(endPage + 1)}
                        className="px-3 py-1 rounded bg-gray-200 hover:bg-blue-100 text-gray-700"
                    >
                        Next
                    </button>
                )}

            </div>

            {/* 현재 페이지 표시 */}
            <span className="flex justify-center items-center mb-4">
                페이지 {currentPage} / {totalPages}
            </span>


        </div>

    );
}