/*
####################################
Lotery chech v1.1.1 
22-12-2017
Moncho Pena
####################################	
*/

// The classic Request Library
const request = require('request');

// The numbers
const numbers = require('./numbers');

// API
// Documentation
// https://servicios.elpais.com/sorteos/loteria-navidad/api/
const apiURL = 'http://api.elpais.com/ws/LoteriaNavidadPremiados';

// Function to convert to JSON the body
function getJSONFromString(weirdString) {
  let parts = weirdString.split('=');
  if (parts && parts[1]) {
    let result = JSON.parse(parts[1]);
    if (result.error == 0) {
      return result;
    } else {
      return { error: result.error }
    }
  } else {
    return { error: 'No parts' }
  }
}

// Request into Promise
function doRequest(url) {
  return new Promise(function (resolve, reject) {
    request(url, function (error, res, body) {
      if (!error && res.statusCode == 200) {
        resolve(body);
      } else {
        reject(error);
      }
    });
  });
}

// Fill with 0
function leftPad(str, length) {
  str = str == null ? '' : String(str);
  length = ~~length;
  pad = '';
  padLength = length - str.length;

  while (padLength--) {
    pad += '0';
  }

  return pad + str;
}

// Check all the numbers
async function checkTheNumbers(numbers) {
  let total = 0;
  await Promise.all(numbers.map(async (number) => {
    let getRequest = await doRequest(apiURL + '?n=' + number);
    let result = getJSONFromString(getRequest);
    console.log('# Number: ' + leftPad(result.numero, 5) + ' ---- Prize: ' + result.premio + ' ---- Status: ' + result.status);
    total = total + result.premio;
  }));
  console.log();
  console.log('# ');
  console.log('# TOTAL: ' + total);
}

console.log(`####################################
Lotery chech v1.1.1 
22-12-2017
####################################
`);

checkTheNumbers(numbers);
