var express = require("express");
var app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);
let dotenv = require("dotenv");
dotenv.config();
let bodyParser = require("body-parser");
const Sequelize = require("sequelize");
const path = require("path");
const hbs = require("hbs");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require('connect-flash');
const { userJoin, getCurrentUser, userLeave, getEmailUsers } = require("./src/utils/users");

global.sequelize = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    operatorAliases: false,
    // timezone: 'Asia/Jakarta',
    timezone: "+07:00",
  }
);
global.browserSession = new Object();
app.use(
  session({
    name: process.env.SESS_NAME,
    resave: false,
    saveUnitialized: false,
    secret: process.env.SESS_SECRET,
    cookie: {
      sameSite: true,
    },
  })
);
app.use(flash());

const auth = require('./src/middleware/auth');
const authRouter = require("./src/routes/auth");
const dashboardRouter = require("./src/routes/dashboard");
const scraperRouter = require("./src/routes/scraper");
const sitesRouter = require("./src/routes/sites");

// set view engine setup
hbs.registerHelper('json', function (val) {
  return JSON.stringify(val);
});
hbs.registerHelper('formatedDate', function (val) {
  return new Date(val).toDateString();
});
hbs.registerHelper("inc", function(val)
{
    return parseInt(val) + 1;
});
hbs.registerHelper("dec", function(val)
{
    return parseInt(val) - 1;
});
hbs.registerHelper('times', function(n, block) {
  var accum = '';
  for(var i = 0; i < n; ++i)
      accum += block.fn(i);
  return accum;
});
hbs.registerHelper('ifCond', function (v1, operator, v2, options) {
  switch (operator) {
      case '==':
          return (v1 == v2) ? options.fn(this) : options.inverse(this);
      case '===':
          return (v1 === v2) ? options.fn(this) : options.inverse(this);
      case '!=':
          return (v1 != v2) ? options.fn(this) : options.inverse(this);
      case '!==':
          return (v1 !== v2) ? options.fn(this) : options.inverse(this);
      case '<':
          return (v1 < v2) ? options.fn(this) : options.inverse(this);
      case '<=':
          return (v1 <= v2) ? options.fn(this) : options.inverse(this);
      case '>':
          return (v1 > v2) ? options.fn(this) : options.inverse(this);
      case '>=':
          return (v1 >= v2) ? options.fn(this) : options.inverse(this);
      case '&&':
          return (v1 && v2) ? options.fn(this) : options.inverse(this);
      case '||':
          return (v1 || v2) ? options.fn(this) : options.inverse(this);
      default:
          return options.inverse(this);
  }
});
hbs.registerPartials(path.join(__dirname, "./src/views/dashboard/partials"));
hbs.registerPartials(path.join(__dirname, "./src/views/partials"));
app.set("views", path.join(__dirname, "./src/views"));
app.set("view engine", "hbs");

app.enable("trust proxy");
app.use(express.static("public"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

io.sockets.on("connection", (socket) => {
  socket.on("accountLogin", ({ name, email }) => {
    const user = userJoin(socket.id, name, email);

    console.log(user)
    socket.join(user.email);
  });
  console.log("a user connected");

  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if(user) io.to(user.email).emit("accountLogout", { msg: `Bye. ${user.email}` });
    
    console.log("user disconnected");
  });
});
global.io = io;

app.use("/dashboard", auth, dashboardRouter);
app.use("/auth", authRouter);
// require("./src/routes/dashboard")(app);
app.use("/scraper", auth, scraperRouter);
app.use("/sites", auth, sitesRouter);

http.listen(3000, () => {
  console.log("listening on *:3000");
});
