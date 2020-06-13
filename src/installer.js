"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var os = require("os");
var assert = require("assert");
var core = require("@actions/core");
var hc = require("@actions/http-client");
var io = require("@actions/io");
var tc = require("@actions/tool-cache");
var path = require("path");
var semver = require("semver");
var fs = require("fs");
function getNode(versionSpec, stable, auth) {
    return __awaiter(this, void 0, void 0, function () {
        var osPlat, osArch, toolPath, downloadPath, info, err_1, err_2, extPath, _7zPath, nestedPath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    osPlat = os.platform();
                    osArch = translateArchToDistUrl(os.arch());
                    toolPath = tc.find('node', versionSpec);
                    if (!toolPath) return [3 /*break*/, 1];
                    console.log("Found in cache @ " + toolPath);
                    return [3 /*break*/, 21];
                case 1:
                    console.log("Attempting to download " + versionSpec + "...");
                    downloadPath = '';
                    info = null;
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 7, , 8]);
                    return [4 /*yield*/, getInfoFromManifest(versionSpec, stable, auth)];
                case 3:
                    info = _a.sent();
                    if (!info) return [3 /*break*/, 5];
                    console.log("Acquiring " + info.resolvedVersion + " from " + info.downloadUrl);
                    return [4 /*yield*/, tc.downloadTool(info.downloadUrl, undefined, auth)];
                case 4:
                    downloadPath = _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    console.log('Not found in manifest.  Falling back to download directly from Node');
                    _a.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    err_1 = _a.sent();
                    // Rate limit?
                    if (err_1 instanceof tc.HTTPError &&
                        (err_1.httpStatusCode === 403 || err_1.httpStatusCode === 429)) {
                        console.log("Received HTTP status code " + err_1.httpStatusCode + ".  This usually indicates the rate limit has been exceeded");
                    }
                    else {
                        console.log(err_1.message);
                    }
                    core.debug(err_1.stack);
                    console.log('Falling back to download directly from Node');
                    return [3 /*break*/, 8];
                case 8:
                    if (!!downloadPath) return [3 /*break*/, 15];
                    return [4 /*yield*/, getInfoFromDist(versionSpec)];
                case 9:
                    info = _a.sent();
                    if (!info) {
                        throw new Error("Unable to find Node version '" + versionSpec + "' for platform " + osPlat + " and architecture " + osArch + ".");
                    }
                    console.log("Acquiring " + info.resolvedVersion + " from " + info.downloadUrl);
                    _a.label = 10;
                case 10:
                    _a.trys.push([10, 12, , 15]);
                    return [4 /*yield*/, tc.downloadTool(info.downloadUrl)];
                case 11:
                    downloadPath = _a.sent();
                    return [3 /*break*/, 15];
                case 12:
                    err_2 = _a.sent();
                    if (!(err_2 instanceof tc.HTTPError && err_2.httpStatusCode == 404)) return [3 /*break*/, 14];
                    return [4 /*yield*/, acquireNodeFromFallbackLocation(info.resolvedVersion)];
                case 13: return [2 /*return*/, _a.sent()];
                case 14: throw err_2;
                case 15:
                    //
                    // Extract
                    //
                    console.log('Extracting ...');
                    extPath = void 0;
                    info = info || {}; // satisfy compiler, never null when reaches here
                    if (!(osPlat == 'win32')) return [3 /*break*/, 17];
                    _7zPath = path.join(__dirname, '..', 'externals', '7zr.exe');
                    return [4 /*yield*/, tc.extract7z(downloadPath, undefined, _7zPath)];
                case 16:
                    extPath = _a.sent();
                    nestedPath = path.join(extPath, path.basename(info.fileName, '.7z'));
                    if (fs.existsSync(nestedPath)) {
                        extPath = nestedPath;
                    }
                    return [3 /*break*/, 19];
                case 17: return [4 /*yield*/, tc.extractTar(downloadPath, undefined, [
                        'xz',
                        '--strip',
                        '1'
                    ])];
                case 18:
                    extPath = _a.sent();
                    _a.label = 19;
                case 19:
                    //
                    // Install into the local tool cache - node extracts with a root folder that matches the fileName downloaded
                    //
                    console.log('Adding to the cache ...');
                    return [4 /*yield*/, tc.cacheDir(extPath, 'node', info.resolvedVersion)];
                case 20:
                    toolPath = _a.sent();
                    console.log('Done');
                    _a.label = 21;
                case 21:
                    //
                    // a tool installer initimately knows details about the layout of that tool
                    // for example, node binary is in the bin folder after the extract on Mac/Linux.
                    // layouts could change by version, by platform etc... but that's the tool installers job
                    //
                    if (osPlat != 'win32') {
                        toolPath = path.join(toolPath, 'bin');
                    }
                    //
                    // prepend the tools path. instructs the agent to prepend for future tasks
                    core.addPath(toolPath);
                    return [2 /*return*/];
            }
        });
    });
}
exports.getNode = getNode;
function getInfoFromManifest(versionSpec, stable, auth) {
    return __awaiter(this, void 0, void 0, function () {
        var info, releases, rel;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    info = null;
                    return [4 /*yield*/, tc.getManifestFromRepo('actions', 'node-versions', auth)];
                case 1:
                    releases = _a.sent();
                    console.log("matching " + versionSpec + "...");
                    return [4 /*yield*/, tc.findFromManifest(versionSpec, stable, releases)];
                case 2:
                    rel = _a.sent();
                    if (rel && rel.files.length > 0) {
                        info = {};
                        info.resolvedVersion = rel.version;
                        info.downloadUrl = rel.files[0].download_url;
                        info.fileName = rel.files[0].filename;
                    }
                    return [2 /*return*/, info];
            }
        });
    });
}
function getInfoFromDist(versionSpec) {
    return __awaiter(this, void 0, void 0, function () {
        var osPlat, osArch, version, fileName, urlFileName, url;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    osPlat = os.platform();
                    osArch = translateArchToDistUrl(os.arch());
                    return [4 /*yield*/, queryDistForMatch(versionSpec)];
                case 1:
                    version = _a.sent();
                    if (!version) {
                        return [2 /*return*/, null];
                    }
                    //
                    // Download - a tool installer intimately knows how to get the tool (and construct urls)
                    //
                    version = semver.clean(version) || '';
                    fileName = osPlat == 'win32'
                        ? "node-v" + version + "-win-" + osArch
                        : "node-v" + version + "-" + osPlat + "-" + osArch;
                    urlFileName = osPlat == 'win32' ? fileName + ".7z" : fileName + ".tar.gz";
                    url = "https://nodejs.org/dist/v" + version + "/" + urlFileName;
                    return [2 /*return*/, {
                            downloadUrl: url,
                            resolvedVersion: version,
                            fileName: fileName
                        }];
            }
        });
    });
}
// TODO - should we just export this from @actions/tool-cache? Lifted directly from there
function evaluateVersions(versions, versionSpec) {
    var version = '';
    core.debug("evaluating " + versions.length + " versions");
    versions = versions.sort(function (a, b) {
        if (semver.gt(a, b)) {
            return 1;
        }
        return -1;
    });
    for (var i = versions.length - 1; i >= 0; i--) {
        var potential = versions[i];
        var satisfied = semver.satisfies(potential, versionSpec);
        if (satisfied) {
            version = potential;
            break;
        }
    }
    if (version) {
        core.debug("matched: " + version);
    }
    else {
        core.debug('match not found');
    }
    return version;
}
function queryDistForMatch(versionSpec) {
    return __awaiter(this, void 0, void 0, function () {
        var osPlat, osArch, dataFileName, versions, nodeVersions, version;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    osPlat = os.platform();
                    osArch = translateArchToDistUrl(os.arch());
                    switch (osPlat) {
                        case 'linux':
                            dataFileName = "linux-" + osArch;
                            break;
                        case 'darwin':
                            dataFileName = "osx-" + osArch + "-tar";
                            break;
                        case 'win32':
                            dataFileName = "win-" + osArch + "-exe";
                            break;
                        default:
                            throw new Error("Unexpected OS '" + osPlat + "'");
                    }
                    versions = [];
                    return [4 /*yield*/, module.exports.getVersionsFromDist()];
                case 1:
                    nodeVersions = _a.sent();
                    nodeVersions.forEach(function (nodeVersion) {
                        // ensure this version supports your os and platform
                        if (nodeVersion.files.indexOf(dataFileName) >= 0) {
                            versions.push(nodeVersion.version);
                        }
                    });
                    version = evaluateVersions(versions, versionSpec);
                    return [2 /*return*/, version];
            }
        });
    });
}
function getVersionsFromDist() {
    return __awaiter(this, void 0, void 0, function () {
        var dataUrl, httpClient, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dataUrl = 'https://nodejs.org/dist/index.json';
                    httpClient = new hc.HttpClient('setup-node', [], {
                        allowRetries: true,
                        maxRetries: 3
                    });
                    return [4 /*yield*/, httpClient.getJson(dataUrl)];
                case 1:
                    response = _a.sent();
                    return [2 /*return*/, response.result || []];
            }
        });
    });
}
exports.getVersionsFromDist = getVersionsFromDist;
// For non LTS versions of Node, the files we need (for Windows) are sometimes located
// in a different folder than they normally are for other versions.
// Normally the format is similar to: https://nodejs.org/dist/v5.10.1/node-v5.10.1-win-x64.7z
// In this case, there will be two files located at:
//      /dist/v5.10.1/win-x64/node.exe
//      /dist/v5.10.1/win-x64/node.lib
// If this is not the structure, there may also be two files located at:
//      /dist/v0.12.18/node.exe
//      /dist/v0.12.18/node.lib
// This method attempts to download and cache the resources from these alternative locations.
// Note also that the files are normally zipped but in this case they are just an exe
// and lib file in a folder, not zipped.
function acquireNodeFromFallbackLocation(version) {
    return __awaiter(this, void 0, void 0, function () {
        var osPlat, osArch, tempDownloadFolder, tempDirectory, tempDir, exeUrl, libUrl, exePath, libPath, err_3, exePath, libPath, toolPath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    osPlat = os.platform();
                    osArch = translateArchToDistUrl(os.arch());
                    tempDownloadFolder = 'temp_' + Math.floor(Math.random() * 2000000000);
                    tempDirectory = process.env['RUNNER_TEMP'] || '';
                    assert.ok(tempDirectory, 'Expected RUNNER_TEMP to be defined');
                    tempDir = path.join(tempDirectory, tempDownloadFolder);
                    return [4 /*yield*/, io.mkdirP(tempDir)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 7, , 14]);
                    exeUrl = "https://nodejs.org/dist/v" + version + "/win-" + osArch + "/node.exe";
                    libUrl = "https://nodejs.org/dist/v" + version + "/win-" + osArch + "/node.lib";
                    console.log("Downloading only node binary from " + exeUrl);
                    return [4 /*yield*/, tc.downloadTool(exeUrl)];
                case 3:
                    exePath = _a.sent();
                    return [4 /*yield*/, io.cp(exePath, path.join(tempDir, 'node.exe'))];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, tc.downloadTool(libUrl)];
                case 5:
                    libPath = _a.sent();
                    return [4 /*yield*/, io.cp(libPath, path.join(tempDir, 'node.lib'))];
                case 6:
                    _a.sent();
                    return [3 /*break*/, 14];
                case 7:
                    err_3 = _a.sent();
                    if (!(err_3 instanceof tc.HTTPError && err_3.httpStatusCode == 404)) return [3 /*break*/, 12];
                    exeUrl = "https://nodejs.org/dist/v" + version + "/node.exe";
                    libUrl = "https://nodejs.org/dist/v" + version + "/node.lib";
                    return [4 /*yield*/, tc.downloadTool(exeUrl)];
                case 8:
                    exePath = _a.sent();
                    return [4 /*yield*/, io.cp(exePath, path.join(tempDir, 'node.exe'))];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, tc.downloadTool(libUrl)];
                case 10:
                    libPath = _a.sent();
                    return [4 /*yield*/, io.cp(libPath, path.join(tempDir, 'node.lib'))];
                case 11:
                    _a.sent();
                    return [3 /*break*/, 13];
                case 12: throw err_3;
                case 13: return [3 /*break*/, 14];
                case 14: return [4 /*yield*/, tc.cacheDir(tempDir, 'node', version)];
                case 15:
                    toolPath = _a.sent();
                    core.addPath(toolPath);
                    return [2 /*return*/, toolPath];
            }
        });
    });
}
// os.arch does not always match the relative download url, e.g.
// os.arch == 'arm' != node-v12.13.1-linux-armv7l.tar.gz
// All other currently supported architectures match, e.g.:
//   os.arch = arm64 => https://nodejs.org/dist/v{VERSION}/node-v{VERSION}-{OS}-arm64.tar.gz
//   os.arch = x64 => https://nodejs.org/dist/v{VERSION}/node-v{VERSION}-{OS}-x64.tar.gz
function translateArchToDistUrl(arch) {
    switch (arch) {
        case 'arm':
            return 'armv7l';
        default:
            return arch;
    }
}
