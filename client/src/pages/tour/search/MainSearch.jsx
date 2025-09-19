
import React, { useState, useEffect, useRef } from "react";

export default function MainSearch({
    fetchRegions,
    // fetchTypes,
    onSearch
}) {

    // --- State ---
    // const [cityQuery, setCityQuery] = useState("");
    // const [countyQuery, setCountyQuery] = useState("");
    // const [typeQuery, setTypeQuery] = useState("");

    // 검색 결과
    const [cityResults, setCityResults] = useState([]);
    const [countyResults, setCountyResults] = useState([]);
    const [typeResults, setTypeResults] = useState([]);

    // 선택된 항목
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedCounty, setSelectedCounty] = useState(null);
    const [selectedType, setSelectedType] = useState(null);

    // 포커스 및 키보드 네비게이션
    const [activeList, setActiveList] = useState(null); // 'city' | 'county' | 'type'
    const [highlightIndex, setHighlightIndex] = useState(0); // 현재 하이라이트된 인덱스

    // refs for inputs
    const cityRef = useRef(null);
    const countyRef = useRef(null);
    // const typeRef = useRef(null);


    // --- Debounce helper ---
    // function useDebouncedValue(value, delay = 250) {
    //     const [v, setV] = useState(value);
    //     useEffect(() => {
    //         const t = setTimeout(() => setV(value), delay);
    //         return () => clearTimeout(t);
    //     }, [value, delay]);
    //     return v;
    // }

    // 디바운스는?  (사용자가 입력한 값이 변경된 후, 일정 시간 동안 추가 입력이 없으면 API를 호출)
    // const debCity = useDebouncedValue(cityQuery, 500);
    // const debCounty = useDebouncedValue(countyQuery, 200);
    // const debType = useDebouncedValue(typeQuery, 150);


    // --- Effect: City search ---
    useEffect(() => {
        let active = true;
        (async () => {
            if (fetchRegions) {
                try {
                    // const { data } = await fetchCities(debCity);
                    const { data } = await fetchRegions();
                    if (!active || !data.success) return;
                    setCityResults(data.list || []);
                } catch (e) {
                    alert("도/시 검색 중 오류 발생: " + e);
                    setCityResults([]);
                }
            } else {
                setCityResults(
                    // MOCK_CITIES.filter(c => c.name.includes(debCity) || debCity === "")
                    MOCK_CITIES.filter(c => c.name.includes())
                );
            }
        })();
        return () => (active = false); // cleanup 함수
        // }, [debCity, fetchCities]);
    }, [fetchRegions]);

    // --- Effect: County search depends on selectedCity ---
    useEffect(() => {
        if (!selectedCity) {
            setCountyResults([]);
            return;
        }
        let active = true;
        (async () => {
            if (fetchRegions) {
                // assume fetchCities can return city+counties or separate API
                try {
                    return setCountyResults((selectedCity && selectedCity.signguList) ? selectedCity.signguList : [])
                } catch (e) {
                    alert("군 검색 중 오류 발생: " + e);
                    setCountyResults([]);
                }
            } else {
                const cityObj = MOCK_CITIES.find(c => c.id === selectedCity.id);
                setCountyResults(cityObj ? cityObj.counties.filter(ct => ct.name.includes(debCounty) || debCounty === "") : []);
            }
        })();
        return () => (active = false);
        // }, [selectedCity, debCounty, fetchCities]);
    }, [selectedCity, fetchRegions]);

    // --- Effect: Type search ---
    /*     useEffect(() => {
            let active = true;
            (async () => {
                if (fetchTypes) {
                    try {
                        // const res = await fetchTypes(debType);
                        const res = await fetchTypes();
                        if (!active) return;
                        setTypeResults(res || []);
                    } catch (e) {
                        console.error(e);
                        setTypeResults([]);
                    }
                } else {
                    // setTypeResults(MOCK_TYPES.filter(t => t.name.includes(debType) || debType === ""));
                    setTypeResults(MOCK_TYPES.filter(t => t.name.includes()));
                }
            })();
            return () => (active = false);
            // }, [debType, fetchTypes]);
        }, [fetchTypes]); */


    // 드롭다운 키보드 컨트롤
    function onKeyDownList(e, listType, items) {
        if (activeList !== listType) return;
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlightIndex((idx) => (idx + 1) % items.length);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightIndex((idx) => (idx - 1 + items.length) % items.length);
        } else if (e.key === "Enter") {
            e.preventDefault();
            const selectedItem = items[highlightIndex];
            if (selectedItem) {
                if (listType === 'city') selectCity(selectedItem);
                else if (listType === 'county') selectCounty(selectedItem);
                // else if (listType === 'type') selectType(selectedItem);
            }
        } else if (e.key === "Escape") {
            e.preventDefault();
            setActiveList(null);
        }
    }


    // 드롭다운 마우스 컨트롤  
    function selectCity(c) {
        setSelectedCity(c);
        setSelectedCounty(null);
        // setCityQuery(c.name);
        // setCountyQuery("");
        setActiveList(null);
        setHighlightIndex(0);
        // 포커스 카운티로 이동
        setTimeout(() => countyRef.current?.focus(), 0);
    }
    function selectCounty(ct) {
        setSelectedCounty(ct);
        // setCountyQuery(ct.name);
        setActiveList(null);
        setHighlightIndex(0);
        // setTimeout(() => typeRef.current?.focus(), 0);
    }

    /*    
    function selectType(t) {
            setSelectedType(t);
            // setTypeQuery(t.name);
            setActiveList(null);
            setHighlightIndex(0);
        }        
    */


    function clearAll() {
        setSelectedCity(null);
        setSelectedCounty(null);
        setSelectedType(null);
        // setCityQuery("");
        // setCountyQuery("");
        // setTypeQuery("");
        setCityResults([]);
        setCountyResults([]);
        setTypeResults([]);
    }

    // 검색 제출
    function submitSearch(e) {
        e.preventDefault();

        const payload = {
            sidoCode: selectedCity.sidoCode,
            signguCode: selectedCounty ? selectedCounty.signguCode : '',
            // type: selectedType
        };
        if (onSearch) onSearch(payload);
        else console.log("Search payload:", payload);
    }


    return (
        // <div className="max-w-3xl mx-auto p-4">
        <div className="mx-40 p-4">
            <div className="bg-white shadow-md rounded-2xl p-4 grid grid-cols-1 md:grid-cols-4 gap-3 items-end">

                {/* City Select */}
                <div className="md:col-span-1 relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">시(시도)</label>
                    <button
                        type="button"
                        className="w-full border rounded-lg px-3 py-2 text-left bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        onClick={() => setActiveList(activeList === 'city' ? null : 'city')}
                        onKeyDown={(e) => onKeyDownList(e, 'city', cityResults)}
                    >
                        {selectedCity ? selectedCity.sidoName : "시/도를 선택하세요"}
                    </button>

                    {/* {DOWNLIST} */}
                    {activeList === 'city' && cityResults.length > 0 && (
                        <ul className="absolute z-20 left-0 right-0 mt-2 bg-white border rounded-lg max-h-56 overflow-auto shadow-sm">
                            {cityResults.map((c, idx) => (
                                <li
                                    key={c.sidoCode}
                                    className={`px-3 py-2 cursor-pointer ${idx === highlightIndex ? 'bg-indigo-50' : 'hover:bg-gray-50'}`}
                                    onMouseDown={(ev) => { ev.preventDefault(); selectCity(c); }}
                                >
                                    <div className="flex justify-between">
                                        <span className="font-medium">{c.sidoName}</span>
                                        <small className="text-gray-500">
                                            {c.signguList ? c.signguList.length + '개 군/구' : ''}
                                        </small>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>


                {/* County Select */}
                <div className="md:col-span-1 relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">군/구</label>
                    <button
                        type="button"
                        className={`w-full border rounded-lg px-3 py-2 text-left bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300 ${!selectedCity ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : ''}`}
                        disabled={!selectedCity}
                        onClick={() => selectedCity && setActiveList(activeList === 'county' ? null : 'county')}
                        onKeyDown={(e) => onKeyDownList(e, 'county', countyResults)}
                    >
                        {selectedCounty ? selectedCounty.signguName : selectedCity ? "군/구 선택" : "먼저 시/도를 선택하세요"}
                    </button>

                    {activeList === 'county' && countyResults.length > 0 && (
                        <ul className="absolute z-20 left-0 right-0 mt-2 bg-white border rounded-lg max-h-44 overflow-auto shadow-sm">
                            {countyResults.map((ct, idx) => (
                                <li
                                    key={ct.signguCode}
                                    className={`px-3 py-2 cursor-pointer ${idx === highlightIndex ? 'bg-indigo-50' : 'hover:bg-gray-50'}`}
                                    onMouseDown={(ev) => { ev.preventDefault(); selectCounty(ct); }}
                                >
                                    {ct.signguName}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Type Select */}
                {/* <div className="md:col-span-1 relative">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <button
                        type="button"
                        className="w-full border rounded-lg px-3 py-2 text-left bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        onClick={() => setActiveList(activeList === 'type' ? null : 'type')}
                        onKeyDown={(e) => onKeyDownList(e, 'type', typeResults)}
                    >
                        {selectedType ? selectedType.name : "타입 선택"}
                    </button>

                    {activeList === 'type' && typeResults.length > 0 && (
                        <ul className="absolute z-20 left-0 right-0 mt-2 bg-white border rounded-lg max-h-44 overflow-auto shadow-sm">
                            {typeResults.map((t, idx) => (
                                <li
                                    key={t.id}
                                    className={`px-3 py-2 cursor-pointer ${idx === highlightIndex ? 'bg-indigo-50' : 'hover:bg-gray-50'}`}
                                    onMouseDown={(ev) => { ev.preventDefault(); selectType(t); }}
                                >
                                    {t.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div> */}



                {/* 검색 / 초기화 버튼 */}
                <div className="md:col-span-1 flex gap-2">
                    <button
                        onClick={(e) => submitSearch(e)}
                        className="w-full bg-indigo-600 text-white rounded-lg px-4 py-2 font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    >
                        검색
                    </button>
                    <button
                        onClick={clearAll}
                        className="w-full border rounded-lg px-4 py-2 bg-white hover:bg-gray-50 focus:outline-none"
                        aria-label="초기화"
                    >
                        초기화
                    </button>
                </div>
            </div>

            {/* 선택된 항목 칩 */}
            <div className="mt-3 flex flex-wrap gap-2 items-center">
                {selectedCity && (
                    <span className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-800 px-3 py-1 rounded-full text-sm">
                        {selectedCity.sidoName}
                        <button onClick={() => { setSelectedCity(null); setCountyResults([]); setSelectedCounty(null); }} aria-label="시 제거"> ✕ </button>
                    </span>
                )}
                {selectedCounty && (
                    <span className="inline-flex items-center gap-2 bg-green-50 text-green-800 px-3 py-1 rounded-full text-sm">
                        {selectedCounty.signguName}
                        {/* <button onClick={() => { setSelectedCounty(null); setCountyQuery(""); }} aria-label="군구 제거">✕</button> */}
                        <button onClick={() => { setSelectedCounty(null); }} aria-label="군구 제거">✕</button>
                    </span>
                )}
                {/* {selectedType && (
                    <span className="inline-flex items-center gap-2 bg-yellow-50 text-yellow-800 px-3 py-1 rounded-full text-sm">
                        {selectedType.name}
                        <button onClick={() => { setSelectedType(null); }} aria-label="타입 제거">✕</button>
                    </span>
                )} */}

            </div>
        </div>
    );
}