# Banka-1-Frontend
This is the frontend repository for the Banka-1 project, built with React, JavaScript, React Router and Axios.
## Prerequisites
Before you start, ensure you have installed the following on your computer:

- **[Node.js](https://nodejs.org/en/) (LTS version recommended)**
- **[npm](https://www.npmjs.com) (comes with Node.js)**
-  **[Docker](https://www.docker.com/products/docker-desktop/) OR [Podman](https://podman.io/docs/installation) OR [LazyDocker + WSL]If you are using LazyDocker + WSL you know what to do already**

Once Node.js and npm are setup, you will need to install the following packages globally:

- **React Router**
- **Axios**
- **Material-UI**

## Running the app:
### First make sure to install all dependencies:
```<bash>
npm install
```
### Second run the back using the command:
```<bash>
docker compose up -d --pull always
```
Or if using podman
```<bash>
podman compose up -d --pull always
```
### Third start the local development server:
```<bash>
npm start
```
### Tests will be ran automaticly when commiting using husky. Or you can manually run them using:
```<bash>
npx cypress run
```

## Make sure to write your own simple e2e cypress tests.

# Project organization:
```
public                <- Static files served directly
│   ├── favicon.ico   <- Browser tab icon
│   ├── index.html    <- Main HTML file for React app
│   └── manifest.json <- PWA settings and metadata
src
│
├── components          <- Reusable UI components
│   └── Common           <- Shared components used across multiple pages
│
├── layouts             <- Layout components for consistent page structure
│   └── MainLayout.jsx
│
├── pages               <- Top-level views or screens for routing
│   └── Home.jsx
│   └── NotFound.jsx
│
├── hooks               <- Custom React hooks
│   └── useFetch.js
│
├── services            <- API services and third-party integrations
│   └── api.js
│
├── context             <- React Context API for global state management
│   └── AuthContext.jsx
│
├── utils               <- Utility functions and helpers
│   └── dateFormatter.js
│
├── styles              <- Global styles and variables
│   ├── variables.css
│   └── global.css
│
├── App.js              <- Main app component with routing setup
└── index.js            <- ReactDOM render entry point
```
# Naming Conventions

## ‼️ DO NOT USE ANY LANGUAGE THAT IS NOT ENGLISH ‼️

### Directory and File names:
- **Directory names** should use ```camelCase``` for all directory names. (First letter lower and every new word letter upper case **without spaces**)
    - Examples: ```components, hooks, applicationUtils```
- **File names** should use ```PascalCase```. (Similar to camelCase but the first letter is also upper case).
    - Examples: ```NavBar.jsx, UserProfile.jsx```
- **Test Files** should be followed with ```.test.js``` suffix
- **Hook files** should start with ```use``` and use ```camelCase```.
    - Examples: ```useAuth.js, useFetch.js```
- **Stylesheets** should match the component name in the first section and be followed by ```.module.css```
    - Examples: ```Button.module.css, NavBar.module.css```
### Components 
- **Components** should also use ```PascalCase```, the same as the component file names are.
    - Examples: ```<UserProfile />, <NavBar />```
### Variables, Constants, Functions and Events
- **All of the variables** should use ```camelCase```.
    - Examples: ```userData, isLoading, handleClick```
- **Constants** should use ```UPPER_SNAKE_CASE``` (All letters uppercase wit _ inbetween the words instead of spaces).
    - Examples: ```API_URL, MAX_Rgit remote -vETRIES```
- **Functions** should use ```camelCase``` (ofc followed by ```()```)
- **Events** should use ```handle``` keyword followed by the name in ```PascalCase```
    - Examples: ```handleClick(), handleSubmit(), handleChange()```
### CSS Names
- **CSS Modules** should use ```PascalCase``` for the main container and ```camelCase``` for internals.
    - Examples: 
        ```<css>
        /* Button.module.css */
        .Button {
        /* Main component container */
        }
        .primary {
        /* Variant Class */
        }
        ```
- **Global Styles** should use ```kebab-case``` (for globally defined classes use all lower case letters with ```-``` isntead of spaces).

# Starting the backend

To properly run the backend, you need to have Docker installed.

In the backend project run:

```shell
docker compose -f compose.full.yaml up -d
```


# React info: Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

#### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

#### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

#### Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

#### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

#### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

#### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

#### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

#### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

#### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
