# Tellius ngApp

[![Build Status](https://travis-ci.com/Tellius/Angular_Project.svg?token=Y3qMcTdszCddWKB8sceM&branch=master)](https://travis-ci.com/Tellius/Angular_Project)

### Instalation

- `npm install`

> Please, use latest version of Node.js (5.7)


Development: `npm run dev-fast`

Build: `npm build`

Tests: `npm test`

### Tech stack:
- Angular 1.5
- ES2015
- John Papa's style guide principles (encapsulation, low coupling)
- webpack (ES6 modules)
- Gulp
- ESLint
- Karma, Mocha, Chai
- Stylus
- Stylint
- Jade

### File structure:
- config
- interceptors
- helpers
- constants
- services
- view_models
- api
- components

### Component
Components are reusable UI elements. We able to use them in the view models. They built on top of Angular directives with isolated scope. This simplifies testing and maintenance. Also, they include styles, templates and of course unit tests.

### View Model
Frankly, it is a route config+controller+template. The main difference is that controller and template is a directive. Thanks to this we avoid problems with a scope hell. View Models are nested. An example can be seen on Github.

### Services
This is a place for stores such as DatasetStorageService or AuthService.

### API
I use the api wrapper for encapsulation. Api models aggregate the wrapper and has their own custom methods such as queryRequest or renameColumn. This approach is much more convenient for business logic in the components and view models.
