var username = "XXXXX",
    password = "XXXXX",
    profile_id = "XXXXXXXXX",
    sandbox = false,
    module = require("nextcaller-nodejs-api"),
    client = module.NextCallerClient(username, password, sandbox);

client.getByProfileId(profile_id, function (data, status_code) {
    console.log(data);
    console.log(status_code);
}, function (error, status_code) {
    console.log(error);
    console.log(status_code);
});