import * as installer from "./installer";
import getOwnPropertyDescriptor = Reflect.getOwnPropertyDescriptor;

const core = require('@actions/core');
const exec = require('@actions/exec');
const fs = require("fs");
const FtpDeploy = require('ftp-deploy');

interface IConnectionInfo{
    user: string;
    password: string;
    host: string;
    port: number
}

async function main(){
    try {
        const startTime = (new Date()).toTimeString();
        const nodeVersion = core.getInput("node-version",{required:true});

        await installer.getNode(nodeVersion);

        core.setOutput("startTime", startTime);

        const ftpDetails: IConnectionInfo = {
            user : core.getInput("ftp-user", {required:true}),
            password : core.getInput("ftp-password", {required:true}),
            host : core.getInput("ftp-host", {required:true}),
            port : Number(core.getInput("ftp-port", {required:false})),
        };

        await exec.exec("git", ["checkout"]);

        console.log( await exec.exec("ls -l") );

        let source = core.getInput("source-root");
        let destination = core.getInput("ftp-destination");

        core.setCommandEcho(true);

        deploy( source, destination, ftpDetails ).then(res => {
            console.log("Complete", res);
        });

    } catch (error) {
        core.setFailed(error.message);
    }
}

async function getParsedRules(){
    let ruleFile = fs.readFileSync( core.getInput('rule-file', {required:true}) , { encoding:'utf8' });

    let toIgnore = [];
    let toInclude = [];

    for (let line of ruleFile.split("\n")){
        line = line.trim();
        if (line.length === 0) continue;
        if (line.startsWith("!")){
            toIgnore.push(line.substr(1));
        }
        else{
            toInclude.push(line);
        }
    }

    return {
        ignore: toIgnore,
        include: toInclude
    }
}

async function deploy(sourceRoot:string, destinationRoot:string, connectionInfo:IConnectionInfo){
    let ftp = new FtpDeploy();

    let rules = await getParsedRules();

    let config = {
        user: connectionInfo.user,
        password: connectionInfo.password,
        host: connectionInfo.host,
        port: connectionInfo.port ?? 21,
        localRoot: sourceRoot,
        remoteRoot: destinationRoot,
        include: rules.include,
        exclude: rules.ignore,
        deleteRemote: false,
        forcePasv: true
    };

    ftp.on("uploading", function(data) {
        let progress = Math.ceil(( Number(data.transferredFileCount) / Number(data.totalFilesCount) ) * 100);
        console.log(`[ ${ progress.toString().padStart(3, ' ') }% ] Uploading ${data.filename}...`);
    });

    return ftp.deploy(config);
}

main();