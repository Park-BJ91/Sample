import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Calendar, Car, Clock, Phone, Info, Star } from "lucide-react";
import { tourDetail } from '@api/tour/tourApi';
import { addFavoriteAPI, checkFavoriteExistsAPI } from '@api/favorite/favoriteAPI';
import TourDetailMap from '@components/map/NaverMap';
import { useAuth } from '@contexts/AuthContext'

export default function TourDetail() {

    const [searchParams] = useSearchParams();
    const contentTypeId = searchParams.get('contentTypeId');
    const { id } = useParams();

    const { isLogin } = useAuth();

    const [detailCommon, setDetailCommon] = useState({
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
    const [coordinate, setCoordinate] = useState(null); // "위도,경도" 형식의 문자열
    const [detailIntro, setDetailIntro] = useState(null); // 소개 정보

    const [isFavorite, setIsFavorite] = useState(false); // 즐겨찾기 여부

    const [weather, setWeather] = useState(null); // 날씨 초단기실황 정보

    useEffect(() => {
        // ID로 디테일 데이터 불러오기
        (async () => {
            try {
                const { data } = await tourDetail(id, contentTypeId);
                if (data.success) {
                    setDetailCommon(data.detailCommon);
                    setDetailInfo(data.detailInfo);
                    setCoordinate(data.coordinate);
                    setWeather(data.weather);
                    setDetailIntro(data.detailIntro);
                }

                const exists = await checkFavoriteExistsAPI(id, contentTypeId);
                setIsFavorite(exists);

            } catch (error) {
                console.error("TOUR DETAIL 또는 즐겨찾기 조회 에러 :", error);
            }
        })();
    }, [id, contentTypeId]);



    /* 즐겨찾기 추가 핸들러 */
    const handleFavorite = async () => {
        if (!isLogin) {
            alert("즐겨찾기는 로그인 후 이용 가능합니다.");
            // 재사용 할 수 있는 모달창 만들어서 로그인 유도 또는 사용자가 머무를 수 있게 취소
            return;
        }

        const favoriteData = {
            contentId: id,
            contentTypeId: contentTypeId,
            title: detailCommon.title,
            addr: detailCommon.baseAddr,
            image: detailCommon.orgImage || detailCommon.thumbImage || null,
        };

        await addFavoriteAPI(favoriteData)
            .then(res => {
                if (res.status == 200) {
                    setIsFavorite(true);
                } else {
                    alert("즐겨찾기 추가에 실패했습니다.");
                }
            })
            .catch(err => {
                console.error("Error adding favorite:", err);
                alert("즐겨찾기 추가 중 오류가 발생했습니다.");
            });
    }


    return (
        <div className="max-w-6xl mx-auto p-6 space-y-10">
            {/* Header: Title + Image */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div>
                    {/* <div className='flex items-center space-x-4'> */}
                    <div className='flex flex-row'>
                        <div className='flex-3'>
                            <h1 className="text-4xl font-bold text-gray-900">{detailCommon.title}</h1>
                        </div>

                        <div className='flex-1 text-right'>
                            {/* 즐겨 찾기 */}
                            <Star
                                className={`w-8 h-8 text-yellow-400 cursor-pointer ${isFavorite ? 'fill-current' : 'text-gray-400'}`}
                                title="즐겨찾기 추가"
                                onClick={handleFavorite}
                            />
                        </div>
                    </div>
                    <p className="text-gray-600 mt-3">{detailCommon.baseAddr}</p>



                </div>

                <img
                    src={detailCommon.orgImage || "/noImage.png"}
                    alt={detailCommon.title}
                    className="w-full h-72 object-cover rounded-2xl shadow-md"
                />
            </div>

            {/* Overview */}
            <section>
                <h2 className="text-2xl font-semibold mb-4">개요</h2>
                <div className="bg-white rounded-2xl shadow p-5">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {detailCommon.overview}
                    </p>
                </div>
            </section>

            {/* Info List */}
            {detailInfo?.length > 0 && (
                <section>
                    <h2 className="text-2xl font-semibold mb-4">이용 정보</h2>
                    <div className="space-y-4">
                        {detailInfo.map((item, idx) => (
                            <div
                                key={idx}
                                className="border rounded-xl p-5 bg-white shadow-sm hover:shadow-md transition"
                            >
                                <h3 className="font-bold text-lg text-gray-800">{item.infoname}</h3>
                                <p
                                    className="text-gray-600 mt-2"
                                    dangerouslySetInnerHTML={{ __html: item.infotext }}
                                />
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* 상세 Intro 정보 */}
            {detailIntro && (
                <section>
                    <h2 className="text-2xl font-semibold mb-4">상세 안내</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 이용안내 */}
                        <DetailCard icon={<Info className="text-blue-500" />} title="이용안내" text={detailIntro.expguide} />
                        <DetailCard icon={<Calendar className="text-green-500" />} title="개장일" text={detailIntro.opendate || "-"} />
                        <DetailCard icon={<Car className="text-purple-500" />} title="주차" text={detailIntro.parking} />
                        <DetailCard icon={<Calendar className="text-red-500" />} title="휴무일" text={detailIntro.restdate || "-"} />
                        <DetailCard icon={<Clock className="text-yellow-500" />} title="이용시간" text={detailIntro.usetime} span />
                        <DetailCard icon={<Phone className="text-indigo-500" />} title="문의" text={detailIntro.infocenter || "-"} span />
                    </div>
                </section>
            )}



            {/* Map + Contact */}
            <section>
                <h2 className="text-2xl font-semibold mb-4">위치 & 연락처</h2>
                <div className="bg-white rounded-2xl shadow p-5 space-y-5">
                    {coordinate && (
                        <div className="h-72 rounded-lg overflow-hidden">
                            <TourDetailMap coordinate={coordinate} />
                        </div>
                    )}
                    <div>
                        {detailCommon.tel && <p className="text-gray-700">📞 {detailCommon.tel}</p>}
                        <div
                            className="text-blue-600 underline mt-2"
                            dangerouslySetInnerHTML={{ __html: detailCommon.homepage }}
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}

// 카드 컴포넌트 분리
function DetailCard({ icon, title, text, span }) {
    return (
        <div className={`bg-white shadow rounded-2xl p-5 flex items-start space-x-3 ${span ? "md:col-span-2" : ""}`}>
            <div className="w-6 h-6">{icon}</div>
            <div>
                <h3 className="text-sm font-medium text-gray-500">{title}</h3>
                <p className="text-gray-800 mt-2 text-sm" dangerouslySetInnerHTML={{ __html: text }} />
            </div>
        </div>
    );
}