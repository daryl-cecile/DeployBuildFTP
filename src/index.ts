import * as installer from "./installer";

const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');
const io = require('@actions/io');

async function main(){
    try {
        const startTime = (new Date()).toTimeString();

        await installer.getNode('12.x');

        const gitPath = io.which('git', true);

        core.setOutput("startTime", startTime);

        const ftpDetails = {
            user : core.getInput("ftp-user", {required:true}),
            password : core.getInput("ftp-password", {required:true}),
            host : core.getInput("ftp-host", {required:true}),
            port : Number(core.getInput("ftp-port", {required:false})),
        };
        // const token = core.getInput("repo-token",{required:true});
        // const client = new github.GitHub(token);

        console.log("trying with", gitPath);

        await exec.exec("git", ["checkout"]);

        console.log( await exec.exec("ls -l") );

    } catch (error) {
        core.setFailed(error.message);
    }
}

main();