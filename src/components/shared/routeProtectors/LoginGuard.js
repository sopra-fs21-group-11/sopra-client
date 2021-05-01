import React from "react";
import { Redirect } from "react-router-dom";
import {authJwtToken} from "../../../helpers/authJWT";

/**
 *
 * Another way to export directly your functional component.
 */
export const LoginGuard = props => {
  if (!authJwtToken()) {
    return props.children;
  }
  // if user is already logged in, redirects to the main /app
  return <Redirect to={"/mainView"} />;
};
