import { useState } from "react";
import toast from "react-hot-toast";
import mediaUpload from "../utils/mediaUpload";

export default function Testing() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  async function handleUpload() {
    if (!file) {
      toast.error("No file selected");
      return;
    }

    setLoading(true);
    setProgress(0);

    try {
      const publicUrl = await mediaUpload(file, setProgress);
      console.log("Uploaded URL:", publicUrl);
      toast.success("File uploaded successfully!");
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(typeof err === "string" ? err : "File upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-4">
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button
        onClick={handleUpload}
        className="bg-gray-700 text-white p-2 rounded-lg cursor-pointer"
        disabled={loading}
      >
        {loading ? `Uploading ${progress}%` : "Upload"}
      </button>

      {loading && (
        <div className="w-64 bg-gray-300 rounded-full h-3">
          <div
            className="bg-green-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
}
