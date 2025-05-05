import React from "react";

const RecentSearch = ({
  recentHistory,
  setRecentHistory,
  setSelectedHistory,
}) => {
  const handleClearHistory = () => {
    localStorage.removeItem("history");
    setRecentHistory([]);
  };

  return (
    <div className="left col-span-1 bg-zinc-800 pt-3">
      <h1 className="text-xl text-white font-bold flex text-center justify-center">
        <span>Recent History</span>
        <button onClick={handleClearHistory} className="cursor-pointer mt-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="20px"
            viewBox="0 -960 960 960"
            width="20px"
            fill="#e3e3e3"
          >
            <path d="M312-144q-29.7 0-50.85-21.15Q240-186.3 240-216v-480h-48v-72h192v-48h192v48h192v72h-48v479.57Q720-186 698.85-165T648-144H312Zm336-552H312v480h336v-480ZM384-288h72v-336h-72v336Zm120 0h72v-336h-72v336ZM312-696v480-480Z" />
          </svg>
        </button>
      </h1>
      <ul className="text-left overflow-auto  mt-2">
        {recentHistory?.map((item, index) => (
          <li
            onClick={setSelectedHistory(item)}
            key={index + Math.random()}
            className="pl-5 px-5 text-zinc-400 hover:bg-zinc-700 cursor-pointer rounded-3xl hover:text-white  truncate "
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentSearch;
