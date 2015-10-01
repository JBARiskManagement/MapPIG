#ifndef DATAREQUESTS_H
#define DATAREQUESTS_H

#include <QObject>

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

signals:

public slots:
};

#endif // DATAREQUESTS_H
