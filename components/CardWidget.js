import React from "react";

export default function CardWidget(props) {
  return (
    <div className="bg-white shadow-md w-full h-32 rounded p-5">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-4xl text-gray-600 font-bold">{props.count}</div>
          <div className="text-gray-400 mt-4">{props.title}</div>
        </div>
        <div className="text-gray-300">{props.children}</div>
      </div>
    </div>
  );
}
