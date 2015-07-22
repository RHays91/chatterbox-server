var url = require('url');
var fs = require('fs');
var results = [];
var counter = 1;

var requestHandler = function(request, response, html) {
  response.writeHeader(200, {"Content-Type": "text/html"});  // <-- HERE!
  response.write(html);  // <-- HERE!
  response.end();
  console.log("Serving request type " + request.method + " for url " + request.url);
  // console.log(request.method);

  var headers = defaultCorsHeaders;
  if(request.method === 'GET' || request.method === 'OPTIONS'){
    var url_parts = url.parse(request.url, true);
    var query = url_parts.query;
    console.log(url_parts);
    headers['Content-Type'] = "application/json";
    if (url_parts.pathname.substring(1,8) !== 'classes'){
      response.writeHead(404, headers);
      response.end();
    } else {
      response.writeHead(200, headers);
      jsonResponse = {
        results: results
      };
      response.end(JSON.stringify(jsonResponse));
    }
  }
  else if (request.method ==='POST'){
    headers['Content-Type'] = "application/json";
    response.writeHead(201, headers);
    var chunkResponse = "";
    request.on('data', function(data){
      chunkResponse += data;
    });
    request.on('end', function(){
      chunkResponse = JSON.parse(chunkResponse);
      chunkResponse.objectId = counter;
      counter++;
      chunkResponse.createdAt = new Date();
      results.push(chunkResponse)
      response.end(JSON.stringify(results));
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