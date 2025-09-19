import { useEffect, useRef } from "react";


export default function TourDetailMap(props) {
    const mapRef = useRef(null);

    useEffect(() => {
        console.log("Map Component Props:", props);
        // 좌표가 props로 전달되었는지 확인
        if (props.coordinate && window.naver) {
            const [lat, lng] = props.coordinate.split(',').map(Number);
            console.log("Parsed Coordinates:", lat, lng);

            const mapOptions = { // 지도 옵션 설정
                center: new naver.maps.LatLng(lat, lng), // 중심 좌표 (경도, 위도)
                zoom: 15,
            };

            const map = new naver.maps.Map(mapRef.current, mapOptions); // 지도 생성

            // 마커 추가
            new naver.maps.Marker({
                position: new naver.maps.LatLng(lat, lng),
                map,
            });
        }

    }, [props.coordinate]);

    return (
        <div
            className="rounded-2xl shadow-md"
            ref={mapRef}
            style={{ width: "100%", height: "300px" }}
        ></div>
    );
}