const path = require('path');
const package = require('./package.json');
const rmdir = require('xfs/rmdir.js');
const mkdir = require('xfs/mkdir.js');
const copy = require('xfs/copy.js');
const BeforeBuildPlugin = require('xwebpack/BeforeBuildPlugin.js');
const DTSBundlePlugin = require('xwebpack/DTSBundlePlugin.js');
const CopyPlugin = require('xwebpack/CopyPlugin.js');

var

    outputDirName = 'dist',

    folders = {
        root: __dirname,
        src: path.resolve(__dirname, 'src'),
        dist: path.resolve(__dirname, outputDirName),
        build: path.resolve(__dirname, outputDirName + '/build'),
        bin: path.resolve(__dirname, outputDirName + '/bin'),
        js: path.resolve(__dirname, outputDirName + '/bin/lib'),
        css: path.resolve(__dirname, outputDirName + '/bin/assets/css'),
        fonts: path.resolve(__dirname, outputDirName + '/bin/assets/fonts')
    },

    createDir = function(dirPath) {
        console.log("create \"" + dirPath);
        mkdir.sync(dirPath);
    },

    prepack = function() {

        console.log("removing \"" + folders.dist + "\"");
        rmdir.sync(folders.dist);

        console.log("copying \"" + folders.src + "\" to \"" + folders.build + "\"");
        copy.sync(folders.src, folders.build);

        //createDir(folders.js);
        //createDir(folders.css);
    },

    getEntry = function(entry) {

        if (entry)
            return entry;

        return folders.build + '/index.ts';
    },

    getOutput = function() {
        return {
            filename: package.main || 'index.js',
            path: folders.bin,
            library: package.name || 'unknown',
            libraryTarget: "umd"
        };
    },

    getModule = function(settings) {

        var rules = [{
            test: /\.tsx?$/,
            use: [
                'awesome-typescript-loader?configFileName=' + settings.tsconfig
            ]
        }];

        if (settings && settings.rules)
            for (var i = 0; i < settings.rules.length; i++)
                rules.push(settings.rules[i]);

        return {
            rules: rules
        };
    },

    getResolve = function() {
        return {
            extensions: [".ts", ".tsx", ".js", ".jsx", ".css", ".scss", ".less", ".html"],
            modules: [
                path.resolve(__dirname, 'node_modules')
            ],
            descriptionFiles: ["package.json"]
        };
    },

    getPlugins = function(settings) {

        var plugins = [
            new BeforeBuildPlugin(prepack),
            new DTSBundlePlugin({
                targetDirPath: folders.build,
                dtsBundlePath: folders.bin + '/index.d.ts'
            })
        ];

        if (!(settings && settings.copyPackageJson === false)) {
            plugins.push(
                new CopyPlugin({
                    from: "./package.json",
                    to: folders.bin + '/package.json'
                }));
        }

        if (settings && settings.plugins)
            for (var i = 0; i < settings.plugins.length; i++)
                plugins.push(settings.plugins[i]);

        return plugins;
    };

module.exports = {
    package: package,
    folders: folders,
    getEntry: getEntry,
    getOutput: getOutput,
    getModule: getModule,
    getResolve: getResolve,
    getPlugins: getPlugins
};