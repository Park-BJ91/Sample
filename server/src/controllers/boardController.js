import BoardService from "../services/boardService.js";

export const boardTempImageUpload = async (req, res) => {
    const userId = req.user.id;
    const file = req.file;  // multer가 업로드한 파일을 req.file에 저장

    try {
        const result = await BoardService.boardTempImageUploadService(userId, file);
        console.log("임시 이미지 업로드 결과:", result);
        res.json(result);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


export default {
    boardTempImageUpload
}; 