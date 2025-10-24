import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Calendar, Car, Clock, Phone, Info, Star } from "lucide-react";
import { tourDetail } from '@api/tour/tourApi';
import { addFavoriteAPI, checkFavoriteExistsAPI } from '@api/favorite/favoriteAPI';
import TourDetailMap from '@components/map/NaverMap';
import { useAuth } from '@contexts/AuthContext'

const dummyDataList = [
    {
        contentId: 1, contentTypeId: 12,
        title: '경북궁', baseAddr: '서울특별시 종로구 사직로 161', orgImage: '/A.png',
        overview: '경복궁은 조선시대의 대표적인 궁궐로, 서울의 중심에 위치해 있습니다. 아름다운 건축물과 넓은 정원이 어우러져 있어 많은 관광객들이 찾는 명소입니다.',
        thumbImage: '/A.png', tel: '02-123-4567', homepage: '<a href="https://royal.khs.go.kr/ROYAL/contents/R601000000.do?schGroupCode=gbg&schGroupCodeNm=%EA%B2%BD%EB%B3%B5%EA%B6%81" target="_blank" rel="noopener noreferrer">공식 홈페이지</a>'
    },
    {
        contentId: 2, contentTypeId: 14,
        title: '창덕궁', baseAddr: '서울특별시 종로구 율곡로 99', orgImage: '/B.png',
        overview: '창덕궁은 유네스코 세계문화유산으로 지정된 조선시대의 궁궐입니다. 자연과 조화를 이루는 아름다운 후원이 유명하며, 역사적인 건축물들이 잘 보존되어 있습니다.',
        thumbImage: '/B.png', tel: '02-234-5678', homepage: '<a href="https://royal.khs.go.kr/ROYAL/contents/R601000000.do?schGroupCode=cdg" target="_blank" rel="noopener noreferrer">공식 홈페이지</a>'
    },
    {
        contentId: 3, contentTypeId: 15,
        title: '한옥마을', baseAddr: '서울특별시 종로구 북촌로11길', orgImage: '/C.png',
        overview: '한옥마을은 전통 한옥이 모여 있는 지역으로, 한국의 전통 건축미를 느낄 수 있는 곳입니다. 좁은 골목길과 고즈넉한 분위기가 매력적이며, 다양한 문화 체험도 가능합니다.',
        thumbImage: '/C.png', tel: '02-345-6789', homepage: '<a href="http://www.hanokmaeul.go.kr" target="_blank" rel="noopener noreferrer">공식 홈페이지</a>'
    },
    {
        contentId: 4, contentTypeId: 12,
        title: '숭례문', baseAddr: '서울특별시 중구 세종대로 40', orgImage: '/D.png',
        overview: '숭례문은 조선시대의 대표적인 문으로, 서울의 중심부에 위치해 있습니다. 아름다운 건축물과 역사적인 가치로 많은 관광객들이 찾는 명소입니다.',
        thumbImage: '/D.png', tel: '02-456-7890', homepage: '<a href="http://www.sungnyemun.go.kr" target="_blank" rel="noopener noreferrer">공식 홈페이지</a>'
    },
    {
        contentId: 5, contentTypeId: 14,
        title: '동대문', baseAddr: '서울특별시 종로구 종로 288', orgImage: '/E.png',
        overview: '동대문은 서울의 대표적인 시장으로, 다양한 쇼핑과 먹거리를 즐길 수 있는 곳입니다. 특히 밤늦게까지 운영되는 상점들이 많아 야시장 분위기를 느낄 수 있습니다.',
        thumbImage: '/E.png', tel: '02-567-8901', homepage: '<a href="http://www.ddm.go.kr" target="_blank" rel="noopener noreferrer">공식 홈페이지</a>'
    },
]

const dummyDetailInfo = [
    {
        contentId: 1, contentTypeId: 12,
        infoname: '입장료',
        infotext: '성인 3,000원, 청소년 1,500원, 어린이 1,000원'
    },
    {
        contentId: 2, contentTypeId: 14,
        infoname: '가이드 투어',
        infotext: '매일 10:00, 14:00에 운영되며, 사전 예약 필요'
    },
    {
        contentId: 3, contentTypeId: 15,
        infoname: '체험 프로그램',
        infotext: '한복 체험, 전통 공예 체험 등 다양한 프로그램 운영'
    },
    {
        contentId: 4, contentTypeId: 12,
        infoname: '문화 행사',
        infotext: '매주 토요일 전통 공연 및 행사 개최'
    },
    {
        contentId: 5, contentTypeId: 14,
        infoname: '운영 시간',
        infotext: '10:00 ~ 22:00 (연중무휴)'
    },
]


const dummyDetailIntro = [
    {
        contentId: 1, contentTypeId: 12,
        expguide: '경복궁은 매일 09:00부터 18:00까지 개방하며, 입장은 17:00까지 가능합니다. 매주 월요일은 휴무입니다.',
        opendate: '2025-09-28',
        parking: '경복궁 내 주차장이 있으며, 유료로 운영됩니다.',
        restdate: '매주 월요일',
        usetime: '09:00 ~ 18:00',
        infocenter: '02-123-4567'
    },
    {
        contentId: 2, contentTypeId: 14,
        expguide: '창덕궁은 매일 09:00부터 17:30까지 개방하며, 입장은 16:30까지 가능합니다. 매주 화요일은 휴무입니다.',
        opendate: '2025-10-05',
        parking: '창덕궁 인근에 공영주차장이 있습니다.',
        restdate: '매주 화요일',
        usetime: '09:00 ~ 17:30',
        infocenter: '02-234-5678'
    },
    {
        contentId: 3, contentTypeId: 15,
        expguide: '한옥마을은 연중무휴로 개방되며, 특별한 개장 시간은 없습니다. 다만, 일부 한옥 체험관은 운영 시간이 다를 수 있습니다.',
        opendate: '2025-11-15',
        parking: '한옥마을 주변에 유료 주차장이 있습니다.',
        restdate: '연중무휴',
        usetime: '상시 개방',
        infocenter: '02-345-6789'
    },
    {
        contentId: 4, contentTypeId: 12,
        expguide: '숭례문은 매일 09:00부터 18:00까지 개방하며, 입장은 17:00까지 가능합니다. 매주 수요일은 휴무입니다.',
        opendate: '2025-12-01',
        parking: '숭례문 인근에 공영주차장이 있습니다.',
        restdate: '매주 수요일',
        usetime: '09:00 ~ 18:00',
        infocenter: '02-456-7890'
    },
    {
        contentId: 5, contentTypeId: 14,
        expguide: '동대문 시장은 매일 10:00부터 22:00까지 운영되며, 일부 상점은 더 늦게까지 영업합니다.',
        opendate: '2025-10-20',
        parking: '동대문 인근에 유료 주차장이 있습니다.',
        restdate: '연중무휴',
        usetime: '10:00 ~ 22:00',
        infocenter: '02-567-8901'
    },
]


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
            // 더미 데이터로 진행
            /*             const detailData = dummyDataList.find(item => item.contentId.toString() === id && item.contentTypeId.toString() === contentTypeId);
                        if (detailData) {
                            setDetailCommon(detailData);
                        }
                        const introData = dummyDetailIntro.find(item => item.contentId.toString() === id && item.contentTypeId.toString() === contentTypeId);
                        if (introData) {
                            setDetailIntro(introData);
                        }
            
                        const infoData = dummyDetailInfo.filter(item => item.contentId.toString() === id && item.contentTypeId.toString() === contentTypeId);
                        if (infoData) {
                            setDetailInfo(infoData);
                        }
            
                        const exists = await checkFavoriteExistsAPI(id, contentTypeId);
                        setIsFavorite(exists); */



            /* 데이터 불러오기 공공데이터 화재 이슈로 사용불가 / 복구 2025-10-23 목요일 10시 */
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
            return;
        }

        const favoriteData = {
            contentId: id,
            contentTypeId: contentTypeId,
            title: detailCommon.title,
            addr: detailCommon.baseAddr,
            image: detailCommon.orgImage || detailCommon.thumbImage || null,
        };

        console.log("즐겨찾기 데이터:", favoriteData);


        await addFavoriteAPI(favoriteData)
            .then(res => {
                if (res.status == 200) {
                    setIsFavorite(res.data.isFavorite);
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