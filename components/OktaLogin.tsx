import React, { useEffect } from 'react';

import { useStorageState } from '../hooks/useStorageState';

import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest, useAutoDiscovery } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

const AuthContext = React.createContext<{
  signIn: () => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
});

export function generateNonce() {
  const randomBytes = new Uint8Array(32);
  const nonce = randomBytes.toString();
  return nonce;
}

// This hook can be used to access the user info.
export function useSession() {
  const value = React.useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }

  return value;
}

export function SessionProvider(props: React.PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('session');
  
  // Endpoint
  const discovery = useAutoDiscovery('https://dev-21624059.okta.com/oauth2/default');
  // Request
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: '0oai9j6z6wJowU9QQ5d7',
      scopes: ['openid'],
      responseType: 'id_token',
      redirectUri: makeRedirectUri({
        native: 'com.okta.dev-21624059:/callback',
      }),
      extraParams: {
        nonce: generateNonce(), // Function to generate a unique nonce
      },
    },
    discovery
  );
  
  React.useEffect(() => {
    if (response?.type === 'success') {
      // Check if id_token exists before accessing it
      if (response.params?.id_token) {
        const { id_token } = response.params;
        setSession(id_token);
        router.replace('/tee-times');
      } else {
        console.error('id_token is missing from response');
        // Handle the case where id_token is not present
      }
    }
  }, [response]);

  return (
    <AuthContext.Provider
      value={{
        signIn: () => {
          // Perform sign-in logic here
          promptAsync();
        },
        signOut: () => {
          setSession(null);
        },
        session,
        isLoading,
      }}>
      {props.children}
    </AuthContext.Provider>
  );
}
