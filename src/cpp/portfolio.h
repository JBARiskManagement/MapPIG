#ifndef PORTFOLIO_H
#define PORTFOLIO_H

#include <map>
#include <vector>
#include <QString>

class Portfolio
{
public:
    Portfolio();
    ~Portfolio();
    std::map<QString, std::vector<double> *> portfolioTiv;
    std::vector<int> hist;

    /**
     * @brief computeHist
     *  Get the histogram for a previously loaded portfolio
     * @param fpath
     */
    void computeHist(QString fpath, int nBins);

    /**
     * @brief addPortfolio
     *  Add a portfolio reference
     * @param fpath
     */
    std::vector<double> * addPortfolio(QString fpath);

    /**
     * @brief removePortfolio
     *  Remove a portfolio & associated data
     * @param fpath
     */
    void removePortfolio(QString fpath);

};

#endif // PORTFOLIO_H
