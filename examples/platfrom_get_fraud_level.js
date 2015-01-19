var username = "XXXXX",
    password = "XXXXX",
    phone = "1231231231",
    platformUsername = "username",
    sandbox = false,
    version = 'v2',
    module = require("../index.js"),
    client = module.NextCallerPlatformClient(username, password, sandbox, version);
client.getFraudLevel(phone, platformUsername, function (data, status_code) {
    console.log(data);
    console.log(status_code);
}, function (error, status_code) {
    console.log(error);
    console.log(status_code);
});