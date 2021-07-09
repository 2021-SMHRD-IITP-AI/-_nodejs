const express = require("express");
const router = express.Router();

const conn = require("../config/DB_config.js");

const fs = require("fs");
const { format, addListener } = require("../config/DB_config.js");

let memberdto = new Object;

router.post("/Login", function(request, response){
    let id = request.body.id;
    let pw = request.body.pw;

    let jsonData = JSON.stringify(memberdto);

    let sql = "select * from members where mem_id = ?";

    conn.query(sql, [id], function(err, row){
        if(row.length > 0){
                if(pw == row[0].mem_pw){
                    response.send(jsonData);

                    // request.session.user = {
                    //     "id" : id
                    // }    
                    // response.render("loginS", {
                    //     id : id
                    // });
                    console.log("로그인 성공");
                    console.log(jsonData);
                } else{
                    console.log("로그인 실패" + err);
                }
        } else{
            console.log("로그인 실패" + err);
        }
    });
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

    memberdto.id = id;
    memberdto.pw = pw;
    memberdto.name = name;
    memberdto.tel = tel;
    memberdto.email = email;
    memberdto.address = address;
    memberdto.birth = birth;
    memberdto.status = status;

    let checkJoin = {'check':'NO'};

    let sql2 = "select * from members where = mem_id = ?";

    let sql = "insert into members values(?, ?, ?, ?, ?, ?, ?, ?, now())";

    conn.query(sql, [id, pw, name, tel, email, address, birth, status], function(err, row){
        if(!err){
            if(id == id){
                checkJoin.check = 'true';
                console.log(memberdto.id);                    
            } else{
                console.log("입력실패"+err);
            }
            response.send(checkJoin);
        }   
    });
    conn.end();
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
        
    let user =  request.session.user

    let sql = "insert into notepad values (?, now(), ?)";

    conn.query(sql, [note, user.id], function(err, row){
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

router.get("/logout", function(request, response){
    delete request.session.user;

    response.render("main", {
        user : undefined
    });
});

router.get("/Dosirak", function(request, response){
    console.log(response);
console.log(request);
})

module.exports = router;