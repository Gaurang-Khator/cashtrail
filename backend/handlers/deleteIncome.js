const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.deleteIncome = async(event) => {
    try {
        const incomeId = event.pathParameters?.incomeId;
        const userId = event.queryStringParameters?.userId;

        if(!userId || !incomeId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message:"userId and incomeId are required !"})
            }
        }

        await dynamoDB.delete({
            TableName: 'Income',
            Key: {
                userId,
                incomeId
            },
        }).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({message: "Income deleted successfully"})
        }
    } catch(error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to delete income"})
        }
    }
}