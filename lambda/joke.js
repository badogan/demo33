import fetch from 'node-fetch';

export async function handler(event) {
    const response = await fetch('https://icanhazdadjoke.com/', {
      headers: { 'Accept': 'application/json' }
    });
    const data = await response.json();
    // return data.joke;
    return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'OPTIONS,POST'
        },
        body: JSON.stringify(data.joke)
      };
  }
  