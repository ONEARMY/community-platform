import inquirer from "inquirer";

/**
 * Provide an interactive list of cli options for a user to selet from
 * @returns value of chosen option
 * @param choices array of string/number options, or object with name
 * (what is displayed), and value (what is returned)
 * @param message main text that appears above options
 */
export async function promptOptions(
  choices: string[] | { name: string; value: string }[] = [],
  message = "Select an option"
) {
  const res = await inquirer.prompt([{ type: "list", name: "selected", message, choices }]);
  return res.selected;
}