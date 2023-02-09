const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql2");
const zmq = require("zeromq");
const { socket } = require("zeromq");


app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "",
  database: "eaproject",
});

app.get("/user", (req, res) => {
  db.query("SELECT user.user_id, user.user_name, user.email ,user.password ,COUNT (port.user_id) AS sum_port FROM `user` JOIN port ON port.user_id=user.user_id GROUP BY user.user_id", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/transaction", (req, res) => {
  db.query(`SELECT user.user_id,user.user_name,transaction.port_number
  ,transaction.time,transaction.balance,
  transaction.profit
  FROM user
  JOIN port
  ON user.user_id = port.user_id
  JOIN TRANSACTION
  ON TRANSACTION.port_number= port.port_number`, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});


async function getDataMT4(){
  var count=0;
  const sock = zmq.socket("pull");
  var test;
  sock.connect("tcp://127.0.0.1:3031")
  sock.on("message", function(msg) {
    if(JSON.parse(msg.toString())[0].msg=="permitreq"){
      console.log(JSON.parse(msg.toString())[0].portNumber);
      sendDataMT4(JSON.parse(msg.toString())[0].portNumber);
    }
    else{
      var profit = JSON.parse(msg.toString())[0].Profit;
      var portNumber = JSON.parse(msg.toString())[0].portNumber;
      var equity = JSON.parse(msg.toString())[0].Equity;
      var date = JSON.parse(msg.toString())[0].Date;
      
      db.query('INSERT INTO `transaction` (port_number,time,equity,profit) VALUES (?,?,?,?)',
        [portNumber,date,equity,profit],
        (err,result) => {
          if(err){
            console.log(err);
          }
          else{
            console.log("insert success");
          }
        }
      )
    }
  });
}

async function sendDataMT4(check){
  const sockPush = zmq.socket("push");
  sockPush.bind("tcp://127.0.0.1:3030");
  //sock.send("test");
  setInterval(function() {
    db.query('SELECT port_number FROM `port` WHERE `port_number`=?',
      [check],
      (err, result) => {
        if(result.length==0){
          sockPush.send("Not Allow");
        }
        else{
          sockPush.send("Allow");
        }
      }
    )
  }, 500);
}
//sendDataMT4(2134610728);
getDataMT4();

app.post("/register",(req,res) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  const port_number = req.body.port;


  db.query('SELECT * FROM `user` WHERE `user_name`=? OR `email`=?',
    [username,email],
    (err, result) => {
      if(err){
        res.send({err:err})
      }
      if (result.length==0) {
        //กรณียังไม่ได้สมัครสมาชิก
        db.query('INSERT INTO `user` (user_name,email,password) VALUES (?,?,?)',
          [username, email, password],
          (err, result) => {
            if(err){
              res.send({err:err});
            }
            else{
              console.log(password);
              db.query('SELECT user_id FROM `user` WHERE `user_name`=? AND `email`=?',
                [username, email],
                (err, result) => {
                  const user_id = result[0].user_id;
                  db.query('INSERT INTO `port` (user_id,port_number) VALUES (?,?)',
                    [user_id, port_number],
                    (err,result) => {
                      if(err){
                        res.send({err:err});
                      }
                      else{
                        res.send({msg:"register success"});
                      }
                    }
                  );
                  
                }
              ); 
            }
          }
        );
      }
      else{
        db.query('SELECT user_id FROM `user` WHERE `user_name`=? AND `email`=?',
          [username, email],
          (err, result) => {
            const user_id = result[0].user_id;
            db.query('INSERT INTO `port` (user_id,port_number) VALUES (?,?)',
              [user_id, port_number],
              (err,result) => {
                if(err){
                  res.send({err:err});
                }
                else{
                  res.send({msg:"add success"});
                }
              }
            );
            
          }
        ); 
        
      }
    }
  );


  
});

app.post("/signin",(req,res) => {
  const email = req.body.email;
  const password = req.body.password;
  db.query('SELECT * FROM `user` WHERE `email`=? AND `password`=?',
    [email, password],
    (err, result) => {
      if(err){
        res.send({err:err})
      }
      if (result.length>0) {
        res.send(result);
      }
      else{
        res.send({error:"user not found"})
      }
    }
  );
});

app.listen(3001, () => {
  console.log("Yey, your server is running on port 3001");
});
