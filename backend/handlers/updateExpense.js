const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.updateExpense = async(event) => {
    try {
        const expenseId = event.pathParameters?.expenseId;
        const body = JSON.parse(event.body || "{}");

        const { userId, amount, category, date, note } = body;

        if(!userId || !expenseId) {
            return {
                statusCode: 400,
                body: JSON.stringify({message: "userId and expenseId are required"})
            }
        }

        const updateExpression = [];
        const expressionAttributeValues = {};
        const expressionAttributeNames = {};

        

    } catch(error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({error: "Failed to update expense"})
        }
    }
}