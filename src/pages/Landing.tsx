import { useEffect, useState } from "react";
import { UploadCloud } from "lucide-react";
import axios from "axios";

const Landing = () => {

  const [quota, setQuota] = useState(0);
  const [mobile, setMobile] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const profile = JSON.parse(localStorage.getItem("profile") || "{}");
    console.log("Quota from state:", profile);
    if (profile) {
      setQuota(parseInt(profile.quota) || 0);
      setMobile(profile.mobile || "");
    }
  }, []);
  


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const totalFiles = images.length + selectedFiles.length;

    if (totalFiles > quota) {
      if(quota === 0) {
        alert("You have reached your quota limit.");
        return;
      }
      alert(`You can only upload ${quota} images total.`);
      return;
    }
    setImages(prev => [...prev, ...selectedFiles]);
  };

  const handleSubmit = async () => {
    if (images.length === 0) {
      alert("Please upload at least one image.");
      return;
    }

    const maxTotalSize = 5 * 1024 * 1024; // 5MB in bytes
    const totalSize = images.reduce((acc, image) => acc + image.size, 0);

    if (totalSize > maxTotalSize) {
      alert(`The total size of all images exceeds the maximum limit of 5MB.`);
      return;
    }
    // Here you would typically handle the submission of the images
    // For example, you could send them to a server or process them
    // For demonstration, we'll just log the image names
    // and show a success message

    const files = await Promise.all(
      images.map(image =>
        new Promise<{ fileName: string; fileContentBase64: string }>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = async () => {
            const img = new Image();
            img.src = reader.result as string;
            img.onload = () => {
              const canvas = document.createElement("canvas");
              const ctx = canvas.getContext("2d");
              const maxWidth = 1200; // Set max width for the image
              const maxHeight = 1200; // Set max height for the image
              let { width, height } = img;

              if (width > maxWidth || height > maxHeight) {
                if (width > height) {
                  height = (height * maxWidth) / width;
                  width = maxWidth;
                } else {
                  width = (width * maxHeight) / height;
                  height = maxHeight;
                }
              }

              canvas.width = width;
              canvas.height = height;
              ctx?.drawImage(img, 0, 0, width, height);

              const optimizedBase64 = canvas.toDataURL("image/jpeg", 0.9); // Compress to 100% quality
              resolve({
                fileName: image.name,
                fileContentBase64: optimizedBase64.split(",")[1] || "",
              });
            };
          };
          reader.onerror = reject;
          reader.readAsDataURL(image);
        })
      )
    );



    console.log("Files to upload:", files);
    if (mobile === "") {
      alert("Please login to upload images.");
      setTimeout(() => {
        window.location.href = "/";
      }
        , 2000);
      return;
    }


    try {
      const response = await axios.post("https://2jlple5l42kiuf4fhoup77n4om0hqesm.lambda-url.ap-southeast-1.on.aws/", {
        action: "upload",
        mobile,
        files,
      });
      if (response.status === 200) {
        console.log("Submitting images:", images.map(img => img.name));
        setImages([])
        setQuota(response.data.remainingQuota);
      } else {
        alert("Failed to upload images. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("An error occurred while uploading images.");
    }
    setShowModal(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-6 bg-gray-50">
      <div className="w-full max-w-xl space-y-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold text-gray-800">
            Quota Remaining:{" "}
            <span className="text-[#000]">{quota - images.length}</span>
          </h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow space-y-4">

          <div className="bg-white p-6 rounded-2xl shadow-lg space-y-5 border border-gray-200"
            onClick={() => document.getElementById("file-upload")?.click()}>
            <label className="block text-base font-semibold text-gray-800 mb-2">
              Upload Images
              <span className="ml-1 text-sm font-normal text-gray-500">
                (Max: {quota}) and 5MB total size
              </span>
            </label>

            <div className="flex flex-col items-center justify-center border-2 border-dashed border-indigo-300 rounded-xl p-6 hover:bg-indigo-50 transition-colors">
              <UploadCloud className="w-10 h-10 text-indigo-500 mb-2" />
              <p className="text-gray-600 text-sm mb-2">
                click to browse
              </p>
              <div
                className="bg-[#801f36] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer relative z-10"
              >
                Select Images
              </div>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-4 mt-4">
              {images.map((image, index) => (
                <div key={index} className="border rounded overflow-hidden relative">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index}`}
                    className="w-full h-32 object-cover"
                  />
                  <p className="text-sm text-center truncate p-1">{image.name}</p>
                  <button
                    onClick={() => {
                      setImages(prev => prev.filter((_, i) => i !== index));
                    }}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => handleSubmit()}
            className="w-full bg-[#801f36] text-white py-2 rounded-xl hover:bg-indigo-700 transition"
          >
            Submit
          </button>
        </div>
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              🎉 Thanks for submitting!
            </h2>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 px-4 py-2 bg-[#801f36] text-white rounded-lg hover:bg-indigo-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div >
  );
};

export default Landing;
