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
            memberdto.name = row[0].mem_name;
            memberdto.tel = row[0].mem_tel;
            memberdto.address = row[0].mem_address;
            memberdto.email = row[0].mem_email;
            memberdto.status = row[0].mem_status;
            let jsonData = JSON.stringify(memberdto);
            console.log(jsonData);
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
            if(id !== ""){
                checkJoin.check = 'true';
                console.log(id + "가입성공");             
            } else{
                checkJoin.check = 'false';
                console.log("Join: 가입실패"+err);
            }
            response.send(checkJoin);
        }   
    });
    conn.end();
});

router.post("/Dise", function(request, response){
    let status = request.body.status;

    const conn = mysql.createConnection({
        host : "localhost",
        user : "root",
        password : "1234",
        port : "3306",
        database : "one_project_db"
    });

    let sql = "select * from disease where dise_name = ?";

    console.log(status);
    conn.query(sql, [status], function(err, row){
        let diseData = new Object();

            if(status == "고혈압"){
                diseData.recom = row[0].dise_recom;
                diseData.warn = row[0].dise_warn;
            } else if(status == "당뇨"){
                diseData.recom = row[0].dise_recom;
                diseData.warn = row[0].dise_warn;
            } else if(status == "지방"){
                diseData.recom = row[0].dise_recom;
                diseData.warn = row[0].dise_warn;
            }
            response.send(diseData);
            console.log("Dise : 조회성공");

    });
    conn.end();
});

router.post("/NoteIn", function(request, response){
    let note_workout = request.body.note_workout;
    let note_health = request.body.note_health;
    let note_text = request.body.note_text;
    let id = request.body.id;

    console.log(request.body.note_workout +"앱에서 보낸 운동여부");
    console.log(request.body.note_health +"앱에서 보낸 건강상태");
    console.log(request.body.note_text +"앱에서 보낸 건강일지");
    console.log(request.body.id +"앱에서 보낸 아이디");
        
    let check = {'check':'NO'};

    const conn = mysql.createConnection({
        host : "localhost",
        user : "root",
        password : "1234",
        port : "3306",
        database : "one_project_db"
    });

    let sql = "insert into notepad(note_workout, note_health, note_text, note_date, mem_id) values (?, ?, ?, now(), ?)";

    conn.query(sql, [note_workout, note_health, note_text, id], function(err, row){
        if(!err){
            if(row.affectedRows > 0){
                check.check = "true";
                console.log("NoteIn : 입력성공");
            } else{
                check.check = "no";
                console.log("NoteIn: 입력실패"+err);
            }                
        } else{
            check.check = "no";
            console.log("NoteIn: 입력실패"+err);
        }
        response.send(check);
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
        if(!err){
            response.send(row);
            console.log("NoteOut : 출력성공");
        } else{
            console.log("NoteOut : 출력실패" +err);
        }
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

    let sql = "select * from members where mem_id = ? and mem_email = ? and mem_tel = ?";

    conn.query(sql, [id, email, tel], function(err, row){
        if(id == row[0].mem_id && email == row[0].mem_email && tel == row[0].mem_tel){
            console.log("FindPW : id, email, tel 일치");
            response.send(row[0].mem_pw);
        } else{
            console.log("FindPW : id, eaml, tel 불일치" + err);
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
            if(id == row[0].mem_id){
                console.log(id + "ChangePW : 수정성공");
            }
        } else{
            console.log("ChangePW : 수정실패" + err);
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

    let sql = "select * from members where mem_email = ? and mem_tel = ?";

    conn.query(sql, [email, tel], function(err, row){
        if(email == row[0].mem_email && tel == row[0].mem_tel){
            console.log("FindID : email, tel 일치");
            response.send(row[0].mem_id);
        } else{
            console.log("FindID : email, tel 불일치" + err);
        }
    });
    conn.end();
});

router.post("/Exit", function(request, response){ // 되다가 안됨....... 성공뜨는데 실제 삭제가 안됨..
    let id = request.body.id;

    const conn = mysql.createConnection({
        host : "localhost",
        user : "root",
        password : "1234",
        port : "3306",
        database : "one_project_db"
    });

    let checkExit = {'check':'NO'};

    let sql = "delete from members where mem_id = ?";

    conn.query(sql, [id], function(err, row){
        if(err==null){
            checkExit.check = 'true';
                console.log(id + "탈퇴성공");             
            
            response.send(checkExit);
        }else{
            console.log(err);
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

module.exports = router;
