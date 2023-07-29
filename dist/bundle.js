parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"wW3P":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.BUCKET_URL=exports.AWS_CLIENT_ID=exports.CREDENTIALS_KEY=void 0,exports.CREDENTIALS_KEY="credentials",exports.AWS_CLIENT_ID="6nki0f24aj9hrvluekbmkea631",exports.BUCKET_URL="https://trackmania-registry.s3.eu-west-1.amazonaws.com";
},{}],"GYWt":[function(require,module,exports) {
"use strict";var t=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(exports,"__esModule",{value:!0}),exports.load=exports.store=exports.STORAGE_FILE=void 0;const e=t(require("fs"));function r(t,r){const o=s();o[t]=r,e.default.writeFileSync(exports.STORAGE_FILE,JSON.stringify(o))}function o(t){return s()[t]}function s(){try{return JSON.parse(e.default.readFileSync(exports.STORAGE_FILE).toString())}catch(t){return e.default.writeFileSync(exports.STORAGE_FILE,JSON.stringify({})),{}}}exports.STORAGE_FILE="tmr.json",exports.store=r,exports.load=o;
},{}],"BHXf":[function(require,module,exports) {
"use strict";var e=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(exports,"__esModule",{value:!0}),exports.question=exports.downloadFile=exports.msToLaptime=void 0;const t=e(require("readline-sync")),r=e(require("node-fetch")),o=e(require("fs")),i=e(require("stream")),a=require("util"),s=require("./definitions"),n=e(require("path"));function u(e){if(void 0===e)return"";const t=Math.abs(e);if(t<1e3)return(e<0?"-":"")+`00:${Math.round(t/10).toString().padStart(2,"0")}`;const r=Math.floor(t/6e4),o=Math.floor(t%6e4/1e3),i=t%1e3;return isNaN(t)||isNaN(r)||isNaN(o)||isNaN(i)?"":(e<0?"-":"")+`${r?r+":":""}${o.toString().padStart(r>0?2:0,"0")}:${Math.floor(i/10).toString().padStart(2,"0")}`}async function d(e,t){const u=(0,a.promisify)(i.default.pipeline),d=await(0,r.default)(`${s.BUCKET_URL}/ghosts/${e}`);if(!d.ok)throw new Error(`unexpected response ${d.statusText}`);await u(d.body,o.default.createWriteStream(n.default.join(t,e.replace("<>","__"))))}function f(e,r){return t.default.question(e,r?{hideEchoBack:!0,mask:"*"}:void 0)}exports.msToLaptime=u,exports.downloadFile=d,exports.question=f;
},{"./definitions":"wW3P"}],"AV0o":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.getEmailPassword=void 0;const e=require("./util");async function s(){return{email:(0,e.question)("CKAL email: "),password:(0,e.question)("Password: ",!0)}}exports.getEmailPassword=s;
},{"./util":"BHXf"}],"ooF7":[function(require,module,exports) {
"use strict";function e(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,n)}return r}function t(t){for(var n=1;n<arguments.length;n++){var o=null!=arguments[n]?arguments[n]:{};n%2?e(Object(o),!0).forEach(function(e){r(t,e,o[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(o)):e(Object(o)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(o,e))})}return t}function r(e,t,r){return(t=n(t))in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function n(e){var t=o(e,"string");return"symbol"==typeof t?t:String(t)}function o(e,t){if("object"!=typeof e||null===e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var n=r.call(e,t||"default");if("object"!=typeof n)return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}Object.defineProperty(exports,"__esModule",{value:!0}),exports.clearCredentials=exports.isAccessTokenOld=exports.refreshCredentials=exports.getAccessToken=exports.login=exports.logout=void 0;const i=require("@aws-sdk/client-cognito-identity-provider"),s=require("./definitions"),a=require("./storage"),c=require("./promptLogin"),u=new i.CognitoIdentityProvider({region:"eu-west-1"});function l(){(0,a.store)(s.CREDENTIALS_KEY,void 0)}async function p(){const{email:e,password:r}=await(0,c.getEmailPassword)();try{const o=await u.initiateAuth({AuthFlow:"USER_PASSWORD_AUTH",ClientId:s.AWS_CLIENT_ID,AuthParameters:{USERNAME:e.replaceAll(" ",""),PASSWORD:r}});if(!o.AuthenticationResult)return void console.log("An error occurred");(0,a.store)(s.CREDENTIALS_KEY,t(t({},o.AuthenticationResult),{},{ExpirationTimestamp:Math.round((new Date).getTime()/1e3+o.AuthenticationResult.ExpiresIn)}))}catch(n){return console.log("Invalid login, try again"),void(await p())}}async function f(){try{let r;if(!(r=(0,a.load)(s.CREDENTIALS_KEY)))throw console.log("Missing credentials"),new Error;if(g(r))try{r=await E(r.RefreshToken),(0,a.store)(s.CREDENTIALS_KEY,r)}catch(e){throw console.log(e),new Error}return r.AccessToken+""}catch(t){return await p(),f()}}async function E(e){const r=await u.initiateAuth({AuthFlow:"REFRESH_TOKEN",ClientId:s.AWS_CLIENT_ID,AuthParameters:{REFRESH_TOKEN:e}});if(!r.AuthenticationResult)throw new Error;return t(t({},r.AuthenticationResult),{},{RefreshToken:e,ExpirationTimestamp:Math.round((new Date).getTime()/1e3+r.AuthenticationResult.ExpiresIn)})}function g(e){return e.ExpirationTimestamp-(new Date).getTime()/1e3<300}async function d(){(0,a.store)(s.CREDENTIALS_KEY,"")}exports.logout=l,exports.login=p,exports.getAccessToken=f,exports.refreshCredentials=E,exports.isAccessTokenOld=g,exports.clearCredentials=d;
},{"./definitions":"wW3P","./storage":"GYWt","./promptLogin":"AV0o"}],"QCba":[function(require,module,exports) {
"use strict";function e(e,t){var o=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),o.push.apply(o,n)}return o}function t(t){for(var n=1;n<arguments.length;n++){var r=null!=arguments[n]?arguments[n]:{};n%2?e(Object(r),!0).forEach(function(e){o(t,e,r[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):e(Object(r)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))})}return t}function o(e,t,o){return(t=n(t))in e?Object.defineProperty(e,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[t]=o,e}function n(e){var t=r(e,"string");return"symbol"==typeof t?t:String(t)}function r(e,t){if("object"!=typeof e||null===e)return e;var o=e[Symbol.toPrimitive];if(void 0!==o){var n=o.call(e,t||"default");if("object"!=typeof n)return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}var l=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(exports,"__esModule",{value:!0});const a=l(require("node-fetch")),i=require("./credentialsHandler"),s=require("./util"),c=l(require("form-data")),u=l(require("fs")),f=l(require("path")),g={},d="..";async function p(){const e=u.default.readdirSync(d).filter(e=>e.includes(".Replay.gbx")),t={},o=[];if(e.forEach(e=>{const[n]=e.split("."),[r,l]=n.split("__");t[r]&&t[r].time<Number(l)?o.push(e):t[r]={time:Number(l),fileName:e}}),0===o.length)console.log("Nothing to clean up");else{console.log(`${o.length} ghost${1===o.length?"":"s"} can be deleted:`),o.forEach(e=>console.log(`- ${e}`));const e=(0,s.question)("Delete now? (Y/n): ");"y"!==e.toLowerCase()&&""!==e||o.forEach(e=>u.default.rmSync(f.default.join(d,e))),console.log(`Deleted ${o.length} ghost${1===o.length?"":"s"}`)}}async function h(){const e=await(0,a.default)("https://api.ckal.dk/tmr/tracks",{headers:{Authorization:await(0,i.getAccessToken)()}});if(!e.ok)return void console.log("An error occurred");const t=await e.json(),o=[];t.forEach(e=>{Object.entries(e.records).forEach(([,e])=>o.push(e.fileName.replace("<>","__").split("/")[1]))});const n=u.default.readdirSync(d).filter(e=>e.includes(".Replay.gbx")),r=o.filter(e=>!n.includes(e));if(0===r.length)return void console.log("No new ghosts");const l=(0,s.question)(`${r.length} new ghost${1===r.length?"":"s"}. Download now? (Y/n): `);"y"!==l.toLowerCase()&&""!==l||(console.log(`Downloading new ghost${1===r.length?"":"s"}...`),await Promise.all(r.map(async e=>{g[e]=Date.now()+3e4,await(0,s.downloadFile)(e.replace("__","<>"),d),console.log(`Downloaded ghost on ${e.split("_")[1]}`)}))),p()}async function w(e){if(!e.includes(".Replay.gbx"))throw new Error(`Tried to upload ${e} but is not a ghost file`);y(u.default.readFileSync(e,"utf-8"))}async function y(e){console.log(`Attempting to upload ${e}`);const o=new c.default;o.append("file",u.default.createReadStream(e));const n=await(0,a.default)("https://api.ckal.dk/tmr/upload",{method:"POST",headers:t({Authorization:await(0,i.getAccessToken)()},o.getHeaders()),body:o});n.ok?(console.log(n.ok),console.log(`Updated ghost ${e}'`)):console.log(n.status,await n.text())}(async()=>{const{version:e}=JSON.parse(u.default.readFileSync("package.json").toString());for(console.log(`Running TrackMania Registry watcher v${e}`),await(0,i.getAccessToken)(),console.log(),console.log("Watching for file changes..."),u.default.watch(d,(e,t)=>{if(null==t||!t.includes(".Replay.gbx"))return;const o=u.default.statSync(f.default.join(d,t)).mtimeMs;t&&(!g[t]||g[t]<o)&&(g[t]=o,w(f.default.join(d,t)))});;){console.log();const e=(0,s.question)("(E)xit, (S)ync, (C)lean up, (L)og out: ");"e"===e.toLowerCase()?process.exit():"s"===e.toLowerCase()?await h():"c"===e.toLowerCase()?p():"l"===e.toLowerCase()?((0,i.logout)(),console.log("Logged out..."),await(0,i.login)()):console.log("Input not recognized")}})();
},{"./credentialsHandler":"ooF7","./util":"BHXf"}]},{},["QCba"], null)
//# sourceMappingURL=/bundle.js.map