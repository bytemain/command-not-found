#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var commander_1 = __importDefault(require("commander"));
var got_1 = __importStar(require("got"));
var cheerio_1 = __importDefault(require("cheerio"));
var ora_1 = __importDefault(require("ora"));
var display = function (cmdObj, args) {
    var cmd = args[0];
    cmd = cmd.trim();
    var spinner = ora_1.default(chalk_1.default.green("fetching " + cmd)).start();
    (function () { return __awaiter(void 0, void 0, void 0, function () {
        var body, $_1, commandName, commandDescription, installList, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    return [4 /*yield*/, got_1.default.get("https://command-not-found.com/" + cmd, {
                            hooks: {
                                beforeRedirect: [
                                    function (options, response) {
                                        var url = options.url;
                                        if (url.hostname === "command-not-found.com" &&
                                            url.pathname === "/") {
                                            throw new got_1.RequestError("abort", { code: "-100" }, options);
                                        }
                                    },
                                ],
                            },
                        })];
                case 1:
                    body = (_a.sent()).body;
                    $_1 = cheerio_1.default.load(body);
                    spinner.succeed("fetching succeed.");
                    commandName = $_1(".row-command-info > div > h2").text();
                    commandDescription = $_1(".row-command-info > div > p").text();
                    installList = $_1("div.col-install > div.card.card-install > div.card-body > dl > div");
                    console.log(chalk_1.default.blue("name: ") + commandName.trim());
                    console.log(chalk_1.default.blue("description: ") + commandDescription.trim());
                    installList
                        .toArray()
                        .slice(1)
                        .map(function (item) {
                        console.log(chalk_1.default.greenBright("- OS: ") +
                            $_1(item).find("dt").contents().last().text().trim());
                        console.log(chalk_1.default.greenBright("  Command: ") + $_1(item).find("dd").text().trim());
                    });
                    return [3 /*break*/, 4];
                case 2:
                    error_1 = _a.sent();
                    if (error_1.code === "-100") {
                        spinner.fail(chalk_1.default.red("cannot find " + cmd + "."));
                    }
                    else {
                        spinner.fail(chalk_1.default.red("fetch failed."));
                        console.log(error_1);
                    }
                    return [3 /*break*/, 4];
                case 3:
                    spinner.stop();
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); })();
};
commander_1.default
    .version("0.0.1")
    .description("a cli tool to find the right package.")
    .command("<cmd>", "command name")
    .action(display);
// 必须在.parse()之前
commander_1.default.on("--help", function () {
    console.log("");
    console.log("Example call:");
    console.log("  $ cnf nc");
});
commander_1.default.parse(process.argv);
