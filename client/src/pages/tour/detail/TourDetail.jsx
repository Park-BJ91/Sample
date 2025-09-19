import { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { tourDetail } from '@api/tour/tourApi';
import TourDetailMap from '@components/map/NaverMap';

export default function TourDetail() {

    const [searchParams] = useSearchParams();
    const contentTypeId = searchParams.get('contentTypeId');
    const { id } = useParams();

    const mapRef = useRef(null);

    const [detail, setDetail] = useState({
        title: "로딩중...",
        baseAddr: "로딩중...",
        orgImage: "로딩중...",
        thumbImage: "로딩중...",
        overview: "로딩중...",
        tel: "로딩중...",
        homepage: "로딩중..."
    });
    const [detailInfo, setDetailInfo] = useState([
        {
            infoname: "로딩중...",
            infotext: "로딩중..."
        }
    ]);
    const [coordinate, setCoordinate] = useState(null);


    useEffect(() => {
        // ID로 디테일 데이터 불러오기
        (async () => {
            try {
                const { data } = await tourDetail(id, contentTypeId);
                if (data.success) {

                    console.log("좌표 :", data.coordinate);

                    setDetail(data.detailCommon);
                    setDetailInfo(data.detailInfo);
                    setCoordinate(data.coordinate);

                }

            } catch (error) {
                console.error("Error fetching tour detail:", error);
            }
        })();
    }, [id, contentTypeId]);





    return (
        <div className="max-w-5xl mx-auto p-6 space-y-8">
            {/* Title & Address */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">{detail.title}</h1>
                <div className="mt-2 flex items-center text-gray-600 space-x-2 flex-col">
                    {coordinate && <TourDetailMap coordinate={coordinate} className="w-5 h-5 text-gray-500" />}
                    <span>{detail.baseAddr}</span>
                </div>
            </div>

            {/* Image */}
            <div className="flex justify-center">
                <img
                    src={detail.orgImage ? detail.orgImage : '/noImage.png'}
                    alt={detail.title}
                    className="w-full max-w-xl h-80 object-cover rounded-2xl shadow"
                />
            </div>
            <section>
                <h2 className="text-2xl font-semibold mb-2">소개</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {detail.overview}
                </p>
            </section>

            {/* Info List */}
            <section>
                <h2 className="text-2xl font-semibold mb-4">이용 안내</h2>
                <div className="space-y-4">
                    {detailInfo.map((item, idx) => (
                        <div
                            key={idx}
                            className="border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition"
                        >
                            <h3 className="font-bold text-lg text-gray-800">
                                {item.infoname}
                            </h3>
                            <p
                                className="text-gray-600 mt-1"
                                dangerouslySetInnerHTML={{ __html: item.infotext }} // HTML 태그 렌더링 위해 dangerouslySetInnerHTML 사용
                            />
                        </div>
                    ))}
                </div>
            </section>

            {/* Homepage / Contact */}
            <section>
                <h2 className="text-2xl font-semibold mb-2">연락처 & 홈페이지</h2>
                <div className="flex flex-col space-y-2">
                    {detail.tel && (
                        <div className="flex items-center space-x-2">
                            {/* <Phone className="w-5 h-5 text-gray-500" /> */}
                            <span>{detail.tel}</span>
                        </div>
                    )}
                    <div
                        className="flex items-center space-x-2 text-blue-600 underline"
                        dangerouslySetInnerHTML={{ __html: detail.homepage }}
                    />
                </div>
            </section>
        </div>
    );
}