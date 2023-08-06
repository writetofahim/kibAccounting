import { CgSpinner } from "react-icons/cg";

const Loading = () => {
  return (
    <div className="flex justify-center items-center">
      <CgSpinner className="animate-spin text-4xl" />
    </div>
  );
};

export default Loading;
