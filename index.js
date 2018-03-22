const { spawn } = require('child_process')

class Ethup {
    constructor() {
        this.proc = null
    }

    checkAndKill(data, regexp, done) {
        var re = new RegExp(regexp)

        if (re.test(data.toString())) {
            this.proc.kill()
            if (done) done(0)
        }
    }

    run(executable, args, regexp, done) {
        this.proc = spawn(executable, args, { shell: true })

        this.proc.stdout.on('data', (data) => {
            process.stdout.write(data.toString())
            this.checkAndKill(data.toString(), regexp, done)
        })

        this.proc.stderr.on('data', (data) => {
            process.stdout.write(data.toString())
            this.checkAndKill(data.toString(), regexp, done)
        })

        this.proc.on('exit', (status) => {
            console.log(`Child exited with code ${status}`)
            if (done) done(status)
        })
    }

    kill() {
    	this.proc.kill()
    }
}

module.exports = Ethup