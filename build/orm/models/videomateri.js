"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoMateriDefinition = exports.VideoMateri = void 0;
const sequelize_1 = require("sequelize");
class VideoMateri extends sequelize_1.Model {
}
exports.VideoMateri = VideoMateri;
exports.VideoMateriDefinition = {
    name: 'VideoMateri',
    attributes: {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        content: sequelize_1.DataTypes.STRING,
        thumbnail: sequelize_1.DataTypes.BLOB,
        week: sequelize_1.DataTypes.INTEGER,
        user_bid_id: sequelize_1.DataTypes.INTEGER,
        video_id: sequelize_1.DataTypes.INTEGER,
    },
    options: {
        timestamps: false,
        tableName: 'videomateri',
    },
};
