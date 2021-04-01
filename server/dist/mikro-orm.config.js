"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("./constants");
const Post_1 = require("./entities/Post");
const config = {
    entities: [Post_1.Post],
    dbName: 'draft-online',
    type: 'postgresql',
    debug: !constants_1.__prod__,
};
exports.default = config;
//# sourceMappingURL=mikro-orm.config.js.map