#ifndef DATAREQUESTS_H
#define DATAREQUESTS_H

#include <QObject>
#include <QString>
#include <QtSql>

/**
 * @brief The DataRequests class
 *          Handles requests for JCALF data
 */
class DataRequests : public QObject
{
    Q_OBJECT
public:
    explicit DataRequests(QObject *parent = 0);
    ~DataRequests();
    QSqlDatabase jcalfDb;

signals:
    void riskUpdated(double lat, double lng, QString lob);
    void workFinished();
    void workStarted();
    void progressUpdated(int perc);
    void databaseConnected(bool status);
    void error(QString err, QString title);
    void markerLoadingStats(int nLoaded, int nSkipped);

public slots:

    void refreshExposures(double minX, double minY, double maxX, double maxY);
    void getLastError();
    void setJcalfDatabase(QString host, QString port, QString user, QString pwd);
    void loadCsv(QString fpath);

};

#endif // DATAREQUESTS_H
