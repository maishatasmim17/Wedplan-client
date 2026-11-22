import { API_BASE_URL } from "./utils";

const MAX_ORIGINAL_BYTES = 12 * 1024 * 1024; // 12 MB original; compressed before upload
const MAX_IMAGE_SIDE = 1600;
const JPEG_QUALITY = 0.82;

/**
 * Reads a picked file and resizes/re-encodes it to a compact data URL.
 * Keeping uploads small avoids bloating the database and speeds up page loads.
 */
export async function compressImageToDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please choose an image file (JPG, PNG, WEBP or GIF)");
  }
  if (file.size > MAX_ORIGINAL_BYTES) {
    throw new Error("Image is too large. Please choose a file smaller than 12 MB.");
  }

  const rawDataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read the selected image"));
    reader.readAsDataURL(file);
  });

  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = document.createElement("img");
      element.onload = () => resolve(element);
      element.onerror = () => reject(new Error("Could not open the selected image"));
      element.src = rawDataUrl;
    });

    let width = img.naturalWidth || img.width;
    let height = img.naturalHeight || img.height;
    const ratio = Math.min(1, MAX_IMAGE_SIDE / Math.max(width, height));
    width = Math.max(1, Math.round(width * ratio));
    height = Math.max(1, Math.round(height * ratio));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return rawDataUrl;

    // White backdrop so transparent PNGs don't turn black after JPEG encoding.
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);

    return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
  } catch {
    // If the browser cannot compress it, still allow the original file through;
    // the server validates format and size.
    return rawDataUrl;
  }
}

/** Uploads a service image to the WedPlan API and returns its public URL. */
export async function uploadServiceImage(file: File, token: string | null): Promise<string> {
  if (!token) throw new Error("Please sign in again to upload images");

  const image = await compressImageToDataUrl(file);
  const res = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ image, fileName: file.name })
  });

  const data = await res.json();
  if (!res.ok || !data.success || !data.url) {
    throw new Error(data.message || "Image upload failed. Please try again.");
  }

  return data.url;
}
