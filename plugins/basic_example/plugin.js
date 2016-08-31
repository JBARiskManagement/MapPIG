const {MTPluginGui, MTDom} = mtRequire("dom.js");

module.exports.setup = function(state){

    if (state === true){
        // Plugin setup goes here - UI elements etc
        MTDom.showMessage('Plugin has been activated!', 'Start Example Plugin');
    }
    else{
        // Plugin tear down goes here - be nice an undo everything done in setup!
        MTDom.showMessage('Plugin has been deactivated!', 'Stop Example Plugin');
    }
};