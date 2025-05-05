import React, { useEffect, useState } from "react";

function ProgressBar() {
  const [scrollPercentage, setScrollPercentage] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollDistance = document.documentElement.scrollTop;
      const totalHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      const scrolled = (scrollDistance / totalHeight) * 100;
      setScrollPercentage(scrolled);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      id="progressBarContainer"
      className="fixed bottom-0 left-0 w-full h-2 bg-gray-200"
    >
      <div
        id="progressBar"
        className="h-full bg-primary"
        style={{ width: `${scrollPercentage}%` }}
      ></div>
    </div>
  );
}

export default ProgressBar;
