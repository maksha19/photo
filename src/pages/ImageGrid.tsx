import React, { useEffect, useState } from 'react';
import axios from 'axios';

type ImageType = { id: string; imagePath: string };

export default function ImageGrid() {
    const [images, setImages] = useState<ImageType[][]>([]);
    const [lastEvaluatedKey, setLastEvaluatedKey] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [mobile, setMobile] = useState("");
    useEffect(() => {
        const profile = JSON.parse(localStorage.getItem("profile") || "{}");
        console.log("Quota from state:", profile);
        if (profile) {
            setMobile(profile.mobile || "");
        }
    }, []);

    useEffect(() => {
        if (images[currentPage]) return; // Already cached
        if(mobile === "") return;
        axios.post(`https://2jlple5l42kiuf4fhoup77n4om0hqesm.lambda-url.ap-southeast-1.on.aws/`, { lastEvaluatedKey, "action": "getImages", "mobile": mobile, })
            .then(res => {
                const newImages = [...images];
                newImages[currentPage] = res.data.items
                setLastEvaluatedKey(res.data.lastEvaluatedKey);
                setImages(newImages);
                setLoading(false);
            }).catch(err => {
                console.error("Error fetching images:", err);
                setLoading(true);
                alert("Error fetching images. Please try again.");
            })
    }, [currentPage,mobile]);

    const handleNext = () => setCurrentPage(prev => prev + 1);
    const handlePrev = () => setCurrentPage(prev => (prev > 0 ? prev - 1 : 0));

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid mb-6"></div>
                <p className="text-gray-700 text-lg font-medium mb-2">Loading images...</p>
                <p className="text-gray-500 text-sm">
                    If the issue persists, please{" "}
                    <a
                        href="https://wa.me/6583135769"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline"
                    >
                        contact the admin
                    </a>.
                </p>
            </div>
        );
    }
    return (
        <div className="p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {images[currentPage]?.map(img => (
                    <React.Fragment key={img.id}>
                        <img
                            src={img.imagePath}
                            alt={`img-${img.id}`}
                            className="w-full h-48 object-cover rounded cursor-pointer"
                            onClick={() => setSelectedImage(img.imagePath)}
                        />
                    </React.Fragment>
                ))}
                {selectedImage && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
                        onClick={() => setSelectedImage(null)}
                    >
                        <div className="relative">
                            <img
                                src={selectedImage}
                                alt="Full Image"
                                className="max-w-full max-h-full rounded"
                            />
                            <button
                                className="absolute top-2 right-2 text-white bg-gray-800 rounded-full p-2"
                                onClick={() => setSelectedImage(null)}
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <div className="flex justify-between mt-6">
                <button
                    onClick={handlePrev}
                    disabled={currentPage === 0}
                    className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
                >
                    Previous
                </button>
                <button
                    onClick={handleNext}
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
