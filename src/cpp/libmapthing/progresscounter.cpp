#include "progresscounter.h"

ProgressCounter::ProgressCounter(int64_t nIter, int step)
{
    increment = (int)((step/100.0) * nIter);
    countdown = increment;
    percentStep = step;
    percent = 0;
    emit progressUpdated(0);
}

ProgressCounter::~ProgressCounter()
{

}

void ProgressCounter::update(int decrement)
{
    countdown -= decrement;
    if (countdown <= 0)
    {
        percent += percentStep;
        countdown = increment;
        emit progressUpdated(percent);
    }
}

void ProgressCounter::reset(int64_t nIter, int step)
{
    if (step != 0 && nIter != 0)
    {
        increment = (int)((step/100.0) * nIter);
    }
    percent = 0;
    countdown = increment;
}
