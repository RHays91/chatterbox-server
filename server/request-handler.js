// var request = require('request');
var results = [];

var requestHandler = function(request, response) {
  console.log("Serving request type " + request.method + " for url " + request.url);



  var headers = defaultCorsHeaders;
  if(request.method === 'GET' || request.options === 'OPTIONS'){
    //do we need to parse the url to GET from the right place?
    var url = request.url;
    // var statusCode = 200;
    // var headers = defaultCorsHeaders;
    headers['Content-Type'] = "application/json";
    response.writeHead(200, headers);

    jsonResponse = {
      results: results
    };

    // response.end(JSON.stringify(jsonResponse));
    

    var chunkResponse = "";

    request.on('data', function(data){
      //how do we collect the results array?
      // chunkResponse += data.toString();
      // console.log(data);
    })
    request.on('end', function(){
      response.end(JSON.stringify(jsonResponse));
      // console.log(JSON.stringify(jsonResponse));
    })
  }
  else if (request.method ==='POST' || request.options === 'OPTIONS'){
    //we need to parse the url to post to the correct place
    var url = request.url;
    // var statusCode = 201;
    headers['Content-Type'] = "application/json";
    response.writeHead(201, headers);
    // var jsonResponse ={
    //   results: []
    // };

    var chunkResponse = "";
    request.on('data', function(data){
      chunkResponse += data;//.toString();
    });
    request.on('end', function(){
      results.push(JSON.parse(chunkResponse))
      response.end();
    })
  }
};

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

exports.requestHandler = requestHandler;