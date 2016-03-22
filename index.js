/*global require*/
/*global module*/
/*global console*/

'use strict';

var https = require('https'),
    hostname = 'api.nextcaller.com',
    sandboxHostname = 'api.sandbox.nextcaller.com',
    defaultApiVersion = 'v2.1',
    defaultPlatformAccountHeader = "Nc-Account-Id",
    port = 443,
    jsonContentType = 'application/json; charset=utf-8';


function serialize(obj) {
    var pairs = Object.keys(obj).reduce(
        function(acc, key){
            acc.push(
                encodeURIComponent(key) + '=' +
                encodeURIComponent(obj[key])
            );
          return acc;
        }, []
    ).join('&');
    return '?' + pairs;
}

function make_request(options, successCallback, errorCallback, data) {

    var errorHandler = function (err, statusCode) {
        var jsonMessage = err.message || err;
        try {
            jsonMessage = JSON.parse(jsonMessage);
        } catch (error) {}
        if (typeof(errorCallback) === 'function') {
            errorCallback(jsonMessage, statusCode);
        } else {
            console.log(jsonMessage);
        }
    };

    var successHandler = function (data, statusCode) {
        var jsonMessage = data;
        try {
            jsonMessage = JSON.parse(data);
        } catch (error) {}
        if (typeof(successCallback) === 'function') {
            successCallback(jsonMessage, statusCode);
        } else {
            console.log(jsonMessage);
        }
    };

    var req = https.request(options, function(res) {
        var body = '';
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
            body += chunk;
        });
        res.on('end', function() {
            if (res.statusCode >= 400) {
                errorHandler(body, res.statusCode);
            } else {
                successHandler(body, res.statusCode);
            }
        });
    });

    req.on('error', function(err) {
        errorHandler(err);
    });

    if (data) {
        req.write(data);
    }
    req.end();
}

function NextCallerClient(username, password, sandbox) {
    if (!(this instanceof NextCallerClient)) {
        return new NextCallerClient(username, password, sandbox);
    }
    this.username = username;
    this.password = password;
    this.version = defaultApiVersion;
    this.base_url =  !!sandbox ?  sandboxHostname : hostname;
}

NextCallerClient.prototype.getByPhone = function(phone, successCallback, errorCallback) {
    var params = {
        'format': 'json',
        'phone': phone
    },
    options = {
        hostname: this.base_url,
        port: port,
        path: '/' + this.version + '/records/' + serialize(params),
        method: 'GET',
        auth: this.username + ':' + this.password
    };
    make_request(options, successCallback, errorCallback);
};

NextCallerClient.prototype.getByNameAddress = function(nameAddressData, successCallback, errorCallback) {
    nameAddressData['format'] = 'json';
    var options = {
        hostname: this.base_url,
        port: port,
        path: '/' + this.version + '/records/' + serialize(nameAddressData),
        method: 'GET',
        auth: this.username + ':' + this.password
    };
    make_request(options, successCallback, errorCallback);
};

NextCallerClient.prototype.getByEmail = function(email, successCallback, errorCallback) {
    var params = {
            'format': 'json',
            'email': email
        },
        options = {
            hostname: this.base_url,
            port: port,
            path: '/' + this.version + '/records/' + serialize(params),
            method: 'GET',
            auth: this.username + ':' + this.password
        };
    make_request(options, successCallback, errorCallback);
};

NextCallerClient.prototype.getByProfileId = function(profileId, successCallback, errorCallback) {
    var params = {
        'format': 'json'
    },
    options = {
        hostname: this.base_url,
        port: port,
        path: '/' + this.version + '/users/' + profileId + '/' + serialize(params),
        method: 'GET',
        auth: this.username + ':' + this.password
    };
    make_request(options, successCallback, errorCallback);
};

NextCallerClient.prototype.updateByProfileId = function(profileId, profileData, successCallback, errorCallback) {
    var jsonData = JSON.stringify(profileData),
    params = {
        'format': 'json'
    },
    options = {
        hostname: this.base_url,
        port: port,
        path: '/' + this.version + '/users/' + profileId + '/' + serialize(params),
        method: 'POST',
        auth: this.username + ':' + this.password,
        headers: {
            'Content-Type': jsonContentType,
            'Content-Length': jsonData.length
        }
    };
    make_request(options, successCallback, errorCallback, jsonData);
};

/* Platform client */

function updateWithPlatformAccountHeader(headers, accountId) {
    headers[defaultPlatformAccountHeader] = accountId;
    return headers;
}

function NextCallerPlatformClient(username, password, sandbox) {
    if (!(this instanceof NextCallerPlatformClient)) {
        return new NextCallerPlatformClient(username, password, sandbox);
    }
    this.username = username;
    this.password = password;
    this.sandbox = !!sandbox;
    this.version = defaultApiVersion;
    this.base_url =  this.sandbox ?  sandboxHostname : hostname;
}

NextCallerPlatformClient.prototype.getByPhone = function(phone, accountId, successCallback, errorCallback) {
    var params = {
        'format': 'json',
        'phone': phone
    },
    options = {
        hostname: this.base_url,
        port: port,
        path: '/' + this.version + '/records/' + serialize(params),
        method: 'GET',
        auth: this.username + ':' + this.password,
        headers: updateWithPlatformAccountHeader({}, accountId)
    };
    make_request(options, successCallback, errorCallback);
};

NextCallerPlatformClient.prototype.getByNameAddress = function(nameAddressData, accountId, successCallback, errorCallback) {
    nameAddressData['format'] = 'json';
    var options = {
        hostname: this.base_url,
        port: port,
        path: '/' + this.version + '/records/' + serialize(nameAddressData),
        method: 'GET',
        auth: this.username + ':' + this.password,
        headers: updateWithPlatformAccountHeader({}, accountId)
    };
    make_request(options, successCallback, errorCallback);
};

NextCallerPlatformClient.prototype.getByEmail = function(email, accountId, successCallback, errorCallback) {
    var params = {
            'format': 'json',
            'email': email
        },
        options = {
            hostname: this.base_url,
            port: port,
            path: '/' + this.version + '/records/' + serialize(params),
            method: 'GET',
            auth: this.username + ':' + this.password,
            headers: updateWithPlatformAccountHeader({}, accountId)
        };
    make_request(options, successCallback, errorCallback);
};

NextCallerPlatformClient.prototype.getByProfileId = function(profileId, accountId, successCallback, errorCallback) {
    var params = {
        'format': 'json'
    },
    options = {
        hostname: this.base_url,
        port: port,
        path: '/' + this.version + '/users/' + profileId + '/' + serialize(params),
        method: 'GET',
        auth: this.username + ':' + this.password,
        headers: updateWithPlatformAccountHeader({}, accountId)
    };
    make_request(options, successCallback, errorCallback);
};

NextCallerPlatformClient.prototype.updateByProfileId = function(profileId, profileData, accountId, successCallback, errorCallback) {
    var jsonData = JSON.stringify(profileData),
    params = {
        'format': 'json'
    },
    options = {
        hostname: this.base_url,
        port: port,
        path: '/' + this.version + '/users/' + profileId + '/' + serialize(params),
        method: 'POST',
        auth: this.username + ':' + this.password,
        headers: updateWithPlatformAccountHeader(
            {'Content-Type': jsonContentType, 'Content-Length': jsonData.length}, accountId
        )
    };
    make_request(options, successCallback, errorCallback, jsonData);
};

NextCallerPlatformClient.prototype.getPlatformStatistics = function(page, successCallback, errorCallback) {
    if (!page) {
        page = 1;
    }
    var params = {
        'format': 'json',
        'page': page
    },
    options = {
        hostname: this.base_url,
        port: port,
        path: '/' + this.version + '/accounts/' + serialize(params),
        method: 'GET',
        auth: this.username + ':' + this.password
    };
    make_request(options, successCallback, errorCallback);
};

NextCallerPlatformClient.prototype.getPlatformAccount = function(accountId, successCallback, errorCallback) {
    var params = {
        'format': 'json'
    },
    options = {
        hostname: this.base_url,
        port: port,
        path: '/' + this.version + '/accounts/' + accountId + '/' + serialize(params),
        method: 'GET',
        auth: this.username + ':' + this.password
    };
    make_request(options, successCallback, errorCallback);
};

NextCallerPlatformClient.prototype.createPlatformAccount = function(accountData, successCallback, errorCallback) {
    var jsonData = JSON.stringify(accountData),
    params = {
        'format': 'json'
    },
    options = {
        hostname: this.base_url,
        port: port,
        path: '/' + this.version + '/accounts/' + serialize(params),
        method: 'POST',
        auth: this.username + ':' + this.password,
        headers: {
            'Content-Type': jsonContentType,
            'Content-Length': jsonData.length
        }
    };
    make_request(options, successCallback, errorCallback, jsonData);
};

NextCallerPlatformClient.prototype.updatePlatformAccount = function(accountData, accountId, successCallback, errorCallback) {
    var jsonData = JSON.stringify(accountData),
    params = {
        'format': 'json'
    },
    options = {
        hostname: this.base_url,
        port: port,
        path: '/' + this.version + '/accounts/' + accountId + '/' + serialize(params),
        method: 'PUT',
        auth: this.username + ':' + this.password,
        headers: {
            'Content-Type': jsonContentType,
            'Content-Length': jsonData.length
        }
    };
    make_request(options, successCallback, errorCallback, jsonData);
};

module.exports = {
    'NextCallerClient': NextCallerClient,
    'NextCallerPlatformClient': NextCallerPlatformClient,
    'hostname': hostname,
    'sandboxHostname': sandboxHostname,
    'defaultApiVersion': defaultApiVersion,
    'defaultPlatformAccountHeader': defaultPlatformAccountHeader,
    'serialize': serialize
};
