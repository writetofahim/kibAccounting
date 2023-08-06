import React from "react";

const Tooltip = ({ text, children }) => {
  return (
    <div className="relative inline-block print:hidden ">
      <div className="group">
        {children}
        <div
          className={`bg-gray-600 text-white text-sm rounded-lg py-1 px-2 absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 opacity-0  scale-100 group-hover:opacity-100 group-hover:block hidden transition-opacity duration-200 
          `}
        >
          <div className="min-w-[200px] text-center">{text}</div>
          <div className="mt-1">
            <svg
              className="absolute text-gray-600 h-2 w-full left-0 top-full "
              x="0px"
              y="0px"
              viewBox="0 0 255 255"
            >
              <polygon
                className="fill-current"
                points="0,0 127.5,127.5 255,0"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tooltip;
