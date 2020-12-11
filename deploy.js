const simpleGit = require('simple-git');
const child_process = require('child_process');
const { exit } = require('process');
const ghpages = require('gh-pages');

// create SimpleGit instance with shousetsubook directory
console.log(process.cwd() + '/dist')
var shousetsubook = simpleGit();
shousetsubook.fetch('--all').status(onStatus).getRemotes(true,onGetRemotes).revparse('HEAD', onRevparse);
var gitConditions = [];
function onStatus (err, statusResult) {
    if (!statusResult.isClean()) {
        gitConditions.push('working directory is not clean');
    }
    if (statusResult.current !== "main") {
        gitConditions.push('current branch is not main');
    }
    if (statusResult.tracking !== "origin/main") {
        gitConditions.push('current branch is not tracking origin/main');
    }
    if (statusResult.ahead !== 0 && statusResult.behind !== 0) {
        gitConditions.push('current branch is not up-to-date with origin/main');
    }
    if (statusResult.ahead !== 0 && statusResult.behind !== 0) {
        gitConditions.push('current branch is not up-to-date with origin/main');
    }

}
function onGetRemotes(err, getRemotesResult) {
    correctRemote = false;
    getRemotesResult.forEach(remote => {
        if (remote.name == 'origin' && remote.refs.push == 'git@github.com:shousetsubook/shousetsubook.github.io.git' && remote.refs.push == remote.refs.fetch) {
            correctRemote = true;
        }
    })
    if (!correctRemote) {
        gitConditions.push('remote origin with correct refs does not exist');
    }
}
function onRevparse (err, commit) {
    if (gitConditions.length > 0) {
        console.log('Could not deploy because ' + gitConditions.join(', '));
        exit(1);
    }
    child_process.execSync('npm run build',{stdio:[0,1,2]});
    console.log('Publishing to gh-pages branch with message: ' + commit)
    ghpages.publish('dist', {
        message: commit
    });
}