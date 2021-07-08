const express = require("express");
const router = express.Router();

const conn = require("../config/DB_config.js");

const fs = require("fs");

router.post("/Login", function(request, response){
    let id = request.body.id;
    let pw = request.body.pw;

    conn.connect();
    let sql = "select * from members where mem_id = ?";

    conn.query(sql, [id], function(err, row){
        if(row.length > 0){
            if(row[0].mem_pw === pw){
                request.session.user = {
                    "id" : id
                }

                response.render("loginS", {
                    id : id
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
    let tel = request.body.tel;
    let email = request.body.email;
    let address = request.body.address;
    let birth = request.body.birth;
    let status = request.body.status;

    let check = {'check':'NO'};

    let sql = "insert into members values(?, ?, ?, ?, ?, ?, ?, ?, now())";

    conn.query(sql, [id, pw, name, tel, email, address, birth, status], function(err, row){
        if(!err){
            if(id == id){
                check.check = 'true';  
            } 
        } else{
            console.log("입력실패"+err);
        }
        response.send(check);
    });
});

router.get("/Dise", function(request, response){

    let sql = "select * from disease";

    conn.query(sql, function(err, row){
        response.render("dise", {
            in_row : row
        });
    });
});

router.get("/Select", function(request, response){

    let sql = "select * from members";

    conn.query(sql, function(err, row){
        response.render("select", {
            in_row : row
        });
    });
});

router.get("/Ingre", function(request, response){

    let sql = "select * from ingredient";

    conn.query(sql, function(err, row){
        response.render("ingre", {
            in_row : row
        });
    });
});

router.post("/Note", function(request, response){
    let note = request.body.note;

    let sql = "insert into notepad values(?, now())";

    conn.query(sql, [note], function(err, row){
        if(!err){
            response.redirect("http://222.102.104.135:3000/main");
        } else{
            console.log("입력실패"+err);
        }
    });
});

router.get("/Main", function(request, response){
    response.render("main", {
        user : request.session.user
    });
});

router.get("/Dosirak", function(request, response){
    fs.readFile('../img\img5.png', function(error, data){
        response.writeHead(200, {"Content-Type" : "image/png"});
        response.write(data);
        response.end();
    });
    
});

module.exports = router;