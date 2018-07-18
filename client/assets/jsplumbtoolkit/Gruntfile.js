module.exports = function (grunt) {


    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json')
    });

    grunt.registerTask("default", function () {
        console.log("\n\njsPlumb Toolkit Project Utilities");
        console.log("---------------------------------");
        console.log(" ");
        console.log("You can use this Gruntfile to create a new project skeleton, or a clone of one of the example applications that ship with the Toolkit");
        console.log(" ");
        console.log("To clone an existing application:");
        console.log("---------------------------------");
        console.log("grunt clone --app=<AppID> --o=<output directory>");
        console.log(" ");
        console.log("Valid values for AppID are ['" + pkg.apps.join("','") + "']");
        console.log(" ");
        console.log("To create a new project skeleton:");
        console.log("---------------------------------");
        console.log("grunt create --o=<output directory>");
    });

    var pkg = require("./package.json"),
        app,
        outputDirectory,
        checkApp = function () {
            var a = grunt.option("app");
            if (a == null) throw "";
            if (pkg.apps.indexOf(a) == -1) throw ("No such app: " + a);
            app = a;
        },
        checkOutput = function () {
            var o = grunt.option("o");
            if (o == null) throw "";
            if (grunt.file.exists(o)) throw "Output directory exists; aborting.";
            outputDirectory = o;
        },
        usage = function (id, extra) {
            console.log(" ");
            if (extra) {
                console.log(extra);
                console.log("")
            }
            console.log("Usage");
            console.log("------");
            console.log(_usage[id]());
        },
        _usage = {
            "clone": function () {
                return "grunt clone --app=<AppID> --o=<output directory>\n\nAvailable apps are ['" + pkg.apps.join("','") + "']";
            },
            "create": function () {
                return "grunt create --o=<output directory>";
            }
        };

    var _doClone = function (_app) {
        var type = "clone";
        try {
            if (!_app) {
                checkApp();
            }
            else {
                app = _app;
                type = "new";
            }
            checkOutput();
            grunt.file.mkdir(outputDirectory);
            grunt.file.recurse(pkg["apps-dir"] + "/" + app, function callback(abspath, rootdir, subdir, filename) {
                var path = outputDirectory + (subdir == null ? "" : "/" + subdir) + "/" + filename;
                grunt.file.copy(abspath, path);
                if (filename === "index.html") {
                    var h = grunt.file.read(path);
                    grunt.file.write(path, h.replace(/(<!-- header.*>.*\n)(.*\n)*(.*\/header -->)/, ""));
                }
            });

            console.log("Created copy of [" + app + "] in directory " + outputDirectory);
        }
        catch (e) {
            _usage["clone"](type, e);
        }
    };

    grunt.registerTask("clone", _doClone);


    grunt.registerTask("create", function () {
        _doClone("skeleton");
    });

};