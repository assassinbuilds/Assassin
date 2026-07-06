import { StrictMode, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { ClerkProvider } from "@clerk/react";
import { dark } from '@clerk/themes';
import App from "./App.tsx";
import "./index.css";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const isProductionMode = import.meta.env.MODE === "production";
const isLiveClerkKey = PUBLISHABLE_KEY?.startsWith("pk_live_");

const renderConfigurationError = (message: ReactNode) => {
  createRoot(document.getElementById("root")!).render(
    <div style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0a0a0b',
      color: 'white',
      fontFamily: 'sans-serif',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{ color: '#ef4444', marginBottom: '16px' }}>Configuration Error</h1>
      <p style={{ maxWidth: '540px', lineHeight: '1.6', color: '#a1a1aa' }}>
        {message}
      </p>
    </div>
  );
};

if (!PUBLISHABLE_KEY) {
  // Graceful fail for production if user hasn't set env vars yet
  renderConfigurationError(
    <>
      The <b>VITE_CLERK_PUBLISHABLE_KEY</b> is missing. <br /><br />
      Add your Clerk publishable key to the environment before running the app.
    </>
  );
// Allow test keys in production for hackathon deployments
// (Removed the block that checks isProductionMode && !isLiveClerkKey)
} else {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <ClerkProvider 
        publishableKey={PUBLISHABLE_KEY} 
        afterSignOutUrl="/" 
        appearance={{
          baseTheme: dark,
          elements: {
            modalCloseButton: {
              border: 'none',
              boxShadow: 'none',
            },
          },
        }}
      >
        <App />
      </ClerkProvider>
    </StrictMode>
  );
}
