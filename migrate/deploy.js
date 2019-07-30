const childProcess = require('child_process');

const runScript = (script, args, callback   ) => {
    let invoked = false;

    const process = childProcess.fork(script, args);

    process.on('error', function (err) {
        if (invoked) return;
        invoked = true;
        callback(err);
    });

    // execute the callback once the process has finished running
    process.on('exit', function (code) {
        if (invoked) return;
        invoked = true;
        var err = code === 0 ? null : new Error('exit code ' + code);
        callback(err);
    });
}

const runCommand = command => {
    const exec = require('child_process').exec

    exec(command, (err, stdout, stderr) => {
        process.stdout.write(stdout)
    })
}

const errorFunc =  err => {
    if (err) throw err;
    console.log('finished running some-script.js');
}

const args = process.argv.slice(2);

runScript('migrate/import.js', [args[0], 'all'], errorFunc);
runScript('migrate/qb_data_migration.js', [], errorFunc);
runCommand('mongoimport --db socioscope --collection deputies --type json --file migrate/deputies.json --jsonArray');

