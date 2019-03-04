import { isEmpty } from "lodash";

//Verify if the user is already logged, if true, send to 'user'.
export const verifyAuthentication = (user, history, currentPageName) => {
  if (isEmpty(user)) {
    history.push({
      pathname:
        currentPageName === "/login"
          ? "/login"
          : currentPageName === "/register"
          ? "/register"
          : currentPageName === "/recoverPassword"
          ? "/recoverPassword"
          : "/login",
      state: {
        previusPage: currentPageName === "/login" ? null : currentPageName
      }
    });
  } else {
    history.push("/user");
  }
};
