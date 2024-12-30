const mongoose = require("mongoose");

const LoanSchema = new mongoose.Schema({
    customerId: { 
        type: Number, 
        required: true, 
        ref: "Customer",  // Reference to Customer model
        validate: {
          validator: function(v) {
            return mongoose.model('Customer').exists({ customerId: v });  // Ensure customerId exists in Customer collection
          },
          message: props => `Customer with ID ${props.value} does not exist!`
        }
      },
      
  loanType: {
    type: String,
    enum: [
      "Home Loan",
      "Gold Loan",
      "Loan Against Security",
      "Credit Card Loan",
      "Solar Financing",
      "Auto Loan",
    ],
    required: true,
  },
  amount: { type: Number, required: true },
  tenure: { type: Number, required: true }, // in months
  interest: { type: Number, required: true }, // percentage

  // Required Documents
  documents: {
    proofOfIncome: { type: String, required: true },
    primaryBankStatement: { type: String, required: true },
    permanentAddressProof: { type: String, required: true },
    additionalDocument: { type: String }, // Gold Loan, Auto Loan, etc.
  },

  // Employment Details
  employmentDetails: {
    companyName: { type: String },
    companyAddress: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    employerType: { type: String, enum: ["Government", "Private"] },
    industry: { type: String },
    department: { type: String },
    designation: { type: String },
    employedSince: { type: String },
    income: { type: Number },
  },

  // References
  references: [
    {
      name: { type: String },
      relation: { type: String },
      phoneNo: { type: String },
    },
  ],

  // Bank Details
  bankDetails: {
    beneficiaryName: { type: String, required: true },
    accountNo: { type: String, required: true },
    ifscCode: { type: String, required: true },
  },

  // Loan Status and Code
  loanStatus: {
    status: {
      type: String,
      enum: [
        "New",
        "Application Submitted",
        "Forwarded",
        "Under Process",
        "Verification Pending",
        "Sanctioned",
        "Disbursed",
        "Rejected",
      ],
      default: "New",
    },
    statusCode: {
      type: Number,
      enum: [0, 1, 2, 3, 4, 5, 6, 7], // Corresponding status codes
      default: 0, // Default to 'New' status
    },
  },

  // Verification status and code
  verification: {
    panVerified: {
      status: { type: Boolean, default: null }, // Pending verification
      statusCode: {
        type: Number,
        enum: [0, 1, 2], // 0: Pending, 1: Verified, 2: Failed
        default: 0,
      },
      verifiedOn: { type: Date, default: null },
    },
    eKYC: {
      status: { type: Boolean, default: null },
      statusCode: {
        type: Number,
        enum: [0, 1, 2],
        default: 0,
      },
      verifiedOn: { type: Date, default: null },
    },
    vKYC: {
      status: { type: Boolean, default: null },
      statusCode: {
        type: Number,
        enum: [0, 1, 2],
        default: 0,
      },
      verifiedOn: { type: Date, default: null },
    },
  },

  // Soft delete flag
  isDeleted: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Loan", LoanSchema);
