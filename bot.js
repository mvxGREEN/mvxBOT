var HTTPS = require('https');
var botID = process.env.BOT_ID;
var mention = require('./mention.js');

function respond() {
  var request = JSON.parse(this.req.chunks[0]),
      botRegex = /(^|\s)CSSA Bot(\s|$)/i,
      mentionRegex = /(^|\s)all(\s|$)/i;

  if(request.text && botRegex.test(request.text)) {
    this.res.writeHead(200);
    postMessage(":)");
    this.res.end();
  } else if(request.text && mentionRegex.test(request.text)) {
    this.res.writeHead(200);
    postMessage(mention.all());
    this.res.end();
  } else {
    console.log("don't care");
    this.res.writeHead(200);
    this.res.end();
  }
}

function postMessage(botResponse) {
  var options, body, botReq;

  if(typeof botResponse === "undefined") {
    botResponse = "I don't know.";
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
