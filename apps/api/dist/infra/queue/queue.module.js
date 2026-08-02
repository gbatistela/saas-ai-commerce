"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueueModule = void 0;
const common_1 = require("@nestjs/common");
const bullmq_1 = require("@nestjs/bullmq");
const config_1 = require("@nestjs/config");
const ioredis_1 = require("ioredis");
const queue_constants_1 = require("./queue.constants");
let QueueModule = class QueueModule {
};
exports.QueueModule = QueueModule;
exports.QueueModule = QueueModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            bullmq_1.BullModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (config) => ({
                    connection: new ioredis_1.default(config.get('redis.url'), {
                        maxRetriesPerRequest: null,
                    }),
                }),
            }),
            bullmq_1.BullModule.registerQueue({
                name: queue_constants_1.PROCESS_MESSAGE_QUEUE,
                defaultJobOptions: {
                    attempts: 2,
                    backoff: { type: 'fixed', delay: 5000 },
                    removeOnComplete: 1000,
                    removeOnFail: 5000,
                },
            }, { name: queue_constants_1.SEND_MESSAGE_QUEUE }),
        ],
        exports: [bullmq_1.BullModule],
    })
], QueueModule);
//# sourceMappingURL=queue.module.js.map