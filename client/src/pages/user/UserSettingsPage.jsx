import { useState } from "react";

export default function UserSettingsPage() {
    const [nickname, setNickname] = useState("");
    const [password, setPassword] = useState("");

    const handleSave = (e) => {
        e.preventDefault();
        alert("정보가 저장되었습니다!");
    };

    const handleDeleteAccount = () => {
        if (window.confirm("정말 탈퇴하시겠습니까?")) {
            alert("계정이 삭제되었습니다.");
        }
    };

    return (
        <div className="max-w-lg mx-auto bg-white rounded-2xl shadow p-6">
            <h2 className="text-xl font-bold mb-4">계정 설정</h2>

            <form onSubmit={handleSave} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">닉네임</label>
                    <input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">비밀번호 변경</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2"
                    />
                </div>

                <div className="flex justify-between mt-6">
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        저장
                    </button>
                    <button
                        type="button"
                        onClick={handleDeleteAccount}
                        className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                    >
                        회원 탈퇴
                    </button>
                </div>
            </form>
        </div>
    );
}
