const Spawn = require("child_process").spawn

/**
 * PythonRPC manages invoking/calling procedures/functions within the python backend.
 */
class PythonRPC {

    constructor() {
        this.TASK_SCRIPTS = {
            rh_login: 'sm_task_rh_login.py'
        }
    }

    /**
     * Creates and calls a Python script as a Node process.
     */
    run_process = (task, args=[]) => {
        if (this.does_task_exist(task)) {
            let task_script = this.TASK_SCRIPTS[task]
            let process = Spawn('python', [`${__dirname}/python/${task_script}`, args.flat()])
            return new Promise(function (resolve, reject) {
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
PRPC.run_process('rh_login', ['Some Argument'])
    .then((results) => {
        console.log(results)
    })