"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Investment = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const investmentSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    notes: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
});
investmentSchema.index({ user: 1, date: -1 });
investmentSchema.index({ user: 1, category: 1 });
exports.Investment = mongoose_1.default.model('Investment', investmentSchema);
//# sourceMappingURL=Investment.js.map