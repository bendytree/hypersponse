
module.exports = function hypersponse(hypr, callback){
  var response = null;
  var error = null;
  var datas = [];

  var sendCallback = function () {
    callback(error, response, Buffer.concat(datas));
  };

  hypr.on('response', function (_response) {
    response = _response;
  });

  hypr.on('request', function (request) {
    request.on("timeout", function(){
      error = new Error('ETIMEDOUT');
      error.code = "ETIMEDOUT";
      request.abort();
    });
  });

  hypr.on('error', function (_error) {
    error = error || _error;
    sendCallback();
  });

  hypr.on('data', function (data) {
    datas.push(data);
  });

  hypr.on('end', function(){
    sendCallback();
  });
};

