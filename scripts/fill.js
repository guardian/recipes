/*
  Fill local Docker-based DB with data from db/data.json
  Runs as part of the `start` script under `scripts/`
*/

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');

// Load credentials
var credentials = new AWS.SharedIniFileCredentials({ profile: 'developerPlayground' });
AWS.config.credentials = credentials;

// Set the region
AWS.config.update({ region: 'eu-west-1', 'endpoint': 'http://localhost:8000' });

// How many items to insert in database
var numItems = 150

// Read file with data
const fs = require('fs');
let rawdata = JSON.parse(fs.readFileSync('db/data.json'));

// Create the DynamoDB service object
var ddb = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

var params = {
  AttributeDefinitions: [
    {
      AttributeName: 'id',
      AttributeType: 'S'
    }
  ],
  KeySchema: [
    {
      AttributeName: 'id',
      KeyType: 'HASH'
    }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5
  },
  TableName: 'rawRecipesTableDEV',
  StreamSpecification: {
    StreamEnabled: false
  }
};

// Format data
function formatData(dat, tableName) {
  return dat.map((item) => {
    return {
      TableName: tableName,
      Item: { ...item }
    }
  });
};

// Call DynamoDB to create the table
ddb.createTable(params, function (err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log(`Table created, filling with max ${numItems} data points...`);

    rawdata.slice(-(numItems)).forEach((item) => {
      let params = {
        TableName: "rawRecipesTableDEV",
        Item: AWS.DynamoDB.Converter.marshall(item)
      }

      ddb.putItem(params, function (err, data) {
        if (err) {
          console.error(`Unable to add item: ${item.id}#${item.title}`, ". Error JSON:", JSON.stringify(err, null, 2));
        } else {
          console.log(`PutItem succeeded: ${item.title} (${item.id})`);
        }
      })
    });
  }
});
