# Recipes

A Tool to create structured data from recipes on theguardian.com.

This app uses:
- Scala Play
- TypeScript
- ReactJS
- [@guardian/src-*][guardian-source]
- Jest
- EmotionJS
- ParcelJS
- ESLint
- Prettier

## Developing locally
### Install dependencies
- Java: `brew install adoptopenjdk8`
- SBT: `brew install guardian/devtools/gu-scala`
- [dev-nginx]: `brew install guardian/devtools/dev-nginx`
- Node: `brew install node`
- A Node version manager. [fnm] is recommended (you could use [nvm] too, I guess): `brew install Schniz/tap/fnm`

You'll also need to clone [login.gutools] and have it running.

### AWS credentials
We're using [pan-domain-authentication] to handle authentication.
We're only verifying a pan domain cookie. Cookies are issued by [login.gutools].
[login.gutools] requires credentials to access the relevant AWS resources.

Get `composer` and `workflow` credentials from [Janus][janus-credentials].

### Setup
By now you should have all dependencies installed.
We can now setup the project!

- Use [dev-nginx] to create the nginx reverse proxy for the [app in DEV][recipes-dev]: `dev-nginx setup-app nginx/nginx-mapping.yml`
- Install npm packages: `npm ci`

### Running
By now you should have all dependencies installed,
including all npm packages.

We can run the app by running the [start script][file-script-start]:

```bash
./scripts/start
```

This will start the Play server and build the JS app in watch mode.

Once started, we can [open the app][recipes-dev] in a browser.

#### Alternatives
- To only build the js app: `npm run build`
- To only run the server: `sbt run`

### Tests
Run tests using the [test script][file-script-test]:

```bash
./scripts/test
```

This will run the JS tests (using Jest) and Scala tests.
It will also perform the JS linting check.

#### Alternatives
- To only run JS tests: `npm test`
- To only run Scala tests: `sbt test`
- To only run the linter: `npm run lint`
- Run tests as CI would: `./scripts/ci`

### Where is everything?
#### Server side
This is a Scala Play app.
It's usually easiest to start at the [routes file][file-routes].
Otherwise, the [app directory][directory-app] contains the Play app.

#### Client side
This is a ReactJS app, written in TypeScript and using ParcelJS for bundling.

The app is in the [recipes-client directory][directory-client].
ParcelJS will output the built app to Play's [public][directory-public] directory.

## Acknowledgements
- Initial project created using `play-scala-compile-di-example` from [play-samples]
- Inspired by [recipeasy]

<!-- only links below here -->
[dev-nginx]: https://github.com/guardian/dev-nginx
[directory-app]: ./app
[directory-client]: ./recipes-client
[directory-public]: ./public
[file-routes]: ./conf/routes
[file-script-start]: ./scripts/start
[file-script-test]: ./scripts/test
[fnm]: https://github.com/Schniz/fnm
[guardian-source]: https://github.com/guardian/source
[janus-credentials]: https://janus.gutools.co.uk/multi-credentials?&permissionIds=composer-dev,workflow-dev&tzOffset=1
[login.gutools]: https://github.com/guardian/login.gutools
[nvm]: https://github.com/nvm-sh/nvm
[pan-domain-authentication]: https://github.com/guardian/pan-domain-authentication
[play-samples]: https://github.com/playframework/play-samples/tree/2.8.x/play-scala-compile-di-example
[recipeasy]: https://github.com/guardian/recipeasy
[recipes-dev]: https://recipes.local.dev-gutools.co.uk
