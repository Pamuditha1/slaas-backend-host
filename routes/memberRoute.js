const bcrypt = require('bcrypt');
const express = require('express');
const Joi = require('joi');
const { v1: uuidv1 } = require('uuid');
const env = require('../envVariables')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');
const nodemailMailGun = require('nodemailer-mailgun-transport')

const generateUniqueId = require('generate-unique-id');
// const {addPersonal,addResAddress} = require('../queries/memberRegisterQueries')

const router = express.Router();
const mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '0112704105',
    database : 'slaasproject'
});
// var connection = mysql.createConnection({host: "slaasdatabase.mysql.database.azure.com", user: "adminpamu@slaasdatabase", password: '0112704105Abc', database: 'slaasproject', port: 3306});


connection.connect((err) => {
    if(!err) return console.log("Successfully connected to MySql database");

    else console.log("Database connection failed" , send.stringify(err));   
});

let memberFirstName = '';
// const id = generateUniqueId({
//     useLetters: false,
//     length: 8
// });
let id = '';

let member = '';
let username = ''
let memNo = ''
// let paymentData = '';

router.post('/', async (req, res) => {

    // const { error } = validateUser(req.body);
    // if (error) return res.status(400).send(error.details[0].message);

    //Check whether the member available
    console.log(req.body)
    member = req.body;
    username = req.body.username

    memNo = req.body.membershipNo
    console.log(member.memberData.academic.length)
    // officialData = req.body.officialData;
    // professionalData = req.body.professionalData;
    // membershipData = req.body.membershipData;
    // paymentData = req.body.paymentData;
    if(req.body.memberID) {
        id=req.body.memberID
    }
    else{
        id = uuidv1();
    }
    

    addProposer(res,id,member)

    // connection.query(`SELECT email FROM member_personal WHERE email='${member.email}'`, async function (error, results, fields) {
    //     let databaseError;
    //     if (error) throw error;
    //     let i=0;
    //     let alreadyReg = false;
        // for(i=0; i<results.length; i++) {
        //     if(member.email == results[i].email) {
        //         alreadyReg = true;
        //         break;
        //     }            
        // }
        // if (alreadyReg) {
        //     console.log("Member already Registered.");
        //     res.status(400).send('Member already Registered.');
        //     return;
        // } 
        // else 
        // addProposer(res,id,member)
        
    // });   
});

function addProposer(res,id, member) {
    const proposer = [id, member.proposer.name, member.proposer.memNo , 
        member.proposer.address ,member.proposer.contactNo];

    connection.query(`INSERT INTO proposers (proposerID, name,membershipNo,address,contactNo) \
    VALUES (?,?,?,?,?)` , proposer, (error, results, fields) => {

        if(error) {
            res.status(404).send(error);
            console.log('AddPropoerError', error)
            return 
        }
        console.log('Proposer Saved')
        addSeconder(res,id,member)

    });
}

function addSeconder(res,id,member) {
    const seconder = [id, member.seconder.name, member.seconder.memNo , 
        member.seconder.address ,member.seconder.contactNo];

    connection.query(`INSERT INTO seconders (seconderID, name,membershipNo,address,contactNo) \
    VALUES (?,?,?,?,?)` , seconder, (error, results, fields) => {

        if(error) {
            res.status(404).send(error);
            console.log('AddSeconderError', error)
            return 
        }
        console.log('Seconder Saved')
        addMember(res,id,member)
    });
}

function addMember(res,id,member) {

    const memberData = member.memberData

    const resAddrs = `${memberData.resAddOne}, ${memberData.resAddTwo }, ${memberData.resAddThree}, ${memberData.resAddFour}, ${memberData.resAddFive}` ;
    const perAddrs =   `${memberData.perAddOne}, ${memberData.perAddTwo} , ${memberData.perAddThree}, ${memberData.perAddFour}, ${memberData.perAddFive}`;
    const offAddrs =  `${memberData.offAddrslineOne}, ${memberData.offAddrslineTwo}, ${memberData.offAddrslineThree}, ${memberData.offAddrslineFour}, ${memberData.offAddrslineFive}`;

    function validAddress(memberData) {

        if(memberData.sendingAddrs === "Residence") return resAddrs
        else if(memberData.sendingAddrs === "Permanent") return perAddrs
        else if(memberData.sendingAddrs === "Official") return offAddrs
    }
    const validAddrs = validAddress(memberData)

    // const official = [id, memberData.designation, memberData.division , memberData.placeWork, memberData.offMobile, 
    // memberData.offLandNo, memberData.offFax, memberData.offEmail, offAddrs];

    let enroll ;
    let applied ;
    if(memberData.enrollDate) {
        enroll = new Date(memberData.enrollDate).toISOString()
    }
    if(memberData.appliedDate){
        let today = new Date();
        applied = new Date().toISOString()
    }
    
    //*****************  memberDataFolioNo  needed ***********************
    
    const memberDataArr = [ id ,  member.membershipNo , memberData.gradeOfMem, memberData.section , memberData.status ,  enroll , applied, memberData.council,
        '' , memberData.title , memberData.nameWinitials , memberData.nameInFull , memberData.firstName , memberData.lastName , 
        memberData.gender, memberData.dob, memberData.nic,  memberData.mobileNo, memberData.landNo, memberData.email, resAddrs, perAddrs,  
        validAddrs , memberData.designation, memberData.division , memberData.placeWork, memberData.offMobile, 
        memberData.offLandNo , memberData.offFax , memberData.offEmail , offAddrs , memberData.memBefore , memberData.memFrom , memberData.memTo ,
        memberData.profession , memberData.fieldOfSpecial[0] , memberData.fieldOfSpecial[1] , 
        memberData.fieldOfSpecial[2] , memberData.fieldOfSpecial[3] , memberData.fieldOfSpecial[4], memberData.lastPaidForYear, memberData.arrearstoPay , id, id
    ]
    memberFirstName = memberDataArr[11]

    connection.query(`INSERT INTO members (memberID , membershipNo , gradeOfMembership ,section ,status ,enrollDate , appliedDate ,councilPosition, memberFolioNo , \
        title , nameWinitials , fullName , commonFirst , commomLast , gender , dob , nic , mobileNo , fixedNo , email , resAddrs , perAddrs , sendingAddrs,\
        designation , department , placeOfWork , offMobile , offLand , offFax , offEmail , offAddrs , memberBefore , memberFrom , memberTo ,\
        profession , specialization1 , specialization2 , specialization3 , specialization4 , specialization5, lastPaidForYear, arrearsConti, proposerID , seconderID\
        )\
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,(SELECT proposerID FROM proposers WHERE proposerID='${id}'),\
        (SELECT seconderID FROM seconders WHERE seconderID='${id}'))` , memberDataArr, (error, results, fields) => {
        // (error) ? res.status(404).send(error) : addResAddress()
            if(error) {
                res.status(404).send(error);
                console.log("Member Error",error)
                return
            }
            console.log("Member Saved")
            addAcademic(id,res,member)
        // console.log(id)        
    });
}

function addAcademic(id,res,member) {
    
    let academicData = [];
    var i;
    let isError = false;
    for(i=0; i<member.memberData.academic.length; i++) 
    {
        
        academicData[i] = [member.memberData.academic[i].year, member.memberData.academic[i].degree , member.memberData.academic[i].disciplines, 
                member.memberData.academic[i].uni, id] ;

        connection.query(`INSERT INTO member_academic (year,degree,disciplines,university,memberID)\
            VALUES (?,?,?,?,(SELECT memberID FROM members WHERE memberID = '${id}'))` , 
            academicData[i], (error, results, fields) => {

            
                if(error) {
                    console.log('AcademicError', error)
                    return res.status(404).send(error)
                    
                }
                    
            }
        );

    }   
            
    // if(i === (member.academic.length-1)) 
    console.log("Aca Saved")
    console.log("acc type", member.memberData.status)
    // res.status(200).send("Successfully Added Member " + memberFirstName)  
    console.log("memmmmno", member.memberData.membershipNo)
    sendEmail(member.memberData.email, member.membershipNo, member.memberData.section, member.memberData.status)
    if(member.memberData.status == "Applicant") {
        updateApplicant(id, res)
    }
    else {
        
        res.status(200).json({
            msg: "Application Succesfully Submitted"
        })
        return
    }
    
    
}

function updateApplicant(id, res) {

    connection.query(`UPDATE applicants
    SET type='Applied' WHERE applicantID='${id}';`, (error, results, fields) => {

        if(error) {
            res.status(404).send(error);
            console.log(error)
            return 
        }
        console.log("Username for token", username)
        console.log("ID for token", id)
        const token = jwt.sign({id : id, username: username, type: 'Applied'}, env.jewtKey)
        res.status(200).json({
            jwt: token,
            type: 'Applied',
            msg: "Application Succesfully Submitted"
        })    

    });
    
}

let transporter = nodemailer.createTransport(nodemailMailGun(env.emailAuth));

let mailContent={
    from: 'slaasmembermanagement@gmail.com',
    to: '',
    subject: '',
    text: '',
    // html: '<h1>You can send html formatted content using Nodemailer with attachments</h1>',
    // attachments: [
    //     {
    //         filename: 'image1.png',
    //         path: appRoot + '/profilePics/image1.png'
    //     }
    // ]
};

function sendEmail(e, memNo, section, status) {

    console.log("memno", memNo)

    connection.query(`SELECT * FROM emailbodies WHERE type='Registration Success';`

    , async function (error, results, fields) {
        if (error) throw error;
        let subject = results[0].subject
        let body = results[0].body

        let memNoAdded = body.replace("@memNo", `${memNo}/${section}`)

        mailContent.to = e
        mailContent.subject = subject
        mailContent.text = memNoAdded

        transporter.sendMail(mailContent, function(error, data){
            if(error){

                console.log(`Mail Failed`, error);
                // res.status(404).send(`Registration Success Email Failed`)
            }
            else{
                console.log(`Email send successfully`);
                // res.status(200).send(`Email successfully`)
                        
            }
        });
    });

    
}

// function addPersonal(member,res,id,member) {
//     const resAddrs = `${member.resAddOne}, ${member.resAddTwo }, ${member.resAddThree}, ${member.resAddFour}, 
//     ${member.resAddFive}` ;
//     const perAddrs =   `${member.perAddOne}, ${member.perAddTwo} , ${member.perAddThree}, ${member.perAddFour}, 
//     ${member.perAddFive}`;

//     const personal = [id, member.title, member.nameWinitials, member.nameInFull, member.firstName, member.lastName, 
//     member.gender, member.dob, member.nic,  member.mobileNo, member.landNo, member.email, resAddrs, perAddrs];
        
//     memberFirstName = personal[4]

//     connection.query(`INSERT INTO member_personal (personalID, title, nameWinitials, fullName, commonFirst, commomLast, gender, dob, nic, mobileNo, fixedNo, email, resAddrs, perAddrs)\
//     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)` , personal, (error, results, fields) => {
//         // (error) ? res.status(404).send(error) : addResAddress()
//             if(error) {
//                 res.status(404).send(error);
//                 return 
//             }
//             addOfficial(res,id,member)
//         // console.log(id)
            
//     });
    
// };

// function addOfficial(res,id,member) {
//     const offAddrs =  `${member.offAddrslineOne}, ${member.offAddrslineTwo}, ${member.offAddrslineThree}, 
//     ${member.offAddrslineFour}, ${member.offAddrslineFive}`;

//     const official = [id, member.designation, member.division , member.placeWork, member.offMobile, 
//     member.offLandNo, member.offFax, member.offEmail, offAddrs];

//     connection.query(`INSERT INTO member_official (officialID, designation,department,placeOfWork,offMobile,offLand,\
//         offFax,offEmail,offAddrs)\
//     VALUES (?,?,?,?,?,?,?,?,?)` , official, (error, results, fields) => {
        
//         // (!error) ? res.status(200).send("Successfully Added Member " + memberFirstName) : res.status(404).send(error);
//         if(error) {
//             res.status(404).send(error);
//             // connection.query(`DELETE FROM member_personal WHERE personalID='${id}'`);
//             deleteRow('member_personal', "personalID", id);
//             return 
//         }
//         addProfessional(res,id,member)
            
//         // if(error) databaseError = error;
    
//     });
// }
// function addProfessional(res,id,member) {
//     const professional = [id, member.profession, member.fieldOfSpecial[0] , member.fieldOfSpecial[1] , 
//     member.fieldOfSpecial[2] , member.fieldOfSpecial[3] , member.fieldOfSpecial[4]];

//     connection.query(`INSERT INTO member_professional (professionalID, profession,specialization1,specialization2,specialization3,specialization4,\
//         specialization5)\
//     VALUES (?,?,?,?,?,?,?)` , professional, (error, results, fields) => {

//         if(error) {
//             res.status(404).send(error);
//             // connection.query(`DELETE FROM member_personal WHERE personalID='${id}'`);
//             // connection.query(`DELETE FROM member_official WHERE officialID='${id}'`);
//             deleteRow('member_personal', 'personalID', id);
//             deleteRow('member_official', 'officialID', id);
//             return 
//         }
//         addAcademic(id,res,member)

//     });
// }






// function addMembership(res,id,member) {
//     const membership = [id, member.gradeOfMem, member.section , member.memBefore , 
//         member.memFrom , member.memTo , member.sendingAddrs, id, id] ;

//     connection.query(`INSERT INTO member_membership (membershipID, gradeOfMembership,section,memberBefore,memberFrom,memberTo,\
//         sendingAddrs,proposerID,seconderID)\
//     VALUES (?,?,?,?,?,?,?,(SELECT proposerID FROM proposers WHERE proposerID='${id}'),\
//     (SELECT seconderID FROM seconders WHERE seconderID='${id}'))` , membership, (error, results, fields) => {

//         if(error) {
//             res.status(404).send(error);
//             // connection.query(`DELETE FROM member_personal WHERE personalID='${id}'`);
//             // connection.query(`DELETE FROM member_official WHERE officialID='${id}'`);
//             // connection.query(`DELETE FROM member_academic WHERE professionalID='${id}'`);
//             // connection.query(`DELETE FROM member_professional WHERE professionalID='${id}'`);
//             // connection.query(`DELETE FROM proposers WHERE proposerID='${id}'`);
//             // connection.query(`DELETE FROM seconders WHERE seconderID='${id}'`);
//             deleteRow('member_personal', 'personalID', id);
//             deleteRow('member_official', 'officialID', id);
//             deleteRow('member_academic', 'professionalID', id);
//             deleteRow('member_professional', 'professionalID', id);
//             deleteRow('proposers', 'proposerID', id);
//             deleteRow('seconders', 'seconderID', id);
//             return 
//         }
//         addMember(res,id)

//     });
// }

// function addPayment(res,id) {
//     if(member.status === 'member') {
//     const payment = [id, paymentData.paymentDoneDate, paymentData.receivedData , paymentData.paymentMethod , 
//         paymentData.amount , paymentData.bank , paymentData.branch, paymentData.accountNo, paymentData.description,id] ;

//     connection.query(`INSERT INTO payments (paymentID, paidDate,recordedDate,method,amount,bank,\
//         branch,accountNo,description, memberID)\
//     VALUES (?,?,?,?,?,?,?,?,?,(SELECT memberID FROM members WHERE memberID='${id}'))` , payment, (error, results, fields) => {

//         if(error) {
//             res.status(404).send(error);
//             // connection.query(`DELETE FROM member_personal WHERE personalID='${id}'`);
//             // connection.query(`DELETE FROM member_official WHERE officialID='${id}'`);
//             // connection.query(`DELETE FROM member_membership WHERE membershipID='${id}'`);
//             // connection.query(`DELETE FROM member_academic WHERE professionalID='${id}'`);
//             // connection.query(`DELETE FROM member_professional WHERE professionalID='${id}'`);
//             // connection.query(`DELETE FROM proposers WHERE proposerID='${id}'`);
//             // connection.query(`DELETE FROM seconders WHERE seconderID='${id}'`);
//             deleteRow('member_personal', 'personalID', id);
//             deleteRow('member_official', 'officialID', id);
//             deleteRow('member_academic', 'professionalID', id);
//             deleteRow('member_professional', 'professionalID', id);
//             deleteRow('member_membership', 'membershipID', id);
//             deleteRow('proposers', 'proposerID', id);
//             deleteRow('seconders', 'seconderID', id);
//             return 
//         }   
//         addMember(res,id)
//     });
//     }
//     else {
//         connection.query(`INSERT INTO payments (paymentID) VALUES ('${id}') ` , (error, results, fields) => {
    
//             if(error) {
//                 res.status(404).send(error);
//                 // connection.query(`DELETE FROM member_personal WHERE personalID='${id}'`);
//                 // connection.query(`DELETE FROM member_official WHERE officialID='${id}'`);
//                 // connection.query(`DELETE FROM member_membership WHERE membershipID='${id}'`);
//                 // connection.query(`DELETE FROM member_academic WHERE professionalID='${id}'`);
//                 // connection.query(`DELETE FROM member_professional WHERE professionalID='${id}'`);
//                 // connection.query(`DELETE FROM proposers WHERE proposerID='${id}'`);
//                 // connection.query(`DELETE FROM seconders WHERE seconderID='${id}'`);
//                 deleteRow('member_personal', 'personalID', id);
//                 deleteRow('member_official', 'officialID', id);
//                 deleteRow('member_academic', 'professionalID', id);
//                 deleteRow('member_professional', 'professionalID', id);
//                 deleteRow('member_membership', 'membershipID', id);
//                 deleteRow('proposers', 'proposerID', id);
//                 deleteRow('seconders', 'seconderID', id);
//                 return 
//             }   
//             addMember(res,id)
//         });
//     }
// }

// function addMember(res,id) {
//     let enroll ;
//     let applied ;
//     if(member.enrollDate) {
//         enroll = new Date();
//     }
//     else if(member.appliedDate){
//         applied = new Date();
//     }
//     const member = [id, member.status, enroll , applied , '' , '' , '', '', id, id, id, id, id] ;

//     connection.query(`INSERT INTO members (memberID, status, enrollDate, appliedDate, councilPosition, memberFolioNo, membershipNo,\
//         memPaidLast, personalID, officialID, professionalID, paymentID, membershipID)\
//     VALUES (?,?,?,?,?,?,?,?, (SELECT personalID FROM member_personal WHERE personalID='${id}'), 
//     (SELECT officialID FROM member_official WHERE officialID='${id}'), 
//     (SELECT professionalID FROM member_professional WHERE professionalID='${id}'), 
//     (SELECT paymentID FROM payments WHERE paymentID='${id}'),
//     (SELECT membershipID FROM member_membership WHERE membershipID='${id}'))` , 
    
    
//     member, (error, results, fields) => {

//         if(error) {
//             res.status(404).send(error);
//             // connection.query(`DELETE FROM payments WHERE paymentID='${id}'`);
//             // connection.query(`DELETE FROM member_personal WHERE personalID='${id}'`);
//             // connection.query(`DELETE FROM member_official WHERE officialID='${id}'`);
//             // connection.query(`DELETE FROM member_membership WHERE membershipID='${id}'`);
//             // connection.query(`DELETE FROM member_academic WHERE professionalID='${id}'`);
//             // connection.query(`DELETE FROM member_professional WHERE professionalID='${id}'`);
//             // connection.query(`DELETE FROM proposers WHERE proposerID='${id}'`);
//             // connection.query(`DELETE FROM seconders WHERE seconderID='${id}'`);
//             deleteRow('payments', 'paymentID', id);
//             deleteRow('member_personal', 'personalID', id);
//             deleteRow('member_official', 'officialID', id);
//             deleteRow('member_academic', 'professionalID', id);
//             deleteRow('member_professional', 'professionalID', id);
//             deleteRow('member_membership', 'membershipID', id);
//             deleteRow('proposers', 'proposerID', id);
//             deleteRow('seconders', 'seconderID', id);
//             return 
//         }   
//         res.status(200).send("Successfully Added Member " + memberFirstName)
//     });
// }



function deleteRow(table, key, id) {

    connection.query(`DELETE FROM ${table} WHERE ${key}='${id}'`, (error) => {
        if(error) console.log(error)
    })
    
}


// function validateMember(member) {
//     const schema = Joi.object({
//         userName: Joi.string().min(5).max(50).required(),
//         officeID: Joi.string().min(5).max(255),
//         email: Joi.string().min(5).max(255).required().email(),
//         password: Joi.string().min(5).max(255).required(),
//         accountType: Joi.string().min(3).max(255).required()
        
//     });
//     return schema.validate(member);
// }

module.exports = router;