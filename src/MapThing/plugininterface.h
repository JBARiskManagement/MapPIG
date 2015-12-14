#ifndef PLUGININTERFACE
#define PLUGININTERFACE

#include <QProgressBar>
#include <QtPlugin>

class PluginInterface
{
    public:
        virtual ~PluginInterface(){}
        virtual void initialiseUi(QProgressBar *);
        virtual QString getName();
        virtual QObject * getBridgeObject();
        virtual QString getBridgeObjectName();


};

#define PluginInterface_iid "mapthing.plugins.PluginInterface"

Q_DECLARE_INTERFACE(PluginInterface, PluginInterface_iid)


#endif // PLUGININTERFACE



