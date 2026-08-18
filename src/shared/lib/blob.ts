import { put, del } from "@vercel/blob";
import { v4 as uuidv4 } from "uuid";

const BLOB_TOKEN = process.env.USERS_READ_WRITE_TOKEN;

if (!BLOB_TOKEN) {
  throw new Error("Missing USERS_READ_WRITE_TOKEN environment variable");
}

export function extractBlobPathFromUrl(url: string): string | null {
  try {
    const parsed = new URL(url);
    return parsed.pathname.slice(1);
  } catch {
    return null;
  }
}

export async function deleteBlobFile(url: string): Promise<boolean> {
  const path = extractBlobPathFromUrl(url);
  if (!path) {
    console.warn("Не удалось извлечь путь из URL:", url);
    return false;
  }
  try {
    await del(path, { token: BLOB_TOKEN });
    return true;
  } catch (error) {
    console.error("Ошибка при удалении файла из Blob:", error);
    return false;
  }
}

export async function uploadBlobFile(
  file: File,
  folder: string,
  userId: string,
  customFileName?: string,
): Promise<string> {
  const ext = file.name.split(".").pop() || "";
  const baseName = customFileName || `${Date.now()}-${uuidv4()}`;
  const fileName = `${baseName}.${ext}`;
  const path = `${folder}/${userId}/${fileName}`;

  try {
    const blob = await put(path, file, {
      access: "public",
      token: BLOB_TOKEN,
    });
    return blob.url;
  } catch (error) {
    console.error("Ошибка загрузки в Blob:", error);
    throw new Error("Не удалось загрузить файл");
  }
}
