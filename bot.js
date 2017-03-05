var HTTPS = require('https');
var cool = require('cool-ascii-faces');

var botID = process.env.BOT_ID;

function respond() {
  var request = JSON.parse(this.req.chunks[0]),
      botRegex = /^\/CSSA Bot$/,
      hiRegex = /^hi$/i;

  if(request.text && botRegex.test(request.text)) {
    this.res.writeHead(200);
    postMessage(0);
    this.res.end();
  } else if(request.text && hiRegex.test(request.text)) {
    this.res.writeHead(200);
    postMessage(1);
    this.res.end();
  } else {
    console.log("don't care");
    this.res.writeHead(200);
    this.res.end();
  }
}

function postMessage(case) {
  var botResponse, options, body, botReq;

  if(case == 0) {
    botResponse = cool();
  } else if(case == 1) {
    botResponse = "hi";
  } else {
    botResponse = "I dont't know."
  }

  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  body = {
    "bot_id" : botID,
    "text" : botResponse
  };

  console.log('sending ' + botResponse + ' to ' + botID);

  botReq = HTTPS.request(options, function(res) {
      if(res.statusCode == 202) {
        //neat
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body));
}


exports.respond = respond;
