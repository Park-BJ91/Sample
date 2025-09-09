export const checkRole = (role) => {
    return (req, res, next) => {
        console.log("req.user : ", req.user);
        if (req.user.role !== role) {
            return res.status(403).json({ message: '권한 없음' });
        }
        next();
    };
};