#ifndef PLUGININTERFACE
#define PLUGININTERFACE

#include <QtPlugin>

class PluginInterface
{
    public:
        virtual ~PluginInterface(){}
        virtual QString initialiseUi() = 0;
        virtual QString getUiSetupFunction() = 0;
        virtual QString getName() = 0;
        virtual QString getDescription() = 0;
        virtual QObject * getBridgeObject() = 0;
        virtual QString getBridgeObjectName() = 0;
        virtual QObject * getWorkerObject() = 0;

public slots:

    void workStarted();
    void workFinished();
    void progressUpdated(int percent);

};

#define PluginInterface_iid "mapthing.plugins.PluginInterface"

Q_DECLARE_INTERFACE(PluginInterface, PluginInterface_iid)


#endif // PLUGININTERFACE



