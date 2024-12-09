import { useNavigate } from "react-router-dom";
import { signOut } from "aws-amplify/auth";

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/signin");
  };

  return (
    <div className="flex-1 h-screen flex justify-center items-center w-full gap-7">
      <h1 className="text-3xl font-bold underline">Welcome to home screen</h1>
      <button
        className="p-4 bg-blue-500 rounded-md font-semibold"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
};

export default Home;
