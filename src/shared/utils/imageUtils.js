export function getImageSrc(image) {
    if (!image) return null;
    if (typeof image === 'string') return image;
    if (image instanceof File) {
        return URL.createObjectURL(image);
    }
    return null;
}