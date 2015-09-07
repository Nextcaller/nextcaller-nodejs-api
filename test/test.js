/* global describe */
/* global it */
/* global require */
/* jshint node:true */
/* jshint unused:false */

"use strict";

var should = require("should"),
    nock = require("nock"),
    phone = 2125558383,
    wrongPhone = 212555838,
    email = "demo@nextcaller.com",
    wrongEmail = "demo@nextcaller@com",
    profileId = "97d949a413f4ea8b85e9586e1f2d9a",
    wrongProfileId = profileId + "XXXXXXXXXXX",
    username = "XXXXXXXXXXXXX",
    password = "YYYYYYYYYYYYYYY",
    index = require("../index.js"),
    apiVersion = index.defaultApiVersion,
    apiHostname = index.sandboxHostname,
    serialize = index.serialize,
    client = new (index.NextCallerClient)(username, password, true, apiVersion),
    platformClient = new (index.NextCallerPlatformClient)(username, password, true, apiVersion),
    updateWithAccountHeader = index.updateWithPlatformAccountHeader,
    accountId = "test",
    phoneResponseObject = {
        "records": [
            {
                "id": "97d949a413f4ea8b85e9586e1f2d9a",
                "first_name": "Jerry",
                "last_name": "Seinfeld",
                "name": "Jerry Seinfeld",
                "language": "English",
                "fraud_threat": "low",
                "spoof": "false",
                "phone": [
                    {
                        "number": "2125558383"
                    }
                ],
                "carrier": "Verizon Wireless",
                "line_type": "LAN",
                "address": [
                    {
                        "city": "New York",
                        "extended_zip": "",
                        "country": "USA",
                        "line2": "Apt 5a",
                        "line1": "129 West 81st Street",
                        "state": "NY",
                        "zip_code": "10024"
                    }
                ],
                "email": "demo@nextcaller.com",
                "age": "45-54",
                "gender": "Male",
                "household_income": "50k-75k",
                "marital_status": "Single",
                "presence_of_children": "No",
                "home_owner_status": "Rent",
                "market_value": "350k-500k",
                "length_of_residence": "12 Years",
                "high_net_worth": "No",
                "occupation": "Entertainer",
                "education": "Completed College",
                "department": "not specified"
            }
        ]
    }, profileResponseObject = {
        "id": "97d949a413f4ea8b85e9586e1f2d9a",
        "first_name": "Jerry",
        "last_name": "Seinfeld",
        "name": "Jerry Seinfeld",
        "language": "English",
        "fraud_threat": "low",
        "spoof": "false",
        "phone": [
            {
                "number": "2125558383"
            }
        ],
        "carrier": "Verizon Wireless",
        "line_type": "LAN",
        "address": [
            {
                "city": "New York",
                "extended_zip": "",
                "country": "USA",
                "line2": "Apt 5a",
                "line1": "129 West 81st Street",
                "state": "NY",
                "zip_code": "10024"
            }
        ],
        "email": "demo@nextcaller.com",
        "age": "45-54",
        "gender": "Male",
        "household_income": "50k-75k",
        "marital_status": "Single",
        "presence_of_children": "No",
        "home_owner_status": "Rent",
        "market_value": "350k-500k",
        "length_of_residence": "12 Years",
        "high_net_worth": "No",
        "occupation": "Entertainer",
        "education": "Completed College",
        "department": "not specified"
    }, profileRequestObject = {
        "first_name": "Clark",
        "last_name": "Kent",
        "email": "test@test.com",
        "shipping_address1": {
            "line1": "225 Kryptonite Ave.",
            "line2": "",
            "city": "Smallville",
            "state": "KS",
            "zip_code": "66002"
        }
    }, wrongPhoneError = {
        "error": {
            "message": "The number you have entered is invalid. Please ensure your number contains 10 digits.",
            "code": "555",
            "type": "Bad Request"
        }
    }, wrongEmailError = {
        "error": {
            "message": "The email address you have entered is invalid.",
            "code": "560",
            "type": "Bad Request"
        }
    }, platformStatisticsResponseObject = {
        "object_list": [
            {
                "id": "test",
                "first_name": "",
                "last_name": "",
                "company_name": "",
                "email": "",
                "number_of_operations": 3,
                "billed_operations": {
                    "2014-11": 3
                },
                "total_operations": {
                    "2014-11": 3
                },
                "object": "account",
                "resource_uri": "/v2/accounts/test/"
            }
        ],
        "page": 1,
        "has_next": false,
        "total_pages": 1,
        "object": "page",
        "total_platform_operations": {
            "2014-11": 3
        },
        "billed_platform_operations": {
            "2014-11": 3
        }
    },
    platformStatisticsByAccountResponseObject = {
        "id": "test",
        "first_name": "",
        "last_name": "",
        "company_name": "",
        "email": "",
        "number_of_operations": 3,
        "billed_operations": {
            "201411": 3
        },
        "total_operations": {
            "201411": 3
        },
        "object": "account",
        "resource_uri": "/v2/accounts/test/"
    },
    platformUpdateAccountJsonRequestExample = {
        "first_name": "Clark",
        "last_name": "Kent",
        "email": "test@test.com"
    },
    platformUpdateAccountWrongJsonRequestExample = {
        "first_name": "Clark",
        "last_name": "Kent",
        "email": "XXXX"
    },
    platformUpdateAccountWrongResult = {
        "error": {
            "message": "Validation Error",
            "code": "422",
            "type": "Unprocessable Entity",
            "description": {
                "email": [
                    "Enter a valid email address."
                ]
            }
        }
    },
    fraudGetLevelResult = {
        "spoofed": "false",
        "fraud_risk": "low"
    },
    wrongAddressResponseObj = {
        "error": {
            "message": "Validation Error",
            "code": "422",
            "type": "Unprocessable Entity",
            "description": {
                "address": [
                    "zip_code or combination of city and state parameters must be provided."
                ]
            }
        }
    },
    wrongAddressRequestObj = {
        "first_name": "Sharon",
        "last_name": "Ehni",
        "address": "7160 Sw Crestview Pl"
    },
    correctAddressRequestObj = {
        "first_name": "Sharon",
        "last_name": "Ehni",
        "address": "7160 Sw Crestview Pl",
        "zip_code": 97008
    };


describe("getByPhone with correct phone number", function () {
    it("should return the correct response", function (done) {
        var phoneResponseObjectStr = JSON.stringify(phoneResponseObject);
        nock("https://" + apiHostname)
            .get("/" + apiVersion + "/records/?format=json&phone=" + phone)
            .reply(200, phoneResponseObjectStr);
        client.getByPhone(phone, function (data, statusCode) {
            statusCode.should.equal(200);
            data.records[0].phone[0].number.should.equal(phone.toString());
            data.records[0].id.should.equal(profileId);
            done();
        });
    });
});


describe("getByPhone with incorrect phone number", function () {
    it("should return 400 error", function (done) {
        var phoneErrorObjectStr = JSON.stringify(wrongPhoneError);
        nock("https://" + apiHostname)
            .get("/" + apiVersion + "/records/?format=json&phone=" + wrongPhone)
            .reply(400, phoneErrorObjectStr);
        client.getByPhone(wrongPhone, null, function (data, statusCode) {
            statusCode.should.equal(400);
            data.error.code.should.equal("555");
            done();
        });
    });
});


describe("getByAddressName with correct address", function () {
    it("should return the correct response", function (done) {
        var addressResponseObjectStr = JSON.stringify(phoneResponseObject),
            address_data = correctAddressRequestObj;
        address_data.format = "json";
        nock("https://" + apiHostname)
            .get("/" + apiVersion + "/records/" + serialize(address_data)).
            reply(200, addressResponseObjectStr);
        client.getByAddressName(address_data, function (data, statusCode) {
            statusCode.should.equal(200);
            data.records[0].phone[0].number.should.equal(phone.toString());
            data.records[0].id.should.equal(profileId);
            done();
        });
    });
});


describe("getByAddressName with incorrect address data", function () {
    it("should return 400 error", function (done) {
        var adddressErrorObjectStr = JSON.stringify(wrongAddressResponseObj),
            address_data = wrongAddressRequestObj;
        address_data.format = "json";
        nock("https://" + apiHostname)
            .get("/" + apiVersion + "/records/" + serialize(address_data))
            .reply(400, adddressErrorObjectStr);
        client.getByAddressName(address_data, null, function (data, statusCode) {
            statusCode.should.equal(400);
            data.error.code.should.equal("422");
            done();
        });
    });
});


describe("getByEmail with correct email", function () {
    it("should return the correct response", function (done) {
        var emailResponseObjectStr = JSON.stringify(phoneResponseObject);
        nock("https://" + apiHostname)
            .get("/" + apiVersion + "/records/?format=json&email=" + email)
            .reply(200, emailResponseObjectStr);
        client.getByEmail(email, function (data, statusCode) {
            statusCode.should.equal(200);
            data.records[0].email.should.equal(email);
            data.records[0].id.should.equal(profileId);
            done();
        });
    });
});


describe("getByEmail with incorrect email", function () {
    it("should return 400 error", function (done) {
        var emailErrorObjectStr = JSON.stringify(wrongEmailError);
        nock("https://" + apiHostname)
            .get("/" + apiVersion + "/records/?format=json&email=" + wrongEmail)
            .reply(400, emailErrorObjectStr);
        client.getByEmail(wrongEmail, null, function (data, statusCode) {
            statusCode.should.equal(400);
            data.error.code.should.equal("560");
            done();
        });
    });
});


describe("getByProfileId with correct profile id", function () {
    it("should return the correct response", function (done) {
        var profileResponseObjectStr = JSON.stringify(profileResponseObject);
        nock("https://" + apiHostname)
            .get("/" + apiVersion + "/users/" + profileId + "/?format=json")
            .reply(200, profileResponseObjectStr);
        client.getByProfileId(profileId, function (data, statusCode) {
            statusCode.should.equal(200);
            data.phone[0].number.should.equal(phone.toString());
            data.id.should.equal(profileId);
            done();
        });
    });
});


describe("getByProfileId with incorrect profile id", function () {
    it("should return 404 response", function (done) {
        nock("https://" + apiHostname)
            .get("/" + apiVersion + "/users/" + wrongProfileId + "/?format=json")
            .reply(404, "");
        client.getByProfileId(wrongProfileId, null, function (error, statusCode) {
            statusCode.should.equal(404);
            error.should.equal("");
            done();
        });
    });
});


describe("updateProfile with correct profile id", function () {
    it("should return the correct response", function (done) {
        nock("https://" + apiHostname)
            .post("/" + apiVersion + "/users/" + profileId + "/?format=json")
            .reply(204, "");
        client.updateByProfileId(profileId, profileRequestObject, function (data, statusCode) {
            statusCode.should.equal(204);
            data.should.equal("");
            done();
        });
    });
});


describe("updateProfile with incorrect profile id", function () {
    it("should return 404 response", function (done) {
        nock("https://" + apiHostname)
            .post("/" + apiVersion + "/users/" + wrongProfileId+ "/?format=json")
            .reply(404, "");
        client.updateByProfileId(wrongProfileId, profileRequestObject, null, function (error, statusCode) {
            statusCode.should.equal(404);
            error.should.equal("");
            done();
        });
    });
});


describe("getFraudLevel with correct phone number", function () {
    it("should return the correct response", function (done) {
        var fraudResponseObjectStr = JSON.stringify(fraudGetLevelResult);
        nock("https://" + apiHostname)
            .get("/" + apiVersion + "/fraud/?format=json&phone=" + phone)
            .reply(200, fraudResponseObjectStr);
        client.getFraudLevel(phone, function (data, statusCode) {
            statusCode.should.equal(200);
            data.spoofed.should.equal("false");
            data.fraud_risk.should.equal("low");
            done();
        });
    });
});


describe("platformClient getByPhone with correct phone number", function () {
    it("should return the correct response", function (done) {
        var phoneResponseObjectStr = JSON.stringify(phoneResponseObject);
        nock("https://" + apiHostname, {reqheaders: updateWithAccountHeader(accountId)})
            .get("/" + apiVersion + "/records/?format=json&phone=" + phone)
            .reply(200, phoneResponseObjectStr);
        platformClient.getByPhone(phone, accountId, function (data, statusCode) {
            statusCode.should.equal(200);
            data.records[0].phone[0].number.should.equal(phone.toString());
            data.records[0].id.should.equal(profileId);
            done();
        });
    });
});


describe("platformClient get platform statistics", function () {
    it("should return the correct response", function (done) {
        var platformStatisticsResponseObjectStr = JSON.stringify(platformStatisticsResponseObject);
        nock("https://" + apiHostname)
            .get("/" + apiVersion + "/accounts/?format=json&page=1")
            .reply(200, platformStatisticsResponseObjectStr);
        platformClient.getPlatformStatistics(1, function (data, statusCode) {
            statusCode.should.equal(200);
            data.object_list[0].id.should.equal(accountId);
            data.object_list[0].number_of_operations.should.equal(3);
            data.page.should.equal(1);
            done();
        });
    });
});


describe("platformClient get platform statistics by account", function () {
    it("should return the correct response", function (done) {
        var platformResponseByAccountResponseObjectStr = JSON.stringify(platformStatisticsByAccountResponseObject),
            path = "/" + apiVersion + "/accounts/" + accountId + "/?format=json";
        nock("https://" + apiHostname)
            .get(path)
            .reply(200, platformResponseByAccountResponseObjectStr);
        platformClient.getPlatformAccount(accountId, function (data, statusCode) {
            statusCode.should.equal(200);
            data.id.should.equal(accountId);
            data.number_of_operations.should.equal(3);
            done();
        });
    });
});


describe("platformClient update platform account", function () {
    it("should return the correct response", function (done) {
        var path = "/" + apiVersion + "/accounts/" + accountId + "/?format=json";
        nock("https://" + apiHostname)
            .post(path)
            .reply(204, "");
        platformClient.updatePlatformAccount(platformUpdateAccountJsonRequestExample, accountId, function (data, statusCode) {
            statusCode.should.equal(204);
            data.should.equal("");
            done();
        });
    });
});


describe("platformClient update platform account with incorrect data", function () {
    it("should return 400 response", function (done) {
        var platformUpdateAccountWrongResultStr = JSON.stringify(platformUpdateAccountWrongResult),
            path = "/" + apiVersion + "/accounts/" + accountId + "/?format=json";
        nock("https://" + apiHostname)
            .post(path)
            .reply(400, platformUpdateAccountWrongResultStr);
        platformClient.updatePlatformAccount(platformUpdateAccountWrongJsonRequestExample, accountId, null, function (data, statusCode) {
            statusCode.should.equal(400);
            data.error.description.email[0].should.equal("Enter a valid email address.");
            done();
        });
    });
});


describe("platformClient getFraudLevel with correct phone number", function () {
    it("should return the correct response", function (done) {
        var fraudResponseObjectStr = JSON.stringify(fraudGetLevelResult);
        nock("https://" + apiHostname, {reqheaders: updateWithAccountHeader({}, accountId)})
            .get("/" + apiVersion + "/fraud/?format=json&phone=" + phone)
            .reply(200, fraudResponseObjectStr);
        platformClient.getFraudLevel(phone, accountId, function (data, statusCode) {
            statusCode.should.equal(200);
            data.spoofed.should.equal("false");
            data.fraud_risk.should.equal("low");
            done();
        });
    });
});


describe("PlatformClient getByAddressName with correct address", function () {
    it("should return the correct response", function (done) {
        var addressResponseObjectStr = JSON.stringify(phoneResponseObject),
            request_data = correctAddressRequestObj;
        request_data.format = "json";
        nock("https://" + apiHostname, {reqheaders: updateWithAccountHeader({}, accountId)})
            .get("/" + apiVersion + "/records/" + serialize(request_data)).
            reply(200, addressResponseObjectStr);
        platformClient.getByAddressName(request_data, accountId, function (data, statusCode) {
            statusCode.should.equal(200);
            data.records[0].phone[0].number.should.equal(phone.toString());
            data.records[0].id.should.equal(profileId);
            done();
        });
    });
});


describe("PlatformClient getByAddressName with incorrect address data", function () {
    it("should return 400 error", function (done) {
        var adddressErrorObjectStr = JSON.stringify(wrongAddressResponseObj),
            request_data = wrongAddressRequestObj;
        request_data.format = "json";
        nock("https://" + apiHostname, {reqheaders: updateWithAccountHeader({}, accountId)})
            .get("/" + apiVersion + "/records/" + serialize(request_data))
            .reply(400, adddressErrorObjectStr);
        platformClient.getByAddressName(request_data, accountId, null, function (data, statusCode) {
            statusCode.should.equal(400);
            data.error.code.should.equal("422");
            done();
        });
    });
});


describe("PlatformClient getByEmail with correct email", function () {
    it("should return the correct response", function (done) {
        var emailResponseObjectStr = JSON.stringify(phoneResponseObject);
        nock("https://" + apiHostname, {reqheaders: updateWithAccountHeader({}, accountId)})
            .get("/" + apiVersion + "/records/?format=json&email=" + email)
            .reply(200, emailResponseObjectStr);
        platformClient.getByEmail(email, accountId, function (data, statusCode) {
            statusCode.should.equal(200);
            data.records[0].email.should.equal(email);
            data.records[0].id.should.equal(profileId);
            done();
        });
    });
});


describe("PlatformClient getByEmail with incorrect email", function () {
    it("should return 400 error", function (done) {
        var emailErrorObjectStr = JSON.stringify(wrongEmailError);
        nock("https://" + apiHostname, {reqheaders: updateWithAccountHeader({}, accountId)})
            .get("/" + apiVersion + "/records/?format=json&email=" + wrongEmail)
            .reply(400, emailErrorObjectStr);
        platformClient.getByEmail(wrongEmail, accountId, null, function (data, statusCode) {
            statusCode.should.equal(400);
            data.error.code.should.equal("560");
            done();
        });
    });
});
