**Rest API for FinanceX (2018-11-05)**

- All endpoints return either a JSON object or array.
- Data is returned in ascending order. Oldest first, newest last.

**Global settings**
- EXCHANGE_DEV: http://dev.financex.io
- EXCHANGE_LIVE: https://financex.io

**I. Market Watch endpoints**
    
    The base endpoint is: http://dev-market-watch.financex.io
    
**1. Test connectivity**

    GET api/health-check
    
- Test connectivity to the Rest API.
- Parameters: 
    > NONE
- Response:
    > "Ok!"

**2. Get Market Watch**

    GET api/v1/market-watch/get-market-watch
    
- Parameters
    > NONE

- Response:
```
  [
    {
        "name": "IDR",
        "tradingCurrency": "IDR",
        "index": 0,
        "tradingCoins": [
            {
                "name": "Bitcoin Cash",
                "symbol": "BCH",
                "pair": "BCH-IDR",
                "tradingCurrency": "IDR",
                "lastestPrice": 6426926,
                "prevLastestPrice": 0,
                "priceChange": 0,
                "priceChangeVolume": 0,
                "highestPrice": 6426926,
                "lowestPrice": 6426926,
                "currencyVolume": 0
            },
            {
                "name": "Bitcoin",
                "symbol": "BTC",
                "pair": "BTC-IDR",
                "tradingCurrency": "IDR",
                "lastestPrice": 96796100,
                "prevLastestPrice": 0,
                "priceChange": 0,
                "priceChangeVolume": 0,
                "highestPrice": 96796100,
                "lowestPrice": 96796100,
                "currencyVolume": 0
            },
            {
                "name": "DTE",
                "symbol": "DTE",
                "pair": "DTE-IDR",
                "tradingCurrency": "IDR",
                "lastestPrice": 113510,
                "prevLastestPrice": 0,
                "priceChange": 0,
                "priceChangeVolume": 0,
                "highestPrice": 113510,
                "lowestPrice": 113510,
                "currencyVolume": 0
            },
            {
                "name": "Ethereum Classic",
                "symbol": "ETC",
                "pair": "ETC-IDR",
                "tradingCurrency": "IDR",
                "lastestPrice": 138614,
                "prevLastestPrice": 0,
                "priceChange": 0,
                "priceChangeVolume": 0,
                "highestPrice": 138614,
                "lowestPrice": 138614,
                "currencyVolume": 0
            },
            {
                "name": "Ethereum",
                "symbol": "ETH",
                "pair": "ETH-IDR",
                "tradingCurrency": "IDR",
                "lastestPrice": 3025193,
                "prevLastestPrice": 0,
                "priceChange": 0,
                "priceChangeVolume": 0,
                "highestPrice": 3025193,
                "lowestPrice": 3025193,
                "currencyVolume": 0
            },
            {
                "name": "Litecoin",
                "symbol": "LTC",
                "pair": "LTC-IDR",
                "tradingCurrency": "IDR",
                "lastestPrice": 748491,
                "prevLastestPrice": 0,
                "priceChange": 0,
                "priceChangeVolume": 0,
                "highestPrice": 748491,
                "lowestPrice": 748491,
                "currencyVolume": 0
            },
            {
                "name": "SET",
                "symbol": "SET",
                "pair": "SET-IDR",
                "tradingCurrency": "IDR",
                "lastestPrice": 665730,
                "prevLastestPrice": 0,
                "priceChange": 0,
                "priceChangeVolume": 0,
                "highestPrice": 665730,
                "lowestPrice": 665730,
                "currencyVolume": 0
            }
        ],
        "id": "f57c34b6-30bc-4037-a296-9741daf2a0eb"
    },
    {
        "name": "BTC",
        "tradingCurrency": "BTC",
        "index": 0,
        "tradingCoins": [
            {
                "name": "Bitcoin Cash",
                "symbol": "BCH",
                "pair": "BCH-BTC",
                "tradingCurrency": "BTC",
                "lastestPrice": 0.0905937,
                "prevLastestPrice": 0.0905937,
                "priceChange": 37.4965927,
                "priceChangeVolume": 0.02470574,
                "highestPrice": 0.0905937,
                "lowestPrice": 0.06588796,
                "currencyVolume": 1.27052317
            },
            {
                "name": "DTE",
                "symbol": "DTE",
                "pair": "DTE-BTC",
                "tradingCurrency": "BTC",
                "lastestPrice": 0,
                "prevLastestPrice": 0,
                "priceChange": 0,
                "priceChangeVolume": 0,
                "highestPrice": 0,
                "lowestPrice": 0,
                "currencyVolume": 0
            },
            {
                "name": "Ethereum Classic",
                "symbol": "ETC",
                "pair": "ETC-BTC",
                "tradingCurrency": "BTC",
                "lastestPrice": 0.00140806,
                "prevLastestPrice": 0,
                "priceChange": 0,
                "priceChangeVolume": 0,
                "highestPrice": 0.00140806,
                "lowestPrice": 0.00140806,
                "currencyVolume": 0
            },
            {
                "name": "Ethereum",
                "symbol": "ETH",
                "pair": "ETH-BTC",
                "tradingCurrency": "BTC",
                "lastestPrice": 0.03339115,
                "prevLastestPrice": 0.03339115,
                "priceChange": 7.98540582,
                "priceChangeVolume": 0.00246924,
                "highestPrice": 0.03339115,
                "lowestPrice": 0.03092191,
                "currencyVolume": 0.60164972
            },
            {
                "name": "Litecoin",
                "symbol": "LTC",
                "pair": "LTC-BTC",
                "tradingCurrency": "BTC",
                "lastestPrice": 0.00862786,
                "prevLastestPrice": 0.00862786,
                "priceChange": 10.29303294,
                "priceChangeVolume": 0.00080519,
                "highestPrice": 0.00862786,
                "lowestPrice": 0.00782267,
                "currencyVolume": 0.31953335
            },
            {
                "name": "SET",
                "symbol": "SET",
                "pair": "SET-BTC",
                "tradingCurrency": "BTC",
                "lastestPrice": 0,
                "prevLastestPrice": 0,
                "priceChange": 0,
                "priceChangeVolume": 0,
                "highestPrice": 0,
                "lowestPrice": 0,
                "currencyVolume": 0
            }
        ],
        "id": "6f0e98a2-902f-45b7-9428-608d46af8ee3"
    },
    {
        "name": "VND",
        "tradingCurrency": "VND",
        "index": 0,
        "tradingCoins": [
            {
                "name": "Bitcoin Cash",
                "symbol": "BCH",
                "pair": "BCH-VND",
                "tradingCurrency": "VND",
                "lastestPrice": 14252370,
                "prevLastestPrice": 14252370,
                "priceChange": 42.31023465,
                "priceChangeVolume": 4237370,
                "highestPrice": 14252370,
                "lowestPrice": 10015000,
                "currencyVolume": 276739046.232862
            },
            {
                "name": "Bitcoin",
                "symbol": "BTC",
                "pair": "BTC-VND",
                "tradingCurrency": "VND",
                "lastestPrice": 153382160,
                "prevLastestPrice": 153288356,
                "priceChange": 1.25811001,
                "priceChangeVolume": 1905740,
                "highestPrice": 154999000,
                "lowestPrice": 148903905,
                "currencyVolume": 12177178386.7198
            },
            {
                "name": "DTE",
                "symbol": "DTE",
                "pair": "DTE-VND",
                "tradingCurrency": "VND",
                "lastestPrice": 196400,
                "prevLastestPrice": 196000,
                "priceChange": 17.32377539,
                "priceChangeVolume": 29000,
                "highestPrice": 196400,
                "lowestPrice": 167400,
                "currencyVolume": 288959969.137018
            },
            {
                "name": "Ethereum Classic",
                "symbol": "ETC",
                "pair": "ETC-VND",
                "tradingCurrency": "VND",
                "lastestPrice": 231700,
                "prevLastestPrice": 231094,
                "priceChange": 9.39049148,
                "priceChangeVolume": 19890,
                "highestPrice": 231700,
                "lowestPrice": 211810,
                "currencyVolume": 50020942.1824769
            },
            {
                "name": "Ethereum",
                "symbol": "ETH",
                "pair": "ETH-VND",
                "tradingCurrency": "VND",
                "lastestPrice": 5137600,
                "prevLastestPrice": 5132400,
                "priceChange": 8.45682922,
                "priceChangeVolume": 400600,
                "highestPrice": 5137600,
                "lowestPrice": 4737000,
                "currencyVolume": 324788638.805464
            },
            {
                "name": "Litecoin",
                "symbol": "LTC",
                "pair": "LTC-VND",
                "tradingCurrency": "VND",
                "lastestPrice": 1329400,
                "prevLastestPrice": 1326343,
                "priceChange": 9.76616685,
                "priceChangeVolume": 118280,
                "highestPrice": 1329400,
                "lowestPrice": 1211120,
                "currencyVolume": 113226904.367334
            },
            {
                "name": "SET",
                "symbol": "SET",
                "pair": "SET-VND",
                "tradingCurrency": "VND",
                "lastestPrice": 1215150,
                "prevLastestPrice": 1212900,
                "priceChange": 749.18516241,
                "priceChangeVolume": 1072054,
                "highestPrice": 1215150,
                "lowestPrice": 143096,
                "currencyVolume": 276089943.278631
            }
        ],
        "id": "21937985-80f9-489c-8ba8-2ef6ca89a6b8"
    }
]
```
- Display ASC by Index in UI

**3. Order book**

   `GET /api/v1/market-watch/get-top-price-by-pair/{symbol}/{paymentUnit}/{side}/{top}`
    
- Parameters:
> **symbol**: Coin symbol
> **paymentUnit**: 
> **side**: B = Buy, S = Sell
> **top**: 50

- Response:
```
[
  {
    "price": 147200733,
    "qtty": 0.09410000,
    "amount": 13851588
  }
]
```
**4. Get Trade Histories**

`GET /get-market-trade-histories/{symbol}/{paymentUnit}/{top}`

- Parameters:
> **symbol**: Coin symbol
> **paymentUnit**: 
> **top**: 50

- Response:
```
[
  {
    "price": 147200733,
    "qtty": 0.09410000,
    "amount": 13851588,
    "time": "16:05:50",
    "colorCode": "-1"
  }
]
```
**II. Chart endpoints**

`The base endpoint is: http://13.251.155.9:5000/ `

**1. Get global config**

`GET /api/chart/config`

- Response
```
{
  "supports_search": true,
  "supports_group_request": false,
  "supports_marks": false,
  "supports_timescale_marks": false,
  "supports_time": true,
  "exchanges": [
    {
      "value": "",
      "name": "All Exchanges",
      "desc": ""
    },
    {
      "value": "NasdaqNM",
      "name": "NasdaqNM",
      "desc": "NasdaqNM"
    },
    {
      "value": "NYSE",
      "name": "NYSE",
      "desc": "NYSE"
    },
    {
      "value": "NCM",
      "name": "NCM",
      "desc": "NCM"
    },
    {
      "value": "NGM",
      "name": "NGM",
      "desc": "NGM"
    }
  ],
  "symbols_types": [
    {
      "name": "All types",
      "value": ""
    },
    {
      "name": "Stock",
      "value": "stock"
    },
    {
      "name": "Index",
      "value": "index"
    }
  ],
  "supported_resolutions": [
    "1",
    "5",
    "15",
    "30",
    "60",
    "120",
    "240",
    "D",
    "W",
    "M"
  ]
}
```
**2. Get config by symbol**

`GET api/chart/symbols?symbol=?`

- Parameters:
> **symbol**: Pair of trading {coin_symbol}_{coin_payment_unit}, ex: BTC_VND, LTC_VND

Example: : http://13.251.155.9:5000/api/chart/symbols?symbol=ETC_VND

- Response
```
{
  "name": "ETC_VND",
  "exchange-traded": "FinanceX",
  "exchange-listed": "FinanceX",
  "timezone": "Asia/Bangkok",
  "minmov": 1,
  "minmov2": 0,
  "session": "24x7",
  "has_intraday": true,
  "has_no_volume": false,
  "description": "ETC",
  "type": "crypto",
  "supported_resolutions": [
    "1",
    "5",
    "15",
    "30",
    "60",
    "120",
    "240",
    "D",
    "W",
    "M"
  ],
  "pricescale": "100.00000000",
  "ticker": "ETC_VND",
  "pointvalue": 1
}
```
**3. Get trade histories**

`GET /api/chart/history?symbol=?&resolution=?&from=?&to=?`

- Parameters:
> **symbol**:
> **resolution**:
> **from**:
> **to**:

Example: : http://13.251.155.9:5000/api/chart/history?symbol=BTC_VND&resolution=D&from=1511614267&to=1542718327

- Response
```
{
  "t": [
    1540684800,
    1540771200,
    1540857600,
    1540944000,
    1541030400,
    1541116800,
    1541203200,
    1541289600,
    1541376000,
    1541462400,
    1541548800
  ],
  "c": [
    219303,
    208240,
    208337,
    207937,
    206864,
    210367,
    208918,
    216791,
    216280,
    233586,
    229300
  ],
  "o": [
    218679,
    219303,
    208240,
    208337,
    207937,
    206864,
    210367,
    208918,
    216791,
    216280,
    233586
  ],
  "h": [
    222505,
    222754,
    211586,
    211886,
    210498,
    213445,
    212264,
    221491,
    220548,
    233586,
    233586
  ],
  "l": [
    216973,
    202646,
    202938,
    200143,
    204651,
    205659,
    206224,
    207726,
    210714,
    212012,
    223898
  ],
  "v": [
    937.4214,
    1145.43988909,
    1006.72112583,
    834.38334382,
    757.1992,
    708.4321,
    625.60089257,
    905.8656,
    683.4514,
    821.1865962,
    143.65513729
  ],
  "s": "ok"
}
```
**4. Get server time**

`GET /api/chart/time`

Example: : http://13.251.155.9:5000/api/chart/time

**5. Depth chart**

`GET http://dev-market-watch.financex.io/api/v1/market-watch/depth/{symbol}/{paymentUnit}/{top}`

- Example

`http://dev-market-watch.financex.io/api/v1/market-watch/depth/BTC/VND/10`

- Response
```
{
    "bids": [
        [
            "146917769.00000000",
            0.2293
        ],
        [
            "146772623.00000000",
            0.0111
        ],
        [
            "146570594.00000000",
            0.0482
        ],
        [
            "146450946.00000000",
            0.0348
        ],
        [
            "146199882.00000000",
            0.011
        ],
        [
            "145990008.00000000",
            0.0428
        ],
        [
            "145758558.00000000",
            0.0217
        ],
        [
            "145617334.00000000",
            0.0408
        ],
        [
            "145415306.00000000",
            0.0194
        ],
        [
            "145232892.00000000",
            0.0169
        ]
    ],
    "asks": [
        [
            "147812338.00000000",
            0.0237
        ],
        [
            "147957921.00000000",
            0.0406
        ],
        [
            "148243186.00000000",
            0.0193
        ],
        [
            "148343520.00000000",
            0.0319
        ],
        [
            "148593372.00000000",
            0.0465
        ],
        [
            "148780270.00000000",
            0.0303
        ],
        [
            "149118653.00000000",
            0.0352
        ],
        [
            "149293746.00000000",
            0.0393
        ],
        [
            "149325224.00000000",
            0.0236
        ],
        [
            "149527860.00000000",
            0.0457
        ]
    ]
}
```
> **bids**: Buy order

> **asks**: Sell order

**III. Exchange API**

**A. API for user**

`The base endpoint is: http://dev-api.financex.io`

**1. Get Countries**

`GET /api/get-countries`

- Response
```
[
  {
    "name": "Afghanistan",
    "code": "AF",
    "currencyCode": "AFN"
  },
  {
    "name": "Åland Islands",
    "code": "AX",
    "currencyCode": "EUR"
  },
  {
    "name": "Albania",
    "code": "AL",
    "currencyCode": "ALL"
  },
  {
    "name": "Algéria",
    "code": "DZ",
    "currencyCode": "DZD"
  },
  {
    "name": "Viet Nam",
    "code": "VN",
    "currencyCode": "VND"
  }
]
```
**2. Customer Register**

`POST: /api/v1/user/register`

- Request
```
{
    "email": "thongtd@financex.io",
    "password": "Test@123456",
    "fromReferralId": "",
    "countryCode": "",
    "callbackUrl": "",
    "ipAddress": "127.0.0.1",
    "city": "Ha Noi",
    "userLocationRaw": ""
}
```
> **email** (required): Customer email, email must be valid with regex of Internet Email
> **password** (required):  Customer password, use for login. Password must be valid with
> -   8 or more characters
> - Uppercase & Lower letters

> **fromReferralId**: (option): Referral code of inviter
> **countryCode** (required): Country code get from `/api/get-countries`
> **callbackUrl** (required): Url use for confirm email, use setting in Global Settings
> **ipAddress** (required): Get from detect user Agent
> **city** (required): Get from detect user Agent
> **userLocationRaw** (required): Get from detect user Agent

- Response
```
{
    "itemId": "00000000-0000-0000-0000-000000000000",
    "status": true,
    "code": 4,
    "message": ""
}
```
- If response `status = true` -> User register successfully
- If response `status = false` -> User register unsuccessfully -> Details error in `message`

**3. Login**

`POST /api/v1/user/login`

- Request
```
{
    "email": "thongtd@financex.io",
    "password": "Test@123456"
}
```
- Response

     - Case 1  `"succeeded": false && "isNotAllowed": true` -> User has not been confirmed email
```
{
    "succeeded": false,
    "isLockedOut": false,
    "isNotAllowed": true,
    "requiresTwoFactor": false
}
```
- Case 2: Incorrect Email or Password `"succeeded": false`
```
{
    "succeeded": false,
    "message": "You've entered the wrong password {0} time(s). You have {1} times to retry",
    "messageArray": [
        "2",
        "3"
    ],
    "isLockedOut": false,
    "isNotAllowed": false,
    "requiresTwoFactor": false
}
```
- Case 3: Login successfully `"succeeded": true`

    - Use `response.token.authToken` as a verify token for each request of this user
    - Each request required authen, please add to http header key below
        - Authorization
        - Value: Bearer token_get_from_login
    - Each token has timeout 1 day.
```
{
    "succeeded": true,
    "isLockedOut": false,
    "isNotAllowed": false,
    "requiresTwoFactor": false,
    "token": {
        "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0aG9uZ3RkQGZpbmFuY2V4LmlvIiwianRpIjoiNTU5NGU1YjQtZDNiOS00NzZlLTg3OWItZjZlNGVhZTNiMWRlIiwiaWF0IjoxNTQxNTc4MDg5LCJyb2wiOiJhcGlfYWNjZXNzIiwiaWQiOiJkODI0NjM1My1hY2RkLTRmYjYtOWFiOS0xYzQzMzM5N2ViODMiLCJuYmYiOjE1NDE1NzgwODksImV4cCI6MTU0MTY2NDQ4OSwiaXNzIjoid2ViQXBpIiwiYXVkIjoiaHR0cDovL2xvY2FsaG9zdDo1MDYyNS8ifQ.zVe2KZU9CRjljHuqYyiir7HMT0tgYEINzDdl3u016-c",
        "expiresIn": 86400
    },
    "identityUser": {
        "userName": "thongtd@financex.io",
        "email": "thongtd@financex.io",
        "createdDate": "2018-11-07T07:42:25.129099",
        "customerTypeId": "bedf83e6-6b91-4ae4-a621-dc07cce6f180",
        "disabled": false,
        "lastLoginDate": "2018-11-07T08:08:08.5206888Z",
        "customerMetaData": {
            "referralId": "FH68Q3BQ1W",
            "fromReferralId": "",
            "identityUserId": "00000000-0000-0000-0000-000000000000",
            "countryCode": "",
            "isRejected": false,
            "verified": false,
            "isKycUpdated": false,
            "id": "00000000-0000-0000-0000-000000000000"
        },
        "id": "00000000-0000-0000-0000-000000000000",
        "emailConfirmed": false,
        "phoneNumberConfirmed": false,
        "twoFactorEnabled": false,
        "lockoutEnabled": false,
        "accessFailedCount": 0
    },
    "btcDailyWithdrawLimit": 2
}
```
**4. Reset password**

`POST: /api/v1/user/reset-password/{user_email}?callback={callback_url_for_confirm_reset_password}`

**5. Change password**

`POST: /api/v1/user/change-passowrd
- Authen: Required
- Request
```
{
    "userEmail": "humg.thongit@gmail.com",
    "password": "Test@#123",
    "newPassword": "Test@#123",
    "verifyCode": null,
    "sessionId": null,
    "ipAddress": null,
    "city": null,
    "userLocationRaw": null
}
```
> **userEmail** (required): User email address
> **password** (required): Current user password
> **newPassword** (required): New password
> **verifyCode** (option): 2FA code
> **sessionId** (option): Session Id response from get 2FA code by email
> **ipAddress** (required): IP of user agent
> **city** (required): City of user agent
> **userLocationRaw** (option): Raw data of user agent

**6. Update user info**

`POST: /api/v1/user/change-passowrd`
- Authen: Required
- Request
```
{
    "firstName": null,
    "lastName": null,
    "sex": null,
    "identityUserId": "00000000-0000-0000-0000-000000000000",
    "countryCode": null,    // countryCode get from get-countries
    "frontIdentityCardBytes": null, // byte array of image
    "frontIdentityCardFileName": null,  // name of image
    "backIdentityCardBytes": null,  // byte array of image
    "backIdentityCardFileName": null,   // name of image
    "selfieBytes": null,    // byte array of image
    "selfieFileName": null, // name of image
    "identityCard": null,   // Number of Identity Card
    "birthDate": null,
    "postalCode": null,
    "city": null,
    "address": null
}
```
**7. Get user info**

`POST: /api/v1/user/get-personal-info`

- Authen: Required
- Request
```
{
    "identityUserId": "d8246353-acdd-4fb6-9ab9-1c433397eb83"    // User Id get from login
}
```
- Response

```
{
    "firstName": "Thong",
    "lastName": "Tran",
    "sex": 1,
    "referralId": "FH68Q3BQ1W",
    "fromReferralId": "",
    "identityUserId": "d8246353-acdd-4fb6-9ab9-1c433397eb83",
    "countryCode": "VN",
    "currencyCode": "VND",
    "isRejected": false,
    "verified": false,
    "frontIdentityCard": "https://media-fnx.s3-ap-southeast-1.amazonaws.com/20181120/07299796/download.jpg",
    "backIdentityCard": "https://media-fnx.s3-ap-southeast-1.amazonaws.com/20181120/01941226/download.jpg",
    "selfie": "https://media-fnx.s3-ap-southeast-1.amazonaws.com/20181120/03967473/download.jpg",
    "identityCard": "044645645455",
    "birthDate": "1990-08-25T00:00:00",
    "postalCode": "10000",
    "city": "Ha Noi",
    "isKycUpdated": false,
    "id": "c87aabe3-9a21-405d-8d72-a52e3d2aa7aa"
}
```
**8. Setup Google Authenticator (2FA)**

`POST: /api/v1/user/get-personal-info`

- Authen: Required
- Request
```
{
    "secretKey": null,  // Google Authenticator secret key
    "password": null,   // User password
    "verifyCode": null, // Google Authenticator verify code
    "email": null,      // Email of user
    "ipAddress": null,  // Ip detect user agent
    "city": null        // City detect user agent
}
```
- Response
```
{
    "accId": "d8246353-acdd-4fb6-9ab9-1c433397eb83",
    "status": true,
    "code": 1,
    "message": "Enable 2FA successful"
}
```
**9. Disable Google Authenticator (2FA)**

`POST: /api/v1/user/get-personal-info`

- Authen: Required
- Request
```
{
    "secretKey": null,  // Google Authenticator secret key
    "password": null,   // User password
    "verifyCode": null, // Google Authenticator verify code
    "email": null,      // Email of user
    "ipAddress": null,  // Ip detect user agent
    "city": null        // City detect user agent
}
```
- Response
```
{
    "accId": "d8246353-acdd-4fb6-9ab9-1c433397eb83",
    "status": true,
    "code": 1,
    "message": "2FA has been disabled"
}
```
**10. Send 2FA code via email**

`POST: /api/v1/user/send-2fa-code-via-email/{email}`

- Authen: Required
- Request
>  **email**: User email

- Response
```
{
    "code": "236716",
    "sessionId": "e1447c53-5c49-4e2d-876d-4fca8e577a4b"
}
```

**11. Enable 2FA email**

`POST: /api/v1/user/enable-2fa-email`

- Authen: Required
- Request
```
{
    "email": null,      // Email of user
    "password": null,   // User password
    "verifyCode": null, // Verify Code get from request get email 2FA 
    "sessionId": null,  // Session Id get from request get email 2FA
    "ipAddress": null,  // Ip detect user agent
    "city": null        // City detect user agent
}
```
- Response
```
{
    "accId": "d8246353-acdd-4fb6-9ab9-1c433397eb83",
    "status": true,
    "code": 1,
    "message": "Enable 2FA successful"
}
```
**12. Disable 2FA email**

`POST: /api/v1/user/disable-2fa-email`

- Authen: Required
- Request
```
{
    "email": null,      // Email of user
    "password": null,   // User password
    "verifyCode": null, // Verify Code get from request get email 2FA 
    "sessionId": null,  // Session Id get from request get email 2FA
    "ipAddress": null,  // Ip detect user agent
    "city": null        // City detect user agent
}
```
- Response
```
{
    "accId": "d8246353-acdd-4fb6-9ab9-1c433397eb83",
    "status": true,
    "code": 1,
    "message": "2FA has been disabled"
}
```
**13. Get user activity logs**

`POST: /api/v1/user/get-activity-logs/{email}`

- Authen: Required
- Request
>  **email**: User email

- Response
```
[
    {
        "ipAddress": "127.0.0.1",
        "location": "Ha Noi",
        "action": "Turn Off 2FA by Google Authenticator",
        "createdDate": "2018-11-20T07:38:25.057715"
    },
    {
        "ipAddress": "127.0.0.1",
        "location": "Ha Noi",
        "action": "Turn On 2FA by Google Authenticator",
        "createdDate": "2018-11-20T07:30:04.953922"
    },
    {
        "ipAddress": "14.162.147.78",
        "location": "Hanoi Vietnam",
        "action": "Login",
        "createdDate": "2018-11-20T07:11:18.247916"
    },
    {
        "action": "Login",
        "createdDate": "2018-11-20T07:07:09.160803"
    },
    {
        "action": "Login",
        "createdDate": "2018-11-17T10:31:01.352611"
    }
]
```
**14. Get user referrals**

- This api return list of referrals for `user_id`

`POST: /api/v1/user/get-referrals/{user_id}/{page_index}/{page_side}`

- Authen: Required
- Request
>  **user_id**: User Id get from login
>  **page_index**: Page index
>  **page_side**: Page size

- Response
```
{
    "source": [
        {
            "email": "sdf***@***.com",
            "createdDate": "2018-11-20T09:47:47"
        },
        {
            "email": "sdf***@***.com",
            "createdDate": "2018-11-20T09:46:51"
        }
    ],
    "totalRecords": 2,
    "pages": 1
}
```
**15. Get user commission**

- This api return list of commissions for `user_id`

`POST: /api/v1/user/get-referrals/{user_id}/{page_index}/{page_side}`

- Authen: Required
- Request
>  **user_id**: User Id get from login
>  **page_index**: Page index
>  **page_side**: Page size

- Response
```
{
    "source": [
        {
            "email": "sdf***@***.com",
            "createdDate": "2018-11-20T09:47:47"
        },
        {
            "email": "sdf***@***.com",
            "createdDate": "2018-11-20T09:46:51"
        }
    ],
    "totalRecords": 2,
    "pages": 1
}
```
**16. Get user commission summary**

`POST: /api/v1/user/get-commission-summary/{user_id}`

- Authen: Required
- Request
>  **user_id**: User Id get from login

- Response
```
{
  "totalShared": 2,
  "referralId": "FH68Q3BQ1W",
  "referralUrl": "http://dev.financex.io/sign-up?referralId=FH68Q3BQ1W",
  "qrCode": "base64_of_qr_code",
  "commissionAmounts": [
    {
      "amount": 0,
      "paymentUnit": "VND"
    }
  ]
}
```

**B. API for trade**

**1. Create new order**

`POST /api/v1/trade/create-new-order`

- Authen: Required
- Request
```
{
    "coinSymbol": "BTC",
    "paymentUnit": "VND",
    "quantity": 0.00001,
    "price": 153382160,
    "orderType": "LO",
    "side": "B",
    "customerEmail": "thongtd@financex.io",
    "accId": "d8246353-acdd-4fb6-9ab9-1c433397eb83",
    "via": 2
}
```
- All of properties above are required
> **coinSymbol**: Symbol of trading coin
> **paymentUnit**: Payment unit of `coinSymbol`
> **quantity**: Quantity of this order
> **price**: Price of this order
> **orderType**: Type of this order (at this time use `LO`)
> **side**: Side of this order, `B = Buy, S = Sell`
> **customerEmail**: Email of customer place this order
> **accId**: Id of customer place this order
> **via**: For mobile app hard code `via = 2`

- Response

- Case response error
```
{
    "code": 0,
    "status": false,
    "description": "Balance not enough",
    "orderId": "00000000-0000-0000-0000-000000000000",
    "createdDate": "2018-11-07T08:23:17.395715",
    "feeAmount": 0.3,
    "amount": 1538.4230648
}
```
- Case error Trading Session closed
```
{
    "code": -1100,
    "status": false,
    "description": "End time of the trading session!",
    "orderId": "00000000-0000-0000-0000-000000000000",
    "createdDate": "0001-01-01T00:00:00",
    "feeAmount": 0,
    "amount": 0
}
```

-  Case response successfully   
```
{
    "code": 0,
    "status": true,
    "description": "Create order sucessfully",
    "orderId": "7c9ba6ff-9511-4965-92ca-0bc9cc2de773",
    "createdDate": "2018-11-07T08:41:04.885657",
    "feeAmount": 4.6014648,
    "amount": 1533.8216
}
```
> **orderId**: Id of order
> **createdDate**:  Created order time
> **feeAmount**: Fee amount
> **amount**: Amount of this order

**2. Cancel order**

`POST /api/v1/trade/cancel-orders`

- Authen: Required
- Request
```
{
    "accId": "d8246353-acdd-4fb6-9ab9-1c433397eb83",
    "orderIds": [
        "110db77c-797b-4e7a-b939-2aacced5dd33"
    ]
}
```
> **accId**:  Id of customer want to make cancel order
> **orderIds**: List order ids want to cancel, all of order in orderIds must belong user has accid

- Response
```
{
    "itemId": "00000000-0000-0000-0000-000000000000",
    "status": true,
    "code": 1,
    "message": "Request cancelled sucessfully"
}
```
- If `"status": true` -> request cancel order has been successfully

**3. Get order books**

`POST /api/v1/trade/get-order-books`

- Authen: Required
- Request
```
{
    "accId": "d8246353-acdd-4fb6-9ab9-1c433397eb83",
    "startDate": null,
    "endDate": null,
    "symbol": null,
    "paymentUnit": null,
    "side": null,
    "pageIndex": 1,
    "pageSize": 15
}
```
> **accId**: Id of user want to get list orders

- Response
```
{
    "source": [
        {
            "orderId": "d95d9a52-50e4-4b45-ad59-e64bcd7031d8",
            "createdDate": "2018-11-07T09:17:45",
            "symbol": "BTC",
            "paymentUnit": "VND",
            "orderTypeLabel": "Limit",
            "sideLabel": "Buy",
            "side": "B",
            "avgPrice": 0,
            "orderPrice": 0,
            "matchQtty": 12.13410035,
            "orderQtty": 12.97927261,
            "amount": 0,
            "totalFee": 0,
            "status": 3,
            "orderStatusLabel": "Cancelled",
            "costOfCapital": 0,
            "pnlValue": 0,
            "pnlPercent": 0
        },
        {
            "orderId": "d95d9a52-50e4-4b45-ad59-e64bcd7031d8",
            "createdDate": "2018-11-07T09:17:40",
            "symbol": "BTC",
            "paymentUnit": "VND",
            "orderTypeLabel": "Limit",
            "sideLabel": "Buy",
            "side": "B",
            "avgPrice": 153630900,
            "orderPrice": 153630900,
            "matchQtty": 0.84517226,
            "orderQtty": 12.97927261,
            "amount": 129844574.958834,
            "totalFee": 389533.7248765,
            "status": 4,
            "orderStatusLabel": "Part",
            "costOfCapital": 0,
            "pnlValue": 0,
            "pnlPercent": 0
        }
    ],
    "totalRecords": 2,
    "pages": 1
}
```
**4. Get open orders**

`POST /api/v1/trade/get-order-books`

- Authen: Required
- Request
```
{
    "accId": "d8246353-acdd-4fb6-9ab9-1c433397eb83",
    "startDate": null,
    "endDate": null,
    "symbol": null,
    "paymentUnit": null,
    "side": null,
    "pageIndex": 1,
    "pageSize": 15
}
```
> **accId**: Id of user want to get list orders

- Response
```
{
    "source": [
        {
            "orderId": "d95d9a52-50e4-4b45-ad59-e64bcd7031d8",
            "createdDate": "2018-11-07T09:17:45",
            "symbol": "BTC",
            "paymentUnit": "VND",
            "orderTypeLabel": "Limit",
            "sideLabel": "Buy",
            "side": "B",
            "avgPrice": 0,
            "orderPrice": 0,
            "matchQtty": 12.13410035,
            "orderQtty": 12.97927261,
            "amount": 0,
            "totalFee": 0,
            "status": 3,
            "orderStatusLabel": "Cancelled",
            "costOfCapital": 0,
            "pnlValue": 0,
            "pnlPercent": 0
        },
        {
            "orderId": "d95d9a52-50e4-4b45-ad59-e64bcd7031d8",
            "createdDate": "2018-11-07T09:17:40",
            "symbol": "BTC",
            "paymentUnit": "VND",
            "orderTypeLabel": "Limit",
            "sideLabel": "Buy",
            "side": "B",
            "avgPrice": 153630900,
            "orderPrice": 153630900,
            "matchQtty": 0.84517226,
            "orderQtty": 12.97927261,
            "amount": 129844574.958834,
            "totalFee": 389533.7248765,
            "status": 4,
            "orderStatusLabel": "Part",
            "costOfCapital": 0,
            "pnlValue": 0,
            "pnlPercent": 0
        }
    ],
    "totalRecords": 2,
    "pages": 1
}
```
**C. Socket API**

`The base endpoint is: http://dev-market-watch.financex.io/signalrHub?uid=`

- This url has one query string `uid` it is will stored user id get from Login
- List of socket events
    -   `timeServiceNotifyListener`: Listener server time
        -   Response data has only one parameter are server time
    -   `priceChangeNotifyListener`: Listener for user wallet balance or user orders change
        -   If `notityType = 1` -> Must be update order response by order Id
            ```
            {
              "accId": "d8246353-acdd-4fb6-9ab9-1c433397eb83",
              "notityType": 1,
              "orderInfoNotities": [
                {
                  "id": "dea6fc75-d736-4f9a-81eb-042e0afc3f99",
                  "avgPrice": 154020437,
                  "matchQtty": 0.966719,
                  "amount": 1910348934.8901207,
                  "matchAmount": 148894482.836203,
                  "coCPrice": 0,
                  "pnlValue": 0,
                  "pnlPecent": 0,
                  "status": 4,
                  "statusLable": "Part",
                  "isMatchFull": false,
                  "isCancelled": null,
                  "isRejected": null
                }
              ],
              "walletBalances": null
            }
            ```
        -   If `notityType = 2` -> Must be update update wallet balance
        ```
        {
          "accId": "d8246353-acdd-4fb6-9ab9-1c433397eb83",
          "notityType": 2,
          "orderInfoNotities": null,
          "walletBalances": [
            {
              "walletId": null,
              "symbol": "VND",
              "available": 7664319933.544238,
              "pending": 1916083058.5409207
            }
          ]
        }
        ```
    - `marketWatchListener`: Listener market change
        ```
        {
            "symbol": "BTC",
            "paymentUnit": "VND",
            "lastestPrice": 154183573,
            "prevLastestPrice": 154020437,
            "priceChange": 1.78717783,
            "highestPrice": 154999000,
            "lowestPrice": 148903905,
            "currencyVolume": 13095990001.1451,
            "priceChangeVolume": 2707153
        }
        ```
