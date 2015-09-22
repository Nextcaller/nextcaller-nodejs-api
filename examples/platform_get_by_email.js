var username = "XXXXX",
    password = "XXXXX",
    email = "demo@nextcaller.com",
    sandbox = false,
    accountId = 'test',
    module = require("nextcaller-nodejs-api"),
    client = module.NextCallerPlatformClient(username, password, sandbox);

client.getByEmail(email, accountId, function (data, status_code) {
    console.log(data);
    console.log(status_code);
}, function (error, status_code) {
    console.log(error);
    console.log(status_code);
});
