// services/cloudinary.js
export async function uploadToCloudinary(file /* File or Blob */) {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "free_preset");      // ← your unsigned preset name
  // You can also append folder, tags, etc.

  const resp = await fetch(
    "https://api.cloudinary.com/v1_1/dmzp8kowf/upload",
    { method: "POST", body: data }
  );
  const json = await resp.json();
  if (!resp.ok) throw new Error(json.error?.message || "Upload failed");
  return json.secure_url;                             // ← public URL of the image
}
