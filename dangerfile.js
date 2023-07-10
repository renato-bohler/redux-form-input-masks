// eslint-disable-next-line
import { danger, fail, markdown, message, schedule, warn } from 'danger';

const removeAtSymbols = string => string.replace(/@/g, '');

// ------- Fails if commit messages aren't complying with conventions -------
const commitLint = commit => {
  /* eslint-disable */
  // Convention: <header><blank line><body><blank line><footer>
  // where <header> = <type>(<scope>): <subject> or <type>: <subject>
  // https://github.com/conventional-changelog-archived-repos/conventional-changelog-angular/blob/master/convention.md
  const headerRegex = /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\(.{1,}\))?: (.{1,})/;
  const mergeRegex = /^Merge branch '.{1,}' (of .+)?into .{1,}/;
  /* eslint-enable */

  const { msg, sha } = commit;
  const commitIdentificator = `Commit ${sha}`;
  const errorMessage =
    `${commitIdentificator} message does not comply with` +
    ` the conventional-changelog-standard conventions.`;

  if (!msg) {
    return `${commitIdentificator} has no commit message`;
  }

  // checks for Merge message
  if (mergeRegex.test(msg)) {
    return;
  }

  // checks for <header>
  if (!headerRegex.test(msg)) {
    return (
      `${errorMessage} Header should be **\`<type>(<scope>): <subject>\`** ` +
      `or **\`<type>: <subject>\`**.`
    );
  }
};

// Converts danger.github.commits to simple objects
const commits = danger.github.commits.map(obj => ({
  sha: obj.sha,
  msg: obj.commit.message,
}));

const commitErrors = commits.map(commitLint);
// If any of the commit messages of this PR isn't in complicance with the rules
if (commitErrors.some(e => e !== undefined)) {
  // Fail the build
  commitErrors.forEach(error => {
    if (error !== undefined) {
      fail(error);
    }
  });
}

// ------- Warns for Pull Requests with more than 600 lines modified -------
const bigPRThreshold = 600;
if (danger.github.pr.additions + danger.github.pr.deletions > bigPRThreshold) {
  warn(':exclamation: Big PR');
  markdown(
    '> Pull Request size seems relatively large. If Pull Request contains' +
      ' multiple changes, split each into separate PR will helps faster,' +
      ' easier review.',
  );
}

// ------- Warns if Pull Request isn't assigned to someone -------
if (danger.github.pr.assignee === null) {
  warn(
    'Please assign someone to merge this PR, and optionally include people' +
      ' who should review.',
  );
}

// ------- Messages alerting for new dependencies added -------
schedule(async () => {
  const packageDiff = await danger.git.JSONDiffForFile('package.json');
  if (packageDiff && packageDiff.dependencies) {
    let dependenciesStr;
    const newDependencies = packageDiff.dependencies.added;
    const newCount = newDependencies.length;

    if (newCount > 0) {
      newDependencies.forEach(newDependency => {
        if (!dependenciesStr) {
          dependenciesStr = newDependency;
        } else {
          dependenciesStr = `${dependenciesStr}, ${newDependency}`;
        }
      });
      message(
        `There ${newCount === 1 ? 'is' : 'are'} ${newCount} new ${
          newCount === 1 ? 'dependency' : 'dependencies'
        } added in this PR: ${removeAtSymbols(dependenciesStr)}.`,
      );
    }
  }
});

// ------- Messages alerting for removed dependencies -------
schedule(async () => {
  const packageDiff = await danger.git.JSONDiffForFile('package.json');
  if (packageDiff && packageDiff.dependencies) {
    let dependenciesStr;
    const removedDependencies = packageDiff.dependencies.removed;

    if (removedDependencies.length > 0) {
      removedDependencies.forEach(newDependency => {
        if (!dependenciesStr) {
          dependenciesStr = newDependency;
        } else {
          dependenciesStr = `${dependenciesStr}, ${newDependency}`;
        }
      });
      message(
        `There is ${removedDependencies.length} removed ${
          removedDependencies.length === 1 ? 'dependency' : 'dependencies'
        } in this PR: ${removeAtSymbols(dependenciesStr)}.`,
      );
    }
  }
});

// ------- Messages alerting for updated dependencies -------
schedule(async () => {
  const packageDiff = await danger.git.JSONDiffForFile('package.json');
  if (packageDiff && packageDiff.dependencies) {
    const updatedDependencies = [];
    const { dependencies } = packageDiff;

    // For each dependency in the new package.json
    Object.keys(dependencies.after).forEach(dependency => {
      // If the dependency version has been updated
      const versionBefore = dependencies.before[dependency];
      const versionAfter = dependencies.after[dependency];
      if (versionBefore && versionAfter !== versionBefore) {
        updatedDependencies.push(
          `${dependency} ` +
            `(from <b>${versionBefore}</b> to <b>${versionAfter}</b>)`,
        );
      }
    });

    let updatedStr;
    if (updatedDependencies.length > 0) {
      updatedDependencies.forEach(updatedDependency => {
        if (!updatedStr) {
          updatedStr = updatedDependency;
        } else {
          updatedStr = `${updatedStr}, ${updatedDependency}`;
        }
      });
      message(
        `The version of ${updatedDependencies.length} ${
          updatedDependencies.length === 1 ? 'dependency' : 'dependencies'
        } have been updated in this PR: ${removeAtSymbols(updatedStr)}.`,
      );
    }
  }
});

// ------- Messages alerting for new devDependencies added -------
schedule(async () => {
  const packageDiff = await danger.git.JSONDiffForFile('package.json');
  if (packageDiff && packageDiff.devDependencies) {
    let devDependenciesStr;
    const newDevDependencies = packageDiff.devDependencies.added;
    const newCount = newDevDependencies.length;

    if (newCount > 0) {
      newDevDependencies.forEach(newDevDependency => {
        if (!devDependenciesStr) {
          devDependenciesStr = newDevDependency;
        } else {
          devDependenciesStr = `${devDependenciesStr}, ${newDevDependency}`;
        }
      });
      message(
        `There ${newCount === 1 ? 'is' : 'are'} ${newCount} new dev${
          newCount === 1 ? 'Dependency' : 'Dependencies'
        } added in this PR: ${removeAtSymbols(devDependenciesStr)}.`,
      );
    }
  }
});

// ------- Messages alerting for removed devDependencies -------
schedule(async () => {
  const packageDiff = await danger.git.JSONDiffForFile('package.json');
  if (packageDiff && packageDiff.devDependencies) {
    let devDependenciesStr;
    const removedDevDependencies = packageDiff.devDependencies.removed;
    const removedCount = removedDevDependencies.length;

    if (removedCount > 0) {
      removedDevDependencies.forEach(removedDevDependency => {
        if (!devDependenciesStr) {
          devDependenciesStr = removedDevDependency;
        } else {
          devDependenciesStr = `${devDependenciesStr}, ${removedDevDependency}`;
        }
      });
      message(
        `There ${
          removedCount === 1 ? 'is' : 'are'
        } ${removedCount} removed dev${
          removedCount === 1 ? 'Dependency' : 'Dependencies'
        } in this PR: ${removeAtSymbols(devDependenciesStr)}.`,
      );
    }
  }
});

// ------- Messages alerting for updated devDependencies -------
schedule(async () => {
  const packageDiff = await danger.git.JSONDiffForFile('package.json');
  if (packageDiff && packageDiff.devDependencies) {
    const updatedDependencies = [];
    const { devDependencies } = packageDiff;

    // For each devDependency in the new package.json
    Object.keys(devDependencies.after).forEach(devDependency => {
      // If the devDependency version has been updated
      const versionBefore = devDependencies.before[devDependency];
      const versionAfter = devDependencies.after[devDependency];
      if (versionBefore && versionAfter !== versionBefore) {
        updatedDependencies.push(
          `${devDependency} ` +
            `(from <b>${versionBefore}</b> to <b>${versionAfter}</b>)`,
        );
      }
    });

    let updatedStr;
    if (updatedDependencies.length > 0) {
      updatedDependencies.forEach(updatedDependency => {
        if (!updatedStr) {
          updatedStr = updatedDependency;
        } else {
          updatedStr = `${updatedStr}, ${updatedDependency}`;
        }
      });
      message(
        `The version of ${updatedDependencies.length} dev${
          updatedDependencies.length === 1 ? 'Dependency' : 'Dependencies'
        } have been updated in this PR: ${removeAtSymbols(updatedStr)}.`,
      );
    }
  }
});
