"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchSessionController = void 0;
const common_1 = require("@nestjs/common");
const user_id_decorator_1 = require("../shared/user-id.decorator");
const match_session_dto_1 = require("./match-session.dto");
const match_session_service_1 = require("./match-session.service");
const auth_guard_1 = require("../auth/auth.guard");
const match_session_entity_1 = require("./match-session.entity");
let MatchSessionController = class MatchSessionController {
    constructor(matchSessionService) {
        this.matchSessionService = matchSessionService;
    }
    create(data) {
        return this.matchSessionService.create(data);
    }
    getMatchSession({ userId, matchSessionId }) {
        if (userId) {
            return this.matchSessionService.getMatchSessionByUserId(userId);
        }
        else if (matchSessionId) {
            return this.matchSessionService.getMatchSessionById(matchSessionId);
        }
    }
    swipeFilm(data) {
        return this.matchSessionService.swipe(data.matchSessionId, data.filmJSON, data.userId, data.swipeDirection);
    }
    deleteMatchSession(data) {
        return this.matchSessionService.deleteMatchSession(data.matchSessionId, data.userId);
    }
    update({ id }, matchSession) {
        return this.matchSessionService.update(id, matchSession);
    }
};
__decorate([
    common_1.Post('api/matchsession'),
    __param(0, user_id_decorator_1.User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [match_session_dto_1.CreateMatchSessionDTO]),
    __metadata("design:returntype", void 0)
], MatchSessionController.prototype, "create", null);
__decorate([
    common_1.Get('api/matchsession'),
    __param(0, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MatchSessionController.prototype, "getMatchSession", null);
__decorate([
    common_1.Post('api/swipefilm'),
    __param(0, user_id_decorator_1.User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MatchSessionController.prototype, "swipeFilm", null);
__decorate([
    common_1.Delete('api/matchsession'),
    __param(0, user_id_decorator_1.User()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MatchSessionController.prototype, "deleteMatchSession", null);
__decorate([
    common_1.Put('api/matchsession/:id'),
    __param(0, common_1.Param()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, match_session_entity_1.MatchSession]),
    __metadata("design:returntype", void 0)
], MatchSessionController.prototype, "update", null);
MatchSessionController = __decorate([
    common_1.Controller(),
    __metadata("design:paramtypes", [match_session_service_1.MatchSessionService])
], MatchSessionController);
exports.MatchSessionController = MatchSessionController;
//# sourceMappingURL=match-session.controller.js.map