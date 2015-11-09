#include "datarequests.h"
#include <QDebug>
#include <QSqlQuery>
#include <QCoreApplication>

DataRequests::DataRequests(QObject *parent) : QObject(parent)
{

}

DataRequests::~DataRequests()
{

}

void DataRequests::setJcalfDatabase(QString host, QString port, QString user, QString pwd)
{
    jcalfDb = QSqlDatabase::addDatabase("QPSQL");
    jcalfDb.setHostName(host);
    jcalfDb.setPort(port.toInt());
    jcalfDb.setDatabaseName("JCALF");
    jcalfDb.setUserName(user);
    jcalfDb.setPassword(pwd);

    bool ok = jcalfDb.open();
    emit databaseConnected(ok);
}

void DataRequests::getLastError()
{
    QSqlError err = jcalfDb.lastError();
    emit error(err.text(), "Database error");

}

void DataRequests::refreshExposures(double minX, double minY, double maxX, double maxY)
{
    emit progressUpdated(0);
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

    int size = query.size();


    if (size > 0)
    {

        int increment = 0.01 * size;
        int percent = -1;
        int countdown = increment;

        while (query.next()){
            countdown--;
            if(countdown == 0)
            {
                percent++;
                emit progressUpdated(percent);
                countdown = increment;

                //QCoreApplication::processEvents();

            }
            double lat = query.value(1).toDouble();
            double lng = query.value(2).toDouble();
            emit riskUpdated(lat, lng);


        }

    }
    emit updatesFinished();

}
