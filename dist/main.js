"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const allowList = [
        'http://fireking5997.me',
        'http://www.fireking5997.me',
        'http://localhost:8080',
        process.env.BASE_URL,
        `${process.env.BASE_URL}:8080`,
    ];
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: (origin, callback) => {
            const allowed = allowList.includes(origin);
            if (allowed)
                callback(null, true);
            else
                throw new common_1.UnauthorizedException('UnAccepted Cors');
        },
        credentials: true,
    });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    await app.listen(process.env.PORT);
}
bootstrap();
//# sourceMappingURL=main.js.map