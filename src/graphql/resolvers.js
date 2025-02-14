const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Employee = require("../models/Employee");

const resolvers = {
  Query: {
    // Login user
    login: async (_, { email, password }) => {
      try {
        console.log(`🔹 Attempting to login user: ${email}`);
        
        const user = await User.findOne({ email });
        if (!user) {
          console.log(" User not found.");
          throw new Error("User not found.");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          console.log(" Invalid credentials.");
          throw new Error("Invalid credentials.");
        }

        const token = jwt.sign({ email: user.email }, "secretkey", { expiresIn: "1h" });
        console.log("Login successful.");
        return token;
      } catch (error) {
        console.error(" Login Error:", error);
        throw new Error(error.message);
      }
    },

    // Get all employees
    getAllEmployees: async () => {
      try {
        console.log("🔹 Fetching all employees...");

        const employees = await Employee.find();
        if (!employees.length) {
          console.log(" No employees found.");
          throw new Error("No employees found.");
        }

        console.log(` Found ${employees.length} employees.`);
        return employees;
      } catch (error) {
        console.error(" Get Employees Error:", error);
        throw new Error(error.message);
      }
    },

    // Get an employee by ID
    getEmployeeById: async (_, { eid }) => {
      try {
        console.log(`🔹 Fetching employee by ID: ${eid}`);

        const employee = await Employee.findById(eid);
        if (!employee) {
          console.log(` Employee with ID ${eid} not found.`);
          throw new Error("Employee not found.");
        }

        console.log(" Employee found:", employee);
        return employee;
      } catch (error) {
        console.error(" Get Employee by ID Error:", error);
        throw new Error(error.message);
      }
    },

    // Search employees by designation or department
    searchEmployeeByDesignationOrDepartment: async (_, { designation, department }) => {
      try {
        console.log(`🔹 Searching employees by designation: ${designation}, department: ${department}`);

        let query = {};
        if (designation) query.designation = { $regex: new RegExp(designation, "i") };
        if (department) query.department = { $regex: new RegExp(department, "i") };

        const employees = await Employee.find(query);
        if (!employees.length) {
          console.log(` No employees found.`);
          throw new Error("No employees found.");
        }

        console.log(` Found ${employees.length} employees.`);
        return employees;
      } catch (error) {
        console.error(" Search Employee Error:", error);
        throw new Error(error.message);
      }
    }
  },

  Mutation: {
    // User Signup
    signUp: async (_, { username, email, password }) => {
      try {
        console.log(`🔹 Registering new user: ${email}`);

        const existingUser = await User.findOne({ email });
        if (existingUser) {
          console.log(" User already exists.");
          throw new Error("User already exists.");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        console.log("User registered successfully.");
        return "User registered successfully.";
      } catch (error) {
        console.error(" Sign Up Error:", error);
        throw new Error(error.message);
      }
    },

    // Add a new employee
    addEmployee: async (_, args) => {
      try {
        console.log(`🔹 Adding new employee: ${args.first_name} ${args.last_name}`);

        const newEmployee = new Employee({ ...args });
        await newEmployee.save();

        console.log(" Employee added successfully.");
        return newEmployee;
      } catch (error) {
        console.error(" Add Employee Error:", error);
        throw new Error(error.message);
      }
    },

    // Update employee details by ID
    updateEmployeeById: async (_, { eid, ...updates }) => {
      try {
        console.log(`🔹 Updating employee with ID: ${eid}`);

        const updatedEmployee = await Employee.findByIdAndUpdate(eid, updates, { new: true });
        if (!updatedEmployee) {
          console.log(` Employee with ID ${eid} not found.`);
          throw new Error("Employee not found.");
        }

        console.log(" Employee updated successfully:", updatedEmployee);
        return updatedEmployee;
      } catch (error) {
        console.error(" Update Employee Error:", error);
        throw new Error(error.message);
      }
    },

    // Delete employee by ID
    deleteEmployeeById: async (_, { eid }) => {
      try {
        console.log(`🔹 Attempting to delete employee with ID: ${eid}`);

        const deletedEmployee = await Employee.findByIdAndDelete(eid);
        if (!deletedEmployee) {
          console.log(` Employee with ID ${eid} not found.`);
          throw new Error("Employee not found.");
        }

        console.log(" Employee deleted successfully.");
        return "Employee deleted successfully.";
      } catch (error) {
        console.error(" Delete Employee Error:", error);
        throw new Error(error.message);
      }
    }
  }
};

module.exports = resolvers;
