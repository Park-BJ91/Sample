import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
// import { tourApi } from '@api/tour/tourInstance';
import { toursList } from '@api/tour/tourApi';
import noImage from '@public/no_img.jpg';


const PAGE_SIZE = 9;

export default function SearchContent() {
    const [searchParams] = useSearchParams();
    const [filteredResults, setFilteredResults] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const sidoCode = searchParams.get('sidoCode');
        const signguCode = searchParams.get('signguCode');

        (async () => {
            try {
                const { data } = await toursList({ sidoCode, signguCode });
                if (data.success) {
                    let results = data.list;

                    setFilteredResults(results);
                    setCurrentPage(1); // 첫 페이지로 이동
                }
            } catch (error) {
                console.error("Error fetching festival data:", error);
            }
        })();

        return () => {
            // Cleanup if necessary
        };
    }, [searchParams]);

    // Pagination logic
    const totalResults = filteredResults.length; // 전체 결과 수
    const totalPages = Math.ceil(totalResults / PAGE_SIZE); // 전체 페이지 수
    const pagedResults = filteredResults.slice( // 현재 페이지에 해당하는 결과 slice(start: , end: )
        (currentPage - 1) * PAGE_SIZE, // 시작 인덱스
        currentPage * PAGE_SIZE // 끝 인덱스
    );

    // console.log("Paged Results START:", (currentPage - 1) * PAGE_SIZE);
    // console.log("Paged Results END:", currentPage * PAGE_SIZE);
    // console.log("Paged Results SIZE:", pagedResults.length);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' }); // 페이지 변경 시 상단으로 스크롤
    };

    return (
        <div className="max-w-5xl mx-auto p-4">
            <span className="block mb-4 text-gray-600">검색 내역 {totalResults} </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {pagedResults.map((item, idx) => (
                    <div key={idx} className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col">
                        <img
                            src={item.orgImage ? item.orgImage : noImage}
                            alt={item.title || item.name}
                            className="w-full h-40 object-cover rounded mb-3"
                        />
                        <h3 className="text-lg font-semibold mb-1">{item.title || item.name}</h3>
                        <p className="text-gray-700 flex-1 mb-2">{item.baseAddr || 'No description.'}</p>
                        <Link
                            to={`/tour/detail/${item.contentId}?contentTypeId=${item.contentTypeId}`}
                            className="mt-auto inline-block text-blue-600 hover:underline font-medium"
                        >
                            상세보기
                        </Link>
                    </div>
                ))}
            </div>
            {/* 쪽수 네비게이션 */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-8 space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => ( // totalPages 길이의 배열로 버튼 생성
                        <button
                            key={i}
                            onClick={() => handlePageChange(i + 1)}
                            className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-blue-100'}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}