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

    Q_INVOKABLE bool setJcalfDatabase(QString host, QString port, QString user, QString pwd);
    Q_INVOKABLE QString getLastError();

signals:
    void riskUpdated(double lat, double lng);
    void updatesFinished();
    void progressUpdated(int perc);

public slots:

    void refreshExposures(double minX, double minY, double maxX, double maxY);

};

#endif // DATAREQUESTS_H
