import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./components/SignIn";
import { Amplify } from "aws-amplify";
import { awsConfig } from "./utils/awsConfig";

Amplify.configure(awsConfig);

const App = () => {
  return (
    <div className="h-screen w-full">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
