import { Login } from "@wesdollar/dollar-crypto.dollar-crypto.views.login";

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

const firebaseConfig = {
  apiKey: REACT_APP_GOOGLE_API_KEY,
  authDomain: REACT_APP_GOOGLE_AUTH_DOMAIN,
  projectId: REACT_APP_GOOGLE_PROJECT_ID,
  storageBucket: REACT_APP_GOOGLE_STORAGE_BUCKET,
  messagingSenderId: REACT_APP_GOOGLE_MESSAGING_SENDER_ID,
  appId: REACT_APP_GOOGLE_APP_ID,
  measurementId: REACT_APP_GOOGLE_MEASUREMENT_ID,
};

const props = {
  firebaseConfig,
  apiUrl,
};

function App() {
  return <Login {...props} />;
}

export default App;
