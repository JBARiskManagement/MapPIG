#ifndef MapThingUtil_H
#define MapThingUtil_H

#include <QObject>
#include <QString>
#include <QtSql>
#include <stdlib.h>

#include "portfolio.h"


#define white_space(c) ((c) == ' ' || (c) == '\t')
#define valid_digit(c) ((c) >= '0' && (c) <= '9')
double fatof (const char *p);

/**
 * @brief The DataRequests class
 *          Handles requests for JCALF data
 */
class MapThingUtil : public QObject
{
    Q_OBJECT
public:
    explicit MapThingUtil(QObject *parent = 0);
    ~MapThingUtil();
    QSqlDatabase jcalfDb;
    Portfolio ptf;
    void loadCsv(QString fpath,  void(*callback)(char **fields, int numFields, int index));

signals:
    void riskUpdated(double lat, double lng, double tiv);
    void workFinished();
    void workStarted();
    void progressUpdated(int perc);
    void databaseConnected(bool status);
    void error(QString err, QString title);
    void markerLoadingStats(int nLoaded, int nSkipped);

public slots:

    void refreshExposures();
    void getLastError();
    void setJcalfDatabase(QString host, QString port, QString user, QString pwd);




};

#endif // MapThingUtil_H
/*

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

//ptf.computeHist(fpath, 10);
//std::cout << double( clock() - startTime ) / (double)CLOCKS_PER_SEC<< " seconds." << std::endl;
emit workFinished();

*/
