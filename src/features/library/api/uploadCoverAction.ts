"use server";

import { uploadBlobAction } from "@/shared/actions/uploadBlobAction";

export async function uploadCoverAction(formData: FormData) {
  return uploadBlobAction(formData, "covers");
}
