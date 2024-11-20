"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const investmentController_1 = require("../controllers/investmentController");
const router = express_1.default.Router();
router.use(auth_1.auth);
router.post('/', investmentController_1.createInvestment);
router.get('/', investmentController_1.getInvestments);
router.get('/stats', investmentController_1.getInvestmentStats);
router.patch('/:id', investmentController_1.updateInvestment);
router.delete('/:id', investmentController_1.deleteInvestment);
exports.default = router;
//# sourceMappingURL=investments.js.map