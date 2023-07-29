import { hiddenQuestion, question } from "./util";

export async function getEmailPassword() {
  const email = await question("CKAL email: ");
  const password = await hiddenQuestion("Password: ");

  return { email, password };
}
