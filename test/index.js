

var hyperquest = require("hyperquest");
var portfinder = require("portfinder");
var express = require("express");
var urlUtil = require('url');
var assert = require('assert');
var concatStream = require('concat-stream');
var hypersponse = require("../index.js");

describe('hypersponse', function(){

  var baseUrl = undefined;
  var server = undefined;

  before(function(done) {
    //echo server
    portfinder.getPort(function(err, port){
      baseUrl = "http://0.0.0.0:"+port;

      var app = express();
      app.use(function(req,res,next){
        var timeout = parseInt(req.headers['x-timeout']) || 0;
        setTimeout(next, timeout);
      });
      app.get('/:code', function (req, res) {
        res.status(parseInt(req.params.code)).send(urlUtil.parse(req.url).query);
      });
      app.use(function(req, res, next){
        req.pipe(concatStream(function(data){ req.body = data; next(); }));
      });
      app.post('/:code', function (req, res) {
        res.status(parseInt(req.params.code)).send(req.body);
      });
      server = app.listen(port, done);
    });
  });

  after(function() {
    if (server) { server.close(); }
  });

  it('buffers GET requests', function(done){
    var request = hyperquest(baseUrl+"/200?Orion");
    hypersponse(request, function(err, response, buffer){
      assert.equal(err, null);
      assert.equal(response.statusCode, 200);
      assert.equal(buffer.toString('utf8'), "Orion");
      done();
    });
  });

  it('buffers POST requests', function(done){
    var request = hyperquest(baseUrl+"/200", {method:"POST"});
    hypersponse(request, function(err, response, buffer){
      assert.equal(err, null);
      assert.equal(response.statusCode, 200);
      assert.equal(buffer.toString('utf8'), "Jupiter");
      done();
    });
    request.end("Jupiter");
  });

  it('buffers failed GET requests', function(done){
    var request = hyperquest(baseUrl+"/500?Mars");
    hypersponse(request, function(err, response, buffer){
      assert.equal(err, null);
      assert.equal(response.statusCode, 500);
      assert.equal(buffer.toString('utf8'), "Mars");
      done();
    });
  });

  it('buffers failed POST requests', function(done){
    var request = hyperquest(baseUrl+"/500", {method:"POST"});
    hypersponse(request, function(err, response, buffer){
      assert.equal(err, null);
      assert.equal(response.statusCode, 500);
      assert.equal(buffer.toString('utf8'), "Venus");
      done();
    });
    request.end("Venus");
  });

  it('timeout gives an error', function(done){
    var request = hyperquest(baseUrl+"/200", {
      timeout: 20, headers: { "x-timeout": "50" }
    });
    hypersponse(request, function(err, response, buffer){
      assert.equal(!!err, true, "An error is expected.");
      assert.equal(err.code, "ETIMEDOUT", "Error code is ETIMEDOUT.");
      done();
    });
  });

  it('timeout does not callback multiple times', function(done){
    var numberOfCallbacks = 0;
    var request = hyperquest("/200", {
      timeout: 10,
      headers: { "x-timeout": "20" }
    });
    hypersponse(request, function(err, response, buffer){
      numberOfCallbacks += 1;
    });
    setTimeout(function(){
      assert.equal(numberOfCallbacks, 1);
      done();
    }, 30);
  });

  it('long bodies are not truncated', function(done){
    var body = "";
    for (var i=0; i<1000; i++)
      body += "abcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghijabcdefghij";

    var request = hyperquest(baseUrl+"/200", { method: "POST" });
    request.end(body);
    hypersponse(request, function(err, response, buffer){
      assert.equal(err, null);
      assert.equal(response.statusCode, 200);
      assert.equal(buffer.toString('utf8'), body);
      done();
    });
  });
});
