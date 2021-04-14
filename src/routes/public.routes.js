import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

//pub routes
import SignIn from "../pages/SignIn";
import ForgotPassword from "../pages/ForgotPassword";
import PasswordReset from "../pages/PasswordReset";

export default function PublicRoutes() {
  return (
    <Switch>
      <Route path="/login" component={SignIn} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/password-reset" component={PasswordReset} />

      <Redirect to="/login" />
    </Switch>
  );
}
