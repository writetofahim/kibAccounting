import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

const Home = () => {
  const { user } = useContext(AuthContext);
  return (
    <div className="h-[calc(100vh-64px)] flex items-center justify-center">
      <h1 className="font-[700] text-3xl ">Welcome back {user?.username}</h1>
    </div>
  );
};

export default Home;
