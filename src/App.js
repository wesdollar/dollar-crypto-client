import { useState, useEffect } from "react";
import styled from "styled-components";
import { Dashboard } from "@wesdollar/dollar-ui.views.dashboard";
import { SetKeys } from "@wesdollar/dollar-crypto.dollar-crypto.views.set-keys";
import { Login } from "@wesdollar/dollar-crypto.dollar-crypto.views.login";
import { Loading } from "@wesdollar/dollar-ui.ui.loading";
import { getAuth, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { Space } from "@wesdollar/dollar-ui.ui.space";

const {
  REACT_APP_GOOGLE_API_KEY,
  REACT_APP_GOOGLE_AUTH_DOMAIN,
  REACT_APP_GOOGLE_PROJECT_ID,
  REACT_APP_GOOGLE_STORAGE_BUCKET,
  REACT_APP_GOOGLE_MESSAGING_SENDER_ID,
  REACT_APP_GOOGLE_APP_ID,
  REACT_APP_GOOGLE_MEASUREMENT_ID,
} = process.env;

const { REACT_APP_API_URL: apiUrl } = process.env;

const FlexContainer = styled.div`
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
  align-content: center;
`;

const firebaseConfig = {
  apiKey: REACT_APP_GOOGLE_API_KEY,
  authDomain: REACT_APP_GOOGLE_AUTH_DOMAIN,
  projectId: REACT_APP_GOOGLE_PROJECT_ID,
  storageBucket: REACT_APP_GOOGLE_STORAGE_BUCKET,
  messagingSenderId: REACT_APP_GOOGLE_MESSAGING_SENDER_ID,
  appId: REACT_APP_GOOGLE_APP_ID,
  measurementId: REACT_APP_GOOGLE_MEASUREMENT_ID,
};

function App() {
  /* eslint-disable no-unused-vars */
  const [profits, setProfits] = useState({});
  const [authenticatedUser, setAuthenticatedUser] = useState({});
  const [userIsAuthenticated, setUserIsAuthenticated] = useState(false);
  const [authErrors, setAuthErrors] = useState();
  const [authResult, setAuthResult] = useState();
  const [userDetails, setUserDetails] = useState({});
  const [displaySetCreds, setDisplaySetCreds] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [profitsCalled, setProfitsCalled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loggedOut, setLoggedOut] = useState(false);
  const [auth, setAuth] = useState();
  /* eslint-enable */

  useEffect(() => {
    initializeApp(firebaseConfig);
    setAuth(getAuth());
  }, []);

  useEffect(() => {
    setUserIsAuthenticated(false);
  }, [loggedOut]);

  useEffect(() => {
    const callGetUserDetails = async () => {
      setIsLoading(true);
      console.log(loggedOut);
      if (authenticatedUser.accessToken && !loggedOut) {
        const response = await fetch(
          `${apiUrl}/users?token=${authenticatedUser.accessToken}`
        );
        const user = await response.json();

        if (user && Object.keys(user).length) {
          setUserDetails(user);
          setIsLoading(false);

          if ((!user.cbKey || !user.cbSecret) && !user.status === 401) {
            setDisplaySetCreds(true);
          }

          if (user.status === 401) {
            setIsLoading(false);
          }
        }
      } else {
        setIsLoading(false);
      }
    };

    if (userIsAuthenticated && !loggedOut) {
      callGetUserDetails();
    }
  }, [userIsAuthenticated, authenticatedUser, displaySetCreds, loggedOut]);

  useEffect(() => {
    if (loggedOut) {
      setIsLoading(false);
    }
  }, [loggedOut]);

  useEffect(() => {
    const callProfits = async () => {
      setIsLoading(true);
      const response = await fetch(
        `${apiUrl}/profits?token=${authenticatedUser.accessToken}`
      );
      const json = await response.json();
      setIsLoading(false);

      if (Object.keys(json).length) {
        setProfits(json);
      }
    };

    if (
      Object.keys(userDetails).length &&
      userDetails.cbKey &&
      userDetails.cbSecret &&
      userIsAuthenticated &&
      !profitsCalled
    ) {
      callProfits();
      setProfitsCalled(true);
    }
  }, [userDetails, authenticatedUser, userIsAuthenticated, profitsCalled]);

  const handleSaveKeys = async () => {
    const cbKey = document.querySelector("#key").value;
    const cbSecret = document.querySelector("#secret").value;

    const response = await fetch(`${apiUrl}/set-keys`, {
      method: "POST",
      body: JSON.stringify({
        cbKey,
        cbSecret,
        token: authenticatedUser.accessToken,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.status === 200) {
      setDisplaySetCreds(false);
      setIsLoading(true);
    } else {
      setValidationErrors(response.error);
    }
  };

  if (displaySetCreds) {
    return (
      <FlexContainer>
        <SetKeys onSave={handleSaveKeys} />
      </FlexContainer>
    );
  }

  if (!userIsAuthenticated && auth) {
    return (
      <Loading isLoading={isLoading}>
        <Login
          setAuthResult={setAuthResult}
          setAuthErrors={setAuthErrors}
          setUserIsAuthenticated={setUserIsAuthenticated}
          setAuthenticatedUser={setAuthenticatedUser}
          auth={auth || ""}
          loggedOut={loggedOut}
        />
      </Loading>
    );
  }

  const handleSignOut = () => {
    console.log(auth);
    signOut(auth)
      .then(() => {
        console.log("user logged out");
        setUserIsAuthenticated(false);
        setAuthenticatedUser({});
        setUserDetails({});
        setLoggedOut(true);
      })
      .catch((error) => {
        console.log("logout failed:", error);
      });
  };

  if (auth) {
    return (
      <Dashboard
        isLoading={isLoading}
        profitsResource={profits}
        auth={auth}
        setUserIsAuthenticated={setUserIsAuthenticated}
        setAuthenticatedUser={setAuthenticatedUser}
        setUserDetails={setUserDetails}
        setLoggedOut={setLoggedOut}
        handleSignOut={handleSignOut}
      />
    );
  }

  return <Space />;
}

export default App;
