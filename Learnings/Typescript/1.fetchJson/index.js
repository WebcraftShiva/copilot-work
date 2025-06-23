"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var url = 'https://jsonplaceholder.typicode.com/posts/1';
axios_1.default.get(url).then(function (response) {
    var todo = response.data;
    var userId = todo.userId;
    var id = todo.id;
    var title = todo.title;
    var body = todo.body;
    console.log("\n        The Todo with id: ".concat(id, " has the title: ").concat(title, " witht the content in body: ").concat(body, "\n        has a userId of: ").concat(userId, "\n        "));
});
