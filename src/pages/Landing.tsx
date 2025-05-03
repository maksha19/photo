import { useState } from "react";
import { UploadCloud } from "lucide-react";
import { useLocation } from "react-router-dom";

const Landing = () => {

  const [images, setImages] = useState<File[]>([]);
  const [showModal, setShowModal] = useState(false);

  const location = useLocation();
  const { quota } = location.state || {}; // fallback if undefined

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const totalFiles = images.length + selectedFiles.length;

    if (totalFiles > quota) {
      alert(`You can only upload ${quota} images total.`);
      return;
    }

    setImages(prev => [...prev, ...selectedFiles]);
  };

  const handleSubmit = () => {
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

    console.log("Submitting images:", images.map(img => img.name));
    // Clear after submit if needed
    // setImages([]);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-6 bg-gray-50">
      <div className="w-full max-w-xl space-y-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold text-gray-800">
            Quota Remaining:{" "}
            <span className="text-indigo-600">{quota - images.length}</span>
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
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer relative z-10"
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
                <div key={index} className="border rounded overflow-hidden">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Preview ${index}`}
                    className="w-full h-32 object-cover"
                  />
                  <p className="text-sm text-center truncate p-1">{image.name}</p>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => handleSubmit()}
            className="w-full bg-indigo-600 text-white py-2 rounded-xl hover:bg-indigo-700 transition"
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
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
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
