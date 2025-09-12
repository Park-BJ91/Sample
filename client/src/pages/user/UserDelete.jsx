import { useNavigate, useSearchParams } from 'react-router-dom';

const UserDelete = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const result = searchParams.get('result');

    if (result != 0) {
        alert('회원탈퇴 실패 입니다');
    }
    alert('회원탈퇴가 정상적으로 처리되었습니다.');
    navigate('/login'); // Redirect to login page

};


export default UserDelete;
