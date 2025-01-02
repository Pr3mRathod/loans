const Loan = require("../models/loan");
const Customer = require("../models/Customer");

// Controller to create a new loan application
exports.createLoan = async (req, res) => {
  try {
    const { customerId, loanType, amount, tenure, interest, documents, employmentDetails, references, bankDetails } = req.body;

    // Validate if the customer exists
    const customer = await Customer.findOne({ customerId });
    if (!customer) {
      return res.status(400).json({ message: "Customer not found!" });
    }

    // Create new loan application
    const newLoan = new Loan({
      customerId,
      loanType,
      amount,
      tenure,
      interest,
      documents,
      employmentDetails,
      references,
      bankDetails,
    });

    // Save loan to the database
    const loan = await newLoan.save();

    // Add the loan to the customer's loanApplications array
    customer.loanApplications.push(loan._id);
    await customer.save();

    res.status(201).json({ loan });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Controller to get loan details by loanId
exports.getLoanById = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.loanId);
    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }
    res.status(200).json({ loan });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// Controller to update a loan application (using customerId)
exports.updateLoan = async (req, res) => {
  try {
    const customerId = req.params.customerId;
    
    // Find loan(s) related to customerId
    const loan = await Loan.findOneAndUpdate(
      { customerId },
      req.body,
      { new: true }
    );

    if (!loan) {
      return res.status(404).json({ message: "Loan not found for this customer" });
    }
    res.status(200).json({ loan });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// Controller to update loan status (using customerId)
exports.updateLoanStatus = async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const { status, statusCode } = req.body;

    // Find loan(s) related to customerId and update status
    const loan = await Loan.findOneAndUpdate(
      { customerId },
      {
        'loanStatus.status': status,
        'loanStatus.statusCode': statusCode,
      },
      { new: true }
    );

    if (!loan) {
      return res.status(404).json({ message: "Loan not found for this customer" });
    }
    res.status(200).json({ loan });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Controller to verify PAN, eKYC, vKYC (using customerId)
exports.verifyLoan = async (req, res) => {
  try {
    const customerId = req.params.customerId;
    const { panVerified, eKYC, vKYC } = req.body;

    // Update the verification statuses
    const loan = await Loan.findOneAndUpdate(
      { customerId },
      {
        'verification.panVerified.status': panVerified.status,
        'verification.panVerified.statusCode': panVerified.statusCode,
        'verification.eKYC.status': eKYC.status,
        'verification.eKYC.statusCode': eKYC.statusCode,
        'verification.vKYC.status': vKYC.status,
        'verification.vKYC.statusCode': vKYC.statusCode,
      },
      { new: true }
    );

    if (!loan) {
      return res.status(404).json({ message: "Loan not found for this customer" });
    }

    res.status(200).json({ loan });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Controller to soft delete a loan application (using customerId)
exports.deleteLoan = async (req, res) => {
  try {
    const customerId = req.params.customerId;

    const loan = await Loan.findOneAndUpdate(
      { customerId },
      { isDeleted: true },
      { new: true }
    );

    if (!loan) {
      return res.status(404).json({ message: "Loan not found for this customer" });
    }

    res.status(200).json({ message: "Loan successfully deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
