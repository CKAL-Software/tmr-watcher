import promptImport from "prompt-sync";

const prompt = promptImport({ sigint: true });

export function getEmailPassword() {
  const email = prompt("CKAL email: ");
  const password = prompt("Password: ", { echo: "*" });

  return { email, password };
}
