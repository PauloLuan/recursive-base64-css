# recursive-base64-css 

Recursive walk through directories and Inline all css images to base64.

[![NPM](https://nodei.co/npm/recursive-base64-css.png)](https://nodei.co/npm/recursive-base64-css/)

[![Build Status](https://travis-ci.org/PauloLuan/recursive-base64-css.svg)](https://travis-ci.org/PauloLuan/recursive-base64-css)

Install this globally and you'll have access to the recursive-base64-css command anywhere on your system.

	npm install -g recursive-base64-css

Then run the command `recursive-base64-css <path>` and the application will create a folder called `output` that will have the same css files as the `<path>` param, but with base64 content on all `url('path')` tags. 

# Development

Install the dependencies:

	npm install

to run test:
``` js
npm test
```

## how to debug the unit tests with mocha:

Install `node-inspector` using npm: `npm install -g node-inspector` 

Run in one terminal:

	node-inspector

and on another terminal run:
	
	mocha --debug-brk

then, visit `http://127.0.0.1:8080/debug?port=5858` to start debugging.

## How to execute the binary as a command line interface: 

	npm link

This will make the module available globally, so now you can use the `recursive-base64-css` command anywhere!