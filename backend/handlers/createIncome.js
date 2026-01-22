const aws = require('aws-sdk');
const dynamoDB = new aws.DynamoDB.DocumentClient();

exports.createIncome = async(event) => {
    try {
    const body = JSON.parse(event.body);

    const income = {
      userId: body.userId,
      incomeId: Date.now().toString(), 
      amount: body.amount,
      source: body.source,
      date: body.date,
      createdAt: new Date().toISOString(),
    };

    await dynamoDB.put({
      TableName: "Income",
      Item: income,
    }).promise();

    return {
      statusCode: 201,
      body: JSON.stringify({ 
        message: "Income created successfully",
        income 
    }),
    };
  } catch (error) {
    console.error(error);
    return { 
        statusCode: 500, 
        body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};
