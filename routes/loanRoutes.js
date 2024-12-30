const express = require('express');
const router = express.Router();
const LoanController = require('../controllers/loanController');

// Route to create a new loan application
router.post('/loan', LoanController.createLoan);

// Route to get loan details by loanId
router.get('/loan/:loanId', LoanController.getLoanById);

// Route to update a loan application (use customerId instead of loanId)
router.put('/loan/customer/:customerId', LoanController.updateLoan);

// Route to update loan status (use customerId instead of loanId)
router.patch("/loan/customer/:customerId/status", LoanController.updateLoanStatus);

// Route to verify PAN, eKYC, vKYC (use customerId instead of loanId)
router.patch('/loan/customer/:customerId/verify', LoanController.verifyLoan);

// Route to delete a loan application (soft delete) (use customerId instead of loanId)
router.delete('/loan/customer/:customerId', LoanController.deleteLoan);

module.exports = router;
