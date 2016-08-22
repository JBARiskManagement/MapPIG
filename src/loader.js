const path = require('path');
const fs = require('fs');
const {MTPluginGui, MTDom} = require(path.join(__dirname, "dom.js"));

function MTPlugins(){

    this.all_plugins = {};
    this.pluginPath = path.join(path.dirname(__dirname), "plugins");
};

MTPlugins.prototype.findPlugins = function(){  
    if (fs.lstatSync(this.pluginPath).isDirectory()){
        fs.readdir(this.pluginPath, this.registerPlugin.bind(this));
    };        
}

MTPlugins.prototype.registerPlugin = function(err, files){
    
    for (var i =0; i < files.length; ++i){
        if (fs.lstatSync(files[i]).isDirectory()){
            // Get the path to the plugin file
            var pth = path.join(this.pluginPath, files[i], "package.json");
            var plugin_package = require(pth);

            if (plugin_package.hasOwnProperty('main')){
                var main_pth = path.join(this.pluginPath, files[i], plugin_package.main)
                var plugin = require(main_pth);
                // Store the plugin
                this.all_plugins[plugin.name] = plugin;

                // Add a GUI button
                MTDom.addPluginLauncher(plugin.name, plugin.setup, plugin.description)
            }
        }
    }
    
};

module.exports.MTPlugins = MTPlugins;
