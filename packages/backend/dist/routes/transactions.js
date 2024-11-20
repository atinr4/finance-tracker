"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const transactionController_1 = require("../controllers/transactionController");
const router = express_1.default.Router();
router.use(auth_1.auth);
router.post('/', transactionController_1.createTransaction);
router.get('/', transactionController_1.getTransactions);
router.get('/stats', transactionController_1.getTransactionStats);
router.patch('/:id', transactionController_1.updateTransaction);
router.delete('/:id', transactionController_1.deleteTransaction);
exports.default = router;
//# sourceMappingURL=transactions.js.map