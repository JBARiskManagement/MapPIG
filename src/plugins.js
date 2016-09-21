/*
 */
const path = require('path');
const fs = require('fs');
const {MPContainer, MPDom} = require(path.join(__dirname, "dom.js"));
const conf = require('../conf/conf.json')
const npm = require('npm')

function PluginLoader(){

    this.all_plugins = {}
    this.pluginPath = conf.plugins
};

PluginLoader.prototype.findPlugins = function(){ 

    fs.lstat(this.pluginPath, this.readPluginDir.bind(this))  
};

PluginLoader.prototype.readPluginDir = function(err, stats){
    if (!err && (stats.isDirectory() || stats.isSymbolicLink())){
        fs.readdir(this.pluginPath, this.registerPlugin.bind(this))
    }
}

PluginLoader.prototype.registerPlugin = function(err, files){
    for (var i =0; i < files.length; ++i){
        var pth = path.join(this.pluginPath, files[i])
        if (fs.lstatSync(pth).isDirectory()){
            // Get the path to the plugin file
            var plugin = require(pth);
            var pkg = require(path.join(pth, 'package.json'))
            if (plugin.hasOwnProperty('setup') && pkg.hasOwnProperty('name') && pkg.hasOwnProperty('description')){
                // Store the plugin
                if (!this.all_plugins.hasOwnProperty(pkg.name)){
                    this.all_plugins[pkg.name] = plugin

                    // Add a GUI button
                    MPDom.addPluginLauncher(pkg.name, plugin.setup, pkg.description)
                }
            }
            else {
                alert("Plugin with name " + pkg.name + " is not a valid MapPIG plugin; It may not have defined a 'setup' function.")
            }
        }
    }
    
}

/*
 * \brief Installs plugins
 *
 * @param loader Instanace of PluginLoader which will 'load' a newly installed plugin to the
 * running MapPIG instance
 */

class PluginInstaller {
    constructor(loader){
        $("#install-plugin-btn").click(function(){
            this.install($("#plugin-name-txt").val())}.bind(this))

        this._loader = loader
    }

    install(name){
        MPDom.showLoading("#sb-plugin")
        npm.load(function(err) {
            // handle errors
            if (err){
                alert(err)
            }

            // install module ffi
            npm.commands.install([name], function(err, data) {
                if (err){
                    alert(err)
                }
                else {
                    // If no error, make the symlink in the plugins dir
                    let oldPath = path.join("./node_modules", name)
                    let newPath = path.join(conf.plugins, name)
                    fs.renameSync(oldPath, newPath)

                    // Refresh the loaded plugins
                    this._loader.findPlugins()
                    MPDom.hideLoading("#sb-plugin")
                }
            }.bind(this))

            npm.on('log', function(message) {
                // log installation progress
                console.log(message)
            })
        }.bind(this))
    }
}

module.exports.PluginLoader = PluginLoader;
module.exports.PluginInstaller = PluginInstaller
