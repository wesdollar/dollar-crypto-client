import { useState, useEffect } from "react";
import styled from "styled-components";
import { Dashboard } from "@wesdollar/dollar-ui.views.dashboard";
import { Github } from "@wesdollar/dollar-ui.auth.github";
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

const Container = styled.div`
  display: ${({ githubMounted }) => (!githubMounted ? "none" : "inherit")};
`;

function App() {
  const [isFetching, setIsFetching] = useState(true);
  const [profits, setProfits] = useState({});
  const [authentiatedUser, setAuthenticatedUser] = useState({});
  const [userIsAuthenticated, setUserIsAuthenticated] = useState(false);
  const [authErrors, setAuthErrors] = useState();
  const [authResult, setAuthResult] = useState();
  const [githubMounted, setGithubMounted] = useState(false);

  useEffect(() => console.error("auth errors", authErrors), [authErrors]);
  useEffect(() => console.log("auth result", authResult), [authResult]);

  useEffect(() => {
    const callProfits = async () => {
      const response = await fetch(process.env.REACT_APP_API_URL);
      const json = await response.json();

      if (Object.keys(json).length) {
        setProfits(json);
        setIsFetching(false);
      }
    };

    if (Object.keys(authentiatedUser).length) {
      callProfits();
    }
  }, [authentiatedUser]);

  if (!userIsAuthenticated) {
    return (
      <Container githubMounted={githubMounted}>
        <Space height="40px" />
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
          componenentMounted={setGithubMounted}
        />
      </Container>
    );
  }

  return <Dashboard isLoading={isFetching} profitsResource={profits} />;
}

export default App;
