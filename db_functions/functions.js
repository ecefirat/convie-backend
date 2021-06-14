require("dotenv").config({
  path: "./.env",
});

const bcrypt = require("bcrypt");
const saltRounds = 10;
const mysql = require("mysql");
const { add } = require("winston");

const db = mysql.createPool({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
  port: process.env.port,
});

const registerCustomer = (req, cb) => {
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const email = req.body.email;
  const password = req.body.password;

  const RegisterCustomer =
    "INSERT INTO customers(customer_name, customer_surname, customer_email, customer_password) VALUES (?, ?, ?, ?);";

  const checkifExists =
    "SELECT customer_email FROM customers WHERE customer_email = ?";

  db.query(checkifExists, [email], (err, res) => {
    if (err) {
      console.log(err);
    } else if (res.length > 0) {
      cb(409);
    } else {
      bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
          console.log(err);
          cb(401);
        }
        db.query(
          RegisterCustomer,
          [first_name, last_name, email, hash],
          (err, result) => {
            if (err) {
              cb(400);
            } else {
              console.log(result);
              cb(200);
            }
          }
        );
      });
    }
  });
};

const loginCustomer = (req, cb) => {
  const email = req.body.email;
  const password = req.body.password;

  const checkCustomer = "SELECT * FROM customers WHERE customer_email = ?";
  const loginCustomer =
    "SELECT customer_id, customer_name, customer_surname, customer_email, customer_address, profile_picture, role FROM customers WHERE customer_email = ?";

  db.query(checkCustomer, [email], (err, result) => {
    // console.log(result);
    if (err) {
      cb(400);
      console.log(err);
    }
    if (result.length === 0) {
      cb(404);
    }
    if (result.length > 0) {
      console.log(result[0]);
      console.log("db login");
      bcrypt.compare(password, result[0].customer_password, (err, response) => {
        if (err) {
          console.log(err);
        } else if (!response) {
          cb(401);
          console.log("passwords dont match");
        } else if (response) {
          db.query(loginCustomer, [email], (error, res) => {
            if (error) {
              console.log(error);
            } else if (res) {
              cb(res);
            }
          });
        }
      });
    }
  });
};

const changeAddress = (req, cb) => {
  const customer_address = req.body.customer_address;
  const customer_email = req.body.customer_email;

  const ChangeAddress =
    "UPDATE customers SET customer_address = ? WHERE customer_email = ?";
  db.query(ChangeAddress, [customer_address, customer_email], (err, res) => {
    if (err) {
      cb(400);
      console.log(err);
      console.log("update failed");
    }
    if (res) {
      cb(customer_address);
      console.log("address updated");
    }
  });
};

const changeImage = (req, res, cb) => {
  console.log(req.body.profile_picture);
  const customer_email = req.body.customer_email;
  const profile_picture = req.body.profile_picture;

  const ChangeImage =
    "UPDATE customers SET profile_picture = ? WHERE customer_email = ?";
  db.query(ChangeImage, [profile_picture, customer_email], (err, res) => {
    if (err) {
      cb(404);
      console.log(err);
      console.log("image update failed");
    }
    if (res) {
      console.log("image update good");
    }
  });
};

const deleteAccount = (req, cb) => {
  const customer_email = req.body.customer_email;

  const DeleteAccount = "DELETE FROM customers WHERE customer_email = ?;";

  db.query(DeleteAccount, [customer_email], (err, res) => {
    if (err) {
      console.log(err);
      console.log("account can't be deleted");
    } else if (res) {
      console.log("account deleted");
      cb(200);
    }
  });
};

const showProducts = (cb) => {
  const ShowProducts = "SELECT * FROM products";

  db.query(ShowProducts, (err, results) => {
    if (err) {
      cb(405);
      console.log(err);
    } else if (results.length > 0) {
      cb(results);
    } else if ((results.length = 0)) {
      cb(404);
    }
  });
};

const getUserInfo = (cb) => {
  const GetUserInfo = "SELECT * FROM customers";

  db.query(GetUserInfo, (err, res) => {
    if (err) {
      cb(400);
      console.log(err);
    } else if (res.length > 0) {
      cb(res);
    } else if ((res.length = 0)) {
      cb(404);
    }
  });
};

const sendOrder = (req, cb) => {
  const amount = req.body.totals;
  const customer_id = req.body.customer_id;
  const customer_address = req.body.customer_address;
  console.log(amount);

  const SendOrder =
    "INSERT INTO orders(order_amount, customer_id, order_address) VALUES (?, ?, ?);";
  const SendOrderDetails = "INSERT INTO order_details(order_id) VALUES (?);";

  db.query(SendOrder, [amount, customer_id, customer_address], (err, res) => {
    if (err) {
      cb(400);
      console.log(err);
    }
    if (res) {
      cb(200);
      db.query(SendOrderDetails, [res.insertId], (err, res) => {
        if (err) {
          console.log("order details error");
          console.log(err);
        } else {
          console.log("success foreign key");
        }
      });
    } else {
      console.log("error at order details");
    }
  });
};

const orderHistory = (req, cb) => {
  const customer_id = req.body.customer_id;
  console.log(customer_id);
  const OrderHistory =
    "SELECT * FROM orders WHERE customer_id = ? ORDER BY order_id DESC";

  db.query(OrderHistory, [customer_id], (err, results) => {
    if (err) {
      cb(405);
      console.log(err);
    } else if (results.length > 0) {
      cb(results);
    } else if ((results.length = 0)) {
      cb(404);
    }
  });
};

const deleteOrder = (req, cb) => {
  const order_id = req.body.order_id;

  const DeleteOrder = "DELETE FROM orders WHERE order_id= ?";

  db.query(DeleteOrder, [order_id], (err, res) => {
    if (err) {
      cb(400);
      console.log(err);
    } else {
      cb(order_id);
      console.log("order deleted");
    }
  });
};

const changePName = (req, cb) => {
  const pName = req.body.data;
  const pID = req.body.pID;
  console.log(req.body);
  console.log(pID);
  console.log(pName);

  const ChangePName = "UPDATE products SET pName = ? WHERE pID = ?";
  db.query(ChangePName, [pName, pID], (err, res) => {
    if (err) {
      cb(400);
      console.log(err);
      console.log("pname failed");
    }
    if (res) {
      cb(pName);
      console.log("pname update good");
    }
  });
};

const changeUName = (req, cb) => {
  const uName = req.body.data;
  const customer_id = req.body.customer_id;
  console.log(req.body);
  console.log(uName);

  const ChangeUName =
    "UPDATE customers SET customer_name = ? WHERE customer_id = ?";
  db.query(ChangeUName, [uName, customer_id], (err, res) => {
    if (err) {
      cb(400);
      console.log(err);
      console.log("uname failed");
    }
    if (res) {
      cb(uName);
      console.log("uname update good");
    }
  });
};

const deleteUser = (req, cb) => {
  console.log(req.body);
  const customer_id = req.body.user_id;

  const DeleteUser = "DELETE FROM customers WHERE customer_id= ?";

  db.query(DeleteUser, [customer_id], (err, res) => {
    if (err) {
      cb(400);
      console.log(err);
    } else {
      cb(customer_id);
      console.log("user deleted");
    }
  });
};

const deleteProduct = (req, cb) => {
  console.log(req.body);
  const pID = req.body.pID;
  const pName = req.body.pName;

  const DeleteProduct = "DELETE FROM products WHERE pID= ?";

  db.query(DeleteProduct, [pID], (err, res) => {
    if (err) {
      cb(400);
      console.log(err);
    } else {
      cb(pName);
      console.log("product deleted");
    }
  });
};

const addProduct = (req, cb) => {
  console.log(req.body);
  const pName = req.body.pName;
  const pPrice = req.body.pPrice;

  const AddProduct = "INSERT INTO products(pName, pPrice) VALUES (?, ?)";

  const checkifExists = "SELECT pName FROM products WHERE pName = ?";

  db.query(checkifExists, [pName], (err, res) => {
    if (err) {
      cb(400);
      console.log("exists error", err);
    } else if (res.length > 0) {
      cb([409, pName]);
    } else {
      db.query(AddProduct, [pName, pPrice], (err, res) => {
        if (err) {
          cb(400);
          console.log(err);
        } else {
          cb(pName);
          console.log("product added");
        }
      });
    }
  });
};

const addAdmin = (req, cb) => {
  const customer_name = req.body.customer_name;
  const customer_surname = req.body.customer_surname;
  const customer_email = req.body.customer_email;
  const customer_password = req.body.customer_password;

  const AddAdmin =
    "INSERT INTO customers(customer_name, customer_surname, customer_email, customer_password, role) VALUES (?, ?, ?, ?, 'admin')";

  const checkifExists =
    "SELECT customer_email FROM customers WHERE customer_email = ?";

  db.query(checkifExists, [customer_email], (err, res) => {
    if (err) {
      console.log(err);
    } else if (res.length > 0) {
      cb(409);
    } else {
      bcrypt.hash(customer_password, saltRounds, (err, hash) => {
        if (err) {
          console.log(err);
          cb(401);
        }
        db.query(
          AddAdmin,
          [customer_name, customer_surname, customer_email, hash],
          (err, res) => {
            if (err) {
              cb(400);
              console.log(err);
            } else {
              cb(customer_name);
              console.log("admin added");
            }
          }
        );
      });
    }
  });
};

module.exports = {
  registerCustomer: registerCustomer,
  loginCustomer: loginCustomer,
  showProducts: showProducts,
  sendOrder: sendOrder,
  changeAddress: changeAddress,
  changeImage: changeImage,
  deleteAccount: deleteAccount,
  orderHistory: orderHistory,
  deleteOrder: deleteOrder,
  getUserInfo: getUserInfo,
  changePName: changePName,
  changeUName: changeUName,
  deleteUser: deleteUser,
  deleteProduct: deleteProduct,
  addProduct: addProduct,
  addAdmin: addAdmin,
};
