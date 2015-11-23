#include "portfolio.h"

#include <iostream>
#include <algorithm>
#include <math.h>

Portfolio::Portfolio()
{

}

Portfolio::~Portfolio()
{

}

void Portfolio::computeHist(QString fpath, int nBins)
{
    double minTiv, maxTiv;
    int count = 0;

    std::vector<double> *tivArr = portfolioTiv[fpath];

    maxTiv = *std::max_element(tivArr->begin(), tivArr->end());
    minTiv = *std::min_element(tivArr->begin(), tivArr->end());

    double binWidth = (maxTiv-minTiv)/nBins;
    int binIdx, i;
    std::vector<int> hist(nBins, 0.0);
    //std::vector<double> centres(nBins, 0);

    for (i = 0; i < tivArr->size(); ++i)
    {
        binIdx = (int)floor((*tivArr)[i]/ binWidth);
        hist[binIdx]++;
    }
    for (i = 0; i < hist.size(); ++i)
    {
        count += hist[i];
        std::cout << hist[i] << std::endl;
    }
    std::cout << count << std::endl;
}

std::vector<double> * Portfolio::addPortfolio(QString fpath)
{
    std::vector<double> *arr = new std::vector<double>;
    portfolioTiv[fpath] = arr;
    return arr;
}

void Portfolio::removePortfolio(QString fpath)
{
    delete portfolioTiv[fpath];
    portfolioTiv.erase(fpath);
}

