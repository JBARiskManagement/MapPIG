/*
 * Copyright (c) 2016 James Ramm
 */
const path = require('path');
const fs = require('fs');
const {MTPluginGui, MTDom} = require(path.join(__dirname, "dom.js"));
const conf = require('../conf/conf.json')

function MTPlugins(){

    this.all_plugins = {};
    this.pluginPath = conf.plugins;
};

MTPlugins.prototype.findPlugins = function(){ 

    fs.lstat(this.pluginPath, this.readPluginDir.bind(this));    
};

MTPlugins.prototype.readPluginDir = function(err, stats){
    if (!err && stats.isDirectory()){
        fs.readdir(this.pluginPath, this.registerPlugin.bind(this));
    };
}

MTPlugins.prototype.registerPlugin = function(err, files){
    for (var i =0; i < files.length; ++i){
        var pth = path.join(this.pluginPath, files[i]);
        if (fs.lstatSync(pth).isDirectory()){
            // Get the path to the plugin file
            var plugin = require(pth);
            var pkg = require(path.join(pth, 'package.json'));
            if (plugin.hasOwnProperty('setup') && pkg.hasOwnProperty('name') && pkg.hasOwnProperty('description')){
                // Store the plugin
                this.all_plugins[pkg.name] = plugin;

                // Add a GUI button
                MTDom.addPluginLauncher(pkg.name, plugin.setup, pkg.description)
            }
        }
    }
    
};

module.exports.MTPlugins = MTPlugins;
