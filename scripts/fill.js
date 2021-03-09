/*  
  Fill local Docker-based DB with data from db/data.json
  Runs as part of the `start` script under `scripts/`
*/

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');

// Load credentials
var credentials = new AWS.SharedIniFileCredentials({profile: 'composer'});
AWS.config.credentials = credentials;

// Set the region 
AWS.config.update({region: 'eu-west-1', 'endpoint': 'http://localhost:8000'});

// How many items to insert in database
var numItems = 150

// Read file with data
const fs = require('fs');
let rawdata = JSON.parse(fs.readFileSync('db/data.json'));

// Create the DynamoDB service object
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

var params = {
  AttributeDefinitions: [
    {
      AttributeName: 'path',
      AttributeType: 'S'
    },
    {
      AttributeName: 'recipeId',
      AttributeType: 'N'
    }
  ],
  KeySchema: [
    {
      AttributeName: 'path',
      KeyType: 'HASH'
    },
    {
      AttributeName: 'recipeId',
      KeyType: 'Range'
    }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5
  },
  TableName: 'recipes',
  StreamSpecification: {
    StreamEnabled: false
  }
};

// Format data
function formatData(dat, tableName) {
  return dat.map((item) => {
    return {
      TableName: tableName,
      Item: {...item}
    }
  });
};

// Call DynamoDB to create the table
ddb.createTable(params, function(err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log(`Table created, filling with max ${numItems} data points...`);

    rawdata.slice(-(numItems)).forEach((item) => {
      const regex = new RegExp("_(\\d+)$", 'gm')
      const match = regex.exec(item.recipeId);
      item.recipeId = parseInt(match[1]);
      let params = {
        TableName: "recipes",
        Item: AWS.DynamoDB.Converter.marshall(item)
      }
    
      ddb.putItem(params, function(err, data) {
        if (err) {
            console.error(`Unable to add item: ${item.path}#${item.recipeId}`, ". Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log(`PutItem succeeded: ${item.path}#${item.recipeId}`);
        }
      })
   });
  }
});