import { question } from "./util";

export async function getEmailPassword() {
  const email = await question("CKAL email: ");
  const password = await question("Password: ");

  return { email, password };
}
