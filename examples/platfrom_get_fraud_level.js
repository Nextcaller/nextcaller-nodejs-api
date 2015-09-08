var username = "XXXXX",
    password = "XXXXX",
    accountId = 'test',
    phone = "1231231231",
    sandbox = false,
    module = require("nextcaller-nodejs-api"),
    client = module.NextCallerPlatformClient(username, password, sandbox);

client.getFraudLevel(phone, accountId, function (data, status_code) {
    console.log(data);
    console.log(status_code);
}, function (error, status_code) {
    console.log(error);
    console.log(status_code);
});
