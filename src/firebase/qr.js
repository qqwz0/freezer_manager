// services/qr.js
import QRCode from "qrcode";

/** returns a Blob of PNG data */
export async function generateQRBlob(text) {
  const dataUrl = await QRCode.toDataURL(text, { type: "image/png" });
  // convert dataURL → Blob
  const res = await fetch(dataUrl);
  return await res.blob();
}
