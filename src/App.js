import { useState, useEffect } from "react";
import styled from "styled-components";
import { Dashboard } from "@wesdollar/dollar-ui.views.dashboard";
import { SetKeys } from "@wesdollar/dollar-crypto.dollar-crypto.views.set-keys";
import { Login } from "@wesdollar/dollar-crypto.dollar-crypto.views.login";
import { Loading } from "@wesdollar/dollar-ui.ui.loading";

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
  const [isFetching, setIsFetching] = useState(true);
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
  /* eslint-enable */

  useEffect(
    () => userIsAuthenticated && setIsLoading(true),
    [userIsAuthenticated]
  );

  useEffect(() => {
    if (process.env.REACT_APP_DEBUG) {
      authenticatedUser.length && console.log("user token:", authenticatedUser);

      Object.keys(userDetails).length &&
        console.log("user details:", userDetails);
    }
  }, [authenticatedUser, userDetails]);

  useEffect(() => {
    setIsFetching(true);

    const callGetUserDetails = async () => {
      const response = await fetch(
        `${apiUrl}/users?token=${authenticatedUser.accessToken}`
      );
      const user = await response.json();

      if (user && Object.keys(user).length) {
        setUserDetails(user);

        if (!user.cbKey || !user.cbSecret) {
          setDisplaySetCreds(true);
          setIsFetching(false);
          setIsLoading(false);
        }
      }
    };

    if (userIsAuthenticated) {
      callGetUserDetails();
    }
  }, [userIsAuthenticated, authenticatedUser, displaySetCreds]);

  useEffect(() => {
    const callProfits = async () => {
      const response = await fetch(
        `${apiUrl}/profits?token=${authenticatedUser.accessToken}`
      );
      const json = await response.json();

      if (Object.keys(json).length) {
        setProfits(json);
        setIsFetching(false);
      }
    };

    console.log("user details:", userDetails);
    console.log("userIsAuth:", userIsAuthenticated);
    console.log("profits called:", profitsCalled);
    console.log("authenticated user:", authenticatedUser);

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

    console.log(authenticatedUser);

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
      setIsFetching(true);
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

  if (!userIsAuthenticated) {
    return (
      <Loading isLoading={isLoading}>
        <Login
          setAuthResult={setAuthResult}
          setAuthErrors={setAuthErrors}
          setUserIsAuthenticated={setUserIsAuthenticated}
          setAuthenticatedUser={setAuthenticatedUser}
          firebaseConfig={firebaseConfig}
        />
      </Loading>
    );
  }

  return <Dashboard isLoading={isFetching} profitsResource={profits} />;
}

export default App;
