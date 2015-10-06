#include "datarequests.h"
#include <QDebug>
#include <QSqlQuery>

DataRequests::DataRequests(QObject *parent) : QObject(parent)
{

}

DataRequests::~DataRequests()
{

}

bool DataRequests::setJcalfDatabase(QString host, QString port, QString user, QString pwd)
{
    qDebug() << host;
    jcalfDb = QSqlDatabase::addDatabase("QPSQL");
    jcalfDb.setHostName(host);
    jcalfDb.setPort(port.toInt());
    jcalfDb.setDatabaseName("JCALF");
    jcalfDb.setUserName(user);
    jcalfDb.setPassword(pwd);

    bool ok = jcalfDb.open();
    return ok;
}

void DataRequests::refreshExposures(double minX, double minY, double maxX, double maxY)
{
    QSqlQuery query(jcalfDb);
    query.prepare("SELECT pr.\"RiskID\", \"Latitude\", \"Longitude\", \"TIV\", \"Limit\", \"Deductible\", \"LineOfBusinessID\" "
                   "FROM \"PieceRisk\" pr "
                   "LEFT JOIN \"RiskCoverage\" rc ON pr.\"PieceRiskID\" = rc.\"PieceRiskID\" "
                   "LEFT JOIN \"Risk\" r ON pr.\"RiskID\" = r.\"RiskID\" "
                   "WHERE \"Latitude\" BETWEEN ? AND ? "
                   "AND \"Longitude\" BETWEEN ? AND ?");

    query.bindValue(0, minY);
    query.bindValue(1, maxY);
    query.bindValue(2, minX);
    query.bindValue(3, maxX);

    query.exec();

    if (query.size() > 0)
    {
        while (query.next()){
            double lat = query.value(1).toDouble();
            double lng = query.value(2).toDouble();
            emit riskUpdated(lat, lng);
        }
        emit updatesFinished();
    }

}
