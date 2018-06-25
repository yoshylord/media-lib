
# Contributing

## Guiding principles

These principles where used to guide the project, and should be enforced by the team or changed by the team for better
suited principles.

See also:

-   The `/doc` directory for more details.

### Git clone & go

Issuing a `git clone`, `npm install`, and `npm start` should be enough to start the project locally in a dev
environment.

### Config files should be loaded in a single synchronous sequence at server start

It should be easy to know which conf files are loaded, and in what order the conf files are loaded. They should be
loaded in one go at server start, and it is a rare exception where synchronous Node.js calls are allowed.

### HTTP server isolation

Functions responding to HTTP requests should only be dealing with HTTP, they should delegate database & file management
concerns to other services.

### Database client isolation

Functions issuing requests to databases should only be dealing with one database, they should not be aware of HTTP
concerns.

## Automated Test principles

### Git clone & go

Issuing a `git clone`, `npm install`, and `npm test` should be enough to start the unit tests locally in a dev
environment.

### Respect the testing pyramid

There should be more unit tests that integrated tests.

### Unit tests don't use database, filesystem, or network calls

In unit tests (see `/test/unit`), no database, filesystem, or network call is allowed. Please use spies, stubs, and
mocks to isolate the System Under Test (SUT).

##  How to commit and push your modifications

-   Create a branch

    ```
    git checkout -b antoine/buy_flowers
    ```

-   Ensure test coverage whenever possible

-   How to commit and push your modifications?

    ```
    git add -f ./*
    git commit -m '// my message'
    git push origin antoine/buy_flowers
    ```

-   How to write a commit message "// my message"?

    See **[COMMIT_MESSAGE](https://github.com/PrestaShop/psaas-api-store/blob/master/doc/COMMIT_MESSAGE.md)**

-   Push your branch against the upstream repository

    ```
    git push upstream antoine/buy_flowers
    ```

-   Go on Github and create a pull request ("new pull request" button)

    -   Favor `[WIP]s` to get an early feedback. More information about this
    practice in **[Ben Straub's blog post](http://ben.straub.cc/2015/04/02/wip-pull-request/)**
