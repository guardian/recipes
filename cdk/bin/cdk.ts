import 'source-map-support/register';
import { GuRoot } from '@guardian/cdk/lib/constructs/root';
import { RecipesStack } from '../lib/recipes';

const stack = 'playground';

const app = new GuRoot();

const sharedProps = {
  stack,
  env: { region: 'eu-west-1' },
};

export const prodProps = {
  ...sharedProps,
  stage: 'PROD',
  withBackup: true,
  domainName: 'recipes.gutools.co.uk',
};

export const codeProps = {
  ...sharedProps,
  stage: 'CODE',
  withBackup: false,
  domainName: 'recipes.code.dev-gutools.co.uk',
};

new RecipesStack(app, 'Recipes-euwest-1-PROD', prodProps);
new RecipesStack(app, 'Recipes-euwest-1-CODE', codeProps);
