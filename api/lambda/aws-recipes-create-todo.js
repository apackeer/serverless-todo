console.log('Loading function');
var doc = require('dynamodb-doc');
var dynamodb = new doc.DynamoDB();
var crypto = require('crypto');

exports.handler = function(event, context) {

    console.log("Create todo event: " + JSON.stringify(event));

    if (!event.todo || !event.todo.name) {
        context.fail("Bad Request: Invalid todo");
    }

    ensureTable("serverless-todo", function() {
        var params = {
            TableName : "serverless-todo",
            Item: {
                userId : event.userId,
                todoId : crypto.randomBytes(8).toString('hex'),
                name : event.todo.name}
        };

        console.log(params);

        dynamodb.putItem(params, function(err, data) {
            if (err) {
                console.log("Error saving item: " + err);
                context.fail("Internal Failure: Error saving item");//+ JSON.stringify(err, null, 2)).replace(/(\r\n|\n|\r)/gm,"");
            } else {
                context.succeed(data);
            }
        });
    });

};

function ensureTable(tableName, callback) {
    dynamodb.describeTable({TableName : tableName}, function(err, data) {
        if (err) {
            var params = {
                TableName : tableName,
                KeySchema: [
                    { AttributeName: "todoId", KeyType: "HASH"},  //Partition key
                    { AttributeName: "name", KeyType: "RANGE" }  //Sort key
                ],
                AttributeDefinitions: [
                    { AttributeName: "todoId", AttributeType: "S" },
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