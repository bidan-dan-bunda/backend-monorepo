"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSequelizeInstance = void 0;
const sequelize_1 = require("sequelize");
const models = __importStar(require("./models"));
const config_1 = require("../config");
let sequelize = null;
const config = config_1.getConfig();
const defaultDatabaseConnection = {
    database: config.DB_NAME,
    user: config.DB_USER,
    password: config.DB_PASS,
    host: config.DB_HOST,
};
function getSequelizeInstance({ database, user, password, host, } = defaultDatabaseConnection) {
    if (!sequelize) {
        sequelize = new sequelize_1.Sequelize(database, user, password, {
            host,
            dialect: 'mysql',
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 1000,
            },
        });
    }
    return sequelize;
}
exports.getSequelizeInstance = getSequelizeInstance;
let Database = /** @class */ (() => {
    class Database {
        constructor(model, connection = defaultDatabaseConnection) {
            this.sequelize = getSequelizeInstance(connection);
            if (!this.sequelize.models[model.name]) {
                if (model.run) {
                    model.run(this.sequelize);
                }
                else {
                    sequelize === null || sequelize === void 0 ? void 0 : sequelize.define(model.name, model.attributes, model.options);
                }
                model.runAfter && process.nextTick(model.runAfter.bind(model));
            }
            this.model = sequelize === null || sequelize === void 0 ? void 0 : sequelize.models[model.name];
        }
        static initializeModels(connection = defaultDatabaseConnection) {
            const sequelize = getSequelizeInstance(connection);
            for (const name in models) {
                const model = models[name];
                if (model.run) {
                    model.run(sequelize);
                }
                else {
                    sequelize === null || sequelize === void 0 ? void 0 : sequelize.define(model.name, model.attributes, model.options);
                }
                model.runAfter && process.nextTick(model.runAfter.bind(model, sequelize));
            }
        }
        load(options) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this.model.findAll(options);
            });
        }
        create(values, options) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this.model.create(values, options);
            });
        }
    }
    Database.sequelize = sequelize;
    return Database;
})();
exports.default = Database;
