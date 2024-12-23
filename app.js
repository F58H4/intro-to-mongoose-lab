require('dotenv').config();
const mongoose = require('mongoose');
const prompt = require('prompt-sync')();
const Customer = require('./models/customer');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Database connected');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const createCustomer = async () => {
  const name = prompt('Enter customer name: ');
  const age = parseInt(prompt('Enter customer age: '), 10);

  const customer = new Customer({ name, age });
  await customer.save();
  console.log('Customer created successfully');
};

const viewCustomers = async () => {
  const customers = await Customer.find();
  if (customers.length === 0) {
    console.log('No customers found.');
  } else {
    customers.forEach((customer) =>
      console.log(`id: ${customer._id} -- Name: ${customer.name}, Age: ${customer.age}`)
    );
  }
};

const updateCustomer = async () => {
  const customers = await Customer.find();
  if (customers.length === 0) {
    console.log('No customers found to update.');
    return;
  }

  customers.forEach((customer) =>
    console.log(`id: ${customer._id} -- Name: ${customer.name}, Age: ${customer.age}`)
  );

  const id = prompt('Enter the id of the customer to update: ');
  const customer = await Customer.findById(id);

  if (!customer) {
    console.log('Customer not found.');
    return;
  }

  const newName = prompt('Enter new name: ');
  const newAge = parseInt(prompt('Enter new age: '), 10);

  customer.name = newName;
  customer.age = newAge;
  await customer.save();

  console.log('Customer updated successfully');
};

const deleteCustomer = async () => {
  const customers = await Customer.find();
  if (customers.length === 0) {
    console.log('No customers found to delete.');
    return;
  }

  customers.forEach((customer) =>
    console.log(`id: ${customer._id} -- Name: ${customer.name}, Age: ${customer.age}`)
  );

  const id = prompt('Enter the id of the customer to delete: ');
  const customer = await Customer.findByIdAndDelete(id);

  if (customer) {
    console.log('Customer deleted successfully');
  } else {
    console.log('Customer not found.');
  }
};

const mainMenu = async () => {
  while (true) {
    console.log('\nWelcome to the CRM');
    console.log('1. Create a customer');
    console.log('2. View all customers');
    console.log('3. Update a customer');
    console.log('4. Delete a customer');
    console.log('5. Quit');
    const choice = prompt('Number of action to run: ');

    if (choice === '1') {
      await createCustomer();
    } else if (choice === '2') {
      await viewCustomers();
    } else if (choice === '3') {
      await updateCustomer();
    } else if (choice === '4') {
      await deleteCustomer();
    } else if (choice === '5') {
      console.log('Exiting...');
      process.exit(0);
    } else {
      console.log('Invalid choice. Try again.');
    }
  }
};

connectDB().then(() => mainMenu());