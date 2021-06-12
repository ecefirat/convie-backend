const express = require("express");
const bodyParser = require("body-parser");
const db = require("./db_functions/functions");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const { Cookie } = require("express-session");
const fileUpload = require("express-fileupload");
const path = require("path");
require("dotenv").config();
const app = express();
const { body, validationResult } = require("express-validator");
var MySQLStore = require("express-mysql-session")(session);

const winston = require("winston");

const logConfiguration = {
  transports: [
    new winston.transports.File({
      filename: "./log/logger.log",
    }),
  ],
};

const logger = winston.createLogger(logConfiguration);

// const logger = (req, res, next) => {
//   console.log(moment().format());
//   next();
// };

// app.use(logger);

var sessionStore = new MySQLStore({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
  port: process.env.port,
});

app.use(
  cors({
    origin: ["http://localhost:3000", "https://convie-frontend.herokuapp.com"],
    credentials: true,
    allowedHeaders: ["Origin", "Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(bodyParser.json({ limit: "200mb" }));
// app.use(bodyParser.urlencoded({ limit: "200mb",  extended: true, parameterLimit: 1000000 }));
app.use("/", express.static(path.join(__dirname, "/")));
app.enable("trust proxy", true);

app.use(cookieParser());
app.use(
  session({
    key: "customer",
    secret: process.env.SESSION_SECRET || "xTDwaz8pjqKLWbg4",
    saveUninitialized: false,
    resave: false,
    proxy: true,
    store: sessionStore,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: false,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 60000 * 60 * 48,
    },
  })
);

app.use(fileUpload({ createParentPath: true }));

// const rateLimit = require("express-rate-limit");

// const dayLimiter = rateLimit({
//   windowMs: 24 * 60 * 60 * 1000, // 24 hours
//   max: 1000, // 1000 requests
// });

// const secondLimiter = rateLimit({
//   windowMs: 1000, // 1 second
//   max: 10, // 10 request
// });

// app.use(dayLimiter, secondLimiter);

app.post(
  "/register",
  body("first_name").isAlpha(),
  body("last_name").isAlpha(),
  body("email").isEmail(),
  body("password").isLength({ min: 8, max: 8 }),
  body("password").isAlphanumeric(),

  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    db.registerCustomer(req, (cb) => {
      if (cb === 400) {
        res.status(400).send({ message: "reg failed" });
      } else if (cb === 200) {
        res.status(200).send({ message: "reg success" });
        logger.info(
          `IP: ${req.ip}, Session: ${req.sessionID}, Username: ${
            req.session.user
          }, Usertype: ${
            req.session.user
          }, Timestamp: ${new Date().toJSON()}, Action: Register`
        );
      } else if (cb === 401) {
        res.status(401).send({ message: "hashing failed" });
      } else if (cb === 409) {
        res.status(409).send({ message: "user exists" });
      } else {
        console.log("something wrong");
      }
    });
  }
);

app.post(
  "/login",
  body("email").isEmail(),
  body("password").isLength({ min: 8 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    db.loginCustomer(req, (cb) => {
      if (cb === 400) {
        res.status(400).send({ message: "login failed" });
      } else if (cb === 404) {
        res.status(404).send({ message: "user does not exist" });
      } else if (cb === 401) {
        res.status(401).send({ messsage: "password incorrect" });
      } else {
        req.session.user = cb[0];
        res.status(200).send({ user: cb[0] });
        logger.info(
          `IP: ${req.ip}, Session: ${req.sessionID}, Username: ${
            req.session.user.customer_name
          }, Usertype: ${
            req.session.user.role
          }, Timestamp: ${new Date().toJSON()}, Action: Login`
        );
      }
    });
  }
);

app.get("/logout", (req, res) => {
  logger.info(
    `IP: ${req.ip}, Session: ${req.sessionID}, Username: ${
      req.session.user.customer_name
    }, Usertype: ${
      req.session.user.role
    }, Timestamp: ${new Date().toJSON()}, Action: Logout`
  );
  req.session.destroy();
  res.sendStatus(200);
});

app.post(
  "/customerAddress",
  body("customer_address").isLength({ max: 50 }),

  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    db.changeAddress(req, (cb) => {
      if (cb === 400) {
        res.status(400).send({ message: "address update failed" });
      } else {
        req.session.user.customer_address = cb;
        res.status(200).send({ message: cb });
        logger.info(
          `IP: ${req.ip}, Session: ${req.sessionID}, Username: ${
            req.session.user.customer_name
          }, Usertype: ${
            req.session.user.role
          }, Timestamp: ${new Date().toJSON()}, Action: Address Update`
        );
      }
    });
  }
);

app.post("/picture", async (req, res) => {
  // implement validation
  try {
    if (!req.files) {
      res.send({ message: "no files" });
    } else if (req.files.picture.name.endsWith("jpeg")) {
      const { picture } = req.files;
      picture.mv("./uploads/" + picture.name);
      res.send({ picture });
      logger.info(
        `IP: ${req.ip}, Session: ${req.sessionID}, Username: ${
          req.session.user.customer_name
        }, Usertype: ${
          req.session.user.role
        }, Timestamp: ${new Date().toJSON()}, Action: Image Upload`
      );
    } else {
      res.status(415).send({ message: "wrong file type" });
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post("/uploads", (req, res) => {
  // implement validation
  db.changeImage(req, (cb) => {
    if (cb === 404) {
      res.status(404).send({ message: "image update failed" });
    } else if (cb === 200) {
      res.status(200).send({ message: "image changed" });
      logger.info(
        `IP: ${req.ip}, Session: ${req.sessionID}, Username: ${
          req.session.user.customer_name
        }, Usertype: ${
          req.session.user.role
        }, Timestamp: ${new Date().toJSON()}, Action: Image Update`
      );
    }
  });
});

app.post("/account", (req, res) => {
  db.deleteAccount(req, (cb) => {
    if (cb === 400) {
      res.status(400).send({ message: "deletion failed" });
    } else if (cb === 200) {
      logger.info(
        `IP: ${req.ip}, Session: ${req.sessionID}, Username: ${
          req.session.user.customer_name
        }, Usertype: ${
          req.session.user.role
        }, Timestamp: ${new Date().toJSON()}, Action: Delete Account`
      );
      res.status(200).send({ message: "deletion succesful" });
    }
  });
});

app.get("/products", (req, res) => {
  db.showProducts((cb) => {
    if (cb === 405) {
      res.status(405).send({ message: "can't load products" });
    } else if (cb === 404) {
      res.status(404).send({ message: "no product is found" });
    } else {
      res.status(200).send({ prod: cb });
    }
  });
});

app.get("/userInfo", (req, res) => {
  db.getUserInfo((cb) => {
    if (cb === 400) {
      res.status(400).send({ message: "can't get user info" });
    } else if (cb === 404) {
      res.status(404).send({ message: "user does not exist" });
    } else {
      res.status(200).send({ users: cb });
    }
  });
});

app.post("/order", (req, res) => {
  db.sendOrder(req, (cb) => {
    if (cb === 400) {
      res.status(400).send({ message: "order failed" });
    } else if (cb === 200) {
      res.status(200).send({ message: "order is sent" });
      logger.info(
        `IP: ${req.ip}, Session: ${req.sessionID}, Username: ${
          req.session.user.customer_name
        }, Usertype: ${
          req.session.user.role
        }, Timestamp: ${new Date().toJSON()}, Action: Order`
      );
    }
  });
});

app.post("/history", (req, res) => {
  // let user_id = req.session.user.customer_id
  db.orderHistory(req, (cb) => {
    if (cb === 405) {
      res.status(405).send({ message: "failed" });
    } else if (cb === 404) {
      res.status(404).send({ message: "no order found" });
    } else {
      res.status(200).send({ history: cb });
    }
  });
});

app.post("/orders", (req, res) => {
  db.deleteOrder(req, (cb) => {
    if (cb === 400) {
      res.status(400).send({ message: "order cannot be deleted" });
    } else {
      res.status(200).send({ order_id: cb });
      logger.info(
        `IP: ${req.ip}, Session: ${req.sessionID}, Username: ${
          req.session.user.customer_name
        }, Usertype: ${
          req.session.user.role
        }, Timestamp: ${new Date().toJSON()}, Action: Order Delete`
      );
    }
  });
});

app.get("/onlyAdmin", (req, res) => {
  console.log(req.ip);
  console.log("server ip");
  let whiteList = [
    "::192.168.1.110",
    "::192.168.1.219",
    "::1",
    "::ffff:127.0.0.1",
    process.env.ipAdmin,
  ];
  let comingIp = req.ip;
  let checkIP = whiteList.includes(comingIp);
  console.log(req.session.user.role);
  console.log(checkIP);
  if (req.session.user.role === "admin") {
    if (checkIP === true) {
      res.status(200).send({ message: "allowed" });
    } else if (checkIP === false) {
      res.status(403).send({ message: "not allowed" });
    }
  } else if (req.session.user.role === "customer") {
    res.status(403).send({ message: "customer account" });
  }
});

app.post(
  "/pName",
  body("pName").isLength({ max: 30 }),

  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    db.changePName(req, (cb) => {
      if (cb === 400) {
        res.status(400).send({ message: "no change in pname" });
      } else {
        console.log(cb);
        console.log("pname updates");
        // req.session.user.customer_address = cb;
        res.status(200).send({ message: cb });
        logger.info(
          `IP: ${req.ip}, Session: ${req.sessionID}, Username: ${
            req.session.user.customer_name
          }, Usertype: ${
            req.session.user.role
          }, Timestamp: ${new Date().toJSON()}, Action: Product Name Update`
        );
      }
    });
  }
);

app.post("/uName", body("uName").isLength({ max: 20 }), (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  db.changeUName(req, (cb) => {
    if (cb === 400) {
      res.status(400).send({ message: "no change in uname" });
    } else {
      console.log(cb);
      console.log("uname updates");
      res.status(200).send({ message: cb });
      logger.info(
        `IP: ${req.ip}, Session: ${req.sessionID}, Username: ${
          req.session.user.customer_name
        }, Usertype: ${
          req.session.user.role
        }, Timestamp: ${new Date().toJSON()}, Action: User Name Update`
      );
    }
  });
});

app.post("/users", (req, res) => {
  db.deleteUser(req, (cb) => {
    if (cb === 400) {
      res.status(400).send({ message: "user cannot be deleted" });
    } else {
      logger.info(
        `IP: ${req.ip}, Session: ${req.sessionID}, Username: ${
          req.session.user.customer_name
        }, Usertype: ${
          req.session.user.role
        }, Timestamp: ${new Date().toJSON()}, Action: Delete User`
      );
      res.status(200).send({ user_id: cb });
    }
  });
});

app.post("/product", (req, res) => {
  db.deleteProduct(req, (cb) => {
    if (cb === 400) {
      res.status(400).send({ message: "product cannot be deleted" });
    } else {
      res.status(200).send({ pName: cb });
      logger.info(
        `IP: ${req.ip}, Session: ${req.sessionID}, Username: ${
          req.session.user.customer_name
        }, Usertype: ${
          req.session.user.role
        }, Timestamp: ${new Date().toJSON()}, Action: Delete Product`
      );
    }
  });
});

app.post(
  "/addProduct",
  body("pName").isLength({ max: 20 }),
  body("pPrice").isLength({ max: 5 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    db.addProduct(req, (cb) => {
      if (cb === 400) {
        res.status(400).send({ message: "product cannot be added" });
      } else if (cb[0] === 409) {
        res.status(409).send();
      } else {
        res.status(200).send({ pName: cb });
        logger.info(
          `IP: ${req.ip}, Session: ${req.sessionID}, Username: ${
            req.session.user.customer_name
          }, Usertype: ${
            req.session.user.role
          }, Timestamp: ${new Date().toJSON()}, Action: Add Product`
        );
      }
    });
  }
);

app.post(
  "/addAdmin",
  body("customer_name").isLength({ max: 20 }),
  body("customer_surname").isLength({ max: 30 }),
  body("customer_email").isEmail(),
  body("customer_password").isLength({ min: 8 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    db.addAdmin(req, (cb) => {
      if (cb === 409) {
        res.status(409).send();
      } else if (cb === 401) {
        res.status(401).send({ message: "hashing error" });
      } else if (cb === 400) {
        res.status(400).send({ message: "admin cannot be added" });
      } else {
        res.status(200).send({ admin: cb });
        logger.info(
          `IP: ${req.ip}, Session: ${req.sessionID}, Username: ${
            req.session.user.customer_name
          }, Usertype: ${
            req.session.user.role
          }, Timestamp: ${new Date().toJSON()}, Action: Add Admin`
        );
      }
    });
  }
);

app.get("/sessionInfo", (req, res) => {
  if (req.session.user) {
    res.status(200).send({ user: req.session.user });
  } else {
    res.status(400).send({ message: "not logged in" });
  }
});

module.exports = app;
