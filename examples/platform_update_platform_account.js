var username = "XXXXX",
    password = "XXXXX",
    sandbox = false,
    version = 'v2',
    module = require("nextcaller-nodejs-api"),
    accountId = 'test1',
    data = {
        'email': 'test@test.com'
    },
    client = module.NextCallerPlatformClient(username, password, sandbox, version);

client.updatePlatformAccount(data, accountId, function (data, status_code) {
    console.log(data);
    console.log(status_code);
}, function (error, status_code) {
    console.log(error);
    console.log(status_code);
});
