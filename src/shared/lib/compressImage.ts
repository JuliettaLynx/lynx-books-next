export async function compressImage(
  file: File,
  maxSizeBytes: number = 100 * 1024,
  maxDimension: number = 400,
): Promise<File | null> {
  if (file.size <= maxSizeBytes) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target?.result as string;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          const scale = maxDimension / Math.max(width, height);
          width = Math.round(width * scale);
          height = Math.round(height * scale);
        }

        let quality = 0.85;
        let dataUrl: string;
        let currentSize: number;

        do {
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            resolve(null);
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          dataUrl = canvas.toDataURL("image/jpeg", quality);
          currentSize = Math.round(dataUrl.length * 0.75);

          if (currentSize > maxSizeBytes && quality > 0.3) {
            quality -= 0.05;
          } else {
            break;
          }
        } while (currentSize > maxSizeBytes && quality > 0.3);

        const blob = dataUrlToBlob(dataUrl);
        if (!blob) {
          resolve(null);
          return;
        }
        const compressedFile = new File(
          [blob],
          file.name.replace(/\.[^.]+$/, ".jpg"),
          { type: "image/jpeg" },
        );
        resolve(compressedFile);
      };
      img.onerror = () => resolve(null);
    };
    reader.onerror = () => resolve(null);
  });
}

function dataUrlToBlob(dataUrl: string): Blob | null {
  const parts = dataUrl.split(",");
  if (parts.length !== 2) return null;
  const mime = parts[0].match(/:(.*?);/)?.[1] || "image/jpeg";
  const byteString = atob(parts[1]);
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mime });
}
