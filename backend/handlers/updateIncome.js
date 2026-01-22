const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.updateIncome = async(event) => {
    try {
        const incomeId = event.pathParameters?.incomeId;
        const body = JSON.parse(event.body || "{}");

        const { userId, amount, source, date } = body;

        if(!userId || !incomeId) {
            return {
                statusCode: 400,
                body: JSON.stringify({message: "userId and incomeId are required"})
            }
        }

        const updates = [];
        const values = {};
        const names = {};

        if(amount !== undefined) {
            updates.push("#amount = :amount");
            values[":amount"] = amount;
            names["#amount"] = "amount";
        }

        if(source) {
            updates.push("#source = :source");
            values[":source"] = source;
            names["#source"] = "source";
        }
        if(date) {
            updates.push("#date = :date");
            values[":date"] = date;
            names["#date"] = "date";
        }

        if(updates.length === 0) {
            return {
                statusCode: 400,
                body: JSON.stringify({message: "No fields provided to update!"})
            }
        }

        const res = await dynamoDB.update({
            TableName: "Income",
            Key: {
                userId,
                incomeId
            },
            UpdateExpression: `SET ${updates.join(", ")}`,
            names: names,
            values: values,
            ReturnValues: "ALL_NEW"
        }).promise();

        return {
            statusCode: 200,
            body: JSON.stringify({message: "Income updated successfully!", income: res.Attributes})
        }

    } catch(error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({error: "Failed to update income"})
        }
    }
}