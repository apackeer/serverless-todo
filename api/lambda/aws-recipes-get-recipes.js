console.log('Loading function');
var doc = require('dynamodb-doc');
var dynamodb = new doc.DynamoDB();

exports.handler = function(event, context) {

    ensureTable("aws-recipes", function() {
        var userId = event.userId;
        var searchQuery = event.search;

        var params = {
            TableName : "aws-recipes",
            Limit : 100
        }

        dynamodb.scan(params, function(err, data) {
            if (err)
                context.fail(JSON.stringify(err, null, 2));
            else
                context.succeed(data.Items);
        });
    });
};

function ensureTable(tableName, callback) {
    dynamodb.describeTable({TableName : tableName}, function(err, data) {
        if (err) {
            var params = {
                TableName : tableName,
                KeySchema: [
                    { AttributeName: "recipeId", KeyType: "HASH"},  //Partition key
                    { AttributeName: "name", KeyType: "RANGE" }  //Sort key
                ],
                AttributeDefinitions: [
                    { AttributeName: "recipeId", AttributeType: "S" },
                    { AttributeName: "name", AttributeType: "S" }
                ],
                ProvisionedThroughput: {
                    ReadCapacityUnits: 10,
                    WriteCapacityUnits: 10
                }
            };

            dynamodb.createTable(params, function(err, data) {
                if (err) {
                    console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
                } else {
                    console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
                }
                callback();
            });
        } else {
            callback();
        }
    });

}