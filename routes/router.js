const express = require("express");
const router = express.Router();

const conn = require("../config/DB_config.js");

router.post("/Login", function(request, response){
    let id = request.body.id;
    let pw = request.body.pw;

    conn.connect();

    let sql = "select * from members where mem_id = ?";

    conn.query(sql, [id], function(err, row){
        if(row.length > 0){
            if(row[0].mem_pw === pw){
                response.render("loginS", {
                    in_id : id
                });
            } else{
                response.redirect("http://127.0.0.1:5501/public/LoginF.html");
            }
        } else{
            response.redirect("http://127.0.0.1:5501/public/LoginF.html");
        }
    });
    conn.end();
});

router.post("/Join", function(request, response){
    let id = request.body.id;
    let pw = request.body.pw;
    let name = request.body.name;
    let nick = request.body.nick;
    let tel = request.body.tel;
    let email = request.body.email;
    let address = request.body.address;
    let birth = request.body.birth;
    let gender = request.body.gender;
    let status = request.body.status;
    
    // conn.connect();

    let sql = "insert into members values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, now())";

    conn.query(sql, [id, pw, name, nick, tel, email, address, birth, gender, status], function(err, row){
        if(!err){
            response.redirect("http://222.102.104.135:3000/Main.html");
        } else{
            console.log("입력실패"+err);
        }
    });
    // conn.end();
});

router.get("/Dise", function(request, response){
    conn.connect();

    let sql = "select * from disease";

    conn.query(sql, function(err, row){
        response.render("dise", {
            in_row : row
        });
    });
    conn.end();
});

router.get("/Select", function(request, response){
    conn.connect();

    let sql = "select * from members";

    conn.query(sql, function(err, row){
        response.render("select", {
            in_row : row
        });
    });
    conn.end();
});

router.get("/Ingre", function(request, response){
    conn.connect();

    let sql = "select * from ingredient";

    conn.query(sql, function(err, row){
        response.render("ingre", {
            in_row : row
        });
    });
    conn.end();
});

router.post("/Note", function(request, response){
    let note = request.body.note;

    conn.connect();

    let sql = "insert into notepad values(?, now())";

    conn.query(sql, [note], function(err, row){
        if(!err){
            response.redirect("http://127.0.0.1:5501/public/Main.html");
        } else{
            console.log("입력실패"+err);
        }
    });
    conn.end();
});

module.exports = router;