export const AUTH_TOKEN_RESULT = Object.freeze({
    TOKEN_SUCCESS: 1,       // 토큰 유효
    TOKEN_NOT_FOUND: 0,     // 토큰 없음
    TOKEN_EXPIRED: -1,      // 유효기간 만료
    TOKEN_INVALID: -2,      // 유효하지 않은 토큰
});

export const AUTH_ROLE = Object.freeze({
    ROLE_USER: 'DEF',
    ROLE_ADMIN: 'ADMIN',
    ROLE_MANAGER: 'MANAGER',
    ROLE_GUEST: 'GUEST',
});

export const AUTH_ROLE_RESULT = Object.freeze({
    ROLE_SUCCESS: 1,        // 권한 있음
    ROLE_FORBIDDEN: 0,      // 권한 없음
    ROLE_NOT_FOUND: -1,     // 역할 없음
});

export const AUTH_LOGIN_RESULT = Object.freeze({
    SUCCESS: 'SUCCESS',
    FAILURE: 'FAILURE',
    USER_NOT_FOUND: 'USER_NOT_FOUND',
    INCORRECT_PASSWORD: 'INCORRECT_PASSWORD',
});

export const AUTH_RESULT = Object.freeze({
    SUCCESS: 1,
    FAILURE: -1,
    ERROR: -99,
});