const path = require('path');
const mongoose = require("mongoose");
const Counter = require(path.join(__dirname, "./counter")); 

const CustomerSchema = new mongoose.Schema({
  customerId: { 
    type: Number,  
    unique: true 
  },
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  dob: { 
    type: Date, 
    required: true 
  },
  mobile: { 
    type: Number, 
    required: true, 
    unique: true, 
    match: [/^\d{10}$/, 'must be a valid 10-digit mobile number'] 
  },
  pan: { 
    type: String, 
    required: true, 
    unique: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    match: [/\S+@\S+\.\S+/, 'is invalid'] 
  },
  employmentStatus: { 
    type: String, 
    enum: ["Salaried", "Self Employed", "Professional", "Student"], 
    required: true 
  },
  loanApplications: [
    { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Loan"  // Reference to the Loan model
    }
  ],
  sessionValidUntil: {
    type: Date, // Timestamp to store session expiration time
  },
  isLoggedIn: { 
    type: Boolean, 
    default: false // Default value set to false
  },
  isDeleted: { 
    type: Boolean, 
    default: false 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Pre-save hook to increment customerId using the counter
CustomerSchema.pre("save", async function (next) {
  const customer = this;
  
  if (customer.isNew) {
    try {
      // Set the default session validity for 24 hours from now
      customer.sessionValidUntil = new Date(Date.now() + 24 * 60 * 60 * 1000);

      const counter = await Counter.findByIdAndUpdate(
        { _id: "customerId" },
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      customer.customerId = counter.seq; // Set customerId to the incremented value
      next();  // Proceed with saving the customer
    } catch (err) {
      next(err);  // If an error occurs, pass it to the next middleware
    }
  } else {
    next();  // If not a new customer, proceed without modification
  }
});

module.exports = mongoose.model("Customer", CustomerSchema);
