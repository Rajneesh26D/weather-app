// components/background-image/BackgroundImage.js

import React, { useEffect, useState } from "react";
import "./BackgroundImage.css";

const BackgroundImage = () => {
  const [backgroundImage, setBackgroundImage] = useState("");

  useEffect(() => {
    const updateBackgroundImage = () => {
      const hour = new Date().getHours();
      let image = "";

      if (hour >= 20 || hour < 5) {
        image = "night.jpg"; // night time image
      } else if (hour >= 5 && hour < 6) {
        image = "dawn_time.jpg"; // dawn time image
      } else if (hour >= 6 && hour < 20) {
        image = "morning.jpg"; // day time image
      }
      console.log(`Current hour: ${hour}, Image: ${image}`);
      setBackgroundImage(image);
    };

    updateBackgroundImage();
    const interval = setInterval(updateBackgroundImage, 60 * 60 * 1000); // update every hour

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="background-image"
      style={{ backgroundImage: `url(/icons/${backgroundImage})`}}
    />
  );
};

export default BackgroundImage;
