const express = require("express");
const { v1: uuidv1 } = require("uuid");
const env = require("../envVariables");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const nodemailMailGun = require("nodemailer-mailgun-transport");

const router = express.Router();

const connection = require("../database");

let id = "";
let member = "";
let username = "";
let memNo = "";

router.post("/", async (req, res) => {
  member = req.body;
  username = req.body.username;
  memNo = req.body.membershipNo;

  if (req.body.memberID) {
    id = req.body.memberID;
  } else {
    id = uuidv1();
  }

  //check member is already registered

  connection.query(
    `SELECT memberID, membershipNo, nic FROM members WHERE membershipNo='${member.membershipNo}' OR nic='${member.memberData.nic}'`,
    async function (error, results, fields) {
      if (error) throw error;

      if (results.length > 0)
        return res.status(400).send("Member Already Registered. ");
      else addProposer(res, id, member);
    }
  );
});

function addProposer(res, id, member) {
  const proposer = [
    id,
    member.proposer.name,
    member.proposer.memNo,
    member.proposer.address,
    member.proposer.contactNo,
  ];

  //add proposer data

  connection.query(
    `INSERT INTO proposers (proposerID, name,membershipNo,address,contactNo) \
    VALUES (?,?,?,?,?)`,
    proposer,
    (error, results, fields) => {
      if (error) {
        throw error;
      }
      addSeconder(res, id, member);
    }
  );
}

function addSeconder(res, id, member) {
  const seconder = [
    id,
    member.seconder.name,
    member.seconder.memNo,
    member.seconder.address,
    member.seconder.contactNo,
  ];

  //add seconder data

  connection.query(
    `INSERT INTO seconders (seconderID, name,membershipNo,address,contactNo) \
    VALUES (?,?,?,?,?)`,
    seconder,
    (error, results, fields) => {
      if (error) {
        throw error;
      }
      addMember(res, id, member);
    }
  );
}

function addMember(res, id, member) {
  const memberData = member.memberData;

  //const resAddrs = `${memberData.resAddOne}, ${memberData.resAddTwo }, ${memberData.resAddThree}, ${memberData.resAddFour}, ${memberData.resAddFive}` ;
  const resAddrs = memberData.residenceAddress;
  //const perAddrs =   `${memberData.perAddOne}, ${memberData.perAddTwo} , ${memberData.perAddThree}, ${memberData.perAddFour}, ${memberData.perAddFive}`;
  const perAddrs = memberData.permanentAddress;
  //const offAddrs =  `${memberData.offAddrslineOne}, ${memberData.offAddrslineTwo}, ${memberData.offAddrslineThree}, ${memberData.offAddrslineFour}, ${memberData.offAddrslineFive}`;
  const offAddrs = memberData.officeAddress;

  function validAddress(memberData) {
    if (memberData.sendingAddrs === "Residence") return resAddrs;
    else if (memberData.sendingAddrs === "Permanent") return perAddrs;
    else if (memberData.sendingAddrs === "Official") return offAddrs;
  }
  const validAddrs = validAddress(memberData);

  let enroll;
  let applied;
  if (memberData.enrollDate) {
    enroll = new Date(memberData.enrollDate).toISOString();
  }
  if (memberData.appliedDate) {
    let today = new Date();
    applied = new Date().toISOString();
  }

  const memberDataArr = [
    new Date().toDateString(),
    id,
    member.membershipNo,
    memberData.gradeOfMem,
    memberData.section,
    memberData.status,
    enroll,
    applied,
    memberData.council,
    "",
    memberData.title,
    memberData.nameWinitials,
    memberData.nameInFull,
    memberData.firstName,
    memberData.lastName,
    memberData.gender,
    memberData.dob,
    memberData.nic,
    memberData.mobileNo,
    memberData.landNo,
    memberData.email,
    resAddrs,
    perAddrs,
    validAddrs,
    memberData.designation,
    memberData.division,
    memberData.placeWork,
    memberData.offMobile,
    memberData.offLandNo,
    memberData.offFax,
    memberData.offEmail,
    offAddrs,
    memberData.memBefore,
    memberData.memFrom,
    memberData.memTo,
    memberData.profession,
    memberData.fieldOfSpecial[0],
    memberData.fieldOfSpecial[1],
    memberData.fieldOfSpecial[2],
    memberData.fieldOfSpecial[3],
    memberData.fieldOfSpecial[4],
    memberData.lastPaidForYear,
    memberData.arrearstoPay,
    id,
    id,
  ];
  memberFirstName = memberDataArr[11];

  //add member data

  connection.query(
    `INSERT INTO members (arrearsUpdated, memberID , membershipNo , gradeOfMembership ,section ,status ,enrollDate , appliedDate ,councilPosition, memberFolioNo , \
        title , nameWinitials , fullName , commonFirst , commomLast , gender , dob , nic , mobileNo , fixedNo , email , resAddrs , perAddrs , sendingAddrs,\
        designation , department , placeOfWork , offMobile , offLand , offFax , offEmail , offAddrs , memberBefore , memberFrom , memberTo ,\
        profession , specialization1 , specialization2 , specialization3 , specialization4 , specialization5, lastPaidForYear, arrearsConti, proposerID , seconderID\
        )\
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,(SELECT proposerID FROM proposers WHERE proposerID='${id}'),\
        (SELECT seconderID FROM seconders WHERE seconderID='${id}'))`,
    memberDataArr,
    (error, results, fields) => {
      if (error) {
        throw error;
      }
      addAcademic(id, res, member);
    }
  );
}

function addAcademic(id, res, member) {
  let academicData = [];
  var i;
  let isError = false;
  for (i = 0; i < member.memberData.academic.length; i++) {
    academicData[i] = [
      member.memberData.academic[i].year,
      member.memberData.academic[i].degree,
      member.memberData.academic[i].disciplines,
      member.memberData.academic[i].uni,
      id,
    ];

    //add academic data

    connection.query(
      `INSERT INTO member_academic (year,degree,disciplines,university,memberID)\
            VALUES (?,?,?,?,(SELECT memberID FROM members WHERE memberID = '${id}'))`,
      academicData[i],
      (error, results, fields) => {
        if (error) {
          throw error;
        }
      }
    );
  }

  //send registration success email

  sendEmail(
    member.memberData.email,
    member.membershipNo,
    member.memberData.section,
    member.memberData.status
  );
  if (member.memberData.status == "Applicant") {
    updateApplicant(id, res);
  } else {
    res.status(200).json({
      msg: "Member Successfully Registered",
    });
    return;
  }
}

function updateApplicant(id, res) {
  connection.query(
    `UPDATE applicants
    SET type='Applied' WHERE applicantID='${id}';`,
    (error, results, fields) => {
      if (error) {
        throw error;
      }
      const token = jwt.sign(
        { id: id, username: username, type: "Applied" },
        env.jewtKey
      );
      res.status(200).json({
        jwt: token,
        type: "Applied",
        msg: "Application Succesfully Submitted",
      });
    }
  );
}

let transporter = nodemailer.createTransport(nodemailMailGun(env.emailAuth));

let mailContent = {
  from: process.env.SENDING_MAIL,
  to: "",
  subject: "",
  text: "",
};

function sendEmail(e, memNo, section, status) {
  connection.query(
    `SELECT * FROM emailbodies WHERE type='Registration Success';`,

    async function (error, results, fields) {
      if (error) throw error;
      let subject = results[0].subject;
      let body = results[0].body;

      let memNoAdded = body.replace("@memNo", `${memNo}/${section}`);

      mailContent.to = e;
      mailContent.subject = subject;
      mailContent.text = memNoAdded;

      transporter.sendMail(mailContent, function (error, data) {
        if (error) {
          throw error;
        }
      });
    }
  );
}

module.exports = router;
