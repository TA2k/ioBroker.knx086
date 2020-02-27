"use strict";
// eslint-disable-next-line no-unused-vars
const main = function(req, module) {
    /**
   * @param {string} p
   * @param {string} parent
   * @return {?}
   */
    function require(p, parent) {
        let path;
        let mod;
        if ("." != p[0] && "/" != p[0]) {
            return req(p);
        }
        if (parent = parent || "root", path = require.resolve(p), !path && /\.json$/i.test(p)) {
            return req("./" + require.basename(p));
        }
        if (mod = require.cache[path], !mod) {
            try {
                return req(p);
            } catch (runErr) {
                throw Error('failed to require "' + p + '" from ' + parent + "\n" + runErr.message + "\n" + runErr.stack);
            }
        }
        return mod.exports || (mod.exports = {}, mod.call(mod.exports, mod, mod.exports, require.relative(path))), mod.exports;
    }
    require.cache = {};
    require.basename = req("path").basename;
    /**
   * @param {string} path
   * @return {?}
   */
    require.resolve = function(path) {
        let customizationsPath;
        let _ref;
        let _i;
        let mod;
        if ("." != path[0]) {
            return req.resolve(path);
        }
        customizationsPath = "/" === path.slice(-1) ? path : path + "/";
        /** @type {!Array} */
        _ref = [path, path + ".js", customizationsPath + "index.js", path + ".json", customizationsPath + "index.json"];
        /** @type {number} */
        _i = 0;
        for (; mod = _ref[_i]; _i++) {
            if (require.cache[mod]) {
                return mod;
            }
        }
    };
    /**
   * @param {string} name
   * @param {string} aClass
   * @return {undefined}
   */
    require.register = function(name, aClass) {
    /** @type {string} */
        require.cache[name] = aClass;
    };
    /**
   * @param {string} parent
   * @return {?}
   */
    require.relative = function(parent) {
    /**
     * @param {string} date
     * @return {?}
     */
        function relative(date) {
            let d;
            let p;
            let hi;
            let i;
            let h;
            if ("." != date[0]) {
                return require(date);
            }
            d = parent.split("/");
            p = date.split("/");
            d.pop();
            /** @type {number} */
            hi = 0;
            i = p.length;
            for (; i > hi; hi = hi + 1) {
                h = p[hi];
                if (".." == h) {
                    d.pop();
                } else {
                    if ("." != h) {
                        d.push(h);
                    }
                }
            }
            return require(d.join("/"), parent);
        }
        return relative.resolve = require.resolve, relative.cache = require.cache, relative;
    };
    require.register("./main.js", function(a, b, require) {
    /**
     * @param {!Object} p
     * @param {!Function} callback
     * @return {undefined}
     */
        function f(p, callback) {
            let m;
            let elapsed;
            let start = process.hrtime();
            for (m in p) {
                if (m.match(/\/M.*?/)) {
                    self.log.debug("Found device : " + p[m].Name);
                }
            }
            elapsed = process.hrtime(start);
            self.log.debug("knx.js Zeitmessung parseProject STOPP : ", elapsed[0] + "s  " + elapsed[1] / 1e6 + "ms");
            start = process.hrtime();
            self.log.debug("knx.js Time fillProject start.");
            generateGas.getGAS(p, function(error_func, uid) {
                if (error_func) {
                    callback({
                        error : error_func
                    });
                } else {
                    save(uid, 0, false, function(deletedCount) {
                        generateGas.getRoomFunctions(p, function(a, oris) {
                            each(oris, function() {
                                callback({
                                    error : null,
                                    count : deletedCount
                                });
                            });
                        });
                    });
                }
            });
            elapsed = process.hrtime(start);
            self.log.debug("knx.js Time fillProject STOP : " + elapsed[0] + "s  " + elapsed[1] / 1e6 + "ms");
            self.config.restart();
        }
        /**
     * @param {?} list
     * @param {!Function} cb
     * @return {undefined}
     */
        function each(list, cb) {
            console.log("main.js: Start generateRoomAndFunctions");
            self.getForeignObjects(self.namespace + ".*", function(canCreateDiscussions, newObserveSet) {
                /** @type {!Array} */
                const destination = [];
                const f = {};
                underscore.each(newObserveSet, function(elem) {
                    /** @type {!Object} */
                    f[elem["native"].addressRefId] = elem;
                });
                underscore.each(list, function(result) {
                    let j;
                    let selection;
                    let idSegments;
                    let i;
                    const courseSections = result.facility;
                    const rooms = result.functions.rooms;
                    let item = {};
                    /** @type {number} */
                    j = 0;
                    for (; j < rooms.length; j++) {
                        if (selection = [], idSegments = [], item = {}, rooms[j].functions) {
                            idSegments = rooms[j].functions.split(",");
                            /** @type {number} */
                            i = 0;
                            for (; i < idSegments.length; i++) {
                                if (idSegments[i] in f) {
                                    selection.push(f[idSegments[i]]._id);
                                }
                            }
                        }
                        item = {
                            _id : "enum.rooms." + courseSections + "." + rooms[j].room,
                            common : {
                                name : rooms[j].room,
                                members : selection
                            },
                            type : "enum"
                        };
                        destination.push(item);
                    }
                });
                save(destination, 0, true, cb);
            });
            console.log("main.js: Stopp generateRoomAndFunctions");
        }
        /**
     * @param {!Array} value
     * @param {number} i
     * @param {boolean} document
     * @param {!Function} callback
     * @return {?}
     */
        function save(value, i, document, callback) {
            return i >= value.length ? void("function" == typeof callback && callback(value.length)) : void(document ? self.getForeignObject(value[i]._id, function(canCreateDiscussions, obj) {
                if (obj) {
                    if (value[i].common.members) {
                        obj.common = obj.common || {};
                        obj.common.members = obj.common.members || [];
                        /** @type {number} */
                        let j = 0;
                        for (; j < value[i].common.members.length; j++) {
                            if (-1 === obj.common.members.indexOf(value[i].common.members[j])) {
                                obj.common.members.push(value[i].common.members[j]);
                            }
                        }
                    }
                    self.setForeignObject(obj._id, obj, function() {
                        setTimeout(save, 0, value, i + 1, document, callback);
                    });
                } else {
                    self.setForeignObject(value[i]._id, value[i], function() {
                        setTimeout(save, 0, value, i + 1, document, callback);
                    });
                }
            }) : self.extendObject(value[i]._id, value[i], function() {
                setTimeout(save, 0, value, i + 1, document, callback);
            }));
        }
        /**
     * @param {(Object|string)} options
     * @return {?}
     */
        function filter(options) {
            let option;
            for (option in options) {
                if (options.hasOwnProperty(option)) {
                    return false;
                }
            }
            return true;
        }
        /**
     * @return {undefined}
     */
        function connect() {
            /** @type {number} */
            let a = 0;
            /** @type {number} */
            let b = 0;
            res = knx.Connection({
                ipAddr : self.config.gwip,
                ipPort : self.config.gwipport,
                physAddr : self.config.eibadr,
                minimumDelay : self.config.sendDelay,
                handlers : {
                    connected : function() {
                        if (filter(versions)) {
                            let i;
                            for (i in result) {
                                if (i.match(/\d*\/\d*\/\d*/) && result[i]["native"].dpt) {
                                    try {
                                        if (result[i].common.read) {
                                            versions[i] = new knx.Datapoint({
                                                ga : i,
                                                dpt : result[i]["native"].dpt,
                                                autoread : true
                                            }, res);
                                        } else {
                                            if (result[i]["native"].statusGARefId) {
                                                versions[i] = new knx.Datapoint({
                                                    ga : i,
                                                    status_ga : result[i]["native"].statusGARefId,
                                                    dpt : result[i]["native"].dpt,
                                                    autoread : false
                                                }, res);
                                                self.log.info(" DPP erstellt f\u00fcr : " + i + "    " + result[i].common.name + "mit " + result[i]["native"].dpt);
                                            } else {
                                                versions[i] = new knx.Datapoint({
                                                    ga : i,
                                                    dpt : result[i]["native"].dpt,
                                                    autoread : false
                                                }, res);
                                            }
                                        }
                                    } catch (nameOrPid) {
                                        self.log.warn("could not create controlDPT for " + i + " with error: " + nameOrPid);
                                        self.log.warn("maybe missing dptxxx.js definition");
                                        console.log(" could not create controlDPT for " + i + "     " + versions[i] + " with error: " + nameOrPid);
                                        console.log(" maybe missing dptxxx.js definition");
                                    }
                                    b++;
                                }
                                a++;
                            }
                        }
                        self.setState("info.connection", true, true);
                        self.log.info("Connected!");
                        console.log("Connected!   with " + b + " datapoints of " + a + " Datapoints over all.");
                    },
                    event : function(eventInfo, e, id, options) {
                        let rNameDecl;
                        let data;
                        switch(eventInfo) {
                            case "GroupValue_Read":
                                if (result[id]) {
                                    rNameDecl = result[id].common.name;
                                    try {
                                        self.log.debug("Read from " + e + " to (" + id + ") " + rNameDecl);
                                    } catch (nameOrPid) {
                                        console.warn(" unable to get Value from " + id + " because of : " + nameOrPid);
                                    }
                                }
                                break;
                            case "GroupValue_Response":
                                if (result[id]) {
                                    data = result[id];
                                    rNameDecl = result[id].common.name;
                                    if (versions[id] && versions[id].current_value) {
                                        self.setForeignState(result[id]._id, {
                                            val : versions[id].current_value,
                                            ack : true
                                        });
                                    }
                                    if (data["native"].actGARefId) {
                                        console.info(" on Response update of actGARefId : " + data["native"].actGARefId + "     of  " + result[data["native"].actGARefId]._id + "   with value  " + versions[id].current_value);
                                        self.log.info(" update of actGARefId : " + data["native"].actGARefId + "     of  " + result[data["native"].actGARefId]._id + "   with value  " + versions[id].current_value);
                                        self.setForeignState(result[data["native"].actGARefId]._id, {
                                            val : versions[id].current_value,
                                            ack : true
                                        });
                                    }
                                }
                                break;
                            case "GroupValue_Write":
                                if (result[id] && void 0 !== options) {
                                    if (data = result[id], options && "object" == typeof options && versions[id]) {
                                        try {
                                            self.setForeignState(result[id]._id, {
                                                val : versions[id].current_value,
                                                ack : true
                                            });
                                            if (data["native"].actGARefId) {
                                                console.info(" update of actGARefId : " + data["native"].actGARefId + " of " + result[data["native"].actGARefId]._id + " to " + versions[id].current_value);
                                                self.setForeignState(result[data["native"].actGARefId]._id, {
                                                    val : versions[id].current_value,
                                                    ack : true
                                                });
                                            }
                                        } catch (foundMsg) {
                                            console.info("Wrong bufferlength on ga:" + data._id + " mit " + foundMsg);
                                        }
                                    }
                                } else {
                                    self.log.warn("Value received on unknown GA : " + id);
                                }
                                break;
                            default:
                                console.log("%s **** KNX EVENT: %j, src: %j, dest: %j, value: %j", (new Date).toISOString().replace(/T/, " ").replace(/\..+/, ""), eventInfo, e, id, options);
                        }
                    }
                }
            });
        }
        /**
     * @return {undefined}
     */
        function init() {
            self.log.info("Connecting to knx GW:  " + self.config.gwip + ":" + self.config.gwipport + "   with phy. Adr:  " + self.config.eibadr + " and SendDelay of : " + self.config.sendDelay + " ms");
            self.log.info(utils.controllerDir);
            self.setState("info.connection", false, true);
            self.subscribeStates("*");
            self.subscribeForeignObjects("enum.rooms", true);
            self.objects.getObjectView("system", "state", {
                startkey : self.namespace + ".",
                endkey : self.namespace + ".\u009999",
                include_docs : true
            }, function(maxRev, kvDocsRes) {
                let i;
                let id;
                if (maxRev) {
                    self.log.error("Cannot get objects: " + maxRev);
                } else {
                    list = {};
                    /** @type {number} */
                    i = kvDocsRes.rows.length - 1;
                    for (; i >= 0; i--) {
                        id = kvDocsRes.rows[i].id;
                        list[id] = kvDocsRes.rows[i].value;
                        if (list[id].common.desc && !list[id]["native"].dpt && -1 !== list[id].common.desc.indexOf("DP")) {
                            list[id]["native"].dpt = generateGas.convertDPTtype(list[id].common.desc);
                        } else {
                            if (list[id]["native"].dpt && -1 !== list[id]["native"].dpt.indexOf("DP")) {
                                list[id]["native"].dpt = generateGas.convertDPTtype(list[id]["native"].dpt);
                            }
                        }
                        result[list[id]["native"].address] = list[id];
                        result[list[id]["native"].addressRefId] = list[id];
                    }
                    connect();
                }
            });
        }
        let res;
        let generateGas = require("./lib/generateGAS.js");
        const knx = require("knx");
        let utils = require(__dirname + "/lib/utils.js");
        let underscore = (require("util"), require("underscore"));
        const DOMParser = require("xmldom").DOMParser;
        let result = {};
        let list = {};
        let versions = {};
        let self = utils.adapter({
            name : "knx",
            stateChange : function(id, data) {
                if (id) {
                    if (!data) {
                        const selectedId = list[id]["native"].address;
                        return data[id] && delete data[id], void(result[selectedId] && delete result[selectedId]);
                    }
                    if (!res) {
                        return void self.log.warn("stateChange: not ready");
                    }
                    if (!data.ack) {
                        if (!list[id]) {
                            return void self.log.warn("Unknown ID: " + id);
                        }
                        if ("boolean" === list[id].common.type) {
                            /** @type {number} */
                            data.val = "1" === data.val || 1 === data.val || "true" === data.val || data.val === true || "on" === data.val || "ON" === data.val ? 1 : 0;
                        } else {
                            if ("number" === list[id].common.type) {
                                if (list[id]["native"].dpt && list[id]["native"].dpt.match(/^DPT9|^DPT14/)) {
                                    /** @type {number} */
                                    data.val = parseFloat(data.val);
                                } else {
                                    /** @type {number} */
                                    data.val = parseInt(data.val, 10);
                                }
                            }
                        }
                        console.log(list[id]["native"].address, data.val, list[id]["native"].dpt);
                        res.write(list[id]["native"].address, data.val, list[id]["native"].dpt);
                    }
                }
            },
            unload : function(cb) {
                try {
                    if (res) {
                        res.Disconnect();
                    }
                } finally {
                    cb();
                }
            },
            ready : init
        });
        let o = {};
        self.on("message", function(obj) {
            let i;
            if (obj) {
                switch(obj.command) {
                    case "projectStart":
                        o = {};
                        if (obj.callback) {
                            self.sendTo(obj.from, obj.command, {}, obj.callback);
                        }
                        break;
                    case "projectXml0":
                        o["0.xml"] = (new DOMParser).parseFromString(obj.message.xml0);
                        if (obj.callback) {
                            self.sendTo(obj.from, obj.command, {}, obj.callback);
                        }
                        break;
                    case "projectKnxMaster":
                        o["knx_master.xml"] = (new DOMParser).parseFromString(obj.message.knx_master);
                        if (obj.callback) {
                            self.sendTo(obj.from, obj.command, {}, obj.callback);
                        }
                        break;
                    case "projectDeviceFile":
                        o[obj.message.file.DeviceId] = obj.message.file;
                        if (obj.callback) {
                            self.sendTo(obj.from, obj.command, {}, obj.callback);
                        }
                        break;
                    case "projectComObjectTable":
                        for (i in obj.message) {
                            o.file.ComObjectTable[i] = obj.message[i];
                        }
                        if (obj.callback) {
                            self.sendTo(obj.from, obj.command, {}, obj.callback);
                        }
                        break;
                    case "projectComObjectRefs":
                        for (i in obj.message) {
                            o.file.ComObjectRefs[i] = obj.message[i];
                        }
                        if (obj.callback) {
                            self.sendTo(obj.from, obj.command, {}, obj.callback);
                        }
                        break;
                    case "projectFinished":
                        f(o, function(data) {
                            if (obj.callback) {
                                self.sendTo(obj.from, obj.command, data, obj.callback);
                            }
                        });
                        break;
                    case "write":
                        if (obj.message && obj.message.address && void 0 !== obj.message.val) {
                            res.write(obj.message.address, obj.message.val, obj.message["native"].dpt);
                        } else {
                            self.log.warn("Cannot send command to KNX: " + JSON.stringify(obj.message) + '. Expected like {address: "1/1/2", val: 5, dpt: "DPT9.001"}');
                        }
                        break;
                    case "reload":
                        process.exit(-100);
                        break;
                    default:
                        self.log.warn("Unknown command: " + obj.command);
                }
            }
            return true;
        });
    });
    require.register("./lib/dpt2iobroker.js", function(mixin) {
    /**
     * @param {?} options
     * @param {string} input
     * @return {?}
     */
        mixin.exports = function(options, input) {
            let num;
            let str;
            let typeName;
            let cb;
            let type;
            let resizewidth = options.setDPT;
            /** @type {string} */
            const output = "" + input;
            switch(options.setDPT) {
                case "DPT-1":
                    switch(num = 0, str = 1, typeName = "", type = "boolean", output) {
                        case "0":
                            /** @type {string} */
                            cb = "value";
                            /** @type {string} */
                            typeName = "";
                            break;
                        case "1":
                            /** @type {string} */
                            cb = "value";
                            /** @type {string} */
                            typeName = "";
                            break;
                        case "2":
                            /** @type {string} */
                            cb = "switch";
                            /** @type {string} */
                            typeName = "";
                            break;
                        case "3":
                            /** @type {string} */
                            cb = "switch";
                            /** @type {string} */
                            typeName = "";
                            break;
                        case "4":
                            /** @type {string} */
                            cb = "switch";
                            /** @type {string} */
                            typeName = "";
                    }break;
                case "DPST-1-1":
                    switch(num = 0, str = 1, typeName = "", type = "boolean", output) {
                        case "0":
                            /** @type {string} */
                            cb = "value";
                            /** @type {string} */
                            typeName = "";
                            break;
                        case "1":
                            /** @type {string} */
                            cb = "value";
                            /** @type {string} */
                            typeName = "";
                            break;
                        case "2":
                            /** @type {string} */
                            cb = "switch";
                            /** @type {string} */
                            typeName = "";
                            break;
                        case "3":
                            /** @type {string} */
                            cb = "switch";
                            /** @type {string} */
                            typeName = "";
                            break;
                        case "4":
                            /** @type {string} */
                            cb = "switch";
                            /** @type {string} */
                            typeName = "";
                    }break;
                case "DPST-1-2":
                    switch(num = 0, str = 1, typeName = "", type = "boolean", output) {
                        case "0":
                            /** @type {string} */
                            cb = "value";
                            /** @type {string} */
                            typeName = "";
                            break;
                        case "1":
                            /** @type {string} */
                            cb = "value";
                            /** @type {string} */
                            typeName = "";
                            break;
                        case "2":
                            /** @type {string} */
                            cb = "switch";
                            /** @type {string} */
                            typeName = "";
                            break;
                        case "3":
                            /** @type {string} */
                            cb = "switch";
                            /** @type {string} */
                            typeName = "";
                            break;
                        case "4":
                            /** @type {string} */
                            cb = "switch";
                            /** @type {string} */
                            typeName = "";
                    }break;
                case "DPT-2":
                    switch(num = 0, str = 3, typeName = "", type = "number", output) {
                        case "0":
                            /** @type {string} */
                            cb = "value";
                            break;
                        case "1":
                            /** @type {string} */
                            cb = "value";
                            break;
                        case "2":
                            /** @type {string} */
                            cb = "indicator";
                            break;
                        case "3":
                            /** @type {string} */
                            cb = "indicator";
                            break;
                        case "4":
                            /** @type {string} */
                            cb = "indicator";
                    }break;
                case "DPT-3":
                    switch(num = 0, str = 7, typeName = "", type = "number", output) {
                        case "0":
                            /** @type {string} */
                            cb = "value";
                            break;
                        case "1":
                            /** @type {string} */
                            cb = "value";
                            break;
                        case "2":
                            /** @type {string} */
                            cb = "indicator";
                            break;
                        case "3":
                            /** @type {string} */
                            cb = "indicator";
                            break;
                        case "4":
                            /** @type {string} */
                            cb = "indicator";
                    }break;
                case "DPT-4":
                    switch(num = "", str = "", typeName = "string", type = "number", output) {
                        case "0":
                            /** @type {string} */
                            cb = "text";
                            break;
                        case "1":
                            /** @type {string} */
                            cb = "text";
                            break;
                        case "2":
                            /** @type {string} */
                            cb = "text";
                            break;
                        case "3":
                            /** @type {string} */
                            cb = "text";
                            break;
                        case "4":
                            /** @type {string} */
                            cb = "text";
                    }break;
                case "DPT-5":
                    switch(num = 0, str = 255, typeName = "", type = "number", output) {
                        case "0":
                            /** @type {string} */
                            cb = "value";
                            /** @type {string} */
                            typeName = "";
                            break;
                        case "1":
                            /** @type {string} */
                            cb = "value";
                            /** @type {string} */
                            typeName = "";
                            break;
                        case "2":
                            /** @type {string} */
                            cb = "level";
                            /** @type {string} */
                            typeName = "dimmer";
                            break;
                        case "3":
                            /** @type {string} */
                            cb = "level";
                            /** @type {string} */
                            typeName = "dimmer";
                            break;
                        case "4":
                            /** @type {string} */
                            cb = "level";
                            /** @type {string} */
                            typeName = "dimmer";
                    }break;
                case "DPST-5-1":
                    switch(num = 0, str = 100, typeName = "", type = "number", output) {
                        case "0":
                            /** @type {string} */
                            cb = "value";
                            /** @type {string} */
                            typeName = "dimmer";
                            break;
                        case "1":
                            /** @type {string} */
                            cb = "value";
                            /** @type {string} */
                            typeName = "dimmer";
                            break;
                        case "2":
                            /** @type {string} */
                            cb = "level";
                            /** @type {string} */
                            typeName = "dimmer";
                            break;
                        case "3":
                            /** @type {string} */
                            cb = "level";
                            /** @type {string} */
                            typeName = "dimmer";
                            break;
                        case "4":
                            /** @type {string} */
                            cb = "level";
                            /** @type {string} */
                            typeName = "dimmer";
                    }break;
                case "DPST-5-3":
                    switch(num = 0, str = 255, typeName = "", type = "number", output) {
                        case "0":
                            /** @type {string} */
                            cb = "value";
                            break;
                        case "1":
                            /** @type {string} */
                            cb = "value";
                            break;
                        case "2":
                            /** @type {string} */
                            cb = "level";
                            break;
                        case "3":
                            /** @type {string} */
                            cb = "level";
                            break;
                        case "4":
                            /** @type {string} */
                            cb = "level";
                    }break;
                case "DPST-5-4":
                    switch(num = 0, str = 255, typeName = "", type = "number", output) {
                        case "0":
                            /** @type {string} */
                            cb = "value";
                            break;
                        case "1":
                            /** @type {string} */
                            cb = "value";
                            break;
                        case "2":
                            /** @type {string} */
                            cb = "level";
                            break;
                        case "3":
                            /** @type {string} */
                            cb = "level";
                            break;
                        case "4":
                            /** @type {string} */
                            cb = "level";
                    }break;
                case "DPST-5-5":
                    switch(num = 0, str = 255, typeName = "", type = "number", output) {
                        case "0":
                            /** @type {string} */
                            cb = "value";
                            break;
                        case "1":
                            /** @type {string} */
                            cb = "value";
                            break;
                        case "2":
                            /** @type {string} */
                            cb = "level";
                            break;
                        case "3":
                            /** @type {string} */
                            cb = "level";
                            break;
                        case "4":
                            /** @type {string} */
                            cb = "level";
                    }break;
                case "DPST-5-6":
                    switch(num = 0, str = 255, typeName = "", type = "number", output) {
                        case "0":
                            /** @type {string} */
                            cb = "value";
                            break;
                        case "1":
                            /** @type {string} */
                            cb = "value";
                            break;
                        case "2":
                            /** @type {string} */
                            cb = "level";
                            break;
                        case "3":
                            /** @type {string} */
                            cb = "level";
                            break;
                        case "4":
                            /** @type {string} */
                            cb = "level";
                    }break;
                case "DPT-6":
                    switch(num = -128, str = 127, typeName = "", output) {
                        case "0":
                            /** @type {string} */
                            cb = "value";
                            break;
                        case "1":
                            /** @type {string} */
                            cb = "value";
                            break;
                        case "2":
                            /** @type {string} */
                            cb = "level";
                            break;
                        case "3":
                            /** @type {string} */
                            cb = "level";
                            break;
                        case "4":
                            /** @type {string} */
                            cb = "level";
                    }break;
                case "DPT-7":
                    switch(num = 0, str = 65535, typeName = "", type = "number", output) {
                        case "0":
                            /** @type {string} */
                            cb = "value";
                            break;
                        case "1":
                            /** @type {string} */
                            cb = "value";
                            break;
                        case "2":
                            /** @type {string} */
                            cb = "level";
                            break;
                        case "3":
                            /** @type {string} */
                            cb = "level";
                            break;
                        case "4":
                            /** @type {string} */
                            cb = "level";
                    }break;
                case "DPT-9":
                    switch(num = -670760, str = 670760, typeName = "number", type = "number", output) {
                        case "0":
                            /** @type {string} */
                            cb = "value";
                            break;
                        case "1":
                            /** @type {string} */
                            cb = "value";
                            break;
                        case "2":
                            /** @type {string} */
                            cb = "level";
                            break;
                        case "3":
                            /** @type {string} */
                            cb = "level";
                            break;
                        case "4":
                            /** @type {string} */
                            cb = "level";
                    }break;
                case "DPST-9-1":
                    switch(num = -670760, str = 670760, typeName = "number", type = "number", output) {
                        case "0":
                            /** @type {string} */
                            cb = "value.temperature";
                            break;
                        case "1":
                            /** @type {string} */
                            cb = "value.temperature";
                            break;
                        case "2":
                            /** @type {string} */
                            cb = "level.temperature";
                            break;
                        case "3":
                            /** @type {string} */
                            cb = "level.temperature";
                            break;
                        case "4":
                            /** @type {string} */
                            cb = "level.temperature";
                    }break;
                case "DPST-9-2":
                    switch(num = -670760, str = 670760, typeName = "number", output) {
                        case "0":
                            /** @type {string} */
                            cb = "value.temperature";
                            break;
                        case "1":
                            /** @type {string} */
                            cb = "value.temperature";
                            break;
                        case "2":
                            /** @type {string} */
                            cb = "level.temperature";
                            break;
                        case "3":
                            /** @type {string} */
                            cb = "level.temperature";
                            break;
                        case "4":
                            /** @type {string} */
                            cb = "level.temperature";
                    }break;
                case "DPST-9-3":
                    switch(num = -670760, str = 670760, typeName = "number", output) {
                        case "0":
                            /** @type {string} */
                            cb = "value";
                            break;
                        case "1":
                            /** @type {string} */
                            cb = "value";
                            break;
                        case "2":
                            /** @type {string} */
                            cb = "level";
                            break;
                        case "3":
                            /** @type {string} */
                            cb = "level";
                            break;
                        case "4":
                            /** @type {string} */
                            cb = "level";
                    }break;
                case "DPST-9-4":
                    switch(num = -670760, str = 670760, typeName = "number", output) {
                        case "0":
                            /** @type {string} */
                            cb = "value.lux";
                            break;
                        case "1":
                            /** @type {string} */
                            cb = "value.lux";
                            break;
                        case "2":
                            /** @type {string} */
                            cb = "level.lux";
                            break;
                        case "3":
                            /** @type {string} */
                            cb = "level.lux";
                            break;
                        case "4":
                            /** @type {string} */
                            cb = "level.lux";
                    }break;
                case "DPST-9-5":
                    switch(num = -670760, str = 670760, typeName = "number", output) {
                        case "0":
                            /** @type {string} */
                            cb = "value.speed";
                            break;
                        case "1":
                            /** @type {string} */
                            cb = "value.speed";
                            break;
                        case "2":
                            /** @type {string} */
                            cb = "level.speed";
                            break;
                        case "3":
                            /** @type {string} */
                            cb = "level.speed";
                            break;
                        case "4":
                            /** @type {string} */
                            cb = "level.speed";
                    }break;
                case "DPST-9-6":
                    switch(num = -670760, str = 670760, typeName = "number", output) {
                        case "0":
                            /** @type {string} */
                            cb = "value.pressure";
                            break;
                        case "1":
                            /** @type {string} */
                            cb = "value.pressure";
                            break;
                        case "2":
                            /** @type {string} */
                            cb = "level.pressure";
                            break;
                        case "3":
                            /** @type {string} */
                            cb = "level.pressure";
                            break;
                        case "4":
                            /** @type {string} */
                            cb = "level.pressure";
                    }break;
                case "DPST-9-7":
                    switch(num = -670760, str = 670760, typeName = "number", output) {
                        case "0":
                            /** @type {string} */
                            cb = "value.humidity";
                            break;
                        case "1":
                            /** @type {string} */
                            cb = "value.humidity";
                            break;
                        case "2":
                            /** @type {string} */
                            cb = "level.humidity";
                            break;
                        case "3":
                            /** @type {string} */
                            cb = "level.humidity";
                            break;
                        case "4":
                            /** @type {string} */
                            cb = "level.humidity";
                    }break;
                case "DPST-9-8":
                    switch(num = -670760, str = 670760, typeName = "number", output) {
                        case "0":
                            /** @type {string} */
                            cb = "value";
                            break;
                        case "1":
                            /** @type {string} */
                            cb = "value";
                            break;
                        case "2":
                            /** @type {string} */
                            cb = "level";
                            break;
                        case "3":
                            /** @type {string} */
                            cb = "level";
                            break;
                        case "4":
                            /** @type {string} */
                            cb = "level";
                    }break;
                case "DPST-9-9":
                    switch(num = -670760, str = 670760, typeName = "number", output) {
                        case "0":
                            /** @type {string} */
                            cb = "value";
                            break;
                        case "1":
                            /** @type {string} */
                            cb = "value";
                            break;
                        case "2":
                            /** @type {string} */
                            cb = "level";
                            break;
                        case "3":
                            /** @type {string} */
                            cb = "level";
                            break;
                        case "4":
                            /** @type {string} */
                            cb = "level";
                    }break;
                case "DPST-9-10":
                    switch(num = -670760, str = 670760, typeName = "number", output) {
                        case "0":
                            /** @type {string} */
                            cb = "value";
                            break;
                        case "1":
                            /** @type {string} */
                            cb = "value";
                            break;
                        case "2":
                            /** @type {string} */
                            cb = "level";
                            break;
                        case "3":
                            /** @type {string} */
                            cb = "level";
                            break;
                        case "4":
                            /** @type {string} */
                            cb = "level";
                    }break;
                case "DPST-9-11":
                    switch(num = -670760, str = 670760, typeName = "number", output) {
                        case "0":
                            /** @type {string} */
                            cb = "value";
                            break;
                        case "1":
                            /** @type {string} */
                            cb = "value";
                            break;
                        case "2":
                            /** @type {string} */
                            cb = "level";
                            break;
                        case "3":
                            /** @type {string} */
                            cb = "level";
                            break;
                        case "4":
                            /** @type {string} */
                            cb = "level";
                    }break;
                case "DPST-9-20":
                    switch(num = -670760, str = 670760, typeName = "number", output) {
                        case "0":
                            /** @type {string} */
                            cb = "value";
                            break;
                        case "1":
                            /** @type {string} */
                            cb = "value";
                            break;
                        case "2":
                            /** @type {string} */
                            cb = "level";
                            break;
                        case "3":
                            /** @type {string} */
                            cb = "level";
                            break;
                        case "4":
                            /** @type {string} */
                            cb = "level";
                    }break;
                case "DPST-9-21":
                    switch(num = -670760, str = 670760, typeName = "number", output) {
                        case "0":
                            /** @type {string} */
                            cb = "value";
                            break;
                        case "1":
                            /** @type {string} */
                            cb = "value";
                            break;
                        case "2":
                            /** @type {string} */
                            cb = "level";
                            break;
                        case "3":
                            /** @type {string} */
                            cb = "level";
                            break;
                        case "4":
                            /** @type {string} */
                            cb = "level";
                    }break;
                case "DPST-9-22":
                    switch(num = -670760, str = 670760, typeName = "number", output) {
                        case "0":
                            /** @type {string} */
                            cb = "value";
                            break;
                        case "1":
                            /** @type {string} */
                            cb = "value";
                            break;
                        case "2":
                            /** @type {string} */
                            cb = "level";
                            break;
                        case "3":
                            /** @type {string} */
                            cb = "level";
                            break;
                        case "4":
                            /** @type {string} */
                            cb = "level";
                    }break;
                case "DPST-9-23":
                    switch(num = -670760, str = 670760, typeName = "number", output) {
                        case "0":
                            /** @type {string} */
                            cb = "value";
                            break;
                        case "1":
                            /** @type {string} */
                            cb = "value";
                            break;
                        case "2":
                            /** @type {string} */
                            cb = "level";
                            break;
                        case "3":
                            /** @type {string} */
                            cb = "level";
                            break;
                        case "4":
                            /** @type {string} */
                            cb = "level";
                    }break;
                case "DPST-9-24":
                    switch(num = -670760, str = 670760, typeName = "number", output) {
                        case "0":
                            /** @type {string} */
                            cb = "value";
                            break;
                        case "1":
                            /** @type {string} */
                            cb = "value";
                            break;
                        case "2":
                            /** @type {string} */
                            cb = "level";
                            break;
                        case "3":
                            /** @type {string} */
                            cb = "level";
                            break;
                        case "4":
                            /** @type {string} */
                            cb = "level";
                    }break;
                case "DPST-9-25":
                    switch(num = -670760, str = 670760, typeName = "number", output) {
                        case "0":
                            /** @type {string} */
                            cb = "value";
                            break;
                        case "1":
                            /** @type {string} */
                            cb = "value";
                            break;
                        case "2":
                            /** @type {string} */
                            cb = "level";
                            break;
                        case "3":
                            /** @type {string} */
                            cb = "level";
                            break;
                        case "4":
                            /** @type {string} */
                            cb = "level";
                    }break;
                case "DPST-9-26":
                    switch(num = -670760, str = 670760, typeName = "number", output) {
                        case "0":
                            /** @type {string} */
                            cb = "value";
                            break;
                        case "1":
                            /** @type {string} */
                            cb = "value";
                            break;
                        case "2":
                            /** @type {string} */
                            cb = "level";
                            break;
                        case "3":
                            /** @type {string} */
                            cb = "level";
                            break;
                        case "4":
                            /** @type {string} */
                            cb = "level";
                    }break;
                case "DPST-9-27":
                    switch(num = -670760, str = 670760, typeName = "number", output) {
                        case "0":
                            /** @type {string} */
                            cb = "value";
                            break;
                        case "1":
                            /** @type {string} */
                            cb = "value";
                            break;
                        case "2":
                            /** @type {string} */
                            cb = "level";
                            break;
                        case "3":
                            /** @type {string} */
                            cb = "level";
                            break;
                        case "4":
                            /** @type {string} */
                            cb = "level";
                    }break;
                case "DPST-9-28":
                    switch(num = -670760, str = 670760, typeName = "number", output) {
                        case "0":
                            /** @type {string} */
                            cb = "value";
                            break;
                        case "1":
                            /** @type {string} */
                            cb = "value";
                            break;
                        case "2":
                            /** @type {string} */
                            cb = "level";
                            break;
                        case "3":
                            /** @type {string} */
                            cb = "level";
                            break;
                        case "4":
                            /** @type {string} */
                            cb = "level";
                    }break;
                case "DPT-13":
                    switch(num = '"122147483648', str = "2147483647", typeName = "number", output) {
                        case "0":
                            /** @type {string} */
                            cb = "value";
                            break;
                        case "1":
                            /** @type {string} */
                            cb = "value";
                            break;
                        case "2":
                            /** @type {string} */
                            cb = "level";
                            break;
                        case "3":
                            /** @type {string} */
                            cb = "level";
                            break;
                        case "4":
                            /** @type {string} */
                            cb = "level";
                    }break;
                case "DPT-16":
                    switch(num = "", str = "", typeName = "string", output) {
                        case "0":
                            /** @type {string} */
                            cb = "text";
                            break;
                        case "1":
                            /** @type {string} */
                            cb = "text";
                            break;
                        case "2":
                            /** @type {string} */
                            cb = "text";
                            break;
                        case "3":
                            /** @type {string} */
                            cb = "text";
                            break;
                        case "4":
                            /** @type {string} */
                            cb = "text";
                    }break;
                case "DPST-16-0":
                    switch(num = "", str = "", typeName = "string", output) {
                        case "0":
                            /** @type {string} */
                            cb = "text";
                            break;
                        case "1":
                            /** @type {string} */
                            cb = "text";
                            break;
                        case "2":
                            /** @type {string} */
                            cb = "text";
                            break;
                        case "3":
                            /** @type {string} */
                            cb = "text";
                            break;
                        case "4":
                            /** @type {string} */
                            cb = "text";
                    }break;
                case "DPST-16-1":
                    switch(num = "", str = "", typeName = "string", output) {
                        case "0":
                            /** @type {string} */
                            cb = "text";
                            break;
                        case "1":
                            /** @type {string} */
                            cb = "text";
                            break;
                        case "2":
                            /** @type {string} */
                            cb = "text";
                            break;
                        case "3":
                            /** @type {string} */
                            cb = "text";
                            break;
                        case "4":
                            /** @type {string} */
                            cb = "text";
                    }break;
                default:
                    switch(resizewidth = "", num = 0, str = 1, typeName = "", output) {
                        case "0":
                            /** @type {string} */
                            cb = "value";
                            break;
                        case "1":
                            /** @type {string} */
                            cb = "value";
                            break;
                        case "2":
                            /** @type {string} */
                            cb = "indicator";
                            break;
                        case "3":
                            /** @type {string} */
                            cb = "indicator";
                            break;
                        case "4":
                            /** @type {string} */
                            cb = "indicator";
                    }
            }
            return {
                setDPT : resizewidth,
                setMin : num,
                setMax : str,
                setType : typeName,
                setRole : cb,
                stateType : type
            };
        };
    });
    require.register("./lib/generateGAS.js", function(mixin, b, require) {
    /**
     * @param {?} storedAnnotations
     * @return {?}
     */
        function onMessage(storedAnnotations) {
            switch(storedAnnotations) {
                case "Disabled":
                    return false;
                case "Enabled":
                    return true;
            }
        }
        /**
     * @param {number} addressData
     * @return {?}
     */
        function makeAddress(addressData) {
            return util.format("%d/%d/%d", addressData >>> 11 & 15, addressData >> 8 & 7, 255 & addressData);
        }
        /**
     * @param {?} id
     * @return {?}
     */
        function listAddItem(id) {
            /** @type {!Array} */
            let str = [];
            const originalArticleNode = model[id].Read;
            const e = model[id].Write;
            const IMG = model[id].Update;
            const copytext = model[id].Dpt;
            const protoProps = model[id].statusGA;
            const staticProps = model[id].actGA;
            /** @type {number} */
            let dir = 0;
            /** @type {boolean} */
            let sdir = false;
            return str.setDPT = copytext, protoProps || staticProps ? (protoProps && (dir = 4), staticProps && (dir = 0)) : (("Enabled" !== originalArticleNode || "Enabled" !== IMG || "Disabled" !== e) && "" === id.statusGA || sdir || (dir = 0, sdir = true), ("Disabled" !== originalArticleNode && "Enabled" !== IMG || "Disabled" !== e) && "" === id.statusGA || sdir || (dir = 0, sdir = true), ("Enabled" !== originalArticleNode && "Enabled" !== IMG || "Disabled" !== e) && "" === id.statusGA || sdir || (dir = 
      1, sdir = true), "Disabled" !== originalArticleNode && "Enabled" !== IMG || "Enabled" !== e || sdir || (dir = 2, sdir = true), "Enabled" !== originalArticleNode && "Enabled" !== IMG || "Enabled" !== e || sdir || (dir = 3, sdir = true), "Disabled" !== originalArticleNode && "Disabled" !== IMG || "Enabled" !== e || (dir = 4, sdir = true)), str = dpt2iobroker(str, dir);
        }
        /**
     * @param {string} n
     * @return {?}
     */
        function f(n) {
            if ("string" == typeof n) {
                /** @type {string} */
                n = n.replace(/\s/g, "");
                /** @type {(Array<string>|null)} */
                const b = n.match(/^DPS?T-?(\d+)[.-]?(\d+)?/);
                if (b) {
                    /** @type {string} */
                    n = "DPT" + b[1];
                    if (void 0 !== b[2]) {
                        if (1 === b[2].length) {
                            /** @type {string} */
                            b[2] = "00" + b[2];
                        } else {
                            if (2 === b[2].length) {
                                /** @type {string} */
                                b[2] = "0" + b[2];
                            }
                        }
                        /** @type {string} */
                        n = n + ("." + b[2]);
                    }
                }
            }
            return n;
        }
        /**
     * @param {!Array} x
     * @param {!Array} a
     * @param {!Array} item
     * @param {string} i
     * @param {!Array} node
     * @param {!Object} value
     * @param {!Function} e
     * @return {undefined}
     */
        function cb(x, a, item, i, node, value, e) {
            let type;
            let data;
            let tag;
            let i;
            let line_second_half;
            const start = process.hrtime();
            if (a && a.length) {
                if (type = "" + a.pop(), console.log("generateGAS: getOneObj: key_1 : " + type + " value of matching: " + type.indexOf("M-")), type.indexOf("M-") > -1) {
                    console.log("generateGAS: getOneObj: key_2 : " + type);
                    data = x[type];
                    for (tag in data.ComObjectTable) {
                        if (data.ComObjectTable.hasOwnProperty(tag) && i.indexOf(tag) > -1) {
                            node[tag] = data.ComObjectTable[tag];
                        }
                        delete data.ComObjectTable[tag];
                    }
                    for (i in data.ComObjectRefs) {
                        if (data.ComObjectRefs.hasOwnProperty(i) && item[i]) {
                            value[i] = data.ComObjectRefs[i];
                        }
                        delete data.ComObjectRefs[i];
                    }
                    delete x[type];
                }
                line_second_half = process.hrtime(start);
                console.log("Execution time of Objectlistparsing of : " + type + "    " + line_second_half[0] + "s  " + line_second_half[1] / 1E6 + "ms " + JSON.stringify(process.memoryUsage()));
                setTimeout(cb, 100, x, a, item, i, node, value, e);
            } else {
                e();
            }
        }
        /**
     * @param {!Array} a
     * @param {!Object} err
     * @param {?} time
     * @param {number} r
     * @param {!Function} update
     * @return {undefined}
     */
        function callback(a, err, time, r, update) {
            let data;
            let buf;
            let prop;
            let k;
            const b = {};
            console.log("starting genObj");
            data = {};
            /** @type {!Array} */
            buf = [];
            for (prop in a) {
                buf.push(prop.replace(/(_R-\d*)/g, ""));
            }
            /** @type {!Array} */
            k = [];
            for (prop in time) {
                k.push(prop);
            }
            cb(time, k, a, buf, data, err, function() {
                /** @type {!RegExp} */
                const obj = RegExp(/stat(e|us)|r\u00fcckmeldung\s|\svalue/);
                _.each(err, function(options, n) {
                    let i;
                    const key = n.replace(/_R.*/g, "");
                    err[n] = {
                        Text : options.Text || data[key].Text,
                        Name : options.Name || data[key].Name,
                        FunctionText : options.FunctionText || data[key].FunctionText,
                        ObjectSize : options.ObjectSize || data[key].ObjectSize,
                        read : options.read || data[key].read,
                        write : options.write || data[key].write,
                        transmit : options.transmit || data[key].transmit,
                        Dpt : options.Dpt || data[key].Dpt
                    };
                    /** @type {string} */
                    i = options.Text + "-" + options.Name + "-" + options.FunctionText;
                    if ("Enabled" === options.read || "Enabled" === options.transmit) {
                        /** @type {string} */
                        (i.toLowerCase().match(obj) ? r : b)[i] = n;
                    } else {
                        /** @type {string} */
                        b[i] = n;
                    }
                });
                /** @type {null} */
                data = null;
                console.log("stop genObj");
                setTimeout(update, 500, err, b);
            });
        }
        /**
     * @param {?} a
     * @param {!Object} c
     * @param {!Object} data
     * @param {!Function} fn
     * @return {undefined}
     */
        function next(a, c, data, fn) {
            let inner = _.difference(Object.keys(a), Object.keys(data));
            /** @type {!RegExp} */
            const _REPVARS = RegExp(/stat(e|us)|r\u00fcckmeldung\s|\svalue/);
            console.log("starting control+status pairs");
            _.each(data, function(decipherFinal, p_Interval) {
                const expr = p_Interval.toLowerCase().replace(_REPVARS, "");
                const i = _.max(inner, function(p_Interval) {
                    return similarity(expr, p_Interval.toLowerCase());
                });
                const lockDir = similarity(expr.replace(" ", ""), i.toLowerCase().replace(" ", ""));
                if (lockDir > .9) {
                    /** @type {string} */
                    c[a[i]].statusGA = decipherFinal;
                    c[decipherFinal].actGA = a[i];
                }
            });
            console.log("stop control+status pairs");
            /** @type {null} */
            inner = null;
            setTimeout(fn, 500, c);
        }
        /**
     * @param {!Object} items
     * @param {!Object} data
     * @param {!Object} c
     * @param {!Object} d
     * @param {!Function} fill
     * @return {undefined}
     */
        function set(items, data, c, d, fill) {
            _.each(xpath.select("//*[local-name(.)='Connectors']/*/@GroupAddressRefId", items), function(p) {
                let isAvailable;
                let key;
                let globalDefaultRead;
                let out;
                let submit;
                let nodecrypto;
                let currentObject;
                if ("Send" === p.ownerElement.nodeName) {
                    if (isAvailable = p.ownerElement.parentNode.parentNode.getAttribute("DatapointType"), key = p.ownerElement.parentNode.parentNode.getAttribute("RefId"), globalDefaultRead = data[p.ownerElement.parentNode.parentNode.getAttribute("RefId")].read, out = data[key].write, submit = data[key].transmit, nodecrypto = c[data[key].statusGA], currentObject = c[data[key].actGA], data[key].GARefId = p.value, nodecrypto && (out = "Enabled"), isAvailable && d[p.value] && d[p.value].Dpt && (d[p.value].Dpt = 
          isAvailable), !isAvailable && d[p.value] && d[p.value].Dpt && (isAvailable = d[p.value].Dpt), !isAvailable && d[p.value] && !d[p.value].Dpt && data[key].Dpt && (isAvailable = data[key].Dpt), isAvailable) {
                        console.log(" found : " + key + " - " + isAvailable);
                    } else {
                        switch(data[key].ObjectSize) {
                            case "1 Bit":
                                /** @type {string} */
                                isAvailable = "DPT-1";
                                break;
                            case "2 Bit":
                                /** @type {string} */
                                isAvailable = "DPT-2";
                                break;
                            case "4 Bit":
                                /** @type {string} */
                                isAvailable = "DPT-3";
                                break;
                            case "1 Byte":
                                /** @type {string} */
                                isAvailable = "DPT-5.001";
                        }
                        if (isAvailable) {
                            console.log(" not found : " + key + " - " + isAvailable);
                        }
                    }
                    if (d[p.value]) {
                        if ("Enabled" === d[p.value].Update) {
                            d[p.value] = {
                                statusGA : d[p.value].statusGA,
                                actGA : d[p.value].actGA,
                                ComObjectInstanceRefId : d[p.value].ComObjectInstanceRefId,
                                Read : d[p.value].Read,
                                Write : d[p.value].Write,
                                Update : d[p.value].Update,
                                Dpt : isAvailable
                            };
                        } else {
                            d[p.value] = {
                                statusGA : nodecrypto,
                                actGA : currentObject,
                                ComObjectInstanceRefId : key,
                                Read : globalDefaultRead,
                                Write : out,
                                Update : submit,
                                Dpt : isAvailable
                            };
                        }
                    } else {
                        d[p.value] = {
                            statusGA : nodecrypto || d[p.value].statusGA,
                            actGA : currentObject || d[p.value].actGA,
                            ComObjectInstanceRefId : key || d[p.value].ComObjectInstanceRefId,
                            Read : globalDefaultRead || d[p.value].Read,
                            Write : out || d[p.value].Write,
                            Update : submit || d[p.value].Update,
                            Dpt : isAvailable
                        };
                    }
                }
            });
            setTimeout(fill, 500);
        }
        /**
     * @param {!Object} items
     * @param {?} target
     * @param {!Object} d
     * @param {!Function} process
     * @return {undefined}
     */
        function init(items, target, d, process) {
            _.each(xpath.select("//*[local-name(.)='DeviceInstanceRef']", items), function(elem) {
                /** @type {string} */
                let index = "";
                if ("BuildingPart" === elem.parentNode.nodeName) {
                    index = elem.parentNode.getAttribute("Name");
                    if ("BuildingPart" === elem.parentNode.parentNode.nodeName) {
                        index = elem.parentNode.parentNode.getAttribute("Name") + "." + index;
                        if ("BuildingPart" === elem.parentNode.parentNode.parentNode.nodeName) {
                            index = elem.parentNode.parentNode.parentNode.getAttribute("Name") + "." + index;
                        }
                    }
                }
                target[elem.getAttribute("RefId")] = index;
                _.each(xpath.select("./*[local-name(.)='DeviceInstanceRef']/@RefId", elem.parentNode), function(option) {
                    if (args.hasOwnProperty(option.value)) {
                        const isSelected = {};
                        _.each(xpath.select("./*[local-name(.)='ComObjectInstanceRef']/*[local-name(.)='Connectors']/*[local-name(.)='Send']/@GroupAddressRefId", args[option.value]), function(options) {
                            const el = d[options.value];
                            if (isSelected[option.value]) {
                                isSelected[option.value] = isSelected[option.value] + "," + el.getAttribute("Id");
                            } else {
                                isSelected[option.value] = el.getAttribute("Id");
                            }
                        });
                    }
                });
            });
            setTimeout(process, 500);
        }
        const dpt2iobroker = require("./dpt2iobroker.js");
        const xpath = require("xpath");
        const _ = require("underscore");
        const similarity = require("similarity");
        const util = require("util");
        const extend = util._extend;
        const args = {};
        const namespace = {};
        const model = {};
        mixin.exports = {
            getGAS : function(value, method) {
                let fn;
                let item;
                let results;
                const response = {};
                const bodies = {};
                const xdr = {};
                const s = process.hrtime();
                console.log("Start Zeitmessung getGAS");
                /** @type {!Array} */
                constfn = [];
                item = value["0.xml"];
                _.each(xpath.select("//*[local-name(.)='Send']", item), function(aElem) {
                    xdr[aElem.parentNode.parentNode.getAttribute("RefId")] = aElem.getAttribute("GroupAddressRefId");
                });
                console.log("Start Zeitmessung Objectlistparsing");
                results = {};
                callback(xdr, bodies, value, results, function(id, body) {
                    next(body, id, results, function(a) {
                        let fields;
                        let options;
                        let re;
                        _.each(item.getElementsByTagName("DeviceInstance"), function(itemNode) {
                            const prefix = itemNode.getAttribute("Id");
                            _.each(itemNode.getElementsByTagName("ComObjectInstanceRefs"), function(index) {
                                args[prefix] = index;
                            });
                            console.log("link instanceRefs to comObjectRefs for " + itemNode.getAttribute("Id") + " with " + JSON.stringify(process.memoryUsage()));
                        });
                        fields = {};
                        options = {};
                        /** @type {!RegExp} */
                        re = RegExp(/stat(e|us)|r\u00fcck(|meldung)|RM\s|\svalue/);
                        _.each(xpath.select("//*[local-name(.)='GroupAddress' and string(@Address)]", item), function(node) {
                            let name;
                            const id = node.getAttribute("Id");
                            /** @type {!Node} */
                            response[id] = node;
                            name = node.getAttribute("Name");
                            model[id] = {
                                Dpt : node.getAttribute("DatapointType"),
                                Write : "",
                                Read : "",
                                Update : "",
                                statusGA : "",
                                actGA : "",
                                ComObjectInstanceRefId : ""
                            };
                            (name.toLowerCase().match(re) ? options : fields)[name] = id;
                        });
                        set(item, a, xdr, model, function() {
                            init(item, namespace, response, function() {
                                let obj;
                                let j;
                                /** @type {!Array<string>} */
                                const a = Object.keys(options);
                                const b = _.difference(Object.keys(fields), a);
                                _.each(options, function(key, p_Interval) {
                                    const address = p_Interval.toLowerCase().replace(re, "");
                                    const i = _.max(b, function(p_Interval) {
                                        return similarity(address, p_Interval.toLowerCase());
                                    });
                                    const index = similarity(address, i.toLowerCase());
                                    if (index > .8 && model[key] && model[fields[i]]) {
                                        if (model[fields[i]].dpt || !model[key]) {
                                            if (!model[fields[i]].dpt && model[key].dpt) {
                                                model[fields[i]].dpt = model[key].dpt;
                                            }
                                            if (model[fields[i]].dpt && !model[key]) {
                                                model[key].dpt = model[fields[i]].dpt;
                                            }
                                        }
                                        /** @type {string} */
                                        model[fields[i]].statusGA = key;
                                        model[key].actGA = fields[i];
                                    }
                                });
                                obj = {};
                                _.each(response, function(elem) {
                                    let item;
                                    let roleArn;
                                    let builtinRead;
                                    let write;
                                    /** @type {(Element|string)} */
                                    const node = elem;
                                    const id = node.getAttribute("Id");
                                    const name = node.getAttribute("Name");
                                    /** @type {string} */
                                    let e = "";
                                    let className = name.replace(/[.\s]/g, "_");
                                    if ("GroupRange" === node.parentNode.nodeName) {
                                        className = node.parentNode.getAttribute("Name").replace(/[.\s]/g, "_") + "." + className;
                                        if ("GroupRange" === node.parentNode.parentNode.nodeName) {
                                            className = node.parentNode.parentNode.getAttribute("Name").replace(/[.\s]/g, "_") + "." + className;
                                        }
                                    }
                                    if (model[id]) {
                                        e = model[id].Dpt;
                                    }
                                    item = listAddItem(id);
                                    /** @type {string} */
                                    roleArn = "";
                                    roleArn = "" === item.setType ? item.setRole : item.setRole + "." + item.setType;
                                    builtinRead = onMessage(model[id].Read);
                                    write = onMessage(model[id].Write);
                                    if (model[id].statusGA) {
                                        /** @type {boolean} */
                                        write = true;
                                        /** @type {boolean} */
                                        builtinRead = false;
                                    }
                                    if (model[id].actGA) {
                                        /** @type {boolean} */
                                        write = false;
                                        /** @type {boolean} */
                                        builtinRead = true;
                                    }
                                    obj = {
                                        _id : className.replace(/[+\s]/g, "_"),
                                        type : "state",
                                        common : {
                                            name : name,
                                            type : item.stateType || item.setType,
                                            read : builtinRead,
                                            write : write,
                                            role : roleArn,
                                            min : item.setMin,
                                            max : item.setMax
                                        },
                                        "native" : {
                                            dpt : f(e),
                                            address : makeAddress(node.getAttribute("Address")),
                                            addressRefId : id,
                                            statusGARefId : model[id].statusGA || "",
                                            actGARefId : model[id].actGA || ""
                                        }
                                    };
                                    if (void 0 !== item.setMin) {
                                        obj.common.min = item.setMin;
                                    }
                                    if (void 0 !== item.setMax) {
                                        obj.common.max = item.setMax;
                                    }
                                    fn.push(obj);
                                });
                                console.log("Done knx_master.xml and 0.xml");
                                j = process.hrtime(s);
                                console.log("Execution time of GetGAS : ", j[0] + "s  " + j[1] / 1E6 + "ms");
                                if ("function" == typeof method) {
                                    method(null, fn);
                                }
                            });
                        });
                    });
                });
            },
            getRoomFunctions : function(name, callback) {
                /**
         * @return {?}
         */
                function run() {
                    let mergedField;
                    let result;
                    let item;
                    let d2;
                    return d ? void setTimeout(run, 1E3) : (mergedField = {}, result = [], item = name["0.xml"], _.each(xpath.select("//*[local-name(.)='BuildingPart' and (@Type='Room' or @Type='DistributionBoard' or @Type='Corridor' or @ Type='Stairway')]", item), function(item) {
                        let value;
                        let title;
                        let name;
                        let id;
                        /** @type {!Array} */
                        const options = [];
                        options.push({
                            rooms : []
                        });
                        /** @type {!Array} */
                        options.rooms = [];
                        /** @type {string} */
                        value = "";
                        /** @type {string} */
                        title = "";
                        /** @type {string} */
                        name = "";
                        /** @type {string} */
                        id = "";
                        _.each(xpath.select("./*[local-name(.)='DeviceInstanceRef']/@RefId", item), function(a) {
                            /** @type {boolean} */
                            d = true;
                            /** @type {string} */
                            let key = "";
                            if (args.hasOwnProperty(a.value)) {
                                _.each(xpath.select("./*[local-name(.)='ComObjectInstanceRef']/*[local-name(.)='Connectors']/*[local-name(.)='Send']/@GroupAddressRefId", args[a.value]), function(value) {
                                    /** @type {boolean} */
                                    d = true;
                                    key = "" !== key ? key + "," + value.value : value.value;
                                });
                            }
                            title = item.parentNode.parentNode.getAttribute("Name").replace(/[.\s]/g, "_");
                            title = title.replace(/[+\s]/g, "_");
                            value = item.parentNode.getAttribute("Name").replace(/[.\s]/g, "_");
                            value = value.replace(/[+\s]/g, "_");
                            name = item.getAttribute("Name").replace(/[.\s]/g, "_");
                            name = name.replace(/[+\s]/g, "_");
                            /** @type {string} */
                            id = "";
                            options.rooms.push({
                                room : name,
                                functions : key
                            });
                            if ("" !== title) {
                                id = title;
                            }
                            id = "" !== value && "" !== id ? id + "." + value : value;
                        });
                        /** @type {boolean} */
                        d = false;
                        mergedField = extend({
                            facility : id,
                            functions : options
                        });
                        result.push(mergedField);
                        console.log("for room : " + JSON.stringify(process.memoryUsage()));
                    }), d2 = process.hrtime(t2), console.log("Execution time of GetRoomFunctions : ", d2[0] + "s  " + d2[1] / 1E6 + "ms "), void("function" == typeof callback && callback(null, result)));
                }
                let d;
                let t2 = process.hrtime();
                console.log("Start Zeitmessung getRoomFunctions");
                /** @type {boolean} */
                d = false;
                run();
            },
            convertDPTtype : f
        };
    });
    require.register("./lib/utils.js", function(a, options, parseInt) {

        function f() {
            const a = __dirname.replace(/\\/g, "/").split("/");
            return a[a.length - 2].split(".")[0];
        }
      
        function init(passedDatabaseTypes) {
            const fs = parseInt("fs");
            let path = __dirname.replace(/\\/g, "/");
            return path = path.split("/"), "adapter" === path[path.length - 3] ? (path.splice(path.length - 3, 3), path = path.join("/")) : "node_modules" === path[path.length - 3] ? (path.splice(path.length - 3, 3), path = path.join("/"), fs.existsSync(path + "/node_modules/" + name + ".js-controller") ? path = path + ("/node_modules/" + name + ".js-controller") : fs.existsSync(path + "/node_modules/" + name.toLowerCase() + ".js-controller") ? path = path + ("/node_modules/" + name.toLowerCase() + ".js-controller") : 
                fs.existsSync(path + "/controller.js") || (passedDatabaseTypes ? process.exit() : (console.log("Cannot find js-controller"), process.exit(10)))) : passedDatabaseTypes ? process.exit() : (console.log("Cannot find js-controller"), process.exit(10)), path;
        }
        function test() {
            if (fs.existsSync(id + "/conf/" + name + ".json")) {
                return JSON.parse(fs.readFileSync(id + "/conf/" + name + ".json"));
            }
            if (fs.existsSync(id + "/conf/" + name.toLowerCase() + ".json")) {
                return JSON.parse(fs.readFileSync(id + "/conf/" + name.toLowerCase() + ".json"));
            }
            throw Error("Cannot find " + id + "/conf/" + name + ".json");
        }
        let name = f();
        let id = init("undefined" != typeof process && process.argv && -1 !== process.argv.indexOf("--install"));
        options.controllerDir = id;
        /** @type {function(): ?} */
        options.getConfig = test;
        options.adapter = parseInt(id + "/lib/adapter.js");
        options.appName = name;
    });
    module.exports = require("./main.js");
}(require, module);
