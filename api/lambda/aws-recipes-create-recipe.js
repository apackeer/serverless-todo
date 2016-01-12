console.log('Loading function');
var doc = require('dynamodb-doc');
var dynamodb = new doc.DynamoDB();
var crypto = require('crypto');

exports.handler = function(event, context) {

    console.log("Create recipe event: " + JSON.stringify(event));

    if (!event.recipe || !event.recipe.name || !event.recipe.instructions) {
        context.fail("Bad Request: Invalid recipe");
    }

    ensureTable("aws-recipes", function() {
        var params = {
            TableName : "aws-recipes",
            Item: {
                userId : event.userId,
                recipeId : crypto.randomBytes(8).toString('hex'),
                name : event.recipe.name,
                instructions : event.recipe.instructions
            }
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