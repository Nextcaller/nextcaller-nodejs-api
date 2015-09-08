var username = "XXXXX",
    password = "XXXXX",
    email = "demo@nextcaller.com",
    sandbox = false,
    version = 'v2',
    module = require("nextcaller-nodejs-api"),
    client = module.NextCallerClient(username, password, sandbox, version);
client.getByEmail(email, function (data, status_code) {
    console.log(data);
    console.log(status_code);
}, function (error, status_code) {
    console.log(error);
    console.log(status_code);
});
