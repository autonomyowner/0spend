import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export function useUploadCreative() {
  const generateUploadUrl = useMutation(api.creatives.generateUploadUrl);
  const saveCreative = useMutation(api.creatives.saveCreative);
  const [uploading, setUploading] = useState(false);

  async function upload(file: File, format: string, duration?: number) {
    setUploading(true);
    try {
      const uploadUrl = await generateUploadUrl();

      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      const { storageId } = await response.json();

      const creativeId = await saveCreative({
        storageId: storageId as any,
        fileName: file.name,
        format,
        mimeType: file.type,
        fileSize: file.size,
        ...(duration !== undefined && { duration }),
      });

      return { storageId, creativeId };
    } finally {
      setUploading(false);
    }
  }

  return { upload, uploading };
}
