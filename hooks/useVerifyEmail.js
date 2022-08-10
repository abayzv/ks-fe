import axios from "axios";
import { useState } from "react";
import toaster from "toasted-notes";

const useVerifyEmail = () => {
  const [loading, setLoading] = useState(false);
  const resendEmailVerification = async () => {
    setLoading(true);
    try {
      await axios.post("email/verification-notification");
      toaster.notify("The verification email has been sent", {
        position: "bottom-right",
      });
      setLoading(false);
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
  };
  return { resendEmailVerification, loading };
};

export default useVerifyEmail;
