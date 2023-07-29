import { question } from "./util";

export async function getEmailPassword() {
  const email = question("CKAL email: ");
  const password = question("Password: ", true);

  return { email, password };
}
