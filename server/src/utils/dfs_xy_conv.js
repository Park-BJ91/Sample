// ----------------------
// 위경도 → 기상청 격자 변환
// ----------------------
export default async function dfsXyConv(code, v1, v2) {
    const RE = 6371.00877;
    const GRID = 5.0;
    const SLAT1 = 30.0;
    const SLAT2 = 60.0;
    const OLON = 126.0;
    const OLAT = 38.0;
    const XO = 43;
    const YO = 136;

    const DEGRAD = Math.PI / 180.0;
    const RADDEG = 180.0 / Math.PI;

    let re = RE / GRID;
    let slat1 = SLAT1 * DEGRAD;
    let slat2 = SLAT2 * DEGRAD;
    let olon = OLON * DEGRAD;
    let olat = OLAT * DEGRAD;

    let sn = Math.tan(Math.PI * 0.25 + slat2 * 0.5) / Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sn = Math.log(Math.cos(slat1) / Math.cos(slat2)) / Math.log(sn);
    let sf = Math.tan(Math.PI * 0.25 + slat1 * 0.5);
    sf = Math.pow(sf, sn) * Math.cos(slat1) / sn;
    let ro = Math.tan(Math.PI * 0.25 + olat * 0.5);
    ro = re * sf / Math.pow(ro, sn);

    if (code === "toXY") {
        let ra = Math.tan(Math.PI * 0.25 + (v1) * DEGRAD * 0.5);
        ra = re * sf / Math.pow(ra, sn);
        let theta = v2 * DEGRAD - olon;
        if (theta > Math.PI) theta -= 2.0 * Math.PI;
        if (theta < -Math.PI) theta += 2.0 * Math.PI;
        theta *= sn;
        let x = Math.floor(ra * Math.sin(theta) + XO + 0.5);
        let y = Math.floor(ro - ra * Math.cos(theta) + YO + 0.5);
        return { nx: x, ny: y };
    }
}