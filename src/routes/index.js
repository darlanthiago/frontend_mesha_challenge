import React, { lazy, Suspense } from "react";

import { useReactAuth } from "../contexts/hooks/AuthContext";
import Loading from "../components/Loading";

import AuthLayout from "../pages/_layouts/auth";
import DefaultLayout from "../pages/_layouts/default";

const PrivateRoutes = lazy(() => import("./app.routes"));
const PublicRoutes = lazy(() => import("./public.routes"));

function Routes() {
  const { signed, loading } = useReactAuth();

  const Layout = signed ? DefaultLayout : AuthLayout;

  if (loading) {
    return <Loading />;
  }

  return signed ? (
    <Suspense fallback={<Loading />}>
      <Layout>
        <PrivateRoutes />
      </Layout>
    </Suspense>
  ) : (
    <Suspense fallback={<Loading />}>
      <Layout>
        <PublicRoutes />
      </Layout>
    </Suspense>
  );
}

export default Routes;
