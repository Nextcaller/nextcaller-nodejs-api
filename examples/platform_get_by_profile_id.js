var username = "XXXXX",
    password = "XXXXX",
    profileId = "XXXXXXXXX",
    sandbox = false,
    accountId = 'test',
    module = require("nextcaller-nodejs-api"),
    client = module.NextCallerPlatformClient(username, password, sandbox);

client.getByProfileId(profileId, accountId, function (data, status_code) {
    console.log(data);
    console.log(status_code);
}, function (error, status_code) {
    console.log(error);
    console.log(status_code);
});
