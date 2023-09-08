# Frontend

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.0.1.

## Development policies (**IMPORTANT TO FOLLOW**)

* File naming (and other types of naming): This project generally follows the rules proposed by angular themselves [here](https://angular.io/guide/styleguide#naming), so **please** do give the guidelines a glance, there's reasons for why following a convention and keeping consistency does great work for the team.
* Naming convention for code: camelCase.
* The use of **Route Guards** and **Resolvers** is a must if a route contains any sort of data that is either fetched or passed on by some mean, such as a query url parameter, regular parameter, or from an API.
* **Route Guards** and **Resolvers** should be contained in their own scope, for example a **Guard** that is used globally in different components should be defined in `src/app/guards/`, while the ones that are used exclusively by a component should be defined within their own directory, let's say `src/app/components/card-viewer/` as an example.
* The last point does not only apply to **Guards** and **Resolvers**, interfaces, services, and such other files should follow the same rule.
* Pull requests are encouraged, and quality checking is a must. A codebase is a thing that extends as time goes on, let's keep keep it healthy.

## NPM scripts

```bash
# run in development mode
$ npm run start

# run in production mode
$ npm run start:prod

# build (The build artifacts will be stored in dist/)
$ npm run build

# build as you develop
$ npm run watch

# test execute the unit tests via Karma
$ npm run test
```

---

## Project's layout

![AI-Auth](./docs/ai-auth.png)

### Folder structure

The following is a reduced version of the project's folder structure, it contains the key folders in order to understand more clearly how the application works.

```bash
ai-authentication
└── src
    └── app
        ├── core
        │   └── services
        └── pages
            ├── showcase
            │   └── pages
            └── error
```

* `app/pages`: As the name suggests it holds the pages for our `app-routing.module` routes, inside of it we have our `showcase` folder that in itself also has its own routing module.
* `core`: Folder where singleton services are defined and used across all components.