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

const authRouter = require("./src/routes/auth");
const dashboardRouter = require("./src/routes/dashboard");
const scraperRouter = require("./src/routes/scraper");
const sitesRouter = require("./src/routes/sites");

// set view engine setup
hbs.registerHelper('json', function (content) {
  return JSON.stringify(content);
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

app.use("/", dashboardRouter);
// app.use("/", (req, res) => res.send("Working perfectly"));
app.use("/auth", authRouter);
// require("./src/routes/dashboard")(app);
app.use("/scraper", scraperRouter);
app.use("/sites", sitesRouter);

http.listen(3000, () => {
  console.log("listening on *:3000");
});
