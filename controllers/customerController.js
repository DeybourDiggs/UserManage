const Customer = require('../models/Customer');
const mongoose = require('mongoose');

// WITH PAGINATION
const homepage = async (req, res) => {
  // req.flash('info', 'welcome')
  const locals = {
    title: "User Management System"
  }

  let perPage = 12;
  let page = req.query.page || 1;

  try {
    const customers = await Customer.aggregate([ { $sort: {updatedAt: -1}}])
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec();
    const count = await Customer.count();
    res.render('index', {locals, 
      customers,
      current:page, 
      pages: Math.ceil(count/ perPage)
    })
  }catch(error){
    console.log(error);
  }
  
}




// WITH NO PAGINATION

// const homepage = async (req, res) => {
//   // req.flash('info', 'welcome')
//   const locals = {
//     title: "User Management System"
//   }

//   try {
//     const customers = await Customer.find({}).limit(22);
//     res.render('index', {locals, customers})
//   }catch(error){
//     console.log(error);
//   }
  
// }

const addCustomer = async (req, res) => {
  const locals = {
    title: "Add New Customer"
  }
  res.render('customer/add', locals)
}

const postCustomer = async (req, res) => {
  console.log(req.body);
  const newCustomer = new Customer ({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    tel: req.body.tel,
    email: req.body.email,
    details: req.body.details,
  })
  try {
    await Customer.create(newCustomer);
    await req.flash('info', "New Customer has been added.")
    res.redirect('/')
  }catch(error) {
    console.log(error)
  }
  
}

const viewCustomer = async (req,res) => {
  try {
    const customer = await Customer.findOne({_id: req.params.id})


    const locals = {
      title: 'View Customer Details'
    };

    res.render('customer/view', {locals, 
      customer
    })
  }catch(error) {
    console.log(error)
  }
}

const editCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOne({ _id: req.params.id})

    const locals = {
      title: "Edit Customer Details"
    }
    res.render('customer/edit', {locals, customer})
  }catch(error) {
    console.log(error);
  }
  
}

const putCustomer = async (req, res) => {
  
  try {
    
    await Customer.findByIdAndUpdate( req.params.id,{
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      tel: req.body.tel,
      email: req.body.email,
      details: req.body.details,
      updatedAt: Date.now()
    });

    res.redirect(`/edit/${req.params.id}`);
  } catch (error) {
    console.log(error)
  }
}

const deleteCustomer = async (req, res) => {
  try {
    

    await Customer.deleteOne({_id: req.params.id});
    await req.flash('info', "Customer Deleted Successfully")
    res.redirect('/')
  } catch (error) {
    console.log(error);
  }
}

const searchCustomer = async (req, res) => {
  const locals = {
    title: "Search New Customer"
  }
  try {
    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

    const customers = await Customer.find({
      $or: [
        { firstName: { $regex: new RegExp(searchNoSpecialChar, "i") }},
        { lastName: { $regex: new RegExp(searchNoSpecialChar, "i") }},
      ]
    });

    res.render("search", {
      customers,
      locals
    })
    
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  homepage,
  addCustomer,
  postCustomer, 
  viewCustomer,
  editCustomer,
  putCustomer,
  deleteCustomer, 
  searchCustomer
}