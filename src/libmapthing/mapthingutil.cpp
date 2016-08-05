#include "mapthingutil.h"
#include "progresscounter.h"

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


/**
 * @brief fatof
 *  A faster implementation of atof
 * @param p
 * @return
 */
double fatof (const char *p)
{
    int frac;
    double sign, value, scale;

    // Skip leading white space, if any.

    while (white_space(*p) ) {
        p += 1;
    }

    // Get sign, if any.

    sign = 1.0;
    if (*p == '-') {
        sign = -1.0;
        p += 1;

    } else if (*p == '+') {
        p += 1;
    }

    // Get digits before decimal point or exponent, if any.

    for (value = 0.0; valid_digit(*p); p += 1) {
        value = value * 10.0 + (*p - '0');
    }

    // Get digits after decimal point, if any.

    if (*p == '.') {
        double pow10 = 10.0;
        p += 1;
        while (valid_digit(*p)) {
            value += (*p - '0') / pow10;
            pow10 *= 10.0;
            p += 1;
        }
    }

    // Handle exponent, if any.

    frac = 0;
    scale = 1.0;
    if ((*p == 'e') || (*p == 'E')) {
        unsigned int expon;

        // Get sign of exponent, if any.

        p += 1;
        if (*p == '-') {
            frac = 1;
            p += 1;

        } else if (*p == '+') {
            p += 1;
        }

        // Get digits of exponent, if any.

        for (expon = 0; valid_digit(*p); p += 1) {
            expon = expon * 10 + (*p - '0');
        }
        if (expon > 308) expon = 308;

        // Calculate scaling factor.

        while (expon >= 50) { scale *= 1E50; expon -= 50; }
        while (expon >=  8) { scale *= 1E8;  expon -=  8; }
        while (expon >   0) { scale *= 10.0; expon -=  1; }
    }

    // Return signed and scaled floating point result.

    return sign * (frac ? (value / scale) : (value * scale));
}

MapThingUtil::MapThingUtil(QObject *parent) : QObject(parent)
{
}

MapThingUtil::~MapThingUtil()
{
}

void MapThingUtil::loadCsv(QString fpath)
{

    //clock_t startTime = clock();
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
    connect(&prog, &ProgressCounter::progressUpdated, this, &MapThingUtil::progressUpdated);

    CsvRow *header, *row;

    header = CsvParser_getHeader(parser);
    char **headerFields = CsvParser_getFields(header);

    //func(headerFields, CsvParser_getNumFields(header), 0);
    int numFields = CsvParser_getNumFields(header);
    emit csvRow(headerFields, numFields, 0);

    int curPos, lastPos = 0, rowCount = 0;
    char **rowFields;
    while((row = CsvParser_getRow(parser)))
    {
        rowCount++;
        rowFields = CsvParser_getFields(row);
        numFields = CsvParser_getNumFields(row);
        //func(rowFields, CsvParser_getNumFields(row), rowCount);
        emit csvRow(rowFields, numFields, rowCount);
        CsvParser_destroy_row(row);
        curPos = ftell(parser->fileHandler_);
        prog.update(curPos - lastPos);
        lastPos = curPos;
    }

    CsvParser_destroy(parser);
    //std::cout << double( clock() - startTime ) / (double)CLOCKS_PER_SEC<< " seconds." << std::endl;
    emit workFinished();
}



//void MapThingUtil::setJcalfDatabase(QString host, QString port, QString user, QString pwd)
//{
//    jcalfDb = QSqlDatabase::addDatabase("QPSQL");
//    jcalfDb.setHostName(host);
//    jcalfDb.setPort(port.toInt());
//    jcalfDb.setDatabaseName("JCALF");
//    jcalfDb.setUserName(user);
//    jcalfDb.setPassword(pwd);

//    bool ok = jcalfDb.open();
//    emit databaseConnected(ok);
//}

//void MapThingUtil::getLastError()
//{
//    QSqlError err = jcalfDb.lastError();
//    emit error(err.text(), "Database error");
//}


//void MapThingUtil::refreshExposures()
//{
//    emit workStarted();
//    QSqlQuery query(jcalfDb);
//    query.prepare("SELECT \"Latitude\", \"Longitude\", \"TIV\", \"Limit\", \"Deductible\", lob.\"Code\" "
//                   "FROM \"PieceRisk\" pr "
//                   "LEFT JOIN \"RiskCoverage\" rc ON pr.\"PieceRiskID\" = rc.\"PieceRiskID\" "
//                   "LEFT JOIN \"Risk\" r ON pr.\"RiskID\" = r.\"RiskID\" "
//                   "LEFT JOIN \"LineOfBusiness\" lob ON r.\"LineOfBusinessID\" = lob.\"LineOfBusinessID\" ");
//                   //"WHERE \"Latitude\" BETWEEN ? AND ? "
//                   //"AND \"Longitude\" BETWEEN ? AND ?");

//    //query.bindValue(0, minY);
//    //query.bindValue(1, maxY);
//    //query.bindValue(2, minX);
//    //query.bindValue(3, maxX);

//    query.exec();

//    int size = query.size();
//    ProgressCounter prog(size, 1);
//    connect(&prog, &ProgressCounter::progressUpdated, this, &MapThingUtil::progressUpdated);
//    if (size > 0)
//    {
//        double lat, lng, tiv;
//        while (query.next()){
//            prog.update();
//            lat = query.value(0).toDouble();
//            lng = query.value(1).toDouble();
//            tiv = query.value(2).toDouble();
//            emit riskUpdated(lat, lng, tiv);
//        }
//    }
//    else
//    {
//        emit error(QString("No risks in database"), QString("Database error"));
//    }
//    //QString name(jcalfDb.connectionName());
//    jcalfDb.close();
//    //QSqlDatabase::removeDatabase(name);
//    emit workFinished();
//}

