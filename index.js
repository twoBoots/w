
function W(opts) {
  opts = opts || {};

  this.uri = opts.uri || '/';
  this.async = opts.async || true;
  this.timeout = opts.timeout || 30000;
}

W.prototype.send = function(args, callback) {
  var x = new XMLHttpRequest();
  if('withCredentials' in x) {
  }else if(typeof XDomainRequest !== "undefined") {
    // fknIE
    x = new XDomainRequest();
  }else{
    throw new Error('CORS not supported');
  }

  args.uri = args.uri || this.uri;
  args.async = args.async || this.async;
  x.timeout = args.timeout || this.timeout;

  x.open(args.method, args.uri, args.async);

  x.onreadystatechange = function() {
    if (x.readyState === 4 && x.status >= 200 && x.status <= 299) {
      return callback(null, {code: x.status, content: x.responseText});
    }
    if (x.readyState === 4) {
      return callback(new Error(x.status), {code: x.status, content: x.responseText});
    }
  };

  if(args.contentType){
    //avoid CORS preflight
    x.setRequestHeader('Content-type', args.contentType);
  }


  x.send(args.data);
};

W.prototype.get = function(args, callback) {
  args.method = 'GET';
  this.send(args, callback);
};

W.prototype.post = function(args, callback) {
  args.method = 'POST';
  this.send(args, callback);
};