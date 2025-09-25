import { useNavigate, Outlet } from 'react-router-dom';
import MainSearch from '@pages/tour/search/MainSearch';
import { regionsList } from '@api/tour/tourApi';

export default function HomePage() {
    const navigate = useNavigate();

    /* 지역 리스트 핸들러 */
    const handleRegion = async () => {
        return await regionsList();
    }

    /* 검색 핸들러 */
    const handleSearch = async (params) => {
        const queryString = new URLSearchParams({
            sidoCode: params.sidoCode ? params.sidoCode : '',
            signguCode: params.signguCode ? params.signguCode : '',
        }).toString();
        navigate(`/tour/search?${queryString}`);
    }

    return (
        <div>
            {/* Search 최상단 */}
            {/* <Topbar isLoggedIn={isLogin} /> */}
            <MainSearch fetchRegions={handleRegion} onSearch={handleSearch} />
            <Outlet />
        </div>
    );
}
