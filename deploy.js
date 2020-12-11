const simpleGit = require('simple-git');
const child_process = require('child_process');

// create SimpleGit instance with shousetsubook directory
console.log(process.cwd() + '/dist')
shousetsubook = simpleGit({baseDir: process.cwd() + '/dist'});
git.status(onStatus).revparse('HEAD', onRevparse)
function onStatus (err, statusResult) {
    var gitConditions = [];
    if (!statusResult.isClean()) {
        gitConditions.push('working directory is not clean')
    }
    if (statusResult.current !== "main") {
        gitConditions.push('current branch is not main')
    }
    if (gitConditions.length > 0) {
        console.log('Could not deploy because ' + gitConditions.join(' and '))
    }
    child_process.execSync('npm run build',{stdio:[0,1,2]});
}
function onRevparse (err, commit) {
    shousetsubook.add('./*').commit(commit).push('origin','gh-pages')
}