parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"wW3P":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.BUCKET_URL=exports.AWS_CLIENT_ID=exports.CREDENTIALS_KEY=void 0,exports.CREDENTIALS_KEY="credentials",exports.AWS_CLIENT_ID="6nki0f24aj9hrvluekbmkea631",exports.BUCKET_URL="https://trackmania-registry.s3.eu-west-1.amazonaws.com";
},{}],"GYWt":[function(require,module,exports) {
"use strict";var t=this&&this.__importDefault||function(t){return t&&t.__esModule?t:{default:t}};Object.defineProperty(exports,"__esModule",{value:!0}),exports.load=exports.store=exports.STORAGE_FILE=void 0;const e=t(require("fs"));function r(t,r){const o=s();o[t]=r,e.default.writeFileSync(exports.STORAGE_FILE,JSON.stringify(o))}function o(t){return s()[t]}function s(){try{return JSON.parse(e.default.readFileSync(exports.STORAGE_FILE).toString())}catch(t){return e.default.writeFileSync(exports.STORAGE_FILE,JSON.stringify({})),{}}}exports.STORAGE_FILE="tmr.json",exports.store=r,exports.load=o;
},{}],"BHXf":[function(require,module,exports) {
"use strict";var e=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(exports,"__esModule",{value:!0}),exports.hiddenQuestion=exports.question=exports.downloadFile=exports.msToLaptime=void 0;const t=e(require("node-fetch")),r=e(require("fs")),o=e(require("stream")),s=require("util"),i=require("./definitions"),n=e(require("path")),a=e(require("readline"));function u(e){if(void 0===e)return"";const t=Math.abs(e);if(t<1e3)return(e<0?"-":"")+`00:${Math.round(t/10).toString().padStart(2,"0")}`;const r=Math.floor(t/6e4),o=Math.floor(t%6e4/1e3),s=t%1e3;return isNaN(t)||isNaN(r)||isNaN(o)||isNaN(s)?"":(e<0?"-":"")+`${r?r+":":""}${o.toString().padStart(r>0?2:0,"0")}:${Math.floor(s/10).toString().padStart(2,"0")}`}async function d(e,a){const u=(0,s.promisify)(o.default.pipeline),d=await(0,t.default)(`${i.BUCKET_URL}/ghosts/${e}`);if(!d.ok)throw new Error(`unexpected response ${d.statusText}`);await u(d.body,r.default.createWriteStream(n.default.join(a,e.replace("<>","__"))))}exports.msToLaptime=u,exports.downloadFile=d;const c=a.default.createInterface({input:process.stdin,output:process.stdout});function p(e){return new Promise(t=>{c.question(e,e=>t(e))})}function f(e){return new Promise(t=>{const r=t=>{switch(t+=""){case"\n":case"\r":case"":process.stdin.removeListener("data",r);break;default:process.stdout.clearLine(0),process.stdout.cursorTo(0),process.stdout.write(e+Array(c.line.length+1).join("*"))}};process.stdin.on("data",r),c.question(e,e=>{t(e)})})}exports.question=p,exports.hiddenQuestion=f;
},{"./definitions":"wW3P"}],"AV0o":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.getEmailPassword=void 0;const e=require("./util");async function s(){return{email:await(0,e.question)("CKAL email: "),password:await(0,e.hiddenQuestion)("Password: ")}}exports.getEmailPassword=s;
},{"./util":"BHXf"}],"ooF7":[function(require,module,exports) {
"use strict";function e(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),r.push.apply(r,n)}return r}function t(t){for(var n=1;n<arguments.length;n++){var o=null!=arguments[n]?arguments[n]:{};n%2?e(Object(o),!0).forEach(function(e){r(t,e,o[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(o)):e(Object(o)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(o,e))})}return t}function r(e,t,r){return(t=n(t))in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function n(e){var t=o(e,"string");return"symbol"==typeof t?t:String(t)}function o(e,t){if("object"!=typeof e||null===e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var n=r.call(e,t||"default");if("object"!=typeof n)return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}Object.defineProperty(exports,"__esModule",{value:!0}),exports.clearCredentials=exports.isAccessTokenOld=exports.refreshCredentials=exports.getAccessToken=exports.login=exports.logout=void 0;const i=require("@aws-sdk/client-cognito-identity-provider"),s=require("./definitions"),a=require("./storage"),c=require("./promptLogin"),u=new i.CognitoIdentityProvider({region:"eu-west-1"});function l(){(0,a.store)(s.CREDENTIALS_KEY,void 0)}async function p(){const{email:e,password:r}=await(0,c.getEmailPassword)();try{const o=await u.initiateAuth({AuthFlow:"USER_PASSWORD_AUTH",ClientId:s.AWS_CLIENT_ID,AuthParameters:{USERNAME:e.replaceAll(" ",""),PASSWORD:r}});if(!o.AuthenticationResult)return void console.log("An error occurred");(0,a.store)(s.CREDENTIALS_KEY,t(t({},o.AuthenticationResult),{},{ExpirationTimestamp:Math.round((new Date).getTime()/1e3+o.AuthenticationResult.ExpiresIn)}))}catch(n){return console.log("Invalid login, try again"),void(await p())}}async function f(){try{let r;if(!(r=(0,a.load)(s.CREDENTIALS_KEY)))throw console.log("Missing credentials"),new Error;if(g(r))try{r=await E(r.RefreshToken),(0,a.store)(s.CREDENTIALS_KEY,r)}catch(e){throw console.log(e),new Error}return r.AccessToken+""}catch(t){return await p(),f()}}async function E(e){const r=await u.initiateAuth({AuthFlow:"REFRESH_TOKEN",ClientId:s.AWS_CLIENT_ID,AuthParameters:{REFRESH_TOKEN:e}});if(!r.AuthenticationResult)throw new Error;return t(t({},r.AuthenticationResult),{},{RefreshToken:e,ExpirationTimestamp:Math.round((new Date).getTime()/1e3+r.AuthenticationResult.ExpiresIn)})}function g(e){return e.ExpirationTimestamp-(new Date).getTime()/1e3<300}async function d(){(0,a.store)(s.CREDENTIALS_KEY,"")}exports.logout=l,exports.login=p,exports.getAccessToken=f,exports.refreshCredentials=E,exports.isAccessTokenOld=g,exports.clearCredentials=d;
},{"./definitions":"wW3P","./storage":"GYWt","./promptLogin":"AV0o"}],"QCba":[function(require,module,exports) {
"use strict";function e(e,t){var o=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),o.push.apply(o,n)}return o}function t(t){for(var n=1;n<arguments.length;n++){var r=null!=arguments[n]?arguments[n]:{};n%2?e(Object(r),!0).forEach(function(e){o(t,e,r[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(r)):e(Object(r)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(r,e))})}return t}function o(e,t,o){return(t=n(t))in e?Object.defineProperty(e,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[t]=o,e}function n(e){var t=r(e,"string");return"symbol"==typeof t?t:String(t)}function r(e,t){if("object"!=typeof e||null===e)return e;var o=e[Symbol.toPrimitive];if(void 0!==o){var n=o.call(e,t||"default");if("object"!=typeof n)return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return("string"===t?String:Number)(e)}var a=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(exports,"__esModule",{value:!0});const i=a(require("node-fetch")),l=require("./credentialsHandler"),s=require("./util"),c=a(require("form-data")),u=a(require("fs")),d=a(require("path")),f={},g="..";async function p(){const e=u.default.readdirSync(g).filter(e=>e.includes(".Replay.gbx")),t={},o=[];if(e.forEach(e=>{const[n]=e.split("."),[r,a]=n.split("__");t[r]&&t[r].time<Number(a)?o.push(e):t[r]={time:Number(a),fileName:e}}),0===o.length)console.log("Nothing to clean up");else{console.log(`${o.length} ghost${1===o.length?"":"s"} can be deleted:`),o.forEach(e=>console.log(`- ${e}`));const e=await(0,s.question)("Delete now? (Y/n): ");"y"!==e.toLowerCase()&&""!==e||o.forEach(e=>u.default.rmSync(d.default.join(g,e))),console.log(`Deleted ${o.length} ghost${1===o.length?"":"s"}`)}}async function w(){const[e,t]=await Promise.all([(0,i.default)("https://api.ckal.dk/tmr/username",{headers:{Authorization:await(0,l.getAccessToken)()}}),(0,i.default)("https://api.ckal.dk/tmr/trackgroups",{headers:{Authorization:await(0,l.getAccessToken)()}})]);if(!e.ok||!t.ok)return void console.log("An error occurred");const o=(await t.json()).reduce((e,t)=>e.concat(...t.tracks),[]),n=(await e.json()).username,r=[];o.forEach(e=>{Object.entries(e.records).filter(([e])=>e!==n).forEach(([,e])=>r.push(e.fileName.replace("<>","__").split("/")[1]))});const a=u.default.readdirSync(g).filter(e=>e.includes(".Replay.gbx")),c=r.filter(e=>!a.includes(e));if(0===c.length)return void console.log("No new ghosts");const d=await(0,s.question)(`${c.length} new ghost${1===c.length?"":"s"}. Download now? (Y/n): `);"y"!==d.toLowerCase()&&""!==d||(console.log(`Downloading new ghost${1===c.length?"":"s"}...`),await Promise.all(c.map(async e=>{f[e]=Date.now()+3e4,await(0,s.downloadFile)(e.replace("__","<>"),g),console.log(`Downloaded ghost ${e.split("__")[0]}`)}))),await p()}async function h(e){if(!e.includes(".Replay.gbx"))throw new Error(`Tried to upload ${e} but is not a ghost file`);await y(e)}async function y(e){console.log(`Attempting to upload ${e}`);const o=new c.default;o.append("file",u.default.createReadStream(e));const n=await(0,i.default)("https://api.ckal.dk/tmr/upload",{method:"POST",headers:t({Authorization:await(0,l.getAccessToken)()},o.getHeaders()),body:o});console.log((await n.text()).slice(1,-1))}(async()=>{const{version:e}=JSON.parse(u.default.readFileSync("package.json").toString());for(console.log(`Running TrackMania Registry watcher v${e}`),await(0,l.getAccessToken)(),console.log(),console.log("Commands are: (E)xit, (S)ync, (C)lean up and (L)og out"),console.log(),console.log("Watching for file changes..."),console.log(),await w(),u.default.watch(g,(e,t)=>{if(null==t||!t.includes(".Replay.gbx")||t.includes("__"))return;try{u.default.readFileSync(d.default.join(g,t))}catch(n){return}const o=u.default.statSync(d.default.join(g,t)).mtimeMs;t&&(!f[t]||f[t]<o)&&(f[t]=o,h(d.default.join(g,t)))});;){const e=await(0,s.question)("");"e"===e.toLowerCase()?process.exit():"s"===e.toLowerCase()?await w():"c"===e.toLowerCase()?await p():"l"===e.toLowerCase()?((0,l.logout)(),console.log("Logged out..."),await(0,l.login)()):console.log("Input not recognized")}})();
},{"./credentialsHandler":"ooF7","./util":"BHXf"}]},{},["QCba"], null)
//# sourceMappingURL=/bundle.js.map