// index.js
var { Client } = require('pg');

const queryTemplate = "INSERT INTO messages (\"from\", \"to\", message)" +
" VALUES (\'{0}\',\'{1}\',\'{2}\')";

/**
 * フォーマット関数
 */
const format = function(fmt, a) {
    var rep_fn = undefined;
    if (typeof a == "object") {
      rep_fn = function(m, k) { return a[ k ]; }
    }
    else {
      var args = arguments;
      rep_fn = function(m, k) {
        console.log(k);
        return args[ parseInt(k)+1 ];
      }
    }
    return fmt.replace( /\{(\w+)\}/g, rep_fn);
}

exports.handler = function(event, context, callback){
  console.log("trying to connect...");
  const client = new Client({
    user: 'voiceuser',
    host: '172.31.44.13', /*'54.64.11.186',*/ // EC2 Private
    database: 'voicedb',
    password: 'voicevoice',
    port: 5432
  });
  const body = JSON.parse(event.body);
  console.log(body);
  const queryString = format(queryTemplate, body.from, body.to, body.message);
  console.log(queryString);

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
      } else {
        var jsonResult = JSON.stringify( result );
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
      }
      client.end();
    });
  });
}
