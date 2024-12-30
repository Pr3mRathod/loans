const express = require("express");
const router = express.Router();
const CustomerController = require("../controllers/customerController");

// Create a new customer
router.post("/", CustomerController.createCustomer);

// Get all customers
router.get("/", CustomerController.getCustomers);

// Get a specific customer by customerId
router.get("/:customerId", CustomerController.getCustomerById);

// Update a customer's information
router.put("/:customerId", CustomerController.updateCustomer);

// Soft delete a customer (set `isDeleted` to true)
router.delete("/:customerId", CustomerController.softDeleteCustomer);

// Get loan details of a customer
router.get("/:customerId/loans", CustomerController.getCustomerWithLoans);

module.exports = router;
