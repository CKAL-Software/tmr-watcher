import { CognitoIdentityProvider } from "@aws-sdk/client-cognito-identity-provider";
import { AWS_CLIENT_ID, CREDENTIALS_KEY } from "./definitions";
import { Credentials } from "./models";
import { load, store } from "./storage";
import { getEmailPassword } from "./promptLogin";
const Cognito = new CognitoIdentityProvider({ region: "eu-west-1" });

export async function login(email: string, password: string) {
  const response = await Cognito.initiateAuth({
    AuthFlow: "USER_PASSWORD_AUTH",
    ClientId: AWS_CLIENT_ID,
    AuthParameters: { USERNAME: email.replaceAll(" ", ""), PASSWORD: password },
  });

  if (!response.AuthenticationResult) {
    throw new Error("An unexpected error occurred");
  }

  store(CREDENTIALS_KEY, {
    ...response.AuthenticationResult,
    ExpirationTimestamp: Math.round(
      new Date().getTime() / 1000 + response.AuthenticationResult.ExpiresIn!
    ),
  });
}

export async function getAccessToken() {
  try {
    let credentials: Credentials | null;

    credentials = load(CREDENTIALS_KEY);

    if (!credentials) {
      console.log("Missing credentials");
      throw new Error();
    }

    if (isAccessTokenOld(credentials)) {
      try {
        credentials = await refreshCredentials(credentials.RefreshToken!);
        store(CREDENTIALS_KEY, credentials);
      } catch (error) {
        console.log(error);
        throw new Error();
      }
    }

    return credentials.AccessToken + "";
  } catch {
    const { email, password } = getEmailPassword();
    await login(email, password);
    return getAccessToken();
  }
}

export async function refreshCredentials(
  refreshToken: string
): Promise<Credentials> {
  const response = await Cognito.initiateAuth({
    AuthFlow: "REFRESH_TOKEN",
    ClientId: AWS_CLIENT_ID,
    AuthParameters: {
      REFRESH_TOKEN: refreshToken,
    },
  });

  if (!response.AuthenticationResult) {
    throw new Error();
  }

  return {
    ...response.AuthenticationResult,
    RefreshToken: refreshToken,
    ExpirationTimestamp: Math.round(
      new Date().getTime() / 1000 + response.AuthenticationResult.ExpiresIn!
    ),
  };
}

export function isAccessTokenOld(credentials: Credentials) {
  return credentials.ExpirationTimestamp - new Date().getTime() / 1000 < 300;
}

export async function clearCredentials() {
  store(CREDENTIALS_KEY, "");
}
