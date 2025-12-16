const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.getExpense = async (event) => {
    try{
        const userId = event.queryStringParameters?.userId;

        if(!userId) {
            return {
                statusCode: 400,
                body: JSON.stringify({error: "userId is required !"})
            };
        }

        const result = await dynamoDB.query({
            TableName: "Expenses",
            KeyConditionExpression: "userId = :uid",
            ExpressionAttributeValues: {
                ":uid": userId
            },
        }).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({
                expenses: result.Items
            }),
        };
    } catch(error) {
        console.error("Error: ", error);

        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error"})
        };
    }
};