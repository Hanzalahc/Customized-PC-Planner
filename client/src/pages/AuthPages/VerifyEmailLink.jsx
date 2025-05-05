import React, { useEffect, useState, memo } from "react";
import { FcCheckmark, FcCancel } from "react-icons/fc";
import useProvideHooks from "../../hooks/useProvideHooks";
import useApiSubmit from "../../hooks/useApiSubmit";
import useReduxHooks from "../../hooks/useReduxHooks";

const VerifyEmailLink = () => {
  const { apis, useParams, navigate, showError } = useProvideHooks();
  const { apiSubmit } = useApiSubmit();
  const { dispatch, protectedActions, protectedPage } = useReduxHooks();

  const [verificationStatus, setVerificationStatus] = useState(null);
  const { token } = useParams();
  const emailVerifyPageAccess = protectedPage?.emailVerifyPageAccess || false;

  const verifyToken = async () => {
    const emailVerifyResponce = await apiSubmit({
      url: `${apis().userVerifyEmail.url}${token}`,
      method: apis().userVerifyEmail.method,
      showLoadingToast: true,
      loadingMessage: "Verifying email..., Please wait!",
    });

    if (emailVerifyResponce?.success) {
      setVerificationStatus("success");
      dispatch(protectedActions.setEmailVerifyPageAccess(false));
      navigate("/signin");
    } else {
      setVerificationStatus("error");
    }
  };

  useEffect(() => {
    if (!emailVerifyPageAccess) {
      showError("Unauthorized Request!");
      navigate("/");
      return;
    }
    if (token) {
      verifyToken();
    } else {
      setVerificationStatus("error");
    }
  }, []);

  return (
    <section className="section py-4 laptop:py-10">
      <div className="w-[95%] mx-auto">
        <div className="card shadow-md m-auto w-full laptop:w-[31rem] rounded-md bg-white p-5 px-10 text-center">
          {verificationStatus === "success" ? (
            <>
              <FcCheckmark className="text-5xl m-auto mb-3" />
              <h3 className="text-lg text-black">
                Email Verified Successfully!
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                Your email has been successfully verified. You can now log in
                and enjoy our services.
              </p>
            </>
          ) : verificationStatus === "error" ? (
            <>
              <FcCancel className="text-5xl m-auto mb-3" />
              <h3 className="text-lg text-red-500">Verification Failed</h3>
              <p className="text-sm text-gray-500 mt-2">
                The verification link is invalid or has expired.
              </p>
              <div className="flex items-center w-full mt-5">
                {/* <Button
                  className="btn-org w-full"
                  onClick={() => navigate("/resend-verification")}
                >
                  Resend Verification Email
                </Button> */}
              </div>
            </>
          ) : (
            <p className="text-sm text-gray-500">Verifying your email...</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default memo(VerifyEmailLink);
