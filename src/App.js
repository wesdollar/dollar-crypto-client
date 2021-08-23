import { useState, useEffect } from "react";
import { Dashboard } from "@wesdollar/dollar-ui.views.dashboard";

function App() {
  const [isFetching, setIsFetching] = useState(true);
  const [profits, setProfits] = useState({});

  useEffect(() => {
    const callProfits = async () => {
      const response = await fetch(process.env.REACT_APP_API_URL);
      const json = await response.json();

      if (Object.keys(json).length) {
        setProfits(json);
        setIsFetching(false);
      }
    };

    callProfits();
  }, []);

  return <Dashboard isLoading={isFetching} profitsResource={profits} />;
}

export default App;
