import React from "react";

const TableLoadingSkeleton = ({ rows = 5, columns = 3 }) => {
  const renderSkeletonRows = () => {
    return [...Array(rows)].map((_, rowIndex) => (
      <tr key={rowIndex}>{renderSkeletonColumns()}</tr>
    ));
  };

  const renderSkeletonColumns = () => {
    return [...Array(columns)].map((_, colIndex) => (
      <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
        <div className="w-20 h-4 bg-gray-200 animate-pulse"></div>
      </td>
    ));
  };

  return (
    <div className="bg-white shadow overflow-hidden ">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>{renderSkeletonColumns()}</tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {renderSkeletonRows()}
        </tbody>
      </table>
    </div>
  );
};

export default TableLoadingSkeleton;
