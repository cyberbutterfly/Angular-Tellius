# SmartQueryEngine

## Changelog

- 4.0.1: `datasetsIds` in searchQL requests are optional from now on. If you supply them, they will be used in the query.
However, instead of them it is recommended to use JWT Token in Authorization header corresponding to the user making 
the request. Then, SQE will find his datasets and use them automatically. 

Old request example:

```bash
curl -v -X POST -H "Content-Type: application/json" \
  http://52.87.228.68:8081/searchQL --data '{
    "datasetsIds":["trip_fare","trip_data"],
    "searchQL":"show bar chart between avg @fare_amount of @trip_data.vendor_id", "maximumAllowedRows": 10
  }'
```

New request example (notice `Authorization` header): 

```bash
curl -v -X POST -H "Content-Type: application/json" \
  -H 'Authorization: Bearer eyJhbGci...ZiYEBIteyUNnA' \
  http://52.87.228.68:8081/searchQL --data '{
    "searchQL":"show bar chart between avg @fare_amount of @trip_data.vendor_id", "maximumAllowedRows": 10
  }'
```

Responses are the same:

```json
{
  "rowsCount": 2,
  "columnNames": ["`trip_fare`.vendor_id", "avg(`trip_fare`.fare_amount)"],
  "suggestions": ["show bar chart between avg @fare_amount of @trip_data.vendor_id for", "show bar chart between avg @fare_amount of @trip_data.vendor_id ordered by", "show bar chart between avg @fare_amount of @trip_data.vendor_id ranked by", "show bar chart between avg @fare_amount of @trip_data.vendor_id sorted by", "show bar chart between avg @fare_amount of @trip_data.vendor_id stacked by"],
  "responseType": "chart",
  "original": "show bar chart between avg @fare_amount of @trip_data.vendor_id",
  "chartType": "bar chart",
  "rows": [["CMT", 12.198965071151358], ["VTS", 12.278962572218036]]
}
```

- 3.6.0: Changed Indicators and Signatures responses. Now they include an additional field `ast`, containing a JSON 
representation of parsed ASTs. Refer to the [updated](https://github.com/Tellius/SmartQueryEngine#signatures-api)
 [docs](https://github.com/Tellius/SmartQueryEngine#indicators-api) for examples.

- 3.4.0: Added some join optimizations.

- 3.3.2: Adjust error reporting for impossible joins.

- 3.3.0: DatasetGroups are now used to improve suggestions

- 3.2.0: Added a CLI option to specify seed nodes for the cluster. Example usage: 
`java -jar tellius_smart_query_engine-assembly-3.2.0.jar -s '"akka.tcp://sqe-cluster@192.168.1.51:2551"'`

- 3.1.1: Fix for https://trello.com/c/IEeUScr3

- 3.1.0: DateColumn now is selected from used datasets.

- 3.0.5: Fixed differenet issues. 

- 3.0.0: Now we can use Dataset Groups from middleware to make joins automatically, no need to supply `joinSchemas` in 
the request to `searchQL` anymore.

- 2.9.0: `suggestions` field has been added to the Indicators and Signatures APIs' Error Responses. 
Please, refer to 
[this description](https://github.com/Tellius/SmartQueryEngine#indicators-and-signatures-suggestions-in-error-responses) 
of changes.

- 2.8.2: Extremum Queries suggestions improvements

- 2.7.1: Fixes and improvements for suggestions for map queries.

- 2.7.0: State and Country queries were added. Refer to 
[this description](https://github.com/Tellius/SmartQueryEngine#state-and-country-map-queries) of the new query types.

- 2.6.0: BoundaryMapQueries and RoundignMapQueries have been added! Refer to 
[this description](https://github.com/Tellius/SmartQueryEngine#rounding-map-queries) of new query types.

- 2.5.0: MapQueries added! Refer to [this description](https://github.com/Tellius/SmartQueryEngine#map-queries)
of a new query type.

- 2.4.0: SQE can now use mapColumns from Dataset Descriptions.

- 2.3.0: Ability to use comparison operators (`<`, `>`, `<=`, `>=`) and `contains` in filters of searchQL queries added.

- 2.2.0: Column names are now preprocessed to [add table qualifiers](https://trello.com/c/gYzMGJHP) where possible.

- 2.1.1: Move Column queries now respond with a new response types. Please, refer to 
[this description](https://github.com/Tellius/SmartQueryEngine#move-column-transform-queries-changes) of the changes.

- 2.0.7: History has been updated to work with multiple datasets. Please, refer to 
[this description](https://github.com/Tellius/SmartQueryEngine#history-with-multiple-datasets-release-changes) 
of the changes.

- 2.0.5: Join functionality now supported in both SearchQL and Extended SQL. 
Please, refer to [this description](https://github.com/Tellius/SmartQueryEngine#joins-release-changes) of the changes.

- 1.5.1: Fixed bug with `where` in Extended SQL.

- 1.5.0: [Prefer local Middleware to remote ones](https://trello.com/c/encaWnso)

- 1.4.2: Fix for [bug in Extended SQL](https://trello.com/c/RmbqhLU2)

- 1.4.1: Fix for the [bug with suggestions after `for`](https://trello.com/c/hUfsJizg)

- 1.4.0: Cluster state API added (needed for monitoring)

- 1.3.1: Akka networking fixes

- 1.3.0: Communication between SQE and Middleware switched to Akka instead of HTTP

- 1.2.0: Limit number of options in autocomplete to 10.

- 1.1.0: Actual health checks implemented. Now before returning 200 to ELB, we check that we can access middleware
and memSQL.

- 1.0.2: Dummy health check for ELB. 
ATTENTION: now you can access SQE and Middleware using ELB address: sqe-lb-449024333.us-east-1.elb.amazonaws.com.

- 1.0.1: Switched to local middleware

- 1.0.0: Adjustments for production deployment

- 0.5.7: Don't add incorrect input after last correct word in autocomplete, to avoid crazy autocomplete options.

- 0.5.6: Fixed bug where input was not always used in ranking of autocompletion.

- 0.5.5: Improvements to autocomplete ranking.

- 0.5.4: Fixed [some issues](https://trello.com/c/9UyrK5DA) with suggestions.

- 0.5.3: suggest aggregations where needed, fix for [this bug](https://trello.com/c/8oPNyI3w).

- 0.5.2: added backticks (`) to datasetIds usages inside SQL queries in Extended SQL and SearchQL.

- 0.5.1: `by @columnName` part [added](https://trello.com/c/JCWTJB1I) to Aggregation Queries.

- 0.5.0: [Suggest Column API](https://github.com/Tellius/SmartQueryEngine#suggest-column-api) added.
[Response Types docs](https://github.com/Tellius/SmartQueryEngine#response-types) added.

- 0.4.0: [Signatures API](https://github.com/Tellius/SmartQueryEngine#signatures-api) added.

- 0.3.0: [Indicators API](https://github.com/Tellius/SmartQueryEngine#indicators-api) added.

- 0.2.3: New searchQL format for Bubble Charts.

- 0.2.2: Fix for a [bug](https://trello.com/c/rwvoiIQD). We will correctly suggest fixes for incorrect column names and reject
any input after this point.

- 0.2.1: Grammar rewrite. Now we can use keywords in column names.

- 0.2.0: [ExtendedSQL API](https://github.com/Tellius/SmartQueryEngine#extendedsql-api) added; various bugfixes.

- 0.1.14: Optional `partialQuery` parameter added to History API. When this parameter is supplied, results from history
will be ordered by a Levenshtein distance to the value of this parameter first, and by number of hits second.

- 0.1.13: Optional integer `offset` field added to searchQL requests. You can use it to page through results.

- 0.1.12: `responseType` field added to all responses of SearchQL and Transform APIs.

- 0.1.11: [SearchQL Transform API](https://github.com/Tellius/SmartQueryEngine#searchql-transform-api-queries)
queries has been added.

- 0.1.10: [History API](https://github.com/Tellius/SmartQueryEngine#history-api) added. 
Various fixes. Filtering for too distant suggestions in autocomplete disabled.

- 0.1.9: Fix for bug with skipping the first row of data.

- 0.1.8: Grammar optimizations. Fixes for autocorrection of partial "for" and "sorted by" filters.

- 0.1.7: Column names checks added to all queries. Related autocorrection bugs fixed.

- 0.1.6: Autocomplete now suggests dimensions and measures according to the context of a query.
Some bugs are fixed.

- 0.1.5: Suggestions are improved: now we will return them not only for invalid queries,
but also for valid queries that still contain unused additional options. For example, for query 
`"show heat map for sum @arrdelay per @uniquecarrier and @dest"` we will return this result: 
    ```json
    {
      "rowsCount": 10,
      "columnNames": ["uniquecarrier", "dest", "sum(airlines.arrdelay)"],
      "suggestions": [
        "show heat map for sum @arrdelay per @uniquecarrier and @dest for",
        "show heat map for sum @arrdelay per @uniquecarrier and @dest ordered by",
        "show heat map for sum @arrdelay per @uniquecarrier and @dest ranked by",
        "show heat map for sum @arrdelay per @uniquecarrier and @dest sorted by"
      ],
      "original": "show heat map for sum @arrdelay per @uniquecarrier and @dest",
      "chartType": "heat map",
      "rows": [
        ["F9", "ELP", "-50"],
        ["EV", "PSC", "260"],
        ["9E", "MSO", "-145"],
        ["CO", "AGS", "0"],
        ["WN", "ONT", "574045"],
        ["WN", "PDX", "318270"],
        ["WN", "PHX", "1174175"],
        ["WN", "SAN", "651960"],
        ["WN", "SEA", "257935"],
        ["WN", "SNA", "260115"]
      ]
    }
    ```
    
- 0.1.4: Added Chart Queries. Added support for single-quoted strings in dimension filters (e.g., it is now possible to 
submit a query with this dimension filter: `for @region = 'North Europe'`

## OS level Dependencies

```bash
sudo apt-get install mysql-client
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib

sudo locale-gen UTF-8
sudo -i -u postgres
psql

// set default password to postgres
// postgres=# \password postgres
// Enter new password:
// Enter it again:

postgres=# create database sqe;
postgres=# \c sqe;
postgres=# create table searchQLHistory(
    datasetId varchar NOT NULL,
    query varchar NOT NULL,
    counter integer DEFAULT 0,
    PRIMARY KEY (datasetId, query));
```

## Response Types

These are the possible values of `responseType` field in all APIs:

- `searchQL` - response for valid SearchQL queries with `columnNames`, `rows` and `suggestions` fields.
- `chart` - response for valid SearchQL Chart Queries, with `rows`, `suggestions`, and `chartType`.
- `map` - response for valid SearchQL Map Queries, with `rows`, `suggestions`, and `mapType`.
- `transformAPI` - response for valid TransformAPI queries, with `transformationtype`, and `options`.
- `autocomplete` - response for invalid or incomplete queries with `suggestions`.
- `history` - response for successful HistoryAPI queries with `columnNames`, and `rows`.
- `historyCount` - response for successful History Count API queries with `query`, and `count`.
- `error` - response for errors from the APIs, with `msg` field.
- `indicator` - response for valid expression submitted to Indicators API
- `indicatorError` - response for invalid expression submitted to Indicators API.
- `signature` - response for valid expression submitted to Signatures API
- `signatureError` - response for invalid expression submitted to Signatures API.
- `suggestColumn` - response for incomplete column submitted to Suggest Column API.
- `suggestColumnIsAColumn` - response for complete column submitted to Suggest Column API.

## SearchQL API

The `POST /searchQL` API returns either the results of a valid query, or suggestions for the invalid query:

```bash
curl -v -H "Content-Type: application/json" \
    http://52.86.76.130:8081/searchQL --data \
    '{
        "datasetId": "airlines",
        "searchQL": "show top @uniquecarrier for @arrdelay",
        "maximumAllowedRows": 10
    }'
```

###Parameters

- `datasetId` -- an identifier of the dataset you're running a query against
- `searchQL` -- a text of the query
- `maximumAllowedRows` -- a number of rows that should be returned at max.
If not specified, a default value of 100 will be used.

Also, note that this API is using TelliusMiddleware to fetch the metadata about the table (from the DatasetDescription API).

For a valid query, the results are returned like this:

```json
{
  "columnNames": ["id", "year", "month", "day", "dayofweek", "deptime", "crsdeptime", "arrtime", "crsarrtime", "uniquecarrier", "flightnum", "tailnum", "actualelapsedtime", "crselapsedtime", "airtime", "arrdelay", "depdelay", "origin", "dest", "distance", "taxiin", "taxiout", "cancelled", "cancellationcode", "diverted", "carrierdelay", "weatherdelay", "nasdelay", "securitydelay", "lateaircraftdelay"],
  "rowsCount": 10,
  "rows": [
    ["29580701", 2009, 10, 3, 3, "820", "1259", "1109", "1551", "NW", "891", "N329NW", "169", "172", "145", 2598, 2601, "PBI", "DTW", "1087", "3", "21", "0", "", "0", "2580", "0", "0", "0", "18"],
    ["29580702", 2010, 10, 3, 3, "820", "1259", "1109", "1551", "NW", "891", "N329NW", "169", "172", "145", 2598, 2601, "PBI", "DTW", "1087", "3", "21", "0", "", "0", "2580", "0", "0", "0", "18"],
    ["29580699", 2007, 10, 3, 3, "820", "1259", "1109", "1551", "NW", "891", "N329NW", "169", "172", "145", 2598, 2601, "PBI", "DTW", "1087", "3", "21", "0", "", "0", "2580", "0", "0", "0", "18"],
    ["29580700", 2008, 10, 3, 3, "820", "1259", "1109", "1551", "NW", "891", "N329NW", "169", "172", "145", 2598, 2601, "PBI", "DTW", "1087", "3", "21", "0", "", "0", "2580", "0", "0", "0", "18"],
    ["35635474", 2007, 12, 1, 6, "1536", "700", "1627", "805", "9E", "4714", "87189E", "51", "65", "34", 1942, 1956, "ALO", "MSP", "166", "5", "12", "0", "", "0", "1942", "0", "0", "0", "0"],
    ["35635475", 2008, 12, 1, 6, "1536", "700", "1627", "805", "9E", "4714", "87189E", "51", "65", "34", 1942, 1956, "ALO", "MSP", "166", "5", "12", "0", "", "0", "1942", "0", "0", "0", "0"],
    ["35635478", 2011, 12, 1, 6, "1536", "700", "1627", "805", "9E", "4714", "87189E", "51", "65", "34", 1942, 1956, "ALO", "MSP", "166", "5", "12", "0", "", "0", "1942", "0", "0", "0", "0"],
    ["35635476", 2009, 12, 1, 6, "1536", "700", "1627", "805", "9E", "4714", "87189E", "51", "65", "34", 1942, 1956, "ALO", "MSP", "166", "5", "12", "0", "", "0", "1942", "0", "0", "0", "0"],
    ["35635477", 2010, 12, 1, 6, "1536", "700", "1627", "805", "9E", "4714", "87189E", "51", "65", "34", 1942, 1956, "ALO", "MSP", "166", "5", "12", "0", "", "0", "1942", "0", "0", "0", "0"],
    ["29575035", 2008, 10, 2, 2, "2351", "1720", "1244", "556", "NW", "808", "N816NW", "473", "456", "431", 1848, 1831, "HNL", "MSP", "3972", "16", "26", "0", "", "0", "1831", "0", "17", "0", "0"]
  ],
  "suggestions": []
}
```

For a query with errors, a list of suggestions together with the original query is returned:

```json
{
  "original": "shw top @uniquecarrier for @arrdelay",
  "suggestions": ["show top @uniquecarrier for @arrdelay", "what top @uniquecarrier for @arrdelay"]
}
```

Another example of suggestions, this type for possible fields:

```json
{
  "original": "show top @",
  "suggestions": [
    "show top @year",
    "show top @uniquecarrier",
    "show top @month", 
    "show top @day", 
    "show top @arrdelay",
    "show top @depdelay"
  ]
}
```

As you may have noticed, field names should be prefixed with `@` character.

### Queries examples

Right now we support the following types of queries:

- Simple Show First queries that show a specified number of rows from a dataset.
    
    **Example Request**: 
    
    ```bash
    curl -v -H "Content-Type: application/json" \
    http://52.86.76.130:8081/searchQL \
    --data '{"datasetId": "airlines", "searchQL": "show first 3 rows of data"}'
    ```
    
    **Example Response**: 
    
    ```json
    {
      "columnNames": ["id", "year", "month", "day", "dayofweek", "deptime", "crsdeptime", "arrtime", "crsarrtime", "uniquecarrier", "flightnum", "tailnum", "actualelapsedtime", "crselapsedtime", "airtime", "arrdelay", "depdelay", "origin", "dest", "distance", "taxiin", "taxiout", "cancelled", "cancellationcode", "diverted", "carrierdelay", "weatherdelay", "nasdelay", "securitydelay", "lateaircraftdelay", "datetime"],
      "rowsCount": 3,
      "rows": [
        ["36", 2011, 1, 1, 1, "1936", "1840", "2217", "2130", "WN", "409", "N482", "101", "110", "89", 47, 56, "SMF", "PHX", "647", "5", "7", "0", "", "0", "46", "0", "0", "0", "1", "2011-01-01 00:00:00.0"],
        ["38", 2009, 1, 1, 1, "944", "935", "1223", "1225", "WN", "1131", "N749SW", "99", "110", "86", -2, 9, "SMF", "PHX", "647", "4", "9", "0", "", "0", "0", "0", "0", "0", "0", "2009-01-01 00:00:00.0"],
        ["40", 2011, 1, 1, 1, "944", "935", "1223", "1225", "WN", "1131", "N749SW", "99", "110", "86", -2, 9, "SMF", "PHX", "647", "4", "9", "0", "", "0", "0", "0", "0", "0", "0", "2011-01-01 00:00:00.0"]
      ]
    }
    ```
    
- Top Queries. Return top rows for a given dimension, sorted by a given measure. Also supports secondary sorting,
time filters, and dimension filters

    **Example Request**:
    
    With time filter and secondary sorting:
     
    ```bash 
    curl -v -H "Content-Type: application/json" \
    http://52.86.76.130:8081/searchQL \
    --data '{
        "datasetId": "airlines", 
        "searchQL": "show top @uniquecarrier for @arrdelay sorted by @dest for last 148 months",
        "maximumAllowedRows": 10
    }'
    ```
    
    **Example Response**:
    
    ```json
    {
      "columnNames": ["id", "year", "month", "day", "dayofweek", "deptime", "crsdeptime", "arrtime", "crsarrtime", "uniquecarrier", "flightnum", "tailnum", "actualelapsedtime", "crselapsedtime", "airtime", "arrdelay", "depdelay", "origin", "dest", "distance", "taxiin", "taxiout", "cancelled", "cancellationcode", "diverted", "carrierdelay", "weatherdelay", "nasdelay", "securitydelay", "lateaircraftdelay", "datetime"],
      "rowsCount": 10,
      "rows": [
        ["29580701", 2009, 10, 3, 3, "820", "1259", "1109", "1551", "NW", "891", "N329NW", "169", "172", "145", 2598, 2601, "PBI", "DTW", "1087", "3", "21", "0", "", "0", "2580", "0", "0", "0", "18", "2009-10-03 00:00:00.0"],
        ["29580702", 2010, 10, 3, 3, "820", "1259", "1109", "1551", "NW", "891", "N329NW", "169", "172", "145", 2598, 2601, "PBI", "DTW", "1087", "3", "21", "0", "", "0", "2580", "0", "0", "0", "18", "2010-10-03 00:00:00.0"],
        ["29580699", 2007, 10, 3, 3, "820", "1259", "1109", "1551", "NW", "891", "N329NW", "169", "172", "145", 2598, 2601, "PBI", "DTW", "1087", "3", "21", "0", "", "0", "2580", "0", "0", "0", "18", "2007-10-03 00:00:00.0"],
        ["29580700", 2008, 10, 3, 3, "820", "1259", "1109", "1551", "NW", "891", "N329NW", "169", "172", "145", 2598, 2601, "PBI", "DTW", "1087", "3", "21", "0", "", "0", "2580", "0", "0", "0", "18", "2008-10-03 00:00:00.0"],
        ["35635474", 2007, 12, 1, 6, "1536", "700", "1627", "805", "9E", "4714", "87189E", "51", "65", "34", 1942, 1956, "ALO", "MSP", "166", "5", "12", "0", "", "0", "1942", "0", "0", "0", "0", "2007-12-01 00:00:00.0"],
        ["35635475", 2008, 12, 1, 6, "1536", "700", "1627", "805", "9E", "4714", "87189E", "51", "65", "34", 1942, 1956, "ALO", "MSP", "166", "5", "12", "0", "", "0", "1942", "0", "0", "0", "0", "2008-12-01 00:00:00.0"],
        ["35635478", 2011, 12, 1, 6, "1536", "700", "1627", "805", "9E", "4714", "87189E", "51", "65", "34", 1942, 1956, "ALO", "MSP", "166", "5", "12", "0", "", "0", "1942", "0", "0", "0", "0", "2011-12-01 00:00:00.0"],
        ["35635476", 2009, 12, 1, 6, "1536", "700", "1627", "805", "9E", "4714", "87189E", "51", "65", "34", 1942, 1956, "ALO", "MSP", "166", "5", "12", "0", "", "0", "1942", "0", "0", "0", "0", "2009-12-01 00:00:00.0"],
        ["35635477", 2010, 12, 1, 6, "1536", "700", "1627", "805", "9E", "4714", "87189E", "51", "65", "34", 1942, 1956, "ALO", "MSP", "166", "5", "12", "0", "", "0", "1942", "0", "0", "0", "0", "2010-12-01 00:00:00.0"],
        ["29575035", 2008, 10, 2, 2, "2351", "1720", "1244", "556", "NW", "808", "N816NW", "473", "456", "431", 1848, 1831, "HNL", "MSP", "3972", "16", "26", "0", "", "0", "1831", "0", "17", "0", "0", "2008-10-02 00:00:00.0"]
      ]
    }
    ```
    
    **Example Request 2**:
        
    With dimension filter and secondary sorting:
     
    ```bash 
    curl -v -H "Content-Type: application/json" \
    http://52.86.76.130:8081/searchQL \
    --data '{
        "datasetId": "airlines", 
        "searchQL": "show top @uniquecarrier for @arrdelay sorted by @dest for @origin = PBI",
        "maximumAllowedRows": 10
    }'
        ```
        
    **Example Response**:
        
    ```json
    {
      "columnNames": ["id", "year", "month", "day", "dayofweek", "deptime", "crsdeptime", "arrtime", "crsarrtime", "uniquecarrier", "flightnum", "tailnum", "actualelapsedtime", "crselapsedtime", "airtime", "arrdelay", "depdelay", "origin", "dest", "distance", "taxiin", "taxiout", "cancelled", "cancellationcode", "diverted", "carrierdelay", "weatherdelay", "nasdelay", "securitydelay", "lateaircraftdelay", "datetime"],
      "rowsCount": 10,
      "rows": [
        ["29580701", 2009, 10, 3, 3, "820", "1259", "1109", "1551", "NW", "891", "N329NW", "169", "172", "145", 2598, 2601, "PBI", "DTW", "1087", "3", "21", "0", "", "0", "2580", "0", "0", "0", "18", "2009-10-03 00:00:00.0"],
        ["29580702", 2010, 10, 3, 3, "820", "1259", "1109", "1551", "NW", "891", "N329NW", "169", "172", "145", 2598, 2601, "PBI", "DTW", "1087", "3", "21", "0", "", "0", "2580", "0", "0", "0", "18", "2010-10-03 00:00:00.0"],
        ["29580699", 2007, 10, 3, 3, "820", "1259", "1109", "1551", "NW", "891", "N329NW", "169", "172", "145", 2598, 2601, "PBI", "DTW", "1087", "3", "21", "0", "", "0", "2580", "0", "0", "0", "18", "2007-10-03 00:00:00.0"],
        ["29580700", 2008, 10, 3, 3, "820", "1259", "1109", "1551", "NW", "891", "N329NW", "169", "172", "145", 2598, 2601, "PBI", "DTW", "1087", "3", "21", "0", "", "0", "2580", "0", "0", "0", "18", "2008-10-03 00:00:00.0"],
        ["17446414", 2007, 6, 25, 1, "2242", "855", "41", "1040", "AA", "1083", "N511AA", "179", "165", "146", 841, 827, "PBI", "DFW", "1103", "17", "16", "0", "", "0", "827", "0", "14", "0", "0", "2007-06-25 00:00:00.0"],
        ["17446400", 2008, 6, 25, 1, "2242", "855", "41", "1040", "AA", "1083", "N511AA", "179", "165", "146", 841, 827, "PBI", "DFW", "1103", "17", "16", "0", "", "0", "827", "0", "14", "0", "0", "2008-06-25 00:00:00.0"],
        ["17446403", 2011, 6, 25, 1, "2242", "855", "41", "1040", "AA", "1083", "N511AA", "179", "165", "146", 841, 827, "PBI", "DFW", "1103", "17", "16", "0", "", "0", "827", "0", "14", "0", "0", "2011-06-25 00:00:00.0"],
        ["17446401", 2009, 6, 25, 1, "2242", "855", "41", "1040", "AA", "1083", "N511AA", "179", "165", "146", 841, 827, "PBI", "DFW", "1103", "17", "16", "0", "", "0", "827", "0", "14", "0", "0", "2009-06-25 00:00:00.0"],
        ["17446415", 2010, 6, 25, 1, "2242", "855", "41", "1040", "AA", "1083", "N511AA", "179", "165", "146", 841, 827, "PBI", "DFW", "1103", "17", "16", "0", "", "0", "827", "0", "14", "0", "0", "2010-06-25 00:00:00.0"],
        ["17805775", 2008, 6, 3, 7, "1623", "605", "1813", "743", "CO", "1831", "N17229", "170", "158", "136", 630, 618, "PBI", "IAH", "956", "4", "30", "0", "", "0", "618", "0", "12", "0", "0", "2008-06-03 00:00:00.0"]
      ]
    ```


- Aggregation Queries. Return aggregation over given measure. Also supports time filters, dimension filters, 
and grouping by time.

    **Example Request**:
        
    With grouping by time:
     
    ```bash 
    curl -v -H "Content-Type: application/json" \
    http://52.86.76.130:8081/searchQL \
    --data '{
        "datasetId": "airlines", 
        "searchQL": "show avg of @arrdelay daily",
        "maximumAllowedRows": 10
    }'
    ```
    
    **Example Response**:
    
    ```json
    {
      "columnNames": ["avg(airlines.arrdelay)", "date(airlines.datetime)"],
      "rowsCount": 10,
      "rows": [
        ["15.5416", "2011-01-01"],
        ["15.5416", "2008-01-01"],
        ["15.5416", "2009-01-01"],
        ["15.5416", "2007-01-01"],
        ["8.6898", "2009-01-02"],
        ["8.6898", "2011-01-02"],
        ["8.6898", "2007-01-02"],
        ["8.6898", "2010-01-02"],
        ["8.6898", "2008-01-02"],
        ["6.6812", "2008-01-03"]
      ]
    }
    ```
    
- Extremum Queries. Return grouped sorted results for some dimension.

  **Example Request**:
   
  ```bash 
  curl -v -H "Content-Type: application/json" \
  http://52.86.76.130:8081/searchQL \
  --data '{
      "datasetId": "airlines", 
      "searchQL": "which @uniquecarrier has the highest @arrdelay for each @dest",
      "maximumAllowedRows": 10
  }'
  ```
  
  **Example Response**:
  
  ```json
  {
    "columnNames": ["dest", "uniquecarrier", "arrdelay"],
    "rowsCount": 10,
    "rows": [
      ["SMF", "HA", 613],
      ["FNT", "NW", 1182],
      ["SJC", "MQ", 729],
      ["FSM", "MQ", 640],
      ["GRR", "NW", 891],
      ["MBS", "NW", 726],
      ["MOT", "NW", 721],
      ["OAK", "B6", 605],
      ["FCA", "OO", 611],
      ["ADK", "AS", 145]
    ]
  }
  ```


### Chart Queries examples

- Bar chart queries.

  **Example Request**:
   
  ```bash 
  curl -v -H "Content-Type: application/json" \
  http://52.86.76.130:8081/searchQL \
  --data '{
      "datasetId": "airlines", 
      "searchQL": "show chart between avg @arrdelay of @uniquecarrier"
  }'
  ```
  
  **Example Response**:
  
  ```json
  {
    "rowsCount": 19,
    "columnNames": ["uniquecarrier", "avg(airlines.arrdelay)"],
    "suggestions": [],
    "original": "show chart between avg @arrdelay of @uniquecarrier",
    "chartType": "bar chart",
    "rows": [
      ["XE", "10.0071"],
      ["YV", "10.9635"],
      ["OH", "13.1351"],
      ["OO", "8.8389"],
      ["UA", "12.7531"],
      ["US", "11.5273"],
      ["DL", "7.3030"],
      ["EV", "17.1957"],
      ["F9", "7.4319"],
      ["FL", "7.9379"],
      ["HA", "-0.4305"],
      ["MQ", "12.9928"],
      ["NW", "12.5591"],
      ["9E", "8.1383"],
      ["AA", "14.4419"],
      ["AQ", "-1.3769"],
      ["AS", "9.2628"],
      ["B6", "13.4399"],
      ["CO", "10.2695"]
    ]
  ```
  
  You also can make this query explicitly providing chart type: `"show bar chart between avg @arrdelay of @uniquecarrier"`.

- Line, pie, and area chart queries. They work similarly to the bar chart queries, but will return a different 
`chartType`. 

  **Example Request**:
   
  ```bash 
  curl -v -H "Content-Type: application/json" \
  http://52.86.76.130:8081/searchQL \
  --data '{
      "datasetId": "airlines", 
      "searchQL": "show pie chart between avg @arrdelay of @uniquecarrier"
  }'
  ```
  
  **Example Response**:
  
  ```json
  {
    "rowsCount": 19,
    "columnNames": ["uniquecarrier", "avg(airlines.arrdelay)"],
    "suggestions": [],
    "original": "show pie chart between avg @arrdelay of @uniquecarrier",
    "chartType": "pie chart",
    "rows": [
      ["XE", "10.0071"],
      ["YV", "10.9635"],
      ["OH", "13.1351"],
      ["OO", "8.8389"],
      ["UA", "12.7531"],
      ["US", "11.5273"],
      ["DL", "7.3030"],
      ["EV", "17.1957"],
      ["F9", "7.4319"],
      ["FL", "7.9379"],
      ["HA", "-0.4305"],
      ["MQ", "12.9928"],
      ["NW", "12.5591"],
      ["9E", "8.1383"],
      ["AA", "14.4419"],
      ["AQ", "-1.3769"],
      ["AS", "9.2628"],
      ["B6", "13.4399"],
      ["CO", "10.2695"]
    ]
  }
  ```
  
- Stacked Bar Chart and Area Chart Queries. They provide additional grouping for the results. 

  **Example Request**:
     
  ```bash 
    curl -v -H "Content-Type: application/json" \
    http://52.86.76.130:8081/searchQL \
    --data '{
        "datasetId": "airlines", 
        "searchQL": "show bar chart between avg @arrdelay of @uniquecarrier stacked by @dest"
    }'
  ```
    
  **Example Response**:
    
  ```json
    {
      "rowsCount": 9,
      "columnNames": ["uniquecarrier", "dest", "avg(airlines.arrdelay)"],
      "suggestions": [],
      "original": "show bar chart between avg @arrdelay of @uniquecarrier stacked by @dest",
      "chartType": "bar chart",
      "rows": [
        ["CO", "MKE", "32.0000"],
        ["OO", "ROW", "52.0000"],
        ["9E", "GLH", "2.5000"],
        ["NW", "PLN", "210.0000"],
        ["CO", "BRO", "10.0000"],
        ["F9", "ELP", "-10.0000"],
        ["WN", "ONT", "5.9946"],
        ["WN", "PHX", "3.3026"],
        ["WN", "SAN", "3.8170"]
      ]
    }
  ```

- Polar Chart Queries. In Polar Chart Queries we aggregate over two columns and group by one destination.

  **Example Request**:
       
  ```bash 
  curl -v -H "Content-Type: application/json" \
  http://52.86.76.130:8081/searchQL \
  --data '{
      "datasetId": "airlines", 
      "searchQL": "show polar chart for avg @arrdelay and sum @depdelay per @dest"
  }'
  ```
      
  **Example Response**:
  
  ```json
  {
    "rowsCount": 10,
    "columnNames": ["dest", "avg(airlines.arrdelay)", "sum(airlines.depdelay)"],
    "suggestions": [],
    "original": "show polar chart for avg @arrdelay and sum @depdelay per @dest",
    "chartType": "polar chart",
    "rows": [
      ["PDX", "8.4244", "2847515"],
      ["PHX", "6.0110", "9599195"],
      ["SAN", "6.3451", "4533020"],
      ["SEA", "10.6240", "6185685"],
      ["SNA", "5.3536", "1842340"],
      ["LAS", "7.3732", "9418845"],
      ["OAK", "5.2826", "3329835"],
      ["SJC", "5.5386", "2583745"],
      ["SMF", "7.5297", "2909945"],
      ["ABQ", "7.3880", "2094610"]
    ]
  }
  ```

- Scatter Plot 1 Queries.

  **Example Request**:
       
  ```bash 
  curl -v -H "Content-Type: application/json" \
  http://52.86.76.130:8081/searchQL \
  --data '{
      "datasetId": "airlines", 
      "searchQL": "show scatter plot for avg @arrdelay and @uniquecarrier color by @dest"
  }'
  ```
      
  **Example Response**:
  
  ```json
  {
    "rowsCount": 10,
    "columnNames": ["uniquecarrier", "dest", "avg(airlines.arrdelay)"],
    "suggestions": [],
    "original": "show scatter plot for avg @arrdelay and @uniquecarrier color by @dest",
    "chartType": "scatter plot 1",
    "rows": [
      ["CO", "AGS", "0.0000"],
      ["OO", "MKC", "12.0000"],
      ["CO", "BNA", "3.0000"],
      ["CO", "PWM", "-19.0000"],
      ["WN", "PDX", "4.4947"],
      ["WN", "PHX", "3.3026"],
      ["WN", "SAN", "3.8170"],
      ["WN", "SEA", "3.5242"],
      ["WN", "SNA", "3.8610"],
      ["WN", "LAS", "3.9347"]
    ]
  }
  ```

- Scatter Plot 2 Queries.

  **Example Request**:
       
  ```bash 
  curl -v -H "Content-Type: application/json" \
  http://52.86.76.130:8081/searchQL \
  --data '{
      "datasetId": "airlines", 
      "searchQL": "show scatter plot for avg @arrdelay and avg @depdelay color by @dest"
  }'
  ```
      
  **Example Response**:
  
  ```json
  {
    "rowsCount": 10,
    "columnNames": ["dest", "avg(airlines.arrdelay)", "avg(airlines.depdelay)"],
    "suggestions": [],
    "original": "show scatter plot for avg @arrdelay and avg @depdelay color by @dest",
    "chartType": "scatter plot 2",
    "rows": [
      ["MKC", "12.0000", "1.0000"],
      ["ONT", "5.2021", "9.2037"],
      ["PDX", "8.4244", "9.8001"],
      ["PHX", "6.0110", "9.2423"],
      ["SAN", "6.3451", "9.4301"],
      ["SEA", "10.6240", "11.4860"],
      ["SNA", "5.3536", "7.0858"],
      ["LAS", "7.3732", "10.3599"],
      ["OAK", "5.2826", "9.0077"],
      ["SJC", "5.5386", "8.4576"]
    ]
  }
  ```

- Bubble Chart Queries.

  **Example Request**:
       
  ```bash 
  curl -v -H "Content-Type: application/json" \
  http://52.86.76.130:8081/searchQL \
  --data '{
      "datasetId": "airlines", 
      "searchQL": "show bubble chart for avg @arrdelay per @uniquecarrier by sum @weatherdelay and avg @depdelay"
  }'
  ```
      
  **Example Response**:
  
  ```json
  {
    "rowsCount": 20,
    "columnNames": ["uniquecarrier", "avg(airlines.arrdelay)", "sum(airlines.weatherdelay)", "avg(airlines.depdelay)"],
    "suggestions": [
        "show bubble chart for avg @arrdelay per @uniquecarrier by sum @weatherdelay and avg @depdelay for", 
        "show bubble chart for avg @arrdelay per @uniquecarrier by sum @weatherdelay and avg @depdelay ordered by", 
        "show bubble chart for avg @arrdelay per @uniquecarrier by sum @weatherdelay and avg @depdelay ranked by", 
        "show bubble chart for avg @arrdelay per @uniquecarrier by sum @weatherdelay and avg @depdelay sorted by"
    ],
    "responseType": "chart",
    "original": "show bubble chart for avg @arrdelay per @uniquecarrier by sum @weatherdelay and avg @depdelay",
    "chartType": "bubble chart",
    "rows": [
        ["9E", "8.1383", 1003480.0, "9.0831"],
        ["AA", "14.4419", 4055620.0, "14.6703"], 
        ["AQ", "-1.3769", 5280.0, "0.4279"], 
        ["AS", "9.2628", 157565.0, "10.5825"], 
        ["B6", "13.4399", 537000.0, "14.6950"], 
        ["CO", "10.2695", 1075535.0, "11.7617"], 
        ["DL", "7.3030", 762505.0, "7.8217"], 
        ["EV", "17.1957", 3801120.0, "20.2719"], 
        ["F9", "7.4319", 197545.0, "7.4022"], 
        ["FL", "7.9379", 188805.0, "8.9971"]
    ]
  }
  ```
  

- Heat Map Queries.

  **Example Request**:
       
  ```bash 
  curl -v -H "Content-Type: application/json" \
  http://52.86.76.130:8081/searchQL \
  --data '{
      "datasetId": "airlines", 
      "searchQL": "show heat map for sum @arrdelay per @uniquecarrier and @dest"
  }'
  ```
      
  **Example Response**:
  
  ```json
  {
    "rowsCount": 10,
    "columnNames": ["uniquecarrier", "dest", "sum(airlines.arrdelay)"],
    "suggestions": [],
    "original": "show heat map for sum @arrdelay per @uniquecarrier and @dest",
    "chartType": "heat map",
    "rows": [
      ["CO", "BRO", "50"],
      ["F9", "ELP", "-50"],
      ["EV", "PSC", "260"],
      ["CO", "AGS", "0"],
      ["CO", "ORF", "-80"],
      ["CO", "PWM", "-95"],
      ["WN", "PDX", "318270"],
      ["WN", "PHX", "1174175"],
      ["WN", "SAN", "651960"],
      ["WN", "SEA", "257935"]
    ]
  }
  ```
  

- Word Cloud Queries.

  **Example Request**:
       
  ```bash 
  curl -v -H "Content-Type: application/json" \
  http://52.86.76.130:8081/searchQL \
  --data '{
      "datasetId": "airlines", 
      "searchQL": "show word cloud for @uniquecarrier by sum @depdelay"
  }'
  ```
      
  **Example Response**:
  
  ```json
  {
    "rowsCount": 10,
    "columnNames": ["uniquecarrier", "sum(airlines.depdelay)"],
    "suggestions": [],
    "original": "show word cloud for @uniquecarrier by sum @depdelay",
    "chartType": "word cloud",
    "rows": [
      ["AQ", "98330"],
      ["F9", "3599230"],
      ["AS", "8313755"],
      ["9E", "11362365"],
      ["FL", "11690400"],
      ["B6", "13748360"],
      ["OH", "14106680"],
      ["YV", "17388880"],
      ["NW", "18058620"],
      ["DL", "18315430"]
    ]
  }
  ```

- Simple Count and Radial Progress Queries. These queries just return simple aggregation values and differ only by the 
value in `chartType` field.

  **Example Request**:
       
  ```bash 
  curl -v -H "Content-Type: application/json" \
  http://52.86.76.130:8081/searchQL \
  --data '{
      "datasetId": "airlines", 
      "searchQL": "show simple count of sum @depdelay"
  }'
  ```
      
  **Example Response**:
  
  ```json
  {
    "rowsCount": 1,
    "columnNames": ["sum(airlines.depdelay)"],
    "suggestions": [],
    "original": "show simple count of sum @depdelay",
    "chartType": "simple count",
    "rows": ["413312000"]
  }
  ```

### Chart Queries Filtering and Sorting

All chart queries support the same filtering and sorting options. You can specify time filter, dimension filter, and 
secondary sorting in field in any order. For example:

  **Example Request**:
       
  ```bash 
  curl -v -H "Content-Type: application/json" \
  http://52.86.76.130:8081/searchQL \
  --data '{
      "datasetId": "airlines", 
      "searchQL": "show bar chart between avg @arrdelay of @uniquecarrier stacked by @dest sorted by @dest for @uniquecarrier = WN for last year"
  }'
  ```
      
  **Example Response**:
  
  ```json
  {
    "rowsCount": 15,
    "columnNames": ["uniquecarrier", "dest", "avg(airlines.arrdelay)"],
    "suggestions": [],
    "original": "show bar chart between avg @arrdelay of @uniquecarrier stacked by @dest sorted by @dest for @uniquecarrier = WN for last year",
    "chartType": "bar chart",
    "rows": [
      ["WN", "ALB", "8.0727"],
      ["WN", "AMA", "12.2963"],
      ["WN", "AUS", "6.5543"],
      ["WN", "BDL", "7.3771"],
      ["WN", "BHM", "4.8253"],
      ["WN", "BNA", "4.6745"],
      ["WN", "BOI", "5.3154"],
      ["WN", "BUF", "5.4496"],
      ["WN", "BUR", "6.3852"],
      ["WN", "BWI", "4.6403"],
      ["WN", "CLE", "9.3713"],
      ["WN", "CMH", "6.6632"],
      ["WN", "CRP", "12.3228"],
      ["WN", "DAL", "9.1559"],
      ["WN", "DEN", "5.2507"]
    ]
  }
  ```

Here, `sorted by @dest` is a secondary sorting, `for @uniquecarrier = WN` is a dimension filter,
and `for last year` is a time filter. 


## History API

When you submit searchQL request via SearchQL API, if this query is a valid finished query, 
it is automatically saved to a History database. Queries are saved together with the datasetId they are made against.
You can fetch some data from this db by using the following requests.

### History request

Get to `/history` endpoint. Will return a list of queries, ordered by the frequency.
Supports the following query string parameters:

- `datasetId` - an optional id of a dataset you want to filter results by. If no `datasetId` is provided, 
will return aggregated results for all datasets.
- `partialQuery` - an optional string parameter. When this parameter is supplied, results from history 
will be ordered by a Levenshtein distance to the value of this parameter first, and by number of hits second.
- `maximumAllowedRows` - an optional number of rows to be returned. Default is 100.

**Example Request**:

```bash
curl -v http://52.86.76.130:8081/history?datasetId=airlines&partialQuery=show%20chart%20for%20average%20@taxiin&maximumAlloweRows=10
```
**Example Response**:

```json
{
  "rowsCount": 10,
  "columnNames": ["query", "sum"],
  "datasetId": "airlines",
  "responseType": "history",
  "rows": [
    ["show chart for average @taxiin of @depdelay", "2"],
    ["show chart for average @arrtime of @arrtime", "1"],
    ["show average of @year", "4"],
    ["show chart for average @deptime of @depdelay", "1"],
    ["show first 50 rows of data", "2"],
    ["show chart between average @arrtime and @origin", "2"],
    ["show chart between average @deptime and @origin", "1"],
    ["show chart for average @arrtime of @uniquecarrier", "4"],
    ["show chart between average @arrtime and @year", "2"],
    ["show chart between average @deptime and @year", "2"]]
}
```

### History count request

Get to `/history/count` endpoint. Will return a frequency of a particular query.
Supports the following query string parameters:

- `query` - a query for which you'd like to know the frequency. Note, that the value of this parameter should be 
urlencoded.
- `datasetId` - an optional id of a dataset you want to filter results by. If no `datasetId` is provided, 
will return aggregated results for all datasets.

**Example Request**:

```bash
curl -v http://52.86.76.130:8081/history/count?query=show%20bar%20chart%20for%20avg%20%40arrdelay%20of%20%40uniquecarrier&datasetId=airlines
```
**Example Response**:

```json
{
  "query": "show bar chart for avg @arrdelay of @uniquecarrier",
  "count": 6
}
```

## SearchQL Transform API Queries

These queries will return a JSON objects with options for Transform API of Spark Backend. You will need to convert `"options"` property to JSON object like this:

```js
// example response
val resp = {
  "sourceid": "airlines",
  "transformationtype": "addcolumn",
  "options": "{\"columnname\": \"newColumn\", \"fixedstring\": \"slowpoke\", \"columntype\": \"fixedstring\"}"
};

resp.options = JSON.parse(resp.options);

// now you can pass resp object to the Transform API
```

### Add column query

**Example Request**:

```bash
curl -v -H "Content-Type: application/json" http://52.86.76.130:8081/searchQL --data '{"datasetId": "airlines", "searchQL": "add column newColumn with fixed value = slowpoke"}'
```

**Example Response**:

```json
{
  "sourceid": "airlines",
  "transformationtype": "addcolumn",
  "options": "{\"columnname\": \"newColumn\", \"fixedstring\": \"slowpoke\", \"columntype\": \"fixedstring\"}"
}
```

### Cast column query

**Example Request**:

```bash
curl -v -H "Content-Type: application/json" http://52.86.76.130:8081/searchQL --data '{"datasetId": "airlines", "searchQL": "change type of column @arrdelay to integer"}'
```

**Example Response**:

```json
{
  "sourceid": "airlines",
  "transformationtype": "cast",
  "options": "{\"columnname\": \"arrdelay\", \"dataType\": \"integer\"}"
}
```

### Rename column query

**Example Request**:

```bash
curl -v -H "Content-Type: application/json" http://52.86.76.130:8081/searchQL --data '{"datasetId": "airlines", "searchQL": "rename column @arrdelay to arrival_delay"}'
```

**Example Response**:

```json
{
  "sourceid": "airlines",
  "transformationtype": "renamecolumn",
  "options": "{\"columnname\": \"arrdelay\", \"renameto\": \"arrival_delay\"}"
}
```

### Sort column query

**Example Request**:

```bash
curl -v -H "Content-Type: application/json" http://52.86.76.130:8081/searchQL --data '{"datasetId": "airlines", "searchQL": "sort column @arrdelay desc"}'
```

**Example Response**:

```json
{
  "sourceid": "airlines",
  "transformationtype": "sort",
  "options": "{\"columnname\": \"arrdelay\", \"sortOrder\": \"desc\"}"
}
```

### Split column query

**Example Request**:

```bash
curl -v -H "Content-Type: application/json" http://52.86.76.130:8081/searchQL --data '{"datasetId": "airlines", "searchQL": "split column @uniquecarrier at foo"}'
```

**Example Response**:

```json
{
  "sourceid": "airlines",
  "transformationtype": "splitcolumn",
  "options": "{\"columnname\": \"uniquecarrier\", \"delimiter\": \"foo\"}"
}
```

### Merge columns query

**Example Request**:

```bash
curl -v -H "Content-Type: application/json" http://52.86.76.130:8081/searchQL --data '{"datasetId": "airlines", "searchQL": "merge column @uniquecarrier with @dest"}'
```

**Example Response**:

```json
{
  "sourceid": "airlines",
  "transformationtype": "mergecolumns",
  "options": "{\"columnnames\": \"uniquecarrier,dest\"}"
}
```

### Find and replace in column query

**Example Request**:

```bash
curl -v -H "Content-Type: application/json" http://52.86.76.130:8081/searchQL --data '{"datasetId": "airlines", "searchQL": "replace column @uniquecarrier on WN with VN"}'
```

**Example Response**:

```json
{
  "sourceid": "airlines",
  "transformationtype": "findandreplace",
  "options": "{\"columnnames\": \"uniquecarrier\", \"find\": \"WN\", \"replace\": \"VN\"}"
}
```

### Split rows in column query

**Example Request**:

```bash
curl -v -H "Content-Type: application/json" http://52.86.76.130:8081/searchQL --data '{"datasetId": "airlines", "searchQL": "split rows in column @uniquecarrier at foo"}'
```

**Example Response**:

```json
{
  "sourceid": "airlines",
  "transformationtype": "splitrows",
  "options": "{\"columnname\": \"uniquecarrier\", \"delimiter\": \"foo\"}"
}
```

### Delete column query

**Example Request**:

```bash
curl -v -H "Content-Type: application/json" http://52.86.76.130:8081/searchQL --data '{"datasetId": "airlines", "searchQL": "delete column @uniquecarrier"}'
```

**Example Response**:

```json
{
  "sourceid": "airlines",
  "transformationtype": "deletecolumn",
  "options": "{\"columnnames\": \"uniquecarrier\"}"
}
```

### Filter column query

**Example Request**:

```bash
curl -v -H "Content-Type: application/json" http://52.86.76.130:8081/searchQL --data '{"datasetId": "airlines", "searchQL": "filter column @uniquecarrier where @uniquecarrier does not equal WN"}'
```

**Example Response**:

```json
{
  "sourceid": "airlines",
  "transformationtype": "filter",
  "options": "{\"condition\": \"uniquecarrier != 'WN'\"}"
}
```

## ExtendedSQL API

ExtendedSQL API makes possible to submit almost any SQL query to MemSQL with the dataset data. It also provides 
some additional functions, like timelines and resolutions, to help to form those queries.

To make an ExtendedSQL query, you'll need to submit a query object with a following fields:

- `datasetId` - an id of a dataset you want to query. This field is required.
- `select` - a list of columns/aggregated columns to select. For instance, 
if you want to select `date`, `uniquecarrier`, and `sum(arrdelay)`, you'll need to submit this string in `select`
field: `"date, uniquecarrier, sum(arrdelay)"`. This field is also required.

Optional fields:

- `where` - `WHERE` part of SQL statement, but without `WHERE` keyword. E.g., to filter by destination, you can 
submit: `"dest = 'PL'"`.
- `groupBy` - 'GROUP BY` part of SQL statement, but without `GROUP BY` keyword.
- `orderBy` - 'ORDER BY` part of SQL statement, but without `ORDER BY` keyword.
- `timeline` - an additional time-filtering condition. `timeColumn` info from DatasetDescription API of Middleware
will be used to build this part of query. Possible timelines are: `"today"`, `"yesterday"`, `"this month"`, 
`"last month"`, `"this quarter"`, `"last quarter"`, `"last N months"`, `"last N days"` (where `N` is an integer > 0).
- `resolution` - an additional time-based group by condition. `timeColumn` info from DatasetDescription API of Middleware
will be used to build this part of query. Possible resolutions are: `"hourly"`, `"daily"`, `"weekly"`, `"monthly"`, 
`"quarterly"`. Note that use of this field will result in additional fields added to the select query, to show the results 
of grouping.
- `maximumAllowedRows` - an optional number of rows to be returned. Default is 100.
- `offset` - an integer offset (how many rows to skip). Default is 0.

**Example Request**:

```bash
curl -v -H "Content-Type: application/json" \
    http://52.86.76.130:8081/extendedSQL --data '{
        "datasetId": "airlines", 
        "select": "uniquecarrier, sum(arrdelay)", 
        "where": "arrdelay > 0", 
        "groupBy": "uniquecarrier", 
        "orderBy": "sum(arrdelay)", 
        "timeline": "last 200 months", 
        "resolution": "monthly", 
        "maximumAllowedRows": 10, 
        "offset": 20}'
```

**Example Response**:

```json
{
  "rowsCount": 10,
  "columnNames": ["uniquecarrier", "sum(arrdelay)", "year(airlines.datetime)", "month(airlines.datetime)"],
  "responseType": "extendedSQL",
  "rows": [
      ["AQ", "13776", "2009", "3"], 
      ["AQ", "13776", "2011", "3"], 
      ["AQ", "13776", "2010", "3"], 
      ["AQ", "13776", "2008", "3"], 
      ["AQ", "13776", "2007", "3"], 
      ["AQ", "14953", "2010", "1"], 
      ["AQ", "14953", "2007", "1"],
      ["AQ", "14953", "2011", "1"], 
      ["AQ", "14953", "2008", "1"], 
      ["AQ", "14953", "2009", "1"]
  ],
  "original": {
    "datasetId": "airlines",
    "select": "uniquecarrier, sum(arrdelay)",
    "offset": 20,
    "groupBy": "uniquecarrier",
    "resolution": "monthly",
    "maximumAllowedRows": 10,
    "orderBy": "sum(arrdelay)",
    "timeline": "last 200 months",
    "where": "arrdelay > 0"
  }
}
```

## Indicators API

The role of this API is to verify the validity of an indicator expression and clean it up.
It also checks the names of the columns in the expression; only measures are allowed.

**Example Request with valid expression**:

```bash
curl -v -H "Content-Type: application/json" \
  http://52.86.76.130:8081/indicator --data '{
    "datasetId": "airlines",
    "expression": "(arrdelay[yesterday] + 3.15) * (4 - sum(depdelay[last 105 months]))"
  }'
```

**Example Response**:

```json
{
  "datasetId": "airlines",
  "responseType": "indicator",
  "value": "(arrdelay[yesterday]+3.15)*(4-sum(depdelay[last 105 months]))",
  "input": "(arrdelay[yesterday] + 3.15) * (4 - sum(depdelay[last 105 months]))",
  "ast": {
    "value": {
      "op": "*",
      "value1": {
        "op": "+",
        "value1": {
          "name": "arrdelay",
          "dateColumn": "datetime",
          "datasetId": "airlines",
          "timeline": {
            "type": "yesterday"
          },
          "type": "column"
        },
        "value2": {
          "value": 3.15,
          "type": "double"
        },
        "type": "binary op"
      },
      "value2": {
        "op": "-",
        "value1": {
          "value": 4,
          "type": "int"
        },
        "value2": {
          "name": "depdelay",
          "dateColumn": "datetime",
          "datasetId": "airlines",
          "aggregation": "sum",
          "timeline": {
            "type": "last months",
            "value": 105
          },
          "type": "column"
        },
        "type": "binary op"
      },
      "type": "binary op"
    },
    "type": "indicator"
  }
}
```

**Example Request with invalid expression (incorrect column name)**:

```bash
curl -v -H "Content-Type: application/json" \
  http://52.86.76.130:8081/indicator --data '{
    "datasetId": "airlines",
    "expression": "arrdelay + wrongColumnName"
  }'
```

**Example Response**:

```json
{
  "datasetId": "airlines",
  "input": "arrdelay + wrongColumnName",
  "message": "Invalid input \"wrongColumnName\", expected AnyColumn, Number or Parens (line 1, column 12):\narrdelay + wrongColumnName\n           ^",
  "responseType": "indicatorError"
}
```

## Signatures API

**Example Request with valid expression**:

```bash
curl -v -H "Content-Type: application/json" \
    http://52.86.76.130:8081/signature --data '{
      "datasetId": "airlines", 
      "expression": "if 1 <= 2 and 4 >= 5 then 1 elseif avg(arrdelay[last 7 days]) + depdelay + deptime < 3.4 then 3 else 4"
    }'
```

**Example Response**:

```json
{
  "datasetId": "airlines",
  "responseType": "signature",
  "value": "if 1<=2 and 4>=5 then 1 elseif ((avg(arrdelay[last 7 days])+depdelay)+deptime)<3.4 then 3 else 4",
  "input": "if 1 <= 2 and 4 >= 5 then 1 elseif avg(arrdelay[last 7 days]) + depdelay + deptime < 3.4 then 3 else 4",
  "ast": {
    "value": {
      "if": {
        "op": "and",
        "arg1": {
          "op": "<=",
          "arg1": {
            "value": 1,
            "type": "int"
          },
          "arg2": {
            "value": 2,
            "type": "int"
          },
          "type": "comparison"
        },
        "arg2": {
          "op": ">=",
          "arg1": {
            "value": 4,
            "type": "int"
          },
          "arg2": {
            "value": 5,
            "type": "int"
          },
          "type": "comparison"
        },
        "type": "bool op"
      },
      "else": {
        "value": 4,
        "type": "int"
      },
      "then": {
        "value": 1,
        "type": "int"
      },
      "elseIf": [{
        "condition": {
          "op": "<",
          "arg1": {
            "value": {
              "op": "+",
              "value1": {
                "op": "+",
                "value1": {
                  "name": "arrdelay",
                  "dateColumn": "datetime",
                  "datasetId": "airlines",
                  "aggregation": "avg",
                  "timeline": {
                    "type": "last days",
                    "value": 7
                  },
                  "type": "column"
                },
                "value2": {
                  "name": "depdelay",
                  "datasetId": "airlines",
                  "dateColumn": "datetime",
                  "type": "column"
                },
                "type": "binary op"
              },
              "value2": {
                "name": "deptime",
                "datasetId": "airlines",
                "dateColumn": "datetime",
                "type": "column"
              },
              "type": "binary op"
            },
            "type": "indicator"
          },
          "arg2": {
            "value": 3.4,
            "type": "double"
          },
          "type": "comparison"
        },
        "then": {
          "value": 3,
          "type": "int"
        },
        "type": "elseifpart"
      }],
      "type": "if"
    },
    "type": "signature"
  }
}
```

**Example Request with invalid expression (incorrect syntax)**:

```bash
curl -v -H "Content-Type: application/json" \
    http://52.86.76.130:8081/signature --data '{
      "datasetId": "airlines", 
      "expression": "if 1 <= 2 and 4 >= 5 then 1 else if arrdelay + depdelay + deptime < 3.4 then 3 else 4"
    }'
```

**Example Response**:

```json
{
  "datasetId": "airlines",
  "input": "if 1 <= 2 and 4 >= 5 then 1 else if arrdelay + depdelay + deptime < 3.4 then 3 else 4",
  "message": "Invalid input \"else i\", expected '.', ElsePart or ElseIfPart (line 1, column 29):\nif 1 <= 2 and 4 >= 5 then 1 else if arrdelay + depdelay + deptime < 3.4 then 3 else 4\n                            ^",
  "responseType": "signatureError"
}
```

## Suggest Column API

**Example Request with incomplete column name in the end**:

```bash
curl -v -H "Content-Type: application/json" \
    http://52.86.76.130:8081/suggestColumn --data '{
        "datasetId": "airlines",
        "expression": "if 1 <= 2 and 4 >= 5 then 1 elseif avg(arrd"
    }'
```

**Example Response**:

```json
{
  "original": "if 1 <= 2 and 4 >= 5 then 1 elseif avg(arrd",
  "suggestions": [
    "arrdelay", "carrierdelay", "lateaircraftdelay", 
    "arrtime", "crsarrtime", "crselapsedtime",
     "weatherdelay", "securitydelay", "crsdeptime", 
     "actualelapsedtime", "airtime", "depdelay", 
     "distance", "nasdelay", "id", "taxiin", "taxiout", "deptime"
  ],
  "responseType": "suggestColumn"
}
```

**Example Request with complete column name in the end**:

```bash
curl -v -H "Content-Type: application/json" \
    http://52.86.76.130:8081/suggestColumn --data '{
      "datasetId": "airlines",
      "expression": "if 1 <= 2 and 4 >= 5 then 1 elseif avg(arrdelay"
    }'
```

**Example Response**:

```json
{
  "original": "if 1 <= 2 and 4 >= 5 then 1 elseif avg(arrdelay",
  "responseType": "suggestColumnIsAColumn"
}
```

## Joins release changes

To support joins in our existing APIs we decided to change them. Thus, you cannot use old frontend code to access 
SearchQL and Extended SQL. Below are examples of the new queries objects. You can test them on the second SQE instance, 
where the new version of SQE is deployed. The endpoint is `http://52.87.228.68:8081`.

We changed SearchQL API to accept a list of `datasetIds` instead of one `datasetId`. 
Field name and type were changed accordingly. We also introduced two additional optional parameters: 
`joinSchemas`, a list of objects describing how to join several datasets, and `timeColumn`, an optional name of the column 
to use as a timeColumn. 
Another important change is a new syntax for qualified column names in the SearchQL queries. If you have a name collision 
of columns from different datasets, you will need to provide a datasetId qualification for this column: `@datasetId.columnName`.

**Example SearchQL request via new API:**

Here we join datasets `trip_data` and `trip_fare` via inner join on `trip_data.medallion = trip_fare.medallion`.

```bash
curl -v -H "Content-Type: application/json" \
    http://52.87.228.68:8081/searchQL --data '{
        "datasetsIds": ["trip_data", "trip_fare"],
        "searchQL": "show bar chart between avg @total_amount of @rate_code",
        "joinSchemas": [
            {
                "dataset1": "trip_data",
                "dataset2": "trip_fare",
                "joinFields": [{"dataset1Field": "medallion", "dataset2Field": "medallion"}]
            }
        ]}'
```

**Response:**

```json
{
  "rowsCount": 8,
  "columnNames": ["rate_code", "avg(`trip_fare`.total_amount)"],
  "suggestions": [
    "show bar chart between avg @total_amount of @rate_code for",
    "show bar chart between avg @total_amount of @rate_code ordered by",
    "show bar chart between avg @total_amount of @rate_code ranked by",
    "show bar chart between avg @total_amount of @rate_code sorted by",
    "show bar chart between avg @total_amount of @rate_code stacked by"
  ],
  "responseType": "chart",
  "original": "show bar chart between avg @total_amount of @rate_code",
  "chartType": "bar chart",
  "rows": [
    [210, 10.833333333333334],
    [1, 14.189340377755439],
    [3, 14.55245567206864],
    [6, 13.342679425837318],
    [0, 13.906951871657753],
    [5, 14.477181005216535],
    [4, 14.55155714185737],
    [2, 15.183472069759816]
  ]
}
```

**Joining on more than one field:**

Here we join datasets `trip_data` and `trip_fare` via inner join on 
`trip_data.medallion = trip_fare.medallion and trip_data.pickup_datetime = trip_fare.pickup_datetime`.

```bash
curl -v -H "Content-Type: application/json" \
    http://52.87.228.68:8081/searchQL --data '{
        "datasetsIds": ["trip_data", "trip_fare"],
        "searchQL": "show bar chart between avg @total_amount of @rate_code",
        "joinSchemas": [{
            "dataset1": "trip_data",
            "dataset2": "trip_fare",
            "joinFields": [
                {"dataset1Field": "medallion", "dataset2Field": "medallion"},
                {"dataset1Field": "pickup_datetime", "dataset2Field": "pickup_datetime"}
            ]
        }]
    }'
```

**Response:**

```json
{
  "rowsCount": 7,
  "columnNames": ["rate_code", "avg(`trip_fare`.total_amount)"],
  "suggestions": [
    "show bar chart between avg @total_amount of @rate_code for",
    "show bar chart between avg @total_amount of @rate_code ordered by",
    "show bar chart between avg @total_amount of @rate_code ranked by",
    "show bar chart between avg @total_amount of @rate_code sorted by",
    "show bar chart between avg @total_amount of @rate_code stacked by"],
  "responseType": "chart",
  "original": "show bar chart between avg @total_amount of @rate_code",
  "chartType": "bar chart",
  "rows": [
    [4, 24.818421052631578],
    [2, 58.915000000000006],
    [1, 13.906942191322267],
    [3, 41.6],
    [6, 3.0],
    [0, 20.5],
    [5, 88.756]
  ]
}
```

**Example request with ambiguous column name**

Here we are using column `medallion` which is present in both datasets. 
This request will be answered with suggestions for qualified column names.

```bash
curl -v -H "Content-Type: application/json" \
    http://52.87.228.68:8081/searchQL --data '{
        "datasetsIds": ["trip_data", "trip_fare"],
        "searchQL": "show bar chart between avg @total_amount of @medallion",
        "joinSchemas": [{
            "dataset1": "trip_data",
            "dataset2": "trip_fare",
            "joinFields": [
                {"dataset1Field": "medallion", "dataset2Field": "medallion"},
                {"dataset1Field": "pickup_datetime", "dataset2Field": "pickup_datetime"}]}]}'
```

**Response:**

```json
{
  "original": "show bar chart between avg @total_amount of @medallion",
  "suggestions": [
    "show bar chart between avg @total_amount of @trip_data.medallion",
    "show bar chart between avg @total_amount of @trip_fare.medallion"],
  "responseType": "autocomplete"
}
```

**Example request with qualified column name**

We resolve ambiguity by providing qualificaiton on the column name (we decided to use `medallion` column from the
`trip_data` dataset).

```bash
curl -v -H "Content-Type: application/json" \
    http://52.87.228.68:8081/searchQL --data '{
        "datasetsIds": ["trip_data", "trip_fare"], 
        "searchQL": "show bar chart between avg @total_amount of @trip_data.medallion", 
        "joinSchemas": [{
            "dataset1": "trip_data",
            "dataset2": "trip_fare",
            "joinFields": [
                {"dataset1Field": "medallion", "dataset2Field": "medallion"},
                {"dataset1Field": "pickup_datetime", "dataset2Field": "pickup_datetime"}]}]}'
```

**Response:**

```json
{
  "rowsCount": 100,
  "columnNames": ["medallion", "avg(`trip_fare`.total_amount)"],
  "suggestions": [
    "show bar chart between avg @total_amount of @trip_data.medallion for",
    "show bar chart between avg @total_amount of @trip_data.medallion ordered by",
    "show bar chart between avg @total_amount of @trip_data.medallion ranked by",
    "show bar chart between avg @total_amount of @trip_data.medallion sorted by",
    "show bar chart between avg @total_amount of @trip_data.medallion stacked by"],
  "responseType": "chart",
  "original": "show bar chart between avg @total_amount of @trip_data.medallion",
  "chartType": "bar chart",
  "rows": [
    ["2013006130", 11.05],
    ["2013004817", 7.0],
    ["2013001210", 10.0],
    ["2013002589", 21.5],
    ["2013001628", 14.5],
    ["2013002972", 7.7],
    ["2013000438", 9.5],
    ["2013002937", 6.0],
    ["2013004611", 9.5],
    ["2013000666", 13.25],
    ...
  ]
}
```

Extended SQL changes were not as extensive. We changed field `datasetId` to `from`, to better mirror the intended use 
of the field (you can pass any valid `FROM` clause there, without `FROM` keyword itself). We also added an optional
`timeColumn` field, that you will need to use if you want to perform timeline and resolution operations.

**Extended SQL request example**

```bash
curl -v -H "Content-Type: application/json" \
    http://52.87.228.68:8081/extendedSQL --data '{
        "from": "trip_data inner join trip_fare on trip_data.medallion = trip_fare.medallion and trip_data.pickup_datetime = trip_fare.pickup_datetime",
        "select": "total_amount, trip_data.medallion",
        "maximumAllowedRows": 10,
        "offset": 20}'
```

**Response**

```json
{
  "rowsCount": 10,
  "columnNames": ["total_amount", "medallion"],
  "responseType": "extendedSQL",
  "original": {
    "from": "trip_data inner join trip_fare on trip_data.medallion = trip_fare.medallion and trip_data.pickup_datetime = trip_fare.pickup_datetime",
    "select": "total_amount, trip_data.medallion",
    "maximumAllowedRows": 10,
    "offset": 20
  },
  "rows": [
    [10.0, "2013000197"],
    [5.0, "2013000211"],
    [12.0, "2013000212"],
    [9.5, "2013000236"],
    [12.5, "2013000250"],
    [11.75, "2013000254"],
    [32.0, "2013000261"],
    [8.5, "2013000263"],
    [16.0, "2013000269"],
    [8.62, "2013000281"]]
```

**Extended SQL request with resolution and timeColumn**

Here we are using `resolution` field in eSQL request. To be able to execute this request, SQE needs to know which
timeColumn to use, thus we need to supply `timeColumn` field. Note, that even for queries that don't use joins, but 
use resolutions and timeline, you will need to supply `timeColumn` from now on.

```bash
curl -v -H "Content-Type: application/json" \
    http://52.87.228.68:8081/extendedSQL --data '{
        "from": "airlines",
        "select": "avg(arrdelay)",
        "groupBy": "dest", 
        "resolution": "monthly",
        "timeColumn": "datetime",
        "maximumAllowedRows": 10}'
```

**Response**

```json
{
  "rowsCount": 10,
  "columnNames": ["avg(arrdelay)", "year(datetime)", "month(datetime)"],
  "responseType": "extendedSQL",
  "original": {
    "timeColumn": "datetime",
    "select": "avg(arrdelay)",
    "groupBy": "dest",
    "resolution": "monthly",
    "maximumAllowedRows": 10,
    "from": "airlines"
  },
  "rows": [
    ["3.5938", "2007", "3"],
    ["5.6506", "2008", "4"],
    ["9.3190", "2010", "6"],
    ["6.5814", "2007", "6"],
    ["14.6442", "2008", "4"],
    ["6.9167", "2007", "11"],
    ["8.6684", "2008", "5"],
    ["15.8683", "2007", "4"],
    ["2.3846", "2011", "2"],
    ["24.0896", "2008", "3"]
  ]
}
```

### timeColumn handling in SearchQL

In searchQL we can provide `timeColumn` in a similar fashion as in Extended SQL. However, sometimes it can be inferred 
from the dataset descriptions. The algorithm is as follows:

- If `timeColumn` field is provided in the request, use it.
- Otherwise, if only one dataset is used in the query, use it's `timeColumn` from the dataset description.
- If several datasets are used, use the timeColumn from the dataset description of the first dataset that 
has timeColumn in its dataset description.
    
Thus, you don't need to provide `timeColumn` for the queries that use only one dataset, if `timeColumn` is specified
in the dataset description object for this dataset.

**Example SearchQL request with a timeColumn**

```bash
curl -v -H "Content-Type: application/json" \
    http://52.87.228.68:8081/searchQL --data '{
        "datasetsIds": ["airlines"],
        "searchQL": "show top @arrdelay for @dest for last 100 months",
        "timeColumn": "datetime",
        "maximumAllowedRows": 10
    }'
```

**Response**

```json
{
  "rowsCount": 10,
  "columnNames": ["id", "year", "month", "day", "dayofweek", "deptime", "crsdeptime", "arrtime", "crsarrtime", "uniquecarrier", "flightnum", "tailnum", "actualelapsedtime", "crselapsedtime", "airtime", "arrdelay", "depdelay", "origin", "dest", "distance", "taxiin", "taxiout", "cancelled", "cancellationcode", "diverted", "carrierdelay", "weatherdelay", "nasdelay", "securitydelay", "lateaircraftdelay", "datetime"],
  "suggestions": [
    "show top @arrdelay for @dest for last 100 months for",
    "show top @arrdelay for @dest for last 100 months ordered by",
    "show top @arrdelay for @dest for last 100 months ranked by",
    "show top @arrdelay for @dest for last 100 months sorted by"],
  "responseType": "searchQL",
  "original": "show top @arrdelay for @dest for last 100 months",
  "rows": [
    ["34441416", 2009, 12, 25, 2, "1827", "1820", "2030", "2031", "OO", "5722", "N290SW", "63", "71", "50", -1, 7, "LAX", "YUM", "237", "3", "10", "0", "", "0", "0", "0", "0", "0", "0", "2009-12-25 00:00:00.0"],
    ["34480792", 2010, 12, 30, 7, "1817", "1815", "2027", "2026", "OO", "5722", "N233SW", "70", "71", "49", 1, 2, "LAX", "YUM", "237", "5", "16", "0", "", "0", "0", "0", "0", "0", "0", "2010-12-30 00:00:00.0"],
    ["34485407", 2010, 12, 31, 1, "2057", "2105", "2248", "2255", "OO", "3743", "N432SW", "111", "110", "81", -7, -8, "SLC", "YUM", "580", "10", "20", "0", "", "0", "0", "0", "0", "0", "0", "2010-12-31 00:00:00.0"],
    ["34465191", 2011, 12, 28, 5, "801", "810", "1008", "1021", "OO", "5734", "N578SW", "67", "71", "46", -13, -9, "LAX", "YUM", "237", "4", "17", "0", "", "0", "0", "0", "0", "0", "0", "2011-12-28 00:00:00.0"],
    ["34469392", 2010, 12, 29, 6, "2115", "2105", "2316", "2255", "OO", "3743", "N423SW", "121", "110", "73", 21, 10, "SLC", "YUM", "580", "15", "33", "0", "", "0", "21", "0", "0", "0", "0", "2010-12-29 00:00:00.0"],
    ["34473037", 2010, 12, 29, 6, "2228", "2253", "2359", "24", "OO", "5775", "N393SW", "31", "31", "17", -25, -25, "IPL", "YUM", "58", "5", "9", "0", "", "0", "0", "0", "0", "0", "0", "2010-12-29 00:00:00.0"],
    ["34478015", 2008, 12, 30, 7, "1320", "1140", "1522", "1330", "OO", "3860", "N910EV", "122", "110", "80", 112, 100, "SLC", "YUM", "580", "4", "38", "0", "", "0", "112", "0", "0", "0", "0", "2008-12-30 00:00:00.0"],
    ["34480951", 2009, 12, 30, 7, "1437", "1428", "1639", "1637", "OO", "5740", "N227SW", "62", "69", "46", 2, 9, "LAX", "YUM", "237", "5", "11", "0", "", "0", "0", "0", "0", "0", "0", "2009-12-30 00:00:00.0"],
    ["34449372", 2010, 12, 26, 3, "1237", "1248", "1407", "1419", "OO", "5778", "N215SW", "30", "31", "14", -12, -11, "IPL", "YUM", "58", "4", "12", "0", "", "0", "0", "0", "0", "0", "0", "2010-12-26 00:00:00.0"],
    ["34473056", 2009, 12, 29, 6, "1256", "1248", "1424", "1419", "OO", "5778", "N393SW", "28", "31", "16", 5, 8, "IPL", "YUM", "58", "4", "8", "0", "", "0", "0", "0", "0", "0", "0", "2009-12-29 00:00:00.0"]
  ]
}
```

## History with multiple datasets release changes

History API, logic, and schema were changed substantially due to added support for joins and multiple datasets 
in searchQL queries.

In API, all fields named `datasetId` were renamed as `datasetsIds` and now accept lists of strings instead of strings.
Also, all GET requests were changed to POST, and now accept JSON instead of query strings.

Lists of datasets are sorted before saving or querying PostgreSQL. Thus, if you request counts for some query with 
`datasetsIds` equal to `["ds3", "ds1", "ds2"]`, it will be equivalent to requesting the counts for the same query with
`datasetsIds` equal to `["ds1", "ds2", "ds3"]`.

**Example History Request**

```bash
curl -v -H "Content-Type: application/json" \
    http://52.87.228.68:8081/history --data '{
      "datasetIds": ["trip_data", "trip_fare"],
      "partialQuery": "show",
      "maximumAllowedRows": 10
    }'
```

**Example History Response**

```json
{
  "columnNames": ["query", "sum"],
  "rows": [["show top", "2"], ["show bar chart between avg @total_amount of @trip_data.medallion", "1"]],
  "rowsCount": 2,
  "responseType": "history"
}
```

**Example History Count Request**

```bash
curl -v -H "Content-Type: application/json" \
    http://52.87.228.68:8081/history/count --data '{
      "query": "show bar chart between avg @total_amount of @trip_data.medallion",
      "datasetsIds": ["trip_data", "trip_fare"]
    }'
```

**Example History Count Response**

```json
{
  "query": "show bar chart between avg @total_amount of @trip_data.medallion",
  "datasetsIds": ["trip_data", "trip_fare"],
  "count": 1,
  "responseType": "historyCount"
}
```

## Move Column Transform Queries Changes

Move Column Queries are another type of Transform Queries that SearchQL API can parse. They were added in
realease 2.1.1 of SQE. Instead of returning a JSON object corresponding to an object that Frontend needs to 
submit to Spark API to perform the Transform Query action, this API will return a custom JSON object. We did
it because to form a corresponding Spark API JSON, SQE will need to know the order of columns in dataset,
which it does not. Thus, we opted to create a new response type.

Note, that those requests will fail when you try to submit them with multiple datasets and/or any join schemas:

**Example incorrect request**

```bash
curl -v -H "Content-Type: application/json" http://52.87.228.68:8081/searchQL \
    --data '{
      "datasetsIds": ["trip_data", "trip_fare"], 
      "searchQL": "move colum @total_amount before previous column", 
      "joinSchemas": [
         {"dataset1": "trip_data","dataset2": "trip_fare","joinFields": [
            {"dataset1Field": "medallion", "dataset2Field": "medallion"},
            {"dataset1Field": "pickup_datetime", "dataset2Field": "pickup_datetime"}]}]}'
```

**Example response**

```json
{
  "msg": "joins and multiple datasets are not supported in transform queries",
  "responseType": "error"
}
```

Correct requests look like these:

**Example request**

```bash
curl -v -H "Content-Type: application/json" \
    http://52.87.228.68:8081/searchQL --data '{
      "datasetsIds": ["trip_fare"], 
      "searchQL": "move column @total_amount before previous column"
    }'
```

**Example response**

```json
{
  "columnToMove": "total_amount",
  "moveOption": "before previous",
  "responseType": "moveColumnTransformAPI"
}
```

**Example request**

```bash
curl -v -H "Content-Type: application/json" \
    http://52.87.228.68:8081/searchQL --data '{
      "datasetsIds": ["trip_fare"],
      "searchQL": "move column @total_amount before column @medallion"
    }'
```

**Example response**

```json
{
  "columnToMove": "total_amount",
  "moveOption": "before",
  "moveOptionColumn": "medallion",
  "responseType": "moveColumnTransformAPI"
}
```

**Example request**

```bash
curl -v -H "Content-Type: application/json" \
    http://52.87.228.68:8081/searchQL --data '{
      "datasetsIds": ["trip_fare"],
      "searchQL": "move column @total_amount after column @medallion"
    }'
```

**Example response**

```json
{
  "columnToMove": "total_amount",
  "moveOption": "after",
  "moveOptionColumn": "medallion",
  "responseType": "moveColumnTransformAPI"
}
```

**Example request**

```bash
curl -v -H "Content-Type: application/json" \
    http://52.87.228.68:8081/searchQL --data '{
      "datasetsIds": ["trip_fare"], 
      "searchQL": "move column @total_amount after next column"
    }'
```

**Example response**

```json
{
  "columnToMove": "total_amount",
  "moveOption": "after next",
  "responseType": "moveColumnTransformAPI"
}
```

## Map Queries

**Invalid request (no mapColumns specified)**

```bash
curl -v -H "Content-Type: application/json" \
    http://52.87.228.68:8081/searchQL --data '{
      "datasetsIds": ["airlines"],
      "searchQL": "show map"
    }'
```

**Response**

```json
{
  "msg": "Error while trying to parse MapQuery: no map columns specified",
  "responseType": "error"
}
```

**Invalid request (need to select a mapColumn with using syntax)**

```bash
curl -v -H "Content-Type: application/json" \
    http://52.87.228.68:8081/searchQL --data '{
      "datasetsIds": ["trip_data"],
      "searchQL": "show map"
    }'
```

**Response**

```json
{
  "original": "show map",
  "suggestions": ["show map using"],
  "responseType": "autocomplete"
}
```

**Valid request**

```bash
curl -v -H "Content-Type: application/json" \
    http://52.87.228.68:8081/searchQL --data '{
      "datasetsIds": ["trip_data"],
      "searchQL": "show map using @dropoff_location"
    }'
```

**Response**

```json
{
  "rowsCount": 100,
  "mapType": "map query",
  "columnNames": ["`trip_data`.dropoff_longitude", "`trip_data`.dropoff_latitude"],
  "suggestions": [
    "show map using @dropoff_location for",
    "show map using @dropoff_location ordered by",
    "show map using @dropoff_location ranked by",
    "show map using @dropoff_location sorted by"],
  "responseType": "map",
  "original": "show map using @dropoff_location",
  "rows": [
    [-74.003761, 40.739388],
    [-73.981247, 40.738007],
    [-73.979935, 40.740757],
    ...
  ]
```

**Valid request with join and filter**

```bash
curl -v -H "Content-Type: application/json" \
    http://52.87.228.68:8081/searchQL --data '{
      "datasetsIds": ["trip_data", "trip_fare"],
      "searchQL": "show map using @dropoff_location for @total_amount > 100",
      "joinSchemas": [
        {
          "dataset1": "trip_data",
          "dataset2": "trip_fare",
          "joinFields": [
            {"dataset1Field": "medallion", "dataset2Field": "medallion"},
            {"dataset1Field": "pickup_datetime", "dataset2Field": "pickup_datetime"}]}]}'
```

**Response**

```json
{
  "rowsCount": 10,
  "mapType": "map query",
  "columnNames": ["`trip_data`.dropoff_longitude", "`trip_data`.dropoff_latitude", "`trip_fare`.total_amount"],
  "suggestions": [
    "show map using @dropoff_location for @total_amount > 100 for",
    "show map using @dropoff_location for @total_amount > 100 ordered by",
    "show map using @dropoff_location for @total_amount > 100 ranked by",
    "show map using @dropoff_location for @total_amount > 100 sorted by"],
  "responseType": "map",
  "original": "show map using @dropoff_location for @total_amount > 100",
  "rows": [
    [-74.03759, 40.731247, 133.25],
    [-74.1782, 40.662979, 117.6],
    [-73.500938, 40.678661, 124.0],
    [-73.636902, 41.071018, 142.0],
    [-73.978424, 40.845776, 110.55],
    [-74.132042, 40.95705, 150.5],
    [-74.622017, 40.650188, 253.25],
    [-74.29879, 40.987392, 100.75],
    [-73.561256, 40.845131, 147.3],
    [0.0, 0.0, 321.05]
  ]
}
```

## Rounding Map Queries

Rouding Map Queries use rounding of longitude and latitude to a 3rd digit after the dot, and after that they group 
by them and return rounded coordinates together with some aggregated metrics.

**Example Rounding Map Query**

```bash
curl -v -H "Content-Type: application/json" \
    http://52.87.228.68:8081/searchQL --data '{
      "datasetsIds": ["trip_data", "trip_fare"],
      "searchQL": "show map using @dropoff_location of avg @trip_distance for @total_amount > 100",
      "joinSchemas": [{
        "dataset1": "trip_data",
        "dataset2": "trip_fare",
        "joinFields": [
          {"dataset1Field": "medallion", "dataset2Field": "medallion"},
          {"dataset1Field": "pickup_datetime", "dataset2Field": "pickup_datetime"}
        ]}]
    }'
```

**Example Response**

```json
{
  "rowsCount": 10,
  "mapType": "rounding map",
  "columnNames": [
    "round(`trip_data`.dropoff_longitude, 3)",
    "round(`trip_data`.dropoff_latitude, 3)",
    "avg(`trip_data`.trip_distance)",
    "`trip_fare`.total_amount"],
  "suggestions": [
    "show map using @dropoff_location of avg @trip_distance for @total_amount > 100 for",
    "show map using @dropoff_location of avg @trip_distance for @total_amount > 100 ordered by",
    "show map using @dropoff_location of avg @trip_distance for @total_amount > 100 ranked by",
    "show map using @dropoff_location of avg @trip_distance for @total_amount > 100 sorted by"],
  "responseType": "map",
  "original": "show map using @dropoff_location of avg @trip_distance for @total_amount > 100",
  "rows": [
    [-73.978, 40.846, 25.7, 110.55],
    [-73.637, 41.071, 39.02, 142.0],
    [0.0, 0.0, 0.0, 321.05],
    [-74.299, 40.987, 31.39, 100.75],
    [-73.561, 40.845, 28.5, 147.3],
    [-74.038, 40.731, 22.51, 133.25],
    [-74.622, 40.65, 55.6, 253.25],
    [-74.178, 40.663, 16.5, 117.6],
    [-73.501, 40.679, 21.48, 124.0],
    [-74.132, 40.957, 23.04, 150.5]
  ]
}
```

### State and Country Map Queries

Those queries don't need mapColumns definitions. Since we don't have datasets with states and countries, we will use 
`@rate_code` column instead, but you need to assume that in the real use case those `by @stateOrCountryColumnName` columns
will contain a text corresponding to a state or country.


**Example State Map Query**

```bash
curl -v -H "Content-Type: application/json" \
    http://52.87.228.68:8081/searchQL --data '{
        "datasetsIds": ["trip_data", "trip_fare"],
        "searchQL": "show state map of avg @trip_distance by @rate_code", 
        "joinSchemas": [{
            "dataset1": "trip_data",
            "dataset2": "trip_fare",
            "joinFields": [
                {"dataset1Field": "medallion", "dataset2Field": "medallion"},
                {"dataset1Field": "pickup_datetime", "dataset2Field": "pickup_datetime"}]}]}'
```

**Example Response**

```json
{
  "rowsCount": 7,
  "mapType": "state map",
  "columnNames": ["`trip_data`.rate_code", "avg(`trip_data`.trip_distance)"],
  "suggestions": [
    "show state map of avg @trip_distance by @rate_code for",
    "show state map of avg @trip_distance by @rate_code ordered by",
    "show state map of avg @trip_distance by @rate_code ranked by",
    "show state map of avg @trip_distance by @rate_code sorted by"],
  "responseType": "map",
  "original": "show state map of avg @trip_distance by @rate_code",
  "rows": [
    [1, 2.8830487961890037],
    [3, 5.958],
    [6, 0.0],
    [4, 5.195263157894737],
    [2, 13.602500000000001],
    [5, 11.6204],
    [0, 0.0]
  ]
}
```

**Example Country Map Request**

```bash
curl -v -H "Content-Type: application/json" \
    http://52.87.228.68:8081/searchQL --data '{
        "datasetsIds": ["trip_data", "trip_fare"],
        "searchQL": "show country map of avg @trip_distance by @rate_code",
        "joinSchemas": [{
            "dataset1": "trip_data",
            "dataset2": "trip_fare",
            "joinFields": [
                {"dataset1Field": "medallion", "dataset2Field": "medallion"},
                {"dataset1Field": "pickup_datetime", "dataset2Field": "pickup_datetime"}]}]}'
```

**Example Response**

```json
{
  "rowsCount": 7,
  "mapType": "country map",
  "columnNames": ["`trip_data`.rate_code", "avg(`trip_data`.trip_distance)"],
  "suggestions": [
    "show country map of avg @trip_distance by @rate_code for",
    "show country map of avg @trip_distance by @rate_code ordered by",
    "show country map of avg @trip_distance by @rate_code ranked by",
    "show country map of avg @trip_distance by @rate_code sorted by"],
  "responseType": "map",
  "original": "show country map of avg @trip_distance by @rate_code",
  "rows": [
    [0, 0.0],
    [1, 2.8830487961890037],
    [3, 5.958],
    [6, 0.0],
    [5, 11.6204],
    [4, 5.195263157894737],
    [2, 13.602500000000001]
  ]
}
```

## Indicators and Signatures suggestions in Error Responses

When you submit an Indicator or Signature with invalid syntax, we try to provide some simple autocorrections for it in 
 a `suggestions` field.
 
**Example Indicator Request**

```bash
curl -v -H "Content-Type: application/json" \
    http://52.87.228.68:8081/indicator --data '{
      "datasetId": "airlines",
      "expression": "depdelay + arr"
    }'
```

**Example Indicator Response**

```json
{
  "suggestions": ["arrtime", "arrdelay"],
  "datasetId": "airlines",
  "responseType": "indicatorError",
  "message": "Invalid input \"arr\", expected AnyColumn, WrappedNumber or Parens (line 1, column 12):\ndepdelay + arr\n           ^",
  "input": "depdelay + arr"
}
```

**Example Signature Request**

```bash
curl -v -H "Content-Type: application/json" \
  http://52.87.228.68:8081/signature --data '{
    "datasetId": "airlines",
    "expression": "if arrdelay > 5"
  }'
```

**Example Signature Response**

```json
{
  "suggestions": ["then"],
  "datasetId": "airlines",
  "responseType": "signatureError",
  "message": "Unexpected end of input, expected BooleanExp, \"and\", \"or\" or ThenPart (line 1, column 16):\nif arrdelay > 5\n               ^",
  "input": "if arrdelay > 5"
}
```
