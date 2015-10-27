.. homepage

SQL
=================================

JCalf SQL queries for use with mapthing:


    WITH yby AS
    (
    SELECT sum("MeanGroundUp") as "MeanGroundUp", sum("MeanInsured") as "MeanInsured", c."YearNumber" FROM "RiskEBELossResult" a
    LEFT JOIN "PieceRisk" b on a."RiskID" = b."RiskID"
    LEFT JOIN "Event" c on a."EventID" = c."EventID"
    WHERE b."Latitude" BETWEEN 52.267 AND 52.2991
    AND b."Longitude" BETWEEN -1.63 AND -1.527

    GROUP BY c."YearNumber"
    --ORDER BY "MeanGroundUp"

    )
    SELECT "YearNumber", "MeanGroundUp" from yby ORDER BY "YearNumber"