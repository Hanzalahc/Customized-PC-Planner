import React, { memo, useEffect } from "react";
import { Link } from "react-router-dom";
import { FcCheckmark } from "react-icons/fc";
import useProvideHooks from "../../hooks/useProvideHooks";
import useApiSubmit from "../../hooks/useApiSubmit";
import useReduxHooks from "../../hooks/useReduxHooks";

const VerifyPassLink = () => {
  const { apis, useParams, navigate, showError } = useProvideHooks();
  const { apiSubmit } = useApiSubmit();
  const { protectedPage } = useReduxHooks();

  const { token } = useParams();
  const resetPassPageAccess = protectedPage?.resetPassPageAccess || false;

  const verifyToken = async () => {
    const emailVerifyResponce = await apiSubmit({
      url: `${apis().userVerifyPassLink.url}${token}`,
      method: apis().userVerifyPassLink.method,
      showLoadingToast: true,
      loadingMessage: "Verifying email..., Please wait!",
    });

    if (emailVerifyResponce?.success) {
      navigate("/reset-password");
    }
  };

  useEffect(() => {
    if (!resetPassPageAccess) {
      showError("Unauthorized Request!");
      navigate("/");
      return;
    }
    if (token) {
      verifyToken();
    }
  }, []);
  return (
    <section className="section py-4 laptop:py-10">
      <div className="w-[95%] mx-auto">
        <div className="card shadow-md m-auto w-full laptop:w-[31rem] rounded-md bg-white p-5 px-10 text-center">
          <FcCheckmark className="text-5xl m-auto mb-3" />
          <h3 className="text-lg text-black">Password Reset Link Verify!</h3>
          <p className="text-sm text-gray-500 mt-2">
            We have sent an email with a password reset link to your email
            address. Please check your email and click on the link to reset your
            password.
          </p>

          <div className="flex items-center w-full mt-3">
            <p className="text-sm">
              Resend the email?
              <Link
                className="link cursor-pointer text-sm font-medium"
                to="/forget-password"
              >
                Try again
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(VerifyPassLink);
