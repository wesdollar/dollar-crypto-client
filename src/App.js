import { useState, useEffect } from "react";
import styled from "styled-components";
import { Dashboard } from "@wesdollar/dollar-ui.views.dashboard";
import { Github } from "@wesdollar/dollar-ui.auth.github";
import { LogoPngMd } from "@wesdollar/dollar-crypto.logo.logo-png-md";
import { Space } from "@wesdollar/dollar-ui.ui.space";
import { Button } from "@wesdollar/dollar-crypto.dollar-crypto.ui.buttons.button";
import { SetKeys } from "@wesdollar/dollar-crypto.dollar-crypto.views.set-keys";

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

const Container = styled.div`
  display: grid;
  place-items: center;
  margin: auto;
`;

const LogoContainer = styled.div`
  grid-row: 1;

  img {
    width: 124px;
    height: 124px;
  }
`;

const FlexContainer = styled.div`
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
  align-content: center;
`;

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
  /* eslint-enable */

  useEffect(
    () =>
      process.env.REACT_APP_DEBUG &&
      console.log("auth user", authenticatedUser),
    [authenticatedUser]
  );

  useEffect(() => {
    setIsFetching(true);

    const callGetUserDetails = async () => {
      const response = await fetch(
        `${apiUrl}/users?token=${authenticatedUser}`
      );
      const json = await response.json();

      if (Object.keys(json).length) {
        setUserDetails(json);

        if (!json.cbKey || !json.cbSecret) {
          setDisplaySetCreds(true);
          setIsFetching(false);
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
        `${apiUrl}/profits?token=${authenticatedUser}`
      );
      const json = await response.json();

      if (Object.keys(json).length) {
        setProfits(json);
        setIsFetching(false);
      }
    };

    if (
      Object.keys(userDetails).length &&
      userDetails.cbKey &&
      userDetails.cbSecret &&
      userIsAuthenticated
    ) {
      callProfits();
    }
  }, [userDetails, authenticatedUser, userIsAuthenticated]);

  const handleSaveKeys = async () => {
    const cbKey = document.querySelector("#key").value;
    const cbSecret = document.querySelector("#secret").value;

    const response = await fetch(`${apiUrl}/set-keys`, {
      method: "POST",
      body: JSON.stringify({
        cbKey,
        cbSecret,
        token: authenticatedUser,
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
      <FlexContainer>
        <Container>
          <LogoContainer>
            <LogoPngMd />
          </LogoContainer>
          <Space height="80px" />
          <Github
            apiKey={REACT_APP_GOOGLE_API_KEY}
            authDomain={REACT_APP_GOOGLE_AUTH_DOMAIN}
            projectId={REACT_APP_GOOGLE_PROJECT_ID}
            storageBucket={REACT_APP_GOOGLE_STORAGE_BUCKET}
            messagingSenderId={REACT_APP_GOOGLE_MESSAGING_SENDER_ID}
            appId={REACT_APP_GOOGLE_APP_ID}
            measurementId={REACT_APP_GOOGLE_MEASUREMENT_ID}
            setAuthenticatedUser={setAuthenticatedUser}
            setUserIsAuthenticated={setUserIsAuthenticated}
            setAuthErrors={setAuthErrors}
            setAuthResult={setAuthResult}
            ButtonOverride={Button}
          />
        </Container>
      </FlexContainer>
    );
  }

  return <Dashboard isLoading={isFetching} profitsResource={profits} />;
}

export default App;
