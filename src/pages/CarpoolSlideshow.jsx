import React, { useState, useEffect } from "react";
import carpool1 from "./carpool.png";
import carpool2 from "./carpool2.png";

function CarpoolSlideshow() {
  const images = [carpool1, carpool2];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4500); 
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="slideshow-container">
      <img
        src={images[index]}
        alt="Carpool visual"
        className="slideshow-img"
      />
    </div>
  );
}

export default CarpoolSlideshow;
