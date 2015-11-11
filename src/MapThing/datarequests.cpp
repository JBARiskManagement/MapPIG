#include "datarequests.h"
#include "progresscounter.h"

extern "C" {
#include "csvparser.h"
}
#include <stdint.h>
#include <iostream>
#include <QDebug>
#include <QSqlQuery>
#include <QCoreApplication>

DataRequests::DataRequests(QObject *parent) : QObject(parent)
{
}

DataRequests::~DataRequests()
{
}

void DataRequests::loadCsv(QString fpath)
{

    emit workStarted();

    // Determine file size
    qint64 size;
    QFile handle(fpath);
    if (handle.open(QIODevice::ReadOnly))
         size = handle.size();
    handle.close();

    // CSV loading uses a C library for performance
    CsvParser *parser = CsvParser_new(fpath.toStdString().c_str(), ",", 1);

    ProgressCounter prog((int64_t)size, 1);
    connect(&prog, &ProgressCounter::progressUpdated, this, &DataRequests::progressUpdated);

    CsvRow *header, *row;

    header = CsvParser_getHeader(parser);
    char **headerFields = CsvParser_getFields(header);
    int idxLat = -1, idxLng = -1, idxLob = -1, i;

    for (i = 0; i < CsvParser_getNumFields(header); i++)
    {
        if (strcmp(headerFields[i], "Lat") == 0)
        {
            idxLat = i;
            continue;
        }
        if (strcmp(headerFields[i], "Long") == 0)
        {
            idxLng = i;
            continue;
        }
        if(strcmp(headerFields[i], "LOB") == 0)
        {
            idxLob = i;
            continue;
        }
    }

    //CsvParser_destroy_row(header);
    if (idxLat != -1 && idxLng  != -1)
    {
        int curPos, lastPos = 0, emptyRows = 0, rowCount = 0;
        double lat, lng;
        char **rowFields;
        while((row = CsvParser_getRow(parser)))
        {
            rowFields = CsvParser_getFields(row);
            if (rowFields[idxLat][0] == '\0' || rowFields[idxLng] == '\0')
            {
                emptyRows++;
            }
            else
            {
                rowCount++;
                lat = atof(rowFields[idxLat]);
                lng = atof(rowFields[idxLng]);
                emit riskUpdated(lat, lng, QString(rowFields[idxLob]));
            }
            CsvParser_destroy_row(row);
            curPos = ftell(parser->fileHandler_);
            prog.update(curPos - lastPos);
            lastPos = curPos;
        }
        std::cout << emptyRows << " rows did not contain latitude and/or longitude values" << std::endl;
        std::cout << rowCount << " exposures were added to the map" << std::endl;
    }
    CsvParser_destroy(parser);




    emit workFinished();
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
    emit workStarted();
    QSqlQuery query(jcalfDb);
    query.prepare("SELECT \"Latitude\", \"Longitude\", \"TIV\", \"Limit\", \"Deductible\", lob.\"Code\" "
                   "FROM \"PieceRisk\" pr "
                   "LEFT JOIN \"RiskCoverage\" rc ON pr.\"PieceRiskID\" = rc.\"PieceRiskID\" "
                   "LEFT JOIN \"Risk\" r ON pr.\"RiskID\" = r.\"RiskID\" "
                   "LEFT JOIN \"LineOfBusiness\" lob ON r.\"LineOfBusinessID\" = lob.\"LineOfBusinessID\" ");
                   //"WHERE \"Latitude\" BETWEEN ? AND ? "
                   //"AND \"Longitude\" BETWEEN ? AND ?");

    //query.bindValue(0, minY);
    //query.bindValue(1, maxY);
    //query.bindValue(2, minX);
    //query.bindValue(3, maxX);

    query.exec();

    int size = query.size();
    ProgressCounter prog(size, 1);
    connect(&prog, &ProgressCounter::progressUpdated, this, &DataRequests::progressUpdated);
    if (size > 0)
    {
        while (query.next()){
            prog.update();
            double lat = query.value(0).toDouble();
            double lng = query.value(1).toDouble();
            QString lob = query.value(5).toString();
            emit riskUpdated(lat, lng, lob);
        }
    }
    emit workFinished();
}
