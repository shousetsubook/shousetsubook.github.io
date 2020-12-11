const simpleGit = require('simple-git');
const child_process = require('child_process');
const { exit } = require('process');

// create SimpleGit instance with shousetsubook directory
console.log(process.cwd() + '/dist')
var dist = simpleGit({baseDir: process.cwd() + '/dist'});
var shousetsubook = simpleGit();
shousetsubook.status(onStatus).revparse('HEAD', onRevparse);
function onStatus (err, statusResult) {
    var gitConditions = [];
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
    if (gitConditions.length > 0) {
        console.log('Could not deploy because ' + gitConditions.join(' and '));
        exit(1);
    }
    child_process.execSync('npm run build',{stdio:[0,1,2]});
}
function onRevparse (err, commit) {
    dist.add('./*').commit(commit).push('origin','gh-pages')
}