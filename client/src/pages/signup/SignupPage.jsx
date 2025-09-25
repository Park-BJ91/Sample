import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, XCircle } from "lucide-react";
import { verifyIdAPI, signUpAPI } from "@api/user/userApi";
import { useVerifyAction } from "@hooks/verifyActionHook";
import ImageUpload from "@components/img/ImageUpload";

import DaumPostcodeButton from "@components/addr/Address";

export default function SignupPage() {
    const navigate = useNavigate();

    const [id, setId] = useState("");
    const [idAvailable, setIdAvailable] = useState(null);

    const [password, setPassword] = useState("");
    const [pwError, setPwError] = useState("");
    const [confirmPw, setConfirmPw] = useState("");

    const [nickname, setNickname] = useState("");

    const [profileImage, setProfileImage] = useState(null);

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState(" ");

    const [phone, setPhone] = useState("");
    const [phoneError, setPhoneError] = useState(" ");

    const [address, setAddress] = useState("");
    const [addressDetail, setAddressDetail] = useState("");
    const [zonecode, setZonecode] = useState("");

    const isPwMatch = password && confirmPw && password === confirmPw; // 비밀번호 일치 여부
    const { verify } = useVerifyAction(verifyIdAPI); // ID 중복 확인 훅


    /** ID 입력 핸들러 */
    const handleUserIdChange = (e) => {
        setId(e.target.value);
        setIdAvailable(1); // 아이디 입력이 변경될 때 메시지 초기화
        const regex = /^[a-zA-Z0-9]{4,12}$/; // 영문자, 숫자 조합 4~12자
        if (!regex.test(e.target.value)) {
            console.log("아이디 형식 불일치:", e.target.value);
            setIdAvailable(0); // 형식에 맞지 않으면 사용 불가
        }

    }

    /** ID 중복 확인 핸들러 */
    const handleIdVerify = async () => {
        await verify(id, {
            onSuccess: (res) => {
                console.log("SignupPage ID 검증 성공:", res);
                setIdAvailable(res.result);
            },
            onFail: (error) => {
                console.error("SignupPage ID 검증 실패:", error);
                setIdAvailable(error);
            }
        });
    };


    /** 이메일 입력 핸들러 */
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(e.target.value)) {
            setEmailError("유효한 이메일 형식이 아닙니다.");
        } else {
            setEmailError("");
        }
    };

    /** 전화번호 입력 핸들러 */
    // 휴대폰 번호 입력 핸들러 (010 기본값)
    const handlePhoneChange = (e) => {
        let value = e.target.value.replace(/[^0-9]/g, "");

        // 010이 없으면 자동으로 붙임
        if (!value.startsWith("010")) {
            value = "010" + value.replace(/^010/, "");
        }

        // 최대 11자리까지만 허용
        value = value.slice(0, 11);

        // 하이픈 자동 삽입
        if (value.length < 4) {
            setPhone(value);
        } else if (value.length < 8) {
            setPhone(value.slice(0, 3) + "-" + value.slice(3));
        } else {
            setPhone(value.slice(0, 3) + "-" + value.slice(3, 7) + "-" + value.slice(7, 11));
        }

        // 010-xxxx-xxxx 형식 체크
        const regex = /^010-\d{4}-\d{4}$/;
        if (!regex.test(
            value.length < 4
                ? value
                : value.length < 8
                    ? value.slice(0, 3) + "-" + value.slice(3)
                    : value.slice(0, 3) + "-" + value.slice(3, 7) + "-" + value.slice(7, 11)
        )) {
            setPhoneError("유효한 휴대폰 번호 형식이 아닙니다.");
        } else {
            setPhoneError("");
        }
    };

    /** 주소 선택 핸들러 */
    const handleAddrSelect = (data) => {
        const { address, zonecode } = data;
        setAddress(address);
        setZonecode(zonecode);
    }


    /** 제출 핸들러 */
    const handleSubmit = (e) => {
        e.preventDefault(); // 폼 제출 기본 동작 방지
        // 모든 유효성 검사 통과 시 폼 제출 로직 추가
        if (idAvailable !== 200) { // ID 중복 확인 필요
            alert("아이디 중복 확인이 필요합니다.");
            return;
        }
        if (pwError) { // 비밀번호 오류
            alert("비밀번호를 확인해주세요.");
            return;
        }
        if (!isPwMatch) { // 비밀번호 불일치
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }
        if (emailError) { // 이메일 오류
            alert("이메일을 확인해주세요.");
            return;
        }
        if (phoneError) { // 휴대폰 번호 오류
            alert("휴대폰 번호를 확인해주세요.");
            return;
        }

        if (!address) { // 주소 미입력
            alert("주소를 입력해주세요.");
            return;
        }

        const addrs = {
            address, addressDetail, zonecode
        }

        // const testData = { id, password, nickname, profileImage, email, phone, ...addrs }}
        signUpAPI({ id, password, nickname, profileImage, email, phone, ...addrs })
            .then((res) => {
                console.log("회원가입 성공:", res);
                alert("회원가입이 완료되었습니다.");
                // 추가적인 처리 (예: 로그인 페이지로 리다이렉트)
                navigate("/login");
            })
            .catch((err) => {
                console.error("회원가입 실패:", err);
                alert("회원가입에 실패했습니다. 다시 시도해주세요.");
            });
    }


    return (
        <div className="max-w-lg mx-auto my-12 p-6 bg-white shadow rounded-2xl space-y-6">
            <form className="space-y-4" onSubmit={handleSubmit}>
                <h1 className="text-2xl font-bold text-center">회원가입</h1>

                {/* ID */}
                <div>
                    <label className="block font-medium">아이디</label>
                    <div className="flex space-x-2 mt-1">
                        <input
                            type="text"
                            value={id}
                            onChange={handleUserIdChange}
                            className="flex-1 border rounded-lg px-3 py-2"
                            placeholder="아이디 입력"
                        />
                        <button
                            type="button"
                            disabled={idAvailable === 0 || !id} // 형식 불일치 또는 빈 값일 때 비활성화
                            onClick={handleIdVerify}
                            className={`px-4 py-2 bg-blue-600 text-white rounded-lg ${idAvailable === 0 || !id ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"}`}
                        >
                            중복 확인
                        </button>
                    </div>
                    {idAvailable !== null && (
                        <p className={`mt-1 text-sm ${idAvailable == 200 ? "text-green-600" : "text-red-500"}`}>
                            {/* {idAvailable.result ? "사용 가능한 아이디입니다." : "이미 사용 중인 아이디입니다."} */}
                            {idAvailable == 200 && "사용 가능한 아이디입니다."}
                            {idAvailable.result == 400 && "아이디를 입력해주세요."}
                            {idAvailable.result == 409 && "이미 사용 중인 아이디입니다."}
                            {idAvailable == 1 && ""}
                            {idAvailable == 0 && "영문자, 숫자 조합 4~12자이어야 합니다."}
                        </p>
                    )}
                </div>

                {/* Password */}
                <div>
                    <label className="block font-medium">비밀번호</label>
                    <input
                        type="password"
                        minLength={8}
                        maxLength={20}
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setPwError("");
                        }}
                        onBlur={() => {
                            if (password && (password.length < 8 || password.length > 20)) {
                                setPwError("비밀번호는 8~20자여야 합니다.");
                            } else {
                                setPwError("");
                            }
                        }}
                        className="w-full border rounded-lg px-3 py-2 mt-1"
                        placeholder="비밀번호 입력 (8~20)"
                    />
                    {pwError && (
                        <p className="mt-1 text-sm text-red-500">{pwError}</p>
                    )}
                </div>
                <div>
                    <label className="block font-medium">비밀번호 확인</label>
                    <input
                        type="password"
                        value={confirmPw}
                        onChange={(e) => setConfirmPw(e.target.value)}
                        className="w-full border rounded-lg px-3 py-2 mt-1"
                        placeholder="비밀번호 확인"
                    />
                    {confirmPw && (
                        <p className={`mt-1 text-sm flex items-center space-x-1 ${isPwMatch ? "text-green-600" : "text-red-500"}`}>
                            {isPwMatch ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                            <span>{isPwMatch ? "비밀번호가 일치합니다." : "비밀번호가 일치하지 않습니다."}</span>
                        </p>
                    )}
                </div>

                {/* Nickname */}
                <div>
                    <label className="block font-medium">닉네임</label>
                    <input className="w-full border rounded-lg px-3 py-2 mt-1"
                        type="text"
                        placeholder="닉네임 입력"
                        onChange={(e) => setNickname(e.target.value)}  // 임시
                    />
                </div>

                {/* 프로필 이미지 */}
                <ImageUpload label="프로필 이미지" onChange={setProfileImage} />

                <div>
                    <label className="block font-medium">이메일</label>
                    <input className="w-full border rounded-lg px-3 py-2 mt-1"
                        type="email"
                        onChange={handleEmailChange}
                        placeholder="example@email.com"
                    />
                    {emailError && (
                        <p className="mt-1 text-sm text-red-500">{emailError}</p>
                    )}
                </div>

                {/* Phone */}
                <div>
                    <label className="block font-medium">휴대폰 번호</label>
                    <input className="w-full border rounded-lg px-3 py-2 mt-1"
                        type="text"
                        onChange={handlePhoneChange}
                        value={phone}
                        minLength={13}
                        maxLength={13}
                        placeholder="0000-0000"
                    />
                    {phoneError && (
                        <p className="mt-1 text-sm text-red-500">{phoneError}</p>
                    )}
                </div>

                {/* Address */}
                <div>
                    <label className="block font-medium">주소</label>
                    <div className="flex space-x-2 mt-1">
                        <input className="flex-1 border rounded-lg px-3 py-2"
                            type="text"
                            value={address}
                            readOnly={true}
                            placeholder="주소 입력" />
                        <DaumPostcodeButton onComplete={handleAddrSelect}>
                            주소 찾기
                        </DaumPostcodeButton>
                    </div>

                    <div className="mt-2 space-y-2">
                        {zonecode && (
                            <>
                                <label className="block font-medium">상세 주소</label>
                                <input className="flex-1 border rounded-lg px-3 py-2 w-full" type="text" onChange={(e) => setAddressDetail(e.target.value)} value={addressDetail} />
                            </>
                        )}
                    </div>

                </div>

                {/* Submit */}
                <button className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg">
                    회원가입
                </button>
            </form>
        </div>
    );
}
