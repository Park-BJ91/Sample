import { useNavigate, Outlet, useSearchParams } from 'react-router-dom';
import MainSearch from '@pages/tour/search/MainSearch';
import { regionsList } from '@api/tour/tourApi';


export default function HomePage() {
    const navigate = useNavigate();

    const handleRegion = async () => {
        return await regionsList();
    }

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
            <MainSearch fetchRegions={handleRegion} onSearch={handleSearch} />
            <Outlet />
        </div>
    );
}
