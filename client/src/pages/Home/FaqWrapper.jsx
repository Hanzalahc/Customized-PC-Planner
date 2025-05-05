import React, { useEffect, useState } from "react";
import EachFAQ from "./EachFAQ";
import axios from "axios";
import toast from "react-hot-toast";
import apis from "../../api/api";

function FaqWrapper() {
  const [faqs, setFaqs] = useState([]); // State to store FAQ data

  useEffect(() => {
    const showAllFaq = async () => {
      const loadingToastId = toast.loading("Fetching...");
      try {
        const response = await axios.get(apis().getFaq, {
          headers: { "Content-Type": "application/json" },
        });
        setFaqs(response.data.faqs);
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message;
        toast.error(errorMessage);
      } finally {
        toast.dismiss(loadingToastId); // Dismiss toast in both success and error cases
      }
    };

    showAllFaq();
  }, []);

  return (
    <div
      id="faq"
      className="wrapper px-6 py-12 max-w-7xl mt-16 mx-auto lg:px-8 lg:mt-10 animate__animated wow animate__fadeInDown"
    >
      <h2 className="h1 text-center">
        <span className="cucss">FAQs</span>
      </h2>
      {/* FAQ Sub Wrapper */}
      <div className="sub-wrapper grid grid-cols-1 lg:grid-cols-2 mt-6 gap-6 items-start">
        {faqs.map((faq) => (
          <EachFAQ
            key={faq._id} // Unique key for each FAQ
            heading={faq.question} // Use the question as heading
            content={faq.answer} // Use the answer as content
          />
        ))}
      </div>
    </div>
  );
}

export default FaqWrapper;
