"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/shared/lib/auth";
import { uploadBlobFile } from "@/shared/lib/blob";

export async function uploadBlobAction(formData: FormData, folder: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    throw new Error("Необходимо авторизоваться");
  }
  const userId = (session.user as any).id ?? session.user.email;
  if (!userId) {
    throw new Error("Не удалось определить пользователя");
  }

  const file = formData.get("file") as File;
  if (!file) {
    throw new Error("Файл не передан");
  }

  const url = await uploadBlobFile(file, folder, userId);
  return { url };
}
