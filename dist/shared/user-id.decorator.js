"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const common_1 = require("@nestjs/common");
const JWT = require("jsonwebtoken");
exports.User = common_1.createParamDecorator((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    if (request === null || request === void 0 ? void 0 : request.headers.authorization) {
        const jwt = request === null || request === void 0 ? void 0 : request.headers.authorization.split(' ')[1];
        const payload = JWT.decode(jwt);
        return { ...request.body, userId: payload.id };
    }
    return { ...request.body };
});
//# sourceMappingURL=user-id.decorator.js.map