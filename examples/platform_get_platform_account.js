var username = "XXXXX",
    password = "XXXXX",
    sandbox = false,
    module = require("nextcaller-nodejs-api"),
    accountId = 'test1',
    client = module.NextCallerPlatformClient(username, password, sandbox);

client.getPlatformAccount(accountId, function (data, status_code) {
    console.log(data);
    console.log(status_code);
}, function (error, status_code) {
    console.log(error);
    console.log(status_code);
});
