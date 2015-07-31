var username = "XXXXX",
    password = "XXXXX",
    sandbox = false,
    version = 'v2',
    page = 1,
    module = require("nextcaller-nodejs-api"),
    client = module.NextCallerPlatformClient(username, password, sandbox, version);

client.getPlatformStatistics(page, function (data, status_code) {
    console.log(data);
    console.log(status_code);
}, function (error, status_code) {
    console.log(error);
    console.log(status_code);
});
