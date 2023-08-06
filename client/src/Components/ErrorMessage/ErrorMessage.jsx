const ErrorMessage = ({ error }) => {
  return (
    <div className="flex justify-center items-center h-full">
      <p className="text-red-500">{error}</p>
    </div>
  );
};

export default ErrorMessage;
