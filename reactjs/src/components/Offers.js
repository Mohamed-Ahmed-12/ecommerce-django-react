import { useState, useEffect } from "react";

const OfferBanner = () => {
  const [position, setPosition] = useState(window.innerWidth); // Start from the right

  useEffect(() => {
    const speed = 2; // Adjust speed
    const moveBanner = () => {
      setPosition((prev) => (prev < -300 ? window.innerWidth : prev - speed));
    };

    const interval = setInterval(moveBanner, 16); // Smooth animation (~60 FPS)
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: `${position}px`,
        whiteSpace: "nowrap",
        fontSize: "20px",
        fontWeight: "bold",
        background: "#ff5722",
        color: "white",
        padding: "10px 20px",
        borderRadius: "5px",
      }}
    >
      🔥 Special Discount! Get 50% OFF Today! 🔥
    </div>
  );
};

export default OfferBanner;
