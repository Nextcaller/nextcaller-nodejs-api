var username = "XXXXX",
    password = "XXXXX",
    sandbox = false,
    version = 'v2',
    module = require("nextcaller-nodejs-api"),
    data = {
        "id": "test1",
        "first_name": "Clark",
        "last_name": "Kent",
        "email": "test@example.com"
    },
    client = module.NextCallerPlatformClient(username, password, sandbox, version);

client.createPlatformAccount(data, function (data, status_code) {
    console.log(data);
    console.log(status_code);
}, function (error, status_code) {
    console.log(error);
    console.log(status_code);
});
