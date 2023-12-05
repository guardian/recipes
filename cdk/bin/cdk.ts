import "source-map-support/register";
import { GuRoot } from "@guardian/cdk/lib/constructs/root";
import { Recipes } from "../lib/recipes";

const app = new GuRoot();
export const prodProps = {
  stack: "playground",
  stage: "PROD",
  env: { region: "eu-west-1" },
  withBackup: true,
};
new Recipes(app, "Recipes-euwest-1-PROD", prodProps);
