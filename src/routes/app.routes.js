import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import User from "../pages/User";
import UserView from "../pages/User/view";
import UserCreate from "../pages/User/create";
import Services from "../pages/Services";
import ServicesCreate from "../pages/Services/create";

export default function PrivateRoutes() {
  return (
    <Switch>
      <Route exact path="/" component={Home} />

      <Route path="/dashboard" component={Dashboard} />

      <Route path="/user" component={User} />
      <Route path="/user-view/:id" component={UserView} />
      <Route path="/user-create" component={UserCreate} />

      <Route path="/service" component={Services} />
      <Route path="/service-create" component={ServicesCreate} />

      <Redirect to="/" />
    </Switch>
  );
}
