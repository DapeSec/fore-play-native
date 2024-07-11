import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest, useAutoDiscovery } from 'expo-auth-session';
import { Button, Platform } from 'react-native';


WebBrowser.maybeCompleteAuthSession();


export default function App() {
  // Endpoint
  const discovery = useAutoDiscovery('https://dev-21624059.okta.com/oauth2/default');
  // Request
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: '0oai9j6z6wJowU9QQ5d7',
      scopes: ['openid', 'profile'],
      redirectUri: makeRedirectUri({
        native: 'http://localhost:8081/',
      }),
    },
    discovery
  );

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
    }
  }, [response]);

  return (
    <Button
      disabled={!request}
      title="Login"
      onPress={() => {
        promptAsync();
      }}
    />
  );
}