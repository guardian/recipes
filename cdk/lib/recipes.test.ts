import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { Recipes } from "./recipes";

describe("The Recipes stack", () => {
  it("matches the snapshot", () => {
    const app = new App();
    const stack = new Recipes(app, "Recipes", { stack: "playground", stage: "TEST" });
    const template = Template.fromStack(stack);
    expect(template.toJSON()).toMatchSnapshot();
  });
});
