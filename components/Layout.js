import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import useVerifyEmail from "../hooks/useVerifyEmail";
import { authUserState } from "../store/auth";
import Navbar from "./Navbar";
import React from "react";
import dynamic from "next/dynamic";

const Loader = () => {
  return (
    <>
      <div className="flex min-h-screen items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          style={{
            margin: "auto",
            background: "none",
            display: "block",
            shapeRendering: "auto",
          }}
          width="70px"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid"
        >
          <rect x="17.5" y={30} width={15} height={40} fill="#ff0011">
            <animate
              attributeName="y"
              repeatCount="indefinite"
              dur="1s"
              calcMode="spline"
              keyTimes="0;0.5;1"
              values="18;30;30"
              keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
              begin="-0.2s"
            />
            <animate
              attributeName="height"
              repeatCount="indefinite"
              dur="1s"
              calcMode="spline"
              keyTimes="0;0.5;1"
              values="64;40;40"
              keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
              begin="-0.2s"
            />
          </rect>
          <rect x="42.5" y={30} width={15} height={40} fill="#ff0000">
            <animate
              attributeName="y"
              repeatCount="indefinite"
              dur="1s"
              calcMode="spline"
              keyTimes="0;0.5;1"
              values="20.999999999999996;30;30"
              keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
              begin="-0.1s"
            />
            <animate
              attributeName="height"
              repeatCount="indefinite"
              dur="1s"
              calcMode="spline"
              keyTimes="0;0.5;1"
              values="58.00000000000001;40;40"
              keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
              begin="-0.1s"
            />
          </rect>
          <rect x="67.5" y={30} width={15} height={40} fill="#ff0000">
            <animate
              attributeName="y"
              repeatCount="indefinite"
              dur="1s"
              calcMode="spline"
              keyTimes="0;0.5;1"
              values="20.999999999999996;30;30"
              keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
            />
            <animate
              attributeName="height"
              repeatCount="indefinite"
              dur="1s"
              calcMode="spline"
              keyTimes="0;0.5;1"
              values="58.00000000000001;40;40"
              keySplines="0 0.5 0.5 1;0 0.5 0.5 1"
            />
          </rect>
        </svg>
      </div>
    </>
  );
};

const Layout = ({ title, children, middleware }) => {
  const router = useRouter();
  const authUser = JSON.parse(localStorage.getItem("user"));
  const setUserAuth = useSetRecoilState(authUserState);
  const { resendEmailVerification, loading } = useVerifyEmail();
  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    if (middleware === "auth" && authUser == null) {
      router.replace("/login");
    } else {
      setUserAuth(authUser);
      setInterval(() => {
        setLoading(false);
      }, 500);
    }
    if (middleware === "guest" && authUser?.user !== null && authUser) {
      router.replace("/dashboard");
    }
  }, []);

  if (isLoading) {
    return <Loader />;
  } else {
    return (
      <div>
        <Head>
          <title>{title || "Toska"}</title>
        </Head>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <div className="pt-5 flex-grow relative md:pt-10">{children}</div>
        </div>
        <footer className="mt-10 p-3 bg-white text-center">
          Copyright @Mahesadev 2022
        </footer>
      </div>
    );
  }
};

export default dynamic(() => Promise.resolve(Layout), {
  ssr: false,
});
