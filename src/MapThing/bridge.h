#ifndef BRIDGE_H
#define BRIDGE_H

#include <QObject>
#include <QString>

class Bridge : public QObject
{
    Q_OBJECT
public:
    explicit Bridge(QObject *parent = 0);
    ~Bridge();

    //Q_INVOKABLE void getLastError();

signals:

    // Ask for a new set of exposures from jcalf db connection
    Q_INVOKABLE void refreshExposures(double minX, double minY, double maxX, double maxY);
    Q_INVOKABLE void connectDatabase(QString host, QString port, QString user, QString pwd);

    void exposureUpdated(double lat, double lng);
    void progressUpdated(int percent);
    void databaseConnected(bool status);
    void updatesFinished();
    void error(QString err, QString title);


public slots:

};

#endif // BRIDGE_H
