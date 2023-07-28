import { CognitoIdentityServiceProvider } from "aws-sdk";

export interface UserInfo {
  email: string;
  firstname: string;
  lastname: string;
  nickname: string;
}

export interface Credentials
  extends CognitoIdentityServiceProvider.AuthenticationResultType {
  ExpirationTimestamp: number;
}
