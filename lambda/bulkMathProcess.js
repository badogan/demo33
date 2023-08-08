exports.handler = async function (event) {
  console.log("request:", JSON.stringify(event, undefined, 2));
  let receivedNumbers = JSON.parse(event.body).inputArray
  let receivedNumbersArray = receivedNumbers.split(',').map(item => parseFloat(item))
  let summed = receivedNumbersArray.reduce((sum, num) => sum + num)
  let multiplied = receivedNumbersArray.reduce((sum, num) => sum * num)
  // let body = `Hello from lamda! \n Original numbers: ${receivedNUmbersArray} \n The sum is ${summed} \n The multiplication is ${multiplied} \n Enjoy`
  let bodyObj = Object.create({})
  bodyObj.receivedNumbersArray = receivedNumbersArray
  bodyObj.summed = summed
  bodyObj.multiplied = multiplied
  bodyObj.basriTestKey = "BasriTestValue"

  // `{summed:${summed},multiplied:${multiplied}}`

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'OPTIONS,POST'
    },
    body: JSON.stringify(bodyObj)
  };
};