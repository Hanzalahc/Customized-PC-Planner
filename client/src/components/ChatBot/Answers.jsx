import React, { useEffect, useState } from "react";

const Answers = ({ answer, index, totalResult, type }) => {
  const [heading, setHeading] = useState(false);
  const [replacedAnswer, setReplacedAnswer] = useState(answer);

  function checkHeading(str) {
    return /^(\*)(\*)(.*)\*$/.test(str);
  }

  function replaceHeadingStars(str) {
    return str.replace(/^(\*)(\*)$/g, "");
  }

  useEffect(() => {
    if (checkHeading(answer)) {
      setHeading(true);
      setReplacedAnswer(replaceHeadingStars(answer));
    }
  }, []);

  return (
    <>
      {index === 0 && totalResult > 1 ? (
        <span className="pt-2 text-xl block text-white">{replacedAnswer}</span>
      ) : heading ? (
        <span className="pt-2 text-lg block text-white">{replacedAnswer}</span>
      ) : (
        <span className={`${type == "q" ? "pl-1" : "pl-5"} text-sm`}>
          {replacedAnswer}
        </span>
      )}
    </>
  );
};

export default Answers;
