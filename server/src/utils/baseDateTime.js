
/**
 * 
 * @param {number} keyword 0: 초단기실황, 1: 단기예보 
 * @returns 
 */
export default async function getBaseDateTime(keyword) {
    const now = new Date();

    // KST 보정 (UTC → KST)
    // now.setHours(now.getHours() + 9);

    let year = now.getFullYear();
    let month = String(now.getMonth() + 1).padStart(2, "0");
    let day = String(now.getDate()).padStart(2, "0");
    let hours = now.getHours();
    let minutes = now.getMinutes();

    console.log("현재 시각 (KST):", `${year}-${month}-${day} ${hours}:${minutes}`);
    // 초단기실황 base_time 은 매시 정각만 가능
    // 발표시각 = 매시 정각, 제공은 약 10분 뒤
    if (minutes < 40 && keyword === 0) {
        hours -= 1;
        if (hours < 0) {
            const prev = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 1일 전
            year = prev.getFullYear();
            month = String(prev.getMonth() + 1).padStart(2, "0");
            day = String(prev.getDate()).padStart(2, "0");
            hours = 23;
        }
    }

    // 단기예보 base_time 은 0200, 0500, 0800, 1100, 1400, 1700, 2000, 2300 만 가능
    // 발표시각 = 02:10, 05:10, 08:10, 11:10, 14:10, 17:10, 20:10, 23:10

    // 단기예보 발표 가능한 시각 목록
    const baseTimes = [2, 5, 8, 11, 14, 17, 20, 23];

    let baseHour = baseTimes[0]; // 기본값: 02시
    for (let i = 0; i < baseTimes.length; i++) {
        if (hours > baseTimes[i] || (hours === baseTimes[i] && minutes >= 40)) {
            baseHour = baseTimes[i];
        }
    }

    // 만약 현재 시간이 00~01시라면 → 전날 23시 예보 사용
    if (hours < 2 || (hours === 2 && minutes < 40)) {
        const prev = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 하루 전
        year = prev.getFullYear();
        month = String(prev.getMonth() + 1).padStart(2, "0");
        day = String(prev.getDate()).padStart(2, "0");
        baseHour = 23;
    }


    const baseDate = `${year}${month}${day}`;
    const baseTime = String((keyword === 0 ? hours : baseHour)).padStart(2, "0") + "00";

    console.log(`기상청 ${keyword === 0 ? "초단기실황" : "단기예보"} 기준 시각:`, `${baseDate} ${baseTime}`);

    return { baseDate, baseTime };
}