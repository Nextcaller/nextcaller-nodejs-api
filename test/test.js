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
    profileId = "97d949a413f4ea8b85e9586e1f2d9a",
    wrongProfileId = profileId + "XXXXXXXXXXX",
    username = "XXXXXXXXXXXXX",
    password = "YYYYYYYYYYYYYYY",
    index = require("../index.js"),
    apiVersion = index.defaultApiVersion,
    apiHostname = index.sandboxHostname,
    client = new (index.NextCallerClient)(username, password, true, apiVersion),
    platformClient = new (index.NextCallerPlatformClient)(username, password, true, apiVersion),
    platformUsername = "test",
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
    },
    platformStatisticsResponseObject = {
        "object_list": [
            {
                "username": "test",
                "first_name": "",
                "last_name": "",
                "company_name": "",
                "email": "",
                "number_of_operations": 3,
                "successful_calls": {
                    "201411": 3
                },
                "total_calls": {
                    "201411": 3
                },
                "created_time": "2014-11-13 06:07:19.836404",
                "resource_uri": "/v2/platform_users/test/"
            }
        ],
       "page": 1,
        "has_next": false,
        "total_pages": 1,
        "total_platform_calls": {
            "2014-11": 3
        },
        "successful_platform_calls": {
            "2014-11": 3
        }
    },
    platformStatisticsByUserResponseObject = {
        "username": "test",
        "first_name": "",
        "last_name": "",
        "company_name": "",
        "email": "",
        "number_of_operations": 3,
        "successful_calls": {
            "201411": 3
        },
        "total_calls": {
            "201411": 3
        },
        "resource_uri": "/v2/platform_users/test/"
    },
    platformUpdateUsernameJsonRequestExample = {
        "first_name": "Clark",
        "last_name": "Kent",
        "email": "test@test.com"
    },
    platformUpdateUsernameWrongJsonRequestExample = {
        "first_name": "Clark",
        "last_name": "Kent",
        "email": "XXXX"
    },
    platformUpdateUserWrongResult = {
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
    };


describe("getPhone with correct phone number", function () {
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


describe("getPhone with incorrect phone number", function () {
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


describe("getProfile with correct profile id", function () {
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


describe("getProfile with incorrect profile id", function () {
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


describe("platformClient getPhone with correct phone number", function () {
    it("should return the correct response", function (done) {
        var phoneResponseObjectStr = JSON.stringify(phoneResponseObject);
        nock("https://" + apiHostname)
            .get("/" + apiVersion + "/records/?format=json&phone=" + phone +
                "&platform_username=" + platformUsername)
            .reply(200, phoneResponseObjectStr);
        platformClient.getByPhone(phone, platformUsername, function (data, statusCode) {
            statusCode.should.equal(200);
            data.records[0].phone[0].number.should.equal(phone.toString());
            data.records[0].id.should.equal(profileId);
            done();
        });
    });
});


describe("platformClient get platform statistics", function () {
    it("should return the correct response", function (done) {
        var platformResponseResponseObjectStr = JSON.stringify(platformStatisticsResponseObject);
        nock("https://" + apiHostname)
            .get("/" + apiVersion + "/platform_users/?format=json&page=1")
            .reply(200, platformResponseResponseObjectStr);
        platformClient.getPlatformStatistics(1, function (data, statusCode) {
            statusCode.should.equal(200);
            data.object_list[0].username.should.equal(platformUsername);
            data.object_list[0].number_of_operations.should.equal(3);
            data.page.should.equal(1);
            done();
        });
    });
});


describe("platformClient get platform statistics by user", function () {
    it("should return the correct response", function (done) {
        var platformResponseByUserResponseObjectStr = JSON.stringify(platformStatisticsByUserResponseObject),
            path = "/" + apiVersion + "/platform_users/" + platformUsername + "/?format=json";
        nock("https://" + apiHostname)
            .get(path)
            .reply(200, platformResponseByUserResponseObjectStr);
        platformClient.getPlatformUser(platformUsername, function (data, statusCode) {
            statusCode.should.equal(200);
            data.username.should.equal(platformUsername);
            data.number_of_operations.should.equal(3);
            done();
        });
    });
});


describe("platformClient update platform user", function () {
    it("should return the correct response", function (done) {
        var path = "/" + apiVersion + "/platform_users/" + platformUsername + "/?format=json";
        nock("https://" + apiHostname)
            .post(path)
            .reply(204, "");
        platformClient.updatePlatformUser(platformUsername, platformUpdateUsernameJsonRequestExample, function (data, statusCode) {
            statusCode.should.equal(204);
            data.should.equal("");
            done();
        });
    });
});


describe("platformClient update platform user with incorrect data", function () {
    it("should return 400 response", function (done) {
        var platformUpdateUserWrongResultStr = JSON.stringify(platformUpdateUserWrongResult),
            path = "/" + apiVersion + "/platform_users/" + platformUsername + "/?format=json";
        nock("https://" + apiHostname)
            .post(path)
            .reply(400, platformUpdateUserWrongResultStr);
        platformClient.updatePlatformUser(platformUsername, platformUpdateUsernameWrongJsonRequestExample, null, function (data, statusCode) {
            statusCode.should.equal(400);
            data.error.description.email[0].should.equal("Enter a valid email address.");
            done();
        });
    });
});

describe("platformClient getFraudLevel with correct phone number", function () {
    it("should return the correct response", function (done) {
        var fraudResponseObjectStr = JSON.stringify(fraudGetLevelResult);
        nock("https://" + apiHostname)
            .get("/" + apiVersion + "/fraud/?format=json&phone=" + phone + "&platform_username=" + platformUsername)
            .reply(200, fraudResponseObjectStr);
        platformClient.getFraudLevel(phone, platformUsername, function (data, statusCode) {
            statusCode.should.equal(200);
            data.spoofed.should.equal("false");
            data.fraud_risk.should.equal("low");
            done();
        });
    });
});
