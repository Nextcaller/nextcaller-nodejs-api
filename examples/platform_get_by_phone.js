var username = "XXXXX",
    password = "XXXXX",
    phone_number = "2125558383",
    sandbox = false,
    platform_username = 'test',
    version = 'v2',
    module = require("../index.js"),
    client = module.NextCallerPlatformClient(username, password, sandbox, version);
client.getByPhone(phone_number, platform_username, function (data, status_code) {
    console.log(data);
    console.log(status_code);
}, function (error, status_code) {
    console.log(error);
    console.log(status_code);
});
