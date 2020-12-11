const git = require('simple-git')();

git.status(onStatus)
function onStatus (err, statusResult) {
    if (statusResult.isClean()) {
        console.log("Working directory clean!")
    }
}
