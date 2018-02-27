# Contributing

This document contains guidelines for contributing to `redux-form-input-masks`.

Thanks for taking your time and considering contributing to this project :tada:.

Feel free to open a pull request and propose changes to this document.

## Contents

[Code of conduct](#code-of-conduct)

[How can I contribute?](#how-can-i-contribute)

* [Reporting bugs](#reporting-bugs)
* [Suggesting enhancements](#suggesting-enhancements)
* [Your first code contribution](#your-first-code-contribution)
* [Pull requests](#pull-requests)

## Code of conduct

This project and everyone participating in it is governed by this [Code of conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code and report unacceptable behavior to [renato.bohler@gmail.com](mailto:renato.bohler@gmail.com).

## How can I contribute?

### Reporting bugs

If you've found a bug on `redux-form-input-masks`, follow these steps:

* check if anyone have already reported it [on our opened issues](https://github.com/renato-bohler/redux-form-input-masks/issues). If you find an already existing issue reporting a similar bug, you should comment on this issue instead of creating a new one;
* if there's no similar issues opened, please do [open a new issue](https://github.com/renato-bohler/redux-form-input-masks/issues/new), using a clear and descriptive title and filling the [issue template](ISSUE_TEMPLATE.md) with as many details as possible.

### Suggesting enhancements

Any ideas for new masks or new options for the existing ones are welcome! If you have a suggestion, you can open an issue, repeating the steps described at the [Reporting bugs](#reporting-bugs) section.

### Your first code contribution

There's some things that you really should know before contributing with your awesome coding skills.

* **starting:** to start, clone the project into your machine and run `npm install`. You can locally run the [`redux-form-input-masks` documentations & examples](https://renato-bohler.github.io/redux-form-input-masks/) to test your changes by running `cd examples && npm install & npm start`;
* **commitlint:** in order to use [`semantic-release`](https://github.com/semantic-release/semantic-release), we follow the [`conventional-changelog`](https://github.com/conventional-changelog-archived-repos/conventional-changelog-angular/blob/master/convention.md) commit messages conventions. You need to make sure that all of your commit messages are complying with these conventions, **otherwise your commit will fail**. But don't worry! To simplify this process, we have configured [`commitizen`'s cli](https://github.com/commitizen/cz-cli) onto the project: to commit your stashed changes, run `npm run commit`. If you have `commitizen` installed globally, you can run `git cz`;
* **eslint and prettier**: if you don't have ESLint and Prettier extensions installed for your editor of choice, you definitely should before contributing. They will help you improve your coding in many ways;
* **tests:** make sure your changes haven't broken any tests by running `npm test`. If you open a pull request with broken tests, [Travis CI](https://travis-ci.org/) will block the pull request from being merged;
* **code coverage**: please do you best to keep the code coverage as high as possible (100% is the goal);
* **good first issue**: if you're looking for a good first issue, there's a label for that. You can use [this link](https://github.com/renato-bohler/redux-form-input-masks/labels/good%20first%20issue) to check all issues marked with this label;
* **documentation**: you have fixed an issue, you ran the tests and everything is fine. Nice, but hold on! Always remember to keep the documentation updated, as this is **very** important. You can update the docs by changing the `examples` folder. If your code makes it to the `master` branch, Travis CI will take care of building and deploying the updated documentation to the `gh-pages` branch on the repository.

### Pull requests

When you open a pull request, it will trigger [Travis CI](http://travis-ci.org/), that will in turn trigger [Danger](http://danger.systems/js/), [codecov](http://codecov.io/) and other scripts. Danger will post a comment on any pull request giving informations, warnings or even errors that may be useful for those who will review your changes to the code. Codecov will post a comment with informations about the test coverage of your code (absolute and diff values).

Currently, we have no pull request template, but please be as descriptive as you can and be patient while waiting for review.

And hey! You can always open a pull request adding a template if you will.
