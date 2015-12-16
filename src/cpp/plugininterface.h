#ifndef PLUGININTERFACE
#define PLUGININTERFACE

#include <QProgressBar>
#include <QtPlugin>

class PluginInterface
{
    public:
        virtual ~PluginInterface(){}
        virtual QString initialiseUi(QProgressBar *);
        virtual QString getUiSetupFunction();
        virtual QString getName();
        virtual QObject * getBridgeObject();
        virtual QString getBridgeObjectName();
        virtual QObject * getWorkerObject();

};

#define PluginInterface_iid "mapthing.plugins.PluginInterface"

Q_DECLARE_INTERFACE(PluginInterface, PluginInterface_iid)


#endif // PLUGININTERFACE



