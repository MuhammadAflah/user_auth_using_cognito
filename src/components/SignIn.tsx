import { useState } from "react";
import {
  signUp,
  signIn,
  resetPassword,
  confirmResetPassword,
  confirmSignUp,
} from "aws-amplify/auth";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isForgotPassword, setIsForgotPassword] = useState<boolean>(false);
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [isConfirmationRequired, setIsConfirmationRequired] =
    useState<boolean>(false);
  const navigate = useNavigate();

  const handleToggle = () => {
    setIsLogin((prevIsLogin) => !prevIsLogin);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isLogin) {
        // Sign-in
        const { isSignedIn, nextStep } = await signIn({
          username: email,
          password,
        });
        console.log("Sign-in successful", { isSignedIn, nextStep });
        if (isSignedIn) {
          navigate("/");
        }
      } else {
        // Sign-up
        const { isSignUpComplete, userId, nextStep } = await signUp({
          username: email,
          password,
          options: {
            userAttributes: {
              name: username,
            },
          },
        });
        console.log("Sign-up initiated", {
          isSignUpComplete,
          userId,
          nextStep,
        });

        if (!isSignUpComplete) {
          setIsConfirmationRequired(true);
        }
      }
    } catch (error) {
      console.error("Error in authentication flow", error);
    }
  };

  const handleConfirmSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { isSignUpComplete, userId, nextStep } = await confirmSignUp({
        username: email,
        confirmationCode: verificationCode,
      });
      console.log("Confirmation successful", {
        isSignUpComplete,
        userId,
        nextStep,
      });

      if (isSignUpComplete) {
        setIsConfirmationRequired(false);
        setIsLogin(true);
      }
    } catch (error) {
      console.error("Error confirming sign-up", error);
    }
  };

  //forgot password
  const handleForgotPassword = async () => {
    if (!email.trim()) {
      alert("Please enter your email to reset the password.");
      return;
    }

    try {
      const result = await resetPassword({
        username: email, // Use the email as username
        options: {
          clientMetadata: {},
        },
      });

      const { attributeName, deliveryMedium, destination } =
        result.nextStep.codeDeliveryDetails;

      console.log("Password reset code sent to:", {
        attributeName,
        deliveryMedium,
        destination,
      });

      alert(
        `A verification code has been sent to ${destination}. Please check your ${deliveryMedium}.`
      );

      setIsForgotPassword(true);
    } catch (error) {
      console.error("Error in forgot password process", error);
      alert("Failed to send reset code. Please try again.");
    }
  };

  const handleResetPassword = async (e: any) => {
    e.preventDefault();

    if (!email.trim() || !newPassword.trim() || !verificationCode.trim()) {
      alert("All fields are required to reset your password.");
      return;
    }

    try {
      // Confirm reset password
      await confirmResetPassword({
        username: email,
        newPassword,
        confirmationCode: verificationCode,
        options: {
          clientMetadata: {},
        },
      });

      console.log("Password reset successful");

      alert(
        "Password has been reset successfully. You can now log in with your new password."
      );
      setIsForgotPassword(false);
      setIsLogin(true);
    } catch (error) {
      console.error("Error resetting password", error);
      alert("Failed to reset password. Please check your code and try again.");
    }
  };

  return (
    <div className="h-screen w-full flex flex-col justify-center items-center">
      <h4 className="font-bold text-2xl mb-4">
        {isForgotPassword
          ? "Reset Password"
          : isConfirmationRequired
          ? "Confirm Signup"
          : isLogin
          ? "Login"
          : "Signup"}
      </h4>
      <form
        onSubmit={
          isForgotPassword
            ? handleResetPassword
            : isConfirmationRequired
            ? handleConfirmSignUp
            : handleSubmit
        }
        className="w-full max-w-md"
      >
        {isForgotPassword ? (
          <div>
            <div className="mt-3">
              <label className="block mb-2">Verification Code</label>
              <input
                type="text"
                placeholder="Enter Verification Code"
                value={verificationCode}
                required
                onChange={(e) => setVerificationCode(e.target.value)}
                className="h-10 rounded-lg p-4 bg-gray-800 w-full text-white"
              />
            </div>
            <div className="mt-3">
              <label className="block mb-2">New Password</label>
              <input
                type="password"
                placeholder="Enter New Password"
                value={newPassword}
                required
                onChange={(e) => setNewPassword(e.target.value)}
                className="h-10 rounded-lg p-4 bg-gray-800 w-full text-white"
              />
            </div>
          </div>
        ) : isConfirmationRequired ? (
          <div>
            <div className="mt-3">
              <label className="block mb-2">Verification Code</label>
              <input
                type="text"
                placeholder="Enter Verification Code"
                value={verificationCode}
                required
                onChange={(e) => setVerificationCode(e.target.value)}
                className="h-10 rounded-lg p-4 bg-gray-800 w-full text-white"
              />
            </div>
          </div>
        ) : (
          <div>
            {!isLogin && (
              <div className="mt-3">
                <label className="block mb-2">Username</label>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  required
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-10 rounded-lg p-4 bg-gray-800 w-full text-white"
                />
              </div>
            )}
            <div className="mt-3">
              <label className="block mb-2">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-10 rounded-lg p-4 bg-gray-800 w-full text-white"
              />
            </div>
            <div className="mt-3">
              <label className="block mb-2">Password</label>
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-10 rounded-lg p-4 bg-gray-800 w-full text-white"
              />
            </div>
          </div>
        )}
        <div className="flex justify-between items-center mt-4">
          <button
            type="submit"
            className="bg-[#7551FF] text-white rounded-lg px-4 py-2"
          >
            {isForgotPassword
              ? "Reset Password"
              : isConfirmationRequired
              ? "Confirm"
              : isLogin
              ? "Login"
              : "Signup"}
          </button>
          {isLogin && !isForgotPassword && (
            <button
              className="text-[#7551FF] border border-[#7551FF] rounded-lg px-4 py-2"
              onClick={handleForgotPassword}
              type="button"
            >
              Forgot Password
            </button>
          )}
        </div>
      </form>
      <p className="mt-4">
        {isForgotPassword
          ? "Back to"
          : isLogin
          ? "Not registered yet? "
          : "Already a member? "}
        &nbsp;
        <button
          type="button"
          onClick={() => {
            if (isForgotPassword) {
              setIsForgotPassword(false);
            } else {
              handleToggle();
            }
          }}
          className="text-[#7551FF]"
        >
          {isForgotPassword
            ? "Login"
            : isLogin
            ? " Create an Account"
            : " Sign in"}
        </button>
      </p>
    </div>
  );
};

export default SignIn;
