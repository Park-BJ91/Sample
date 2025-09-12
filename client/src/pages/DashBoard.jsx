import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function DashBoard() {

    axios.defaults.withCredentials = true;
    const PATH = import.meta.env.VITE_SERVER_AUTH_API;

    const handelNaverDelete = async () => {
        try {
            const response = await axios.get(`${PATH}/naver/delete`);
            console.log('네이버 삭제 응답:', response.data);

            if (response.data.result === 1) {
                console.log('네이버 삭제 성공');
            } else if (response.data.result === -1) {
                console.log('네이버 삭제 실패');
            } else {
                console.log('네이버 삭제 중 오류 발생');
            }

        } catch (error) {
            console.error('네이버 삭제 에러:', error);
        }
    };

    return (
        <div>
            <h1>Dashboard</h1>

            <div>
                <button onClick={handelNaverDelete}>네이버 탈퇴</button>
            </div>
        </div>
    );
}
