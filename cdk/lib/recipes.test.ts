import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { prodProps } from "../bin/cdk";
import { Recipes } from "./recipes";

describe("The Recipes stack", () => {
  it("matches the snapshot", () => {
    const app = new App();
    const stack = new Recipes(app, "Recipes", prodProps);
    const template = Template.fromStack(stack);
    expect(template.toJSON()).toMatchSnapshot();
  });
});
