var username = "XXXXX",
    password = "XXXXX",
    sandbox = false,
    accountId = 'test_user',
    nameAddressData = {
        "first_name": "Sharon",
        "last_name": "Ehni",
        "address": "7160 Sw Crestview Pl",
        "zip_code": 97008
    },
    module = require("nextcaller-nodejs-api"),
    client = module.NextCallerPlatformClient(username, password, sandbox);

client.getByNameAddress(nameAddressData, accountId, function (data, status_code) {
    console.log(data);
    console.log(status_code);
}, function (error, status_code) {
    console.log(error);
    console.log(status_code);
});
