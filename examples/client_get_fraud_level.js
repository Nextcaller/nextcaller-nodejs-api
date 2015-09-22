var username = "XXXXX",
    password = "XXXXX",
    phone = "1231231231",
    sandbox = false,
    module = require("nextcaller-nodejs-api"),
    client = module.NextCallerClient(username, password, sandbox);

client.getFraudLevel(phone, function (data, status_code) {
    console.log(data);
    console.log(status_code);
}, function (error, status_code) {
    console.log(error);
    console.log(status_code);
});