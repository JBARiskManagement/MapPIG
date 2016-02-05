#ifndef WORKERBASE_H
#define WORKERBASE_H

#include <QObject>

class WorkerBase : public QObject
{
    Q_OBJECT
public:
    explicit WorkerBase(QObject *parent = 0);
    ~WorkerBase();

signals:
    void workStarted();
    void workFinished();
    void progressUpdated(int);

public slots:
};

#endif // WORKERBASE_H
