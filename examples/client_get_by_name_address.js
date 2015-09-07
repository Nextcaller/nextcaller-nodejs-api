var username = "XXXXX",
    password = "XXXXX",
    sandbox = false,
    nameAddressData = {
        "first_name": "Sharon",
        "last_name": "Ehni",
        "address": "7160 Sw Crestview Pl",
        "zip_code": 97008
    },
    version = 'v2',
    module = require("nextcaller-nodejs-api"),
    client = module.NextCallerClient(username, password, sandbox, version);
client.getByNameAddress(nameAddressData, function (data, status_code) {
    console.log(data);
    console.log(status_code);
}, function (error, status_code) {
    console.log(error);
    console.log(status_code);
});
