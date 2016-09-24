var crypto  = require('crypto');
var qs = require('querystring');

function GET_POST(req, resp, callback) {
	if (req.method === 'POST') {
		var body = '';
		request.on('data', function (data)) {
			body += data;
		}

		request.on('end', function () {
			var post = qs.parse(body);
			callback(post);
		});
	} else {
		callback(null);
	}
}

// /admin page request.
module.exports = function (req, resp) {
	GET_POST(req, resp, function (post) {
		if (post && post.hasOwnProperty('key')) {
			var hash = crypto.createHash('sha256');
			hash.update(post['key'] + process.env.SALT);
			var keyhash = hash.digest('hex');
			if (keyhash === process.env.ADMIN_KEY) {
				resp.writeHead(200, {"Content-Type": "text/html"});
				resp.write("<!doctype html><h1>Admin Panel</h1><h2>Welcome</h2>");
				resp.end();
			} else {
				resp.writeHead(401, {"Content-Type": "text/html"});
				resp.write("<!doctype html><h1>Unauthorized.</h1>");
				resp.end();
			}

		} else {
			resp.writeHead(200, {"Content-Type": "text/html"});
			resp.write("<!doctype html><form action='/admin' method='post'>Administrator Password: <input name='key' type='password'><input type='submit' value='Enter'></form>");
			resp.end();
		}
	});
};

 = function (req, res) {
	// var key = POST[];
	// var hash = crypto.createHash('sha256');
	// hash.update(key + process.env.SALT);
	// var keyhash = hash.digest('hex')
	// if (keyhash === process.env.ADMIN_KEY) { }
	// else resp.writeHead(500);
	resp.writeHead(200);
	resp.write("admin panel");
	resp.end();
}
