// index.js
var { Client } = require('pg');

const queryString = "SELECT datetime, t1.name AS from_name, t2.name AS to_name, message" +
" FROM messages" +
" JOIN users AS t1" +
" ON messages.from = t1.user_id" +
" JOIN users AS t2" +
" ON messages.to = t2.user_id" +
" ORDER BY datetime DESC;";

exports.handler = function(event, context, callback){
  console.log("trying to connect...");
  const client = new Client({
    user: 'voiceuser',
    host: '172.31.44.13', /*'54.64.11.186',*/ // EC2 Private
    database: 'voicedb',
    password: 'voicevoice',
    port: 5432
  });  

  client.connect(function(err) {
    if(err) {
      console.log('>> Could not connect to postgresql.', err);
      context.fail(err);
      return;
    }
    console.log(">> Connected.");

    client.query(queryString, function(err, result) {
      if(err) {
        console.log('error running query', err);
        callback(err);
        //context.fail(err);
      } else {
        var jsonResult = JSON.stringify( result.rows ); // 行のみ返す
        console.log(">>> successful query. jsonResult: " +  jsonResult);
        var response = {
          "statusCode": 200,
          "headers": {
            "Content-Type": "application/json"
          },
          "body": jsonResult,
          "isBase64Encoded": false
        };
        callback(null, response);
        //context.succeed(result["rows"]);
      }
      client.end();
    });
  });
}
