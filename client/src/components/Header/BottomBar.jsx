import { LoginProfile } from "../index";
import useProvideHooks from "../../hooks/useProvideHooks";
import useReduxHooks from "./../../hooks/useReduxHooks";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import useApiSubmit from "./../../hooks/useApiSubmit";
import { useState } from "react";

function BottomBar() {
  const { apis, Link, Button } = useProvideHooks();
  const { apiSubmit, loading } = useApiSubmit();
  const { auth, dispatch, cart } = useReduxHooks();

  const [query, setQuery] = useState("");

  const userLoginStatus = auth?.status || false;
  const cartData = cart?.cart || [];

  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!query.trim()) return;

    const response = await apiSubmit({
      url: apis().getProductsBySearch.url,
      method: apis().getProductsBySearch.method,
      query: { query },
      successMessage: null,
      showLoadingToast: true,
      loadingMessage: "Searching...",
    });

    if (response?.data) {
      navigate(`/search-results?query=${query}`, {
        state: { results: response?.data },
      });
    }
  };

  const handleLogout = async () => {
    const logoutResponce = await apiSubmit({
      url: apis().userLogout.url,
      method: apis().userLogout.method,
      showLoadingToast: true,
      loadingMessage: "Logging out..., Please wait!",
    });

    if (logoutResponce?.success) {
      dispatch(authActions.logout());
    }
  };

  return (
    <div className="flex items-center justify-between bg-white px-4 pb-[1rem] top-[72px] left-0 right-0 z-10 shadow-md">
      <div className="flex-1">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 pl-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          />

          <Button
            className="!absolute top-1 right-1 z-50 !min-w-10 !w-10 !h-10 !rounded-full !text-primary !text-xl"
            onClick={handleSearch}
          >
            <IoSearch className="text-secondary" />
          </Button>
        </div>
      </div>

      <div className="flex gap-4 ml-4">
        <Link
          to="/cart"
          className="group flex items-center justify-center bg-white border border-gray-400 px-4 py-2 rounded-lg  hover:border-gray-800 transition-all"
        >
          <lord-icon
            src="https://cdn.lordicon.com/ggirntso.json"
            trigger="hover"
            colors="primary:#121331,secondary:#3238f2"
            style={{ width: 30, height: 30 }}
          />

          <span className="ml-2 text-black font-medium group-hover:text-primary ">
            {cartData.length > 0
              ? cartData.length > 99
                ? "99+"
                : cartData.length
              : 0}
          </span>
        </Link>

        {userLoginStatus ? (
          <LoginProfile />
        ) : (
          <>
            <Link
              to={userLoginStatus ? "/" : "/signin"}
              onClick={userLoginStatus ? handleLogout : null}
            >
              <button
                disabled={loading}
                className="flex gap-2 items-center border border-gray-400 px-6 py-2 rounded-full text-black hover:border-gray-800 hover:text-primary transition-all"
              >
                <lord-icon
                  src="https://cdn.lordicon.com/kdduutaw.json"
                  trigger="hover"
                  state="hover-looking-around"
                  colors="primary:#121331,secondary:#3238f2"
                  style={{ width: 30, height: 30 }}
                />

                <span className="font-display font-medium">
                  {userLoginStatus ? "Log Out" : "Log In"}
                </span>
              </button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default BottomBar;
