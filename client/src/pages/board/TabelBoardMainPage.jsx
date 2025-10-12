import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TabelBoardMainPage() {
    const [data, setData] = useState([]);

    const navigate = useNavigate();
    const handleWrite = () => {
        navigate('/board/write');
    }

    useEffect(() => {
        // 예시 데이터 로드
        setData([
            { id: 1, title: '첫 번째 글', author: 'user1', date: '2023-10-01' },
            { id: 2, title: '두 번째 글', author: 'user2', date: '2023-10-02' },
            { id: 3, title: '세 번째 글', author: 'user3', date: '2023-10-03' },
        ]);

        return () => {

        };

    }, []);


    return (
        <div>
            <h1>테이블 게시판 메인 페이지</h1>

            <div>
                <button onClick={handleWrite}>글쓰기</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>번호</th>
                        <th>제목</th>
                        <th>작성자</th>
                        <th>작성일</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.title}</td>
                            <td>{item.author}</td>
                            <td>{item.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>


        </div>

    );
}