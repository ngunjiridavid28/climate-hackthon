import {StrictMode, useState, useEffect} from 'react';
import {createRoot} from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { LoadingProvider } from './contexts/LoadingContext.tsx';
import { SplashScreen } from './components/SplashScreen.tsx';
import App from './App.tsx';
import './index.css';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "your-google-client-id.apps.googleusercontent.com";

function RootApp() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Show splash screen for minimum 2 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <StrictMode>
      <GoogleOAuthProvider clientId={googleClientId}>
        <LoadingProvider>
          <SplashScreen isVisible={showSplash} />
          {!showSplash && <App />}
        </LoadingProvider>
      </GoogleOAuthProvider>
    </StrictMode>
  );
}

createRoot(document.getElementById('root')!).render(<RootApp />);
