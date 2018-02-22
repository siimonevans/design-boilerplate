# Design boilerplate

A starting point for designing and prototyping in the browser with an emphasis on speed and simplicity. The aim is to cater for designers with varying front-end skillsets, while still offering the latest features for those who want them.

:zap: [View the demo](https://sii.im/playground/design-boilerplate/pages/base-components-resizer.html) :zap:

## Features

 - Superfast live reload
 - Dynamic component imports
 - Sass compilation, autoprefixing, minification and linting
 - Mildly-opinionated CSS structure
 - JS module bundling, optimisation and linting
 - 'Easy' JS usage (you don't _have_ to use ES6, modules, etc)
 - YAML data imports
 - Image optimisation
 - Automated upload to staging

## Dependencies

 - Yarn (on OS X install [brew](https://brew.sh) then `brew install yarn`)

## Quick Start

Get started with a new project by running the following commands:

```
$ git clone https://github.com/SimonDEvans/design-boilerplate.git
$ cd design-boilerplate
$ yarn
```

## Local development

Start a local development environment:

```
$ yarn start
```

This will compile files, then start a server at [http://localhost:3000](http://localhost:3000) that will live-reload when changes are detected.

## Build for production

Build assets ready for production:

```
$ yarn build
```

## Assets

### CSS

 - Add and modify styles in `src/assets/styles`
 - Normalize included by default, along with some useful mixins and base styles
 - Most styles should live in the `components` directory 

### JS

 - Add and modify JS in `src/assets/scripts`
 - Scripts can be imported as modules or listed in `main.js`
 - Linting available but not enabled by default

### Images

 - Add and modify images in `src/assets/images`
 - Automatically optimised when production build command is run

### Data

 - Add and modify globally-available data in `src/data`
 - Uses the [YAML format](https://learnxinyminutes.com/docs/yaml/)
 
### Templating

 - Add and modify templates in `src/templates`
 - [Handlebars](http://handlebarsjs.com/) syntax
 - Includes support for partials, helpers, etc
 - Example page and component provided by default
 
## Deploying

You can take advantage of the nodejs package [dploy](https://github.com/LeanMeanFightingMachine/dploy) and upload the `dist` directory to a staging environment. To do so you will need to:

 * Make a copy of `example.dploy.yaml` and name it `dploy.yaml`
 * Modify the `host` `user` and `path.remote` variables
 * Run `yarn deploy` to start the deployment process

## Window resize

A window resize panel is available, but not by default and must be created on a page-by-page basis. To use it:

- Copy and paste the contents of `src/templates/pages/resize-default.html` into a new `pages` file
- Change the `url` data field to match the filename of the page you wish to view in resize mode
- For example, to create a resizable version of `pages/homepage.html`, copy the `resize-default.html` example into a new file called `homepage-resizer.html` (or something sensible) and set `url` to `homepage`
