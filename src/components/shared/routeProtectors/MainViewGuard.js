import React from "react";
import { Redirect } from "react-router-dom";
import {authJwtToken} from "../../../helpers/authJWT";

/**
 *
 * Another way to export directly your functional component.
 */
export const MainViewGuard = (props) => {
  if (authJwtToken()) {
    return props.children;
  }
  return <Redirect to={"/login"} />;
};
