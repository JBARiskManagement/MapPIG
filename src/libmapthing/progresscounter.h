#ifndef PROGRESSCOUNTER_H
#define PROGRESSCOUNTER_H

#include <QObject>
#include <stdint.h>

class ProgressCounter: public QObject
{
    Q_OBJECT
public:
    ProgressCounter(int64_t nIter, int step);
    ~ProgressCounter();
    void update(int decrement = 1);
    void reset(int64_t nIter = 0, int step = 0);

signals:
    void progressUpdated(int percent);

private:
    int increment, countdown;
    int percent, percentStep;


};

#endif // PROGRESSCOUNTER_H
