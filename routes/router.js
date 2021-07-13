const express = require("express");
const router = express.Router();

// const conn = require("../config/DB_config.js");
// 인식오류로 직접 연결
const mysql = require("mysql");


const fs = require("fs");

let memberdto = new Object;

router.post("/Login", function(request, response){
    let id = request.body.id;
    let pw = request.body.pw;

    const conn = mysql.createConnection({
        host : "localhost",
        user : "root",
        password : "1234",
        port : "3306",
        database : "one_project_db"
    });

    let sql = "select * from members where mem_id = ?";

    conn.query(sql, [id], function(err, row){
        console.log(row.length);
        console.log(row[0].mem_id);
        if(row.length > 0){
            memberdto.id = id;
            memberdto.pw = pw;
            let jsonData = JSON.stringify(memberdto);
            if(pw == row[0].mem_pw){
                response.send(jsonData);
                console.log(id + "로그인 성공");
                } else{
                    console.log("로그인 실패" + err);
                }
        } else{
            console.log("로그인 실패" + err);
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

    memberdto.id = id;
    memberdto.pw = pw;

    const conn = mysql.createConnection({
        host : "localhost",
        user : "root",
        password : "1234",
        port : "3306",
        database : "one_project_db"
    });

    let checkJoin = {'check':'NO'};

    let sql = "insert into members values(?, ?, ?, ?, ?, ?, ?, ?, now())";

    conn.query(sql, [id, pw, name, tel, email, address, birth, status], function(err, row){
        if(!err){
            if(id != ""){
                checkJoin.check = 'true';
                console.log(id + "가입성공");             
            } else{
                console.log("입력실패"+err);
            }
            response.send(checkJoin);
        }   
    });
    conn.end();
});

router.get("/Dise", function(request, response){

    const conn = mysql.createConnection({
        host : "localhost",
        user : "root",
        password : "1234",
        port : "3306",
        database : "one_project_db"
    });

    if(request.body.status == "고혈압"){
        let sql = "select * from disease where dise_no = 1";

        conn.query(sql, function(err, row){
            if(!err){
                response.send({"result" : row});
                console.log("조회성공");
            } else{
                console.log("조회실패"+err);
            }
        });
    } else if(request.body.status == "당뇨"){
        let sql = "select * from disease where dise_no = 2";

        conn.query(sql, function(err, row){
            if(!err){
                response.send({"result" : row});
                console.log("조회성공");
            } else{
                console.log("조회실패"+err);
            }
        });
    } else if(request.body.status == "비만"){
        let sql = "select * from disease where dise_no = 3";

        conn.query(sql, function(err, row){
            if(!err){
                response.send({"result" : row});
                console.log("조회성공");
            } else{
                console.log("조회실패"+err);
            }
        });
    }
    conn.end();
});

router.post("/NoteIn", function(request, response){
    let note_workout = request.body.note_workout;
    let note_health = request.body.note_health;
    let note_text = request.body.note_text
        
    let user =  request.session.user

    const conn = mysql.createConnection({
        host : "localhost",
        user : "root",
        password : "1234",
        port : "3306",
        database : "one_project_db"
    });

    let sql = "insert into notepad values (?, ?, ?, now(), ?)";

    conn.query(sql, [note_workout, note_health, note_text, user.id], function(err, row){
        if(!err){
            console.log("입력성공");
        } else{
            console.log("입력실패"+err);
        }
    });
    conn.end();
});

router.post("/NoteOut", function(request, response){
    const conn = mysql.createConnection({
        host : "localhost",
        user : "root",
        password : "1234",
        port : "3306",
        database : "one_project_db"
    });

    let sql = "select * from notepad";

    conn.query(sql, function(err, row){
        response.send({"result" : row});
    });
    conn.end();
});


router.post("/FindPW", function(request, response){
    let id = request.body.id;
    let email = request.body.email;
    let tel = request.body.tel;

    const conn = mysql.createConnection({
        host : "localhost",
        user : "root",
        password : "1234",
        port : "3306",
        database : "one_project_db"
    });

    let sql = "select * from members where mem_id = ?";

    conn.query(sql, [id], function(err, row){
        if(id == row[0].id && email == row[0].email && tel == row[0].tel){
            console.log("id, email, tel 일치");
            response.send({"result" : row[0].mem_pw});
        } else{
            console.log("id, eaml, tel 불일치" + err);
        }
    });
    conn.end();
});

router.post("/ChangePW", function(request, response){
    let id = request.body.id;
    let update_data = request.body.update_data;

    const conn = mysql.createConnection({
        host : "localhost",
        user : "root",
        password : "1234",
        port : "3306",
        database : "one_project_db"
    });

    let sql = "update members set mem_pw = ? where mem_id = ?"

    conn.query(sql, [update_data, id], function(err, row){
        if(!err){
            console.log(id + "수정성공");
        } else{
            console.log("수정실패" + err);
        }
    });
    conn.end();
});

router.post("/FindID", function(request, response){
    let email = request.body.email;
    let tel = request.body.tel;

    const conn = mysql.createConnection({
        host : "localhost",
        user : "root",
        password : "1234",
        port : "3306",
        database : "one_project_db"
    });

    let sql = "select * from members where mem_email = ?";

    conn.query(sql, [email], function(err, row){
        if(email == row[0].email && tel == row[0].tel){
            console.log("email, tel 일치");
            response.send({"result":row[0].mem_id});
        } else{
            console.log("id, eaml, tel 불일치" + err);
        }
    });
    conn.end();
});

router.get("/Ingre", function(request, response){

    const conn = mysql.createConnection({
        host : "localhost",
        user : "root",
        password : "1234",
        port : "3306",
        database : "one_project_db"
    });

    let sql = "select * from ingredient";

    conn.query(sql, function(err, row){
        response.render("ingre", {
            in_row : row
        });
    });
    conn.end();
});

// router.get("/Select", function(request, response){

//     const conn = mysql.createConnection({
//         host : "localhost",
//         user : "root",
//         password : "1234",
//         port : "3306",
//         database : "one_project_db"
//     });

//     let sql = "select * from members";

//     conn.query(sql, function(err, row){
//         response.render("select", {
//             in_row : row
//         });
//     });
//     conn.end();
// });

// router.get("/Main", function(request, response){
//     response.render("main", {
//         user : request.session.user
//     });
// });

// router.get("/logout", function(request, response){
//     delete request.session.user;

//     response.render("main", {
//         user : undefined
//     });
// });

// router.get("/Dosirak", function(request, response){
//     console.log(response);
// console.log(request);
// })

module.exports = router;