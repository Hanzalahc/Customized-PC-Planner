import React from "react";
import { Answers } from "../index";

const QuestionAnswer = ({ item, index }) => {
  return (
    <div
      key={index + Math.random()}
      className={`${item.type === "q" ? "flex justify-end" : ""}`}
    >
      <li
        key={index + Math.random()}
        className="text-right p-1 border-8 bg-zinc-700 border-zinc-700 rounded-tl-3xl rounded-br-3xl w-fit rounded-bl-3xl  "
      >
        {item.type === "q" ? (
          <li key={index + Math.random()} className="text-left p-1">
            <Answers
              answer={item.text}
              index={index}
              totalResult={1}
              type={item.type}
            />
          </li>
        ) : (
          item.text.map((ans, ansIndex) => (
            <li key={ansIndex + Math.random()} className="text-left">
              <Answers
                answer={ans}
                index={ansIndex}
                totalResult={item.length}
                type={item.type}
              />
            </li>
          ))
        )}
      </li>
    </div>
  );
};

export default QuestionAnswer;
