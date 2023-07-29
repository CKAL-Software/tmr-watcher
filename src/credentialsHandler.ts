import { CognitoIdentityProvider } from "@aws-sdk/client-cognito-identity-provider";
import { AWS_CLIENT_ID, CREDENTIALS_KEY } from "./definitions";
import { Credentials } from "./models";
import { load, store } from "./storage";
import { getEmailPassword } from "./promptLogin";
const Cognito = new CognitoIdentityProvider({ region: "eu-west-1" });

export function logout() {
  store(CREDENTIALS_KEY, undefined);
}

export async function login() {
  const { email, password } = await getEmailPassword();

  try {
    const response = await Cognito.initiateAuth({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: AWS_CLIENT_ID,
      AuthParameters: {
        USERNAME: email.replaceAll(" ", ""),
        PASSWORD: password,
      },
    });

    if (!response.AuthenticationResult) {
      console.log("An error occurred");
      return;
    }

    store(CREDENTIALS_KEY, {
      ...response.AuthenticationResult,
      ExpirationTimestamp: Math.round(
        new Date().getTime() / 1000 + response.AuthenticationResult.ExpiresIn!
      ),
    });
  } catch {
    console.log("Invalid login, try again");
    await login();
    return;
  }
}

export async function getAccessToken(): Promise<string> {
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
    await login();
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
