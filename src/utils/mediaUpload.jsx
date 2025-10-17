import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://ckblbonzyovxwswpxgub.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNrYmxib256eW92eHdzd3B4Z3ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2MTM1NzksImV4cCI6MjA3NjE4OTU3OX0.IYRSIabJkYQxDxFbD3UhA2gLSqsE-6L2VhDUc3eZ2p4"
);

export default async function mediaUpload(file, onProgress) {
  if (!file) throw "No file selected";

  const timeStamp = Date.now();
  const uploadFileName = `${timeStamp}_${file.name}`;
  const uploadUrl = `https://ckblbonzyovxwswpxgub.supabase.co/storage/v1/object/images/${uploadFileName}`;

  // Manually upload file with XMLHttpRequest for progress tracking
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable && typeof onProgress === "function") {
        const percent = Math.round((e.loaded / e.total) * 100);
        onProgress(percent);
      }
    });

    xhr.onreadystatechange = async function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200 || xhr.status === 201) {
          // Fetch the public URL
          const { data } = supabase.storage
            .from("images")
            .getPublicUrl(uploadFileName);
          resolve(data.publicUrl);
        } else {
          reject(`Upload failed with status ${xhr.status}`);
        }
      }
    };

    xhr.onerror = () => reject("Network error during upload");

    xhr.open("POST", uploadUrl);
    xhr.setRequestHeader("Authorization", `Bearer ${supabase.supabaseKey}`);
    xhr.send(file);
  });
}
