#ifndef JCALFDB_H
#define JCALFDB_H

#include <QObject>

class JcalfDb : public QObject
{
    Q_OBJECT
public:
    explicit JcalfDb(QObject *parent = 0);
    ~JcalfDb();

signals:

public slots:
};

#endif // JCALFDB_H
