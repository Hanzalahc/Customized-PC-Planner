import React, { useState } from "react";

function EachFAQ({
  heading = "What is CustomPcAdvisor and how does it work?",
  content = "CustomPcAdvisor is a platform that helps you build your ideal custom PC by recommending components based on your specific needs and budget. Simply input your requirements, and our system will provide you with the best options, complete with benchmarks, compatibility checks, and purchasing links.",
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleFAQ = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="group rounded-xl border border-gray-200 bg-gray-50 p-6">
      <dt
        className="cursor-pointer flex justify-between items-center"
        onClick={toggleFAQ}
      >
        <p className="font-semibold text-lg">{heading}</p>
        <i
          className={`fa-solid fa-chevron-up transition-transform ${
            isOpen ? "-rotate-180" : ""
          }`}
        ></i>
      </dt>
      <dd className={`text-lg font-light mt-6 ${isOpen ? "" : "hidden"}`}>
        <p>{content}</p>
      </dd>
    </div>
  );
}

export default EachFAQ;
