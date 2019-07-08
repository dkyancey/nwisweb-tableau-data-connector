import {
  formatJSONAsTable,
  generateURL,
  generateColList,
  generateSchemaTablesFromData,
  getTimeSeriesByID,
  reformatTimeString
} from "../../src/WDCMethods.js";
import { locationMode } from "../../src/enums.js";

test("converting a fully-populated data JSON to table", () => {
  const input = {
    value: {
      //barebones mockup of a data json with data series of uniform length
      timeSeries: [
        {
          name: "USGS:01646500:00060:00000",
          sourceInfo: {
            geoLocation: {
              geogLocation: {
                latitude: "0.000000",
                longitude: "0.000000"
              }
            }
          },
          values: [
            {
              value: [
                {
                  value: "10800",
                  dateTime: "2019-07-05T10:45:00.000-04:00"
                },
                {
                  value: "10800",
                  dateTime: "2019-07-05T10:45:00.000-04:00"
                }
              ]
            }
          ]
        },
        {
          name: "USGS:01647500:00062:00000",
          sourceInfo: {
            geoLocation: {
              geogLocation: {
                latitude: "0.00000",
                longitude: "0.00000"
              }
            }
          },
          values: [
            {
              value: [
                {
                  value: "343",
                  dateTime: "2019-07-05T10:45:00.000-04:00"
                },
                {
                  value: "5465",
                  dateTime: "2019-07-05T10:45:00.000-04:00"
                }
              ]
            }
          ]
        }
      ]
    }
  };
  const targetResult = [
    {
      "01646500_00060": "10800",
      dateTime: "2019-07-05 10:45:00.000",
      latitude: "0.000000",
      longitude: "0.000000"
    },
    {
      "01646500_00060": "10800",
      dateTime: "2019-07-05 10:45:00.000",
      latitude: "0.000000",
      longitude: "0.000000"
    }
  ];

  expect(formatJSONAsTable(input, "01646500_00060")).toEqual(targetResult);
});

test("correctly generate a URL given a list of sites and parameters with various whitespace", () => {
  const connectionData = {
    siteNums: "01646500 ,   05437641",
    paramNums: "00060   ,00065",
    state: "Rhode Island",
    locationMode: locationMode.SITE
  };
  expect(generateURL(connectionData)).toEqual(
    "https://waterservices.usgs.gov/nwis/iv/?format=json&sites=01646500,05437641&period=P1D&parameterCd=00060,00065&siteStatus=all"
  );
});

test("correctly generate a URL given a state", () => {
  const connectionData = {
    paramNums: "00060,00065",
    state: "ri",
    locationMode: locationMode.STATE
  };
  expect(generateURL(connectionData)).toEqual(
    "https://waterservices.usgs.gov/nwis/iv/?format=json&stateCd=ri&period=P1D&parameterCd=00060,00065&siteStatus=all"
  );
});

test("correctly generate a URL given a coordinate bounding box", () => {
  const connectionData = {
    paramNums: "00060,00065",
    boundaryCoords: {
      north: "2.000000",
      south: "1.000000",
      east: "2.000000",
      west: "1.000000"
    },
    locationMode: locationMode.COORDS
  };
  expect(generateURL(connectionData)).toEqual(
    "https://waterservices.usgs.gov/nwis/iv/?format=json&bBox=1.000000,1.000000,2.000000,2.000000&period=P1D&parameterCd=00060,00065&siteStatus=all"
  );
});

test("correctly generate a URL given a hydrological Unit Code", () => {
  const connectionData = {
    paramNums: "00060,00065",
    hydroCode: "02070010",
    locationMode: locationMode.HYDRO
  };
  expect(generateURL(connectionData)).toEqual(
    "https://waterservices.usgs.gov/nwis/iv/?format=json&huc=02070010&period=P1D&parameterCd=00060,00065&siteStatus=all"
  );
});

test("correctly generate a URL given a list of counties", () => {
  const connectionData = {
    paramNums: "00060,00065",
    countyCode: [11111, 22222],
    locationMode: locationMode.COUNTY
  };
  expect(generateURL(connectionData)).toEqual(
    "https://waterservices.usgs.gov/nwis/iv/?format=json&countyCd=11111,22222&period=P1D&parameterCd=00060,00065&siteStatus=all"
  );
});

test("correctly generates the column schema from sites and parameters", () => {
  const sites = "01646500,05437641";
  const params = "00060,00065";
  const targetResult = [
    "01646500_00060",
    "01646500_00065",
    "05437641_00060",
    "05437641_00065"
  ];
  expect(generateColList(sites, params)).toEqual(targetResult);
});

test("converting a non fully-populated data JSON to table", () => {
  const input = {
    value: {
      //barebones mockup of a data json with data series of non uniform length
      timeSeries: [
        {
          name: "USGS:01646500:00060:00000",
          values: [
            {
              value: [
                {
                  value: "10800",
                  dateTime: "2019-07-05T10:45:00.000-04:00"
                },
                {
                  value: "10800",
                  dateTime: "2019-07-05T10:45:00.000-04:00"
                }
              ]
            }
          ]
        },
        {
          name: "USGS:01647500:00062:00000",
          values: [
            {
              value: [
                {
                  value: "343",
                  dateTime: "2019-07-05T10:45:00.000-04:00"
                },
                {
                  value: "5465",
                  dateTime: "2019-07-05T10:45:00.000-04:00"
                }
              ]
            }
          ]
        }
      ]
    }
  };

  expect(() => {
    formatJSONAsTable(input, "fake_name");
  }).toThrow();
});

test("getTimeSeriesByID  correctly gets a time series by ID", () => {
  let timeSeries = [
    {
      name: "USGS:01646500:00060:00000",
      values: [
        {
          value: [
            {
              value: "10800",
              dateTime: "2019-07-05T10:45:00.000-04:00"
            },
            {
              value: "10800",
              dateTime: "2019-07-05T10:45:00.000-04:00"
            }
          ]
        }
      ]
    },
    {
      name: "USGS:01647500:00062:00000",
      values: [
        {
          value: [
            {
              value: "343",
              dateTime: "2019-07-05T10:45:00.000-04:00"
            },
            {
              value: "5465",
              dateTime: "2019-07-05T10:45:00.000-04:00"
            }
          ]
        }
      ]
    }
  ];

  let tableName = "01647500_00062";
  let targetResult = {
    name: "USGS:01647500:00062:00000",
    values: [
      {
        value: [
          {
            value: "343",
            dateTime: "2019-07-05T10:45:00.000-04:00"
          },
          {
            value: "5465",
            dateTime: "2019-07-05T10:45:00.000-04:00"
          }
        ]
      }
    ]
  };

  expect(getTimeSeriesByID(timeSeries, tableName)).toEqual(targetResult);
});

test("generateSchemaTablesFromData generate the correct schema tables given a data json", () => {
  // todo this will need to be updated as we develop the schema more

  let result = [];
  let targetResult = [
    {
      id: "01646500_00060",
      alias: "01646500_00060",
      columns: [
        { id: "dateTime", alias: "dateTime", dataType: "__TIME" },
        { id: "latitude", alias: "latitude", dataType: "__FLOAT" },
        { id: "longitude", alias: "longitude", dataType: "__FLOAT" },
        { id: "01646500_00060", alias: "01646500_00060", dataType: "__STRING" }
      ]
    },
    {
      id: "01646500_00065",
      alias: "01646500_00065",
      columns: [
        { id: "dateTime", alias: "dateTime", dataType: "__TIME" },
        { id: "latitude", alias: "latitude", dataType: "__FLOAT" },
        { id: "longitude", alias: "longitude", dataType: "__FLOAT" },
        { id: "01646500_00065", alias: "01646500_00065", dataType: "__STRING" }
      ]
    },
    {
      id: "05437641_00065",
      alias: "05437641_00065",
      columns: [
        { id: "dateTime", alias: "dateTime", dataType: "__TIME" },
        { id: "latitude", alias: "latitude", dataType: "__FLOAT" },
        { id: "longitude", alias: "longitude", dataType: "__FLOAT" },
        { id: "05437641_00065", alias: "05437641_00065", dataType: "__STRING" }
      ]
    }
  ];
  let input = {
    value: {
      timeSeries: [
        {
          name: "USGS:01646500:00060",
          sourceInfo: {
            geoLocation: {
              geogLocation: {
                latitude: "0.000000",
                longitude: "0.000000"
              }
            }
          }
        },
        {
          name: "USGS:01646500:00065",
          sourceInfo: {
            geoLocation: {
              geogLocation: {
                latitude: "0.000000",
                longitude: "0.000000"
              }
            }
          }
        },
        {
          name: "USGS:05437641:00065",
          sourceInfo: {
            geoLocation: {
              geogLocation: {
                latitude: "0.000000",
                longitude: "0.000000"
              }
            }
          }
        }
      ]
    }
  };
  result = generateSchemaTablesFromData(input);
  expect(result).toEqual(targetResult);
});

test("reformatTimeString correctly reformats timestring recieved from query into tableau compliant format", () => {
  let input = "2019-07-05T10:45:00.000-04:00";
  let expected = "2019-07-05 10:45:00.000";
  expect(reformatTimeString(input)).toEqual(expected);
});
