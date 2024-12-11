import React, { useEffect, useState } from "react";

const Hero = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const sliderImages = [
        "https://www.cisworld.lk/storage/categories/online-auction.jpg",
        "https://picsum.photos/id/1015/1920/1080",
        "https://picsum.photos/id/1018/1920/1080",
        "https://picsum.photos/id/1021/1920/1080",
        "https://picsum.photos/id/1023/1920/1080",
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % sliderImages.length);
        }, 3000); // Auto-slide every 3 seconds

        return () => clearInterval(interval);
    }, [sliderImages.length]);

    const handlePrev = () => {
        setCurrentSlide(
            (prevSlide) => (prevSlide - 1 + sliderImages.length) % sliderImages.length
        );
    };

    const handleNext = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % sliderImages.length);
    };

    return (
        <>
        <div className=" text-center mt-4">
            <h3>Welcome To NextGEn Bid</h3>
        </div>
        <div
            style={{
                width: "100%",
                maxWidth: "1320px",
                height: "550px",
                margin: "40px auto",
                overflow: "hidden",
                borderRadius: "12px",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
            }}
        >
            {/* Slider Wrapper */}
            <div
                style={{
                    display: "flex",
                    transition: "transform 0.5s ease-in-out",
                    transform: `translateX(-${currentSlide * 100}%)`,
                }}
            >
                {sliderImages.map((image, index) => (
                    <img
                        key={index}
                        src={image}
                        alt={`Slide ${index + 1}`}
                        style={{
                            minWidth: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                        className="mt-3 p-2"
                    />
                ))}
            </div>

            {/* Previous Button */}
            <button
                onClick={handlePrev}
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "10px",
                    transform: "translateY(-50%)",
                    backgroundColor: "#333",
                    color: "#fff",
                    border: "none",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    fontSize: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "background-color 0.3s",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#555")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#333")}
            >
                &#8249;
            </button>

            {/* Next Button */}
            <button
                onClick={handleNext}
                style={{
                    position: "absolute",
                    top: "50%",
                    right: "10px",
                    transform: "translateY(-50%)",
                    backgroundColor: "#333",
                    color: "#fff",
                    border: "none",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    fontSize: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "background-color 0.3s",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#555")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#333")}
            >
                &#8250;
            </button>
        </div>
        </>
    );
};

export default Hero;
