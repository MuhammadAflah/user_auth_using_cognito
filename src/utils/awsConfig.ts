export const awsConfig: any = {
  Auth: {
    Cognito: {
      userPoolClientId: import.meta.env.VITE_USER_POOL_CLIENT_ID,
      userPoolId: import.meta.env.VITE_USER_POOL_ID,
      loginWith: {
        oauth: {
          domain: import.meta.env.VITE_COGNITO_DOMAIN,
          scopes: ["email openid phone "],
          redirectSignIn: ["http://localhost:5173/"],
          redirectSignOut: ["http://localhost:5173/"],
          responseType: "code",
        },
      },
    },
  },
};
