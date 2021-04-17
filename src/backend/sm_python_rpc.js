const Spawn = require("child_process").spawn

/**
 * PythonRPC manages invoking/calling procedures/functions within the Python backend and
 * returning the results to Node.
 */
class PythonRPC {

    constructor() {
        this.TASK_SCRIPTS = {
            rh_login: 'sm_task_rh_login.py'
        }
    }

    /**
     * Creates and calls a Python script as a Node process. Excepts the name of the
     * task script to call and the arguments to pas to it. Returns a Promise that
     * when successful resolves the JSON parsable result of the task.
     */
    run_process = (task, args=[]) => {
        if (this.does_task_exist(task)) {
            let task_script = this.TASK_SCRIPTS[task]
            let process = Spawn(
                'python3',
                [`${__dirname}/python/${task_script}`, ...args],
                {cwd: __dirname}
            )
            return new Promise(function (resolve, reject) {
                process.stderr.on('data', function (data) {
                    console.error(data.toString())
                })
                process.stdout.on('data', function (data) {
                    resolve(JSON.parse(data.toString()))
                })
            })
        }
    }


    /**
     * Check if a task exists and return true, false otherwise.
     */
    does_task_exist = (task) => {
        return this.TASK_SCRIPTS.hasOwnProperty(task)
    }
}

// module.exports = {
//     PythonRPC: PythonRPC
// }

// @todo - Test Bed
let PRPC = new PythonRPC()
PRPC.run_process('rh_login', ['william.neeley@gmail.com', 'u8^2kjHsd<mD7', 'NHHD6DSAC7DI6HLH'])
    .then((results) => {
        console.log(results)
    })