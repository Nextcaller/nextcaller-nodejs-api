var username = "XXXXX",
    password = "XXXXX",
    phoneNumber = "2125558383",
    sandbox = false,
    accountId = 'test',
    version = 'v2',
    module = require("nextcaller-nodejs-api"),
    client = module.NextCallerPlatformClient(username, password, sandbox, version);

client.getByPhone(phoneNumber, accountId, function (data, status_code) {
 console.log(data);
 console.log(status_code);
}, function (error, status_code) {
 console.log(error);
 console.log(status_code);
});
