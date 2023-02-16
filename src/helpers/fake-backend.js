import axios from "axios";
import MockAdapter from "axios-mock-adapter";

const TOKEN =     
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VyIjoie1wiZmlyc3RfbmFtZVwiOlwiYWRhcnNoXCIsXCJsYXN0X25hbWVcIjpcInRyaXBhdGhpXCIsXCJ1c2VyX25hbWVcIjpcInN0cmluZ1wiLFwiZW1haWxcIjpcImFjb21wQGdtYWlsXCIsXCJzaXRlXCI6XCJzdHJpbmdcIixcIm1vYmlsZVwiOlwiODc4Nzg3NTQzXCIsXCJ1c2VyX3R5cGVcIjowLFwicHJvZmlsZV9waWNcIjpcInN0cmluZ1wiLFwiYWRkcmVzc1wiOlwic3RyaW5nXCIsXCJjaXR5XCI6XCJzdHJpbmdcIixcInN0YXRlXCI6XCJzdHJpbmdcIixcImNvdW50cnlcIjpcInN0cmluZ1wiLFwiemlwX2NvZGVcIjpcInN0cmluZ1wiLFwiY3VycmVuY3lcIjpcInN0cmluZ1wiLFwidGltZV96b25lXCI6XCJzdHJpbmdcIixcImlkXCI6MyxcImFjdGl2ZVwiOnRydWUsXCJjcmVhdGVkX2F0XCI6XCIyMDIyLTA4LTIwVDA3OjI2OjI2XCIsXCJ1cGRhdGVkX2F0XCI6XCIyMDIyLTA4LTIwVDA3OjI2OjI2XCJ9IiwibmJmIjoxNjYxMjU3MzM2LCJleHAiOjE2NjM4NDkzMzYsImlhdCI6MTY2MTI1NzMzNn0.efKR4f5oli2EcWqbDEix4oMi7k0z_7svKWv1_xuH944';
// 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJjb2RlcnRoZW1lcyIsImlhdCI6MTU4NzM1NjY0OSwiZXhwIjoxOTAyODg5NDQ5LCJhdWQiOiJjb2RlcnRoZW1lcy5jb20iLCJzdWIiOiJzdXBwb3J0QGNvZGVydGhlbWVzLmNvbSIsImxhc3ROYW1lIjoiVGVzdCIsIkVtYWlsIjoic3VwcG9ydEBjb2RlcnRoZW1lcy5jb20iLCJSb2xlIjoiQWRtaW4iLCJmaXJzdE5hbWUiOiJIeXBlciJ9.P27f7JNBF-vOaJFpkn-upfEh3zSprYfyhTOYhijykdI';
// 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VyIjoie1wiY2xpZW50X2lkXCI6MTAzLFwiY2xpZW50XCI6e1wib3JnYW5pemF0aW9uX25hbWVcIjpcIkpheWFudCBUcmFkZXJzXCIsXCJjb250YWN0X3BlcnNvbl9uYW1lXCI6XCJKYXlhbnQgS2FkYW1cIixcImVtYWlsXCI6XCJqYXlhbnR0cmFkZXJzQHBvcnRlaWdodC5pb1wiLFwibW9iaWxlXCI6XCI5OTk4ODg3Nzc3XCIsXCJnc3Rfbm9cIjpudWxsLFwiYWRkcmVzc1wiOlwiZmFpemFuIGtoYW4gQ2hvd2sgUmFuY2hpXCIsXCJjaXR5X2lkXCI6NzcxLFwic3RhdGVfaWRcIjoxNSxcIlN0YXRlXCI6bnVsbCxcImNvdW50cnlfaWRcIjoxLFwiemlwX2NvZGVcIjpudWxsLFwiY3VycmVuY3lfY29…MSxcInppcF9jb2RlXCI6bnVsbCxcImN1cnJlbmN5XCI6bnVsbCxcInRpbWVfem9uZV9pZFwiOjEsXCJjbGllbnRfc2l0ZV9pZFwiOm51bGwsXCJkcml2aW5nX2xpY2Vuc2Vfbm9cIjpudWxsLFwiZHJpdmluZ19saWNlbnNlX2ZpbGVfcGF0aFwiOm51bGwsXCJ1c2VyX3NpdGVzXCI6bnVsbCxcImNsaWVudF9yb2xlXCI6MSxcImlkXCI6MTU2LFwiYWN0aXZlXCI6dHJ1ZSxcImNyZWF0ZWRfYXRcIjpcIjIwMjMtMDEtMDNUMDk6MjI6NDlcIixcInVwZGF0ZWRfYXRcIjpcIjIwMjMtMDEtMDNUMDk6MjI6NDlcIn0iLCJuYmYiOjE2NzYyMDg2ODEsImV4cCI6MTY3ODgwMDY4MSwiaWF0IjoxNjc2MjA4NjgxfQ.kTJSZM5aAeQj5a3AcHApZzKJCBy-isV55pqz4jYqLp4'
  // "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJjb2RlcnRoZW1lcyIsImlhdCI6MTU4NzM1NjY0OSwiZXhwIjoxOTAyODg5NDQ5LCJhdWQiOiJjb2RlcnRoZW1lcy5jb20iLCJzdWIiOiJzdXBwb3J0QGNvZGVydGhlbWVzLmNvbSIsImxhc3ROYW1lIjoiVGVzdCIsIkVtYWlsIjoic3VwcG9ydEBjb2RlcnRoZW1lcy5jb20iLCJSb2xlIjoiQWRtaW4iLCJmaXJzdE5hbWUiOiJIeXBlciJ9.P27f7JNBF-vOaJFpkn-upfEh3zSprYfyhTOYhijykdI";


var mock = new MockAdapter(axios, { onNoMatch: "passthrough" });

export function configureFakeBackend() {
  let users = [
    {
      id: 2,
      username: "test",
      password: "test",
      firstName: "Test",
      lastName: "User",
      role: "Admin",
      token: TOKEN,
    },
  ];

  mock.onPost("/login/").reply(function (config) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        // get parameters from post request
        let params = JSON.parse(config.data);

        // find if any user matches login credentials
        let filteredUsers = users.filter((user) => {
          return (
            user.username === params.username &&
            user.password === params.password
          );
        });

        if (filteredUsers.length) {
          // if login details are valid return user details and fake jwt token
          let user = filteredUsers[0];
          resolve([200, user]);
        } else {
          // else return error
          resolve([401, { message: "Username or password is incorrect" }]);
        }
      }, 1000);
    });
  });

  mock.onPost("/logout/").reply(function (config) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve([200, "You have successfully logged out!"]);
      });
    });
  });

  mock.onPost("/register/").reply(function (config) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        // get parameters from post request
        let params = JSON.parse(config.data);

        // add new users
        let [firstName, lastName] = params.fullname.split(" ");
        let newUser = {
          id: users.length + 1,
          username: firstName,
          password: params.password,
          firstName: firstName,
          lastName: lastName,
          role: "Admin",
          token: TOKEN,
        };
        users.push({ newUser });

        resolve([200, newUser]);
      }, 1000);
    });
  });

  mock.onPost("/forget-password/").reply(function (config) {
    return new Promise(function (resolve, reject) {
      setTimeout(function () {
        // get parameters from post request
        let params = JSON.parse(config.data);

        // find if any user matches login credentials
        let filteredUsers = users.filter((user) => {
          return user.username === params.username;
        });

        if (filteredUsers.length) {
          // if login details are valid return user details and fake jwt token
          let responseJson = {
            message:
              "We've sent you a link to reset password to your registered email.",
          };
          resolve([200, responseJson]);
        } else {
          // else return error
          resolve([
            401,
            {
              message:
                "Sorry, we could not find any registered user with entered username",
            },
          ]);
        }
      }, 1000);
    });
  });
}
