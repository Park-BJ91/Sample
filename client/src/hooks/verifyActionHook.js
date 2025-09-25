import { useState } from 'react';

export function useVerifyAction(fn) {
    const [status, setStatus] = useState(null); // 요청 상태

    const verify = async (value, { onSuccess, onFail } = {}) => {
        setStatus("loading");
        try {
            const res = await fn(value);
            console.log("###  Verify 요청 응답: ", res);
            if (res.status === 200) {
                setStatus(true);
                onSuccess?.(res.data);
            } else {
                setStatus(false);
                onFail?.(res.data);
            }
        } catch (err) {
            console.error("확인 요청 실패:", err);
            setStatus(false);
            onFail?.(err);
        }
    };

    return { status, verify };
}