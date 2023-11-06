### Assignment Notes:
How to run App:

```sh
npm install
```
After node-modules installation:

```sh
npm run dev
```

Home page will be shown which contains the same todo app from the first assignment.\
To view 2nd assignment i.e. Products page, Please click on the Products Page button on top right.
This will take you to the products page.\\

Note: This app contains third party libraries from first assignment , but none of them is used in 2'nd assignment.

All the features are built from the scratch such as :
1. Image zoom feature
2. Sliding feature for Mobile
3. Slide(using arrows) feature for Desktop
4. Tap feature for Mobile
5. Popup feature
6. Tabs feature.

The touch slide feature can be best tested in mobile devices. The vite config has been modified to allow host exposure.\
To view the app in a mobile device in same network, Please do as follows:
Execute 
```sh
npm run dev --host
```

In your mobile device, try loading the Network url from the terminal.

The 2'nd assignment changes are specifically present in the **feature/product-page** branch.
Videos were not available in the mentioned assets folder , that is why it is not being used.
The tabs will clearly show a videos tab.

Please let me know for any questions/issues/missing reuirements regarding this app.
I will be more than happy to expand/update it as per your needs :)

# General instructions below


# Todo-app

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
npm run build
npm run test:e2e
```
