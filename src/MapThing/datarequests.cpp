#include "datarequests.h"
#include "progresscounter.h"

#include "fatof.h"

extern "C" {
#include "csvparser.h"
}
#include <stdint.h>
#include <iostream>
#include <vector>
#include <QDebug>
#include <QSqlQuery>
#include <QCoreApplication>
#include <time.h>

DataRequests::DataRequests(QObject *parent) : QObject(parent)
{
}

DataRequests::~DataRequests()
{
}


void DataRequests::loadCsv(QString fpath)
{

    //clock_t startTime = clock();
    emit workStarted();

    // Add a portfolio to the container
    std::vector<double> *tivArr = ptf.addPortfolio(fpath);

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
    int idxLat = -1, idxLng = -1, idxTiv = -1, i;

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
        if(strcmp(headerFields[i], "TIV1") == 0)
        {
            idxTiv = i;
            continue;
        }
    }

    if (idxLat != -1 && idxLng  != -1)
    {
        int curPos, lastPos = 0, emptyRows = 0, rowCount = 0;
        double lat, lng, tiv;
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
                lat = fatof(rowFields[idxLat]);
                lng = fatof(rowFields[idxLng]);
                tiv = fatof(rowFields[idxTiv]);
                tivArr->push_back(tiv);
                emit riskUpdated(lat, lng, tiv);
            }
            CsvParser_destroy_row(row);
            curPos = ftell(parser->fileHandler_);
            prog.update(curPos - lastPos);
            lastPos = curPos;
        }
        emit markerLoadingStats(rowCount, emptyRows);
    }
    CsvParser_destroy(parser);

    ptf.computeHist(fpath, 10);
    //std::cout << double( clock() - startTime ) / (double)CLOCKS_PER_SEC<< " seconds." << std::endl;
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
        double lat, lng, tiv;
        while (query.next()){
            prog.update();
            lat = query.value(0).toDouble();
            lng = query.value(1).toDouble();
            tiv = query.value(2).toDouble();
            emit riskUpdated(lat, lng, tiv);
        }
    }
    else
    {
        emit error(QString("No risks in database"), QString("Database error"));
    }
    //QString name(jcalfDb.connectionName());
    jcalfDb.close();
    //QSqlDatabase::removeDatabase(name);
    emit workFinished();
}
