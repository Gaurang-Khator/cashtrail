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

        const updateExpressions = [];
        const expressionAttributeValues = {};
        const expressionAttributeNames = {};

        if(amount !== undefined) {
            updateExpressions.push("#amount = :amount");
            expressionAttributeValues[":amount"] = amount;
            expressionAttributeNames["#amount"] = "amount";
        }

        if(category) {
            updateExpressions.push("#category = :category");
            expressionAttributeValues[":category"] = category;
            expressionAttributeNames["#category"] = "category";
        }
        if(date) {
            updateExpressions.push("#date = :date");
            expressionAttributeValues[":date"] = date;
            expressionAttributeNames["#date"] = "date";
        }
        if(note !== undefined) {
            updateExpressions.push("#note = :note");
            expressionAttributeValues[":note"] = note;
            expressionAttributeNames["#note"] = "note";
        }

        if(updateExpressions.length === 0) {
            return {
                statusCode: 400,
                body: JSON.stringify({message: "No fields provided to update!"})
            }
        }

        const res = await dynamoDB.update({
            TableName: "Expenses",
            Key: {
                userId,
                expenseId
            },
            UpdateExpression: `SET ${updateExpressions.join(", ")}`,
            ExpressionAttributeNames: expressionAttributeNames,
            ExpressionAttributeValues: expressionAttributeValues,
            ReturnValues: "ALL_NEW"
        }).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({message: "Expense updated successfully!", expense: res.Attributes})
        }

    } catch(error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({error: "Failed to update expense"})
        }
    }
}