# CS 534 Final Project

Creating an agent that plays the game Jotto

## How to build and run

Install node.js and npm on your system, then do:

```
$ npm install
```

This command should install all the necessary dependencies. This project is
written in TypeScript, a strongly typed superset of regular JavaScript. You can
compile and run the TypeScript like this:

```
$ npm run build
$ node build/main.js
```

You can also compile a version for use in a browser, and serve it locally:

```
$ npm run build-web
$ npm run serve
```

Then navigate your browser to `http://localhost:3900/jotto/` to play it.

Here are all the npm scripts available:

  - `$ npm run build` compiles to JavaScript that will run with `node` in the
    `build` directory
  - `$ npm run build-web` compiles to JavaScript that will run in a browser
    in the `public_html` directory
  - `$ npm run lint` lints all TypeScript files, fixing simple errors and
    warning about others
  - `$ npm run test` run unit tests
  - `$ npm run serve` starts a web server that serves the `public_html`
    directory
  - `$ npm run clean` remove compiled JavaScript files
