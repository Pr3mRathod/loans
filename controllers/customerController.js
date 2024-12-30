const path = require('path');
const Customer = require(path.join(__dirname, "../models/Customer"));
const Counter = require(path.join(__dirname, "../models/counter"));

// Create Customer
exports.createCustomer = async (req, res) => {
    try {
        const customer = new Customer(req.body);
        await customer.save();
        res.status(201).json(customer);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get all Customers
exports.getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();
        res.status(200).json(customers);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Get Customer by ID
exports.getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findOne({ customerId: req.params.customerId });  
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.status(200).json(customer);
    } catch (error) {
        res.status(400).json({ message: error.message }); 
    }
};


// Update Customer
exports.updateCustomer = async (req, res) => {
    try {
        const { customerId } = req.params;
        const updatedCustomer = await Customer.findOneAndUpdate(
            { customerId },  
            { $set: req.body },  
            { new: true }  
        );

        if (!updatedCustomer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.status(200).json(updatedCustomer); 
    } catch (error) {
        res.status(400).json({ message: error.message }); 
    }
};


// Soft delete customer by customerId
exports.softDeleteCustomer = async (req, res) => {
    try {
        const { customerId } = req.params;
        const customer = await Customer.findOneAndUpdate(
            { customerId },
            { isDeleted: true }, 
            { new: true }  
        );

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.status(200).json({ message: 'Customer successfully soft deleted', customer });
    } catch (error) {
        res.status(400).json({ message: error.message });  
    }
};

// Loan Applied By The Customer
exports.getCustomerWithLoans = async (req, res) => {
    try {
        const { customerId } = req.params;

        // Find the customer by ID and populate loanApplications
        const customerWithLoans = await Customer.findOne({ customerId })
            .populate('loanApplications') // Populate loan details
            .exec();

        if (!customerWithLoans) {
            return res.status(404).json({ message: "Customer not found" });
        }

        res.status(200).json(customerWithLoans);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
