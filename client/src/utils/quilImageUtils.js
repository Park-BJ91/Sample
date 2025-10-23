export default function getCurrentImageUrls(quill) {
    if (!quill) return [];
    const editorContent = quill.root.innerHTML;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = editorContent;

    const images = Array.from(tempDiv.querySelectorAll('img'));
    // return images.map(img => img.src);

    const imagePaths = images.map(img => {
        try {
            // img.src는 항상 절대 URL을 반환합니다 (예: http://localhost:3000/uploads/image.jpg)
            const url = new URL(img.src);
            // ⭐️ 핵심: pathname만 반환합니다. (예: /uploads/image.jpg)
            return url.pathname;
        } catch (e) {
            // URL 파싱 오류(예: src가 유효한 URL 형식이 아닐 경우) 처리
            console.error("URL 파싱 오류:", img.src, e);
            return []; // 오류 발생 시 전체 src를 반환하거나 null을 반환할 수 있음
        }
    })
    return imagePaths;
}