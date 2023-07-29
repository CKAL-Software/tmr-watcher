export const CREDENTIALS_KEY = "credentials";
export const AWS_CLIENT_ID = "6nki0f24aj9hrvluekbmkea631";
export const BUCKET_URL =
  "https://trackmania-registry.s3.eu-west-1.amazonaws.com";

export interface Ghost {
  time: number;
  fileName: string;
  lastUpdated: number;
}

export interface Track {
  name: string;
  records: Record<string, Ghost>;
  lastUpdated?: number;
  fileName?: string;
  excluded: boolean;
  diff?: { ms: number; percentage: number };
}
