const express = require("express");
const router = express.Router();

const connection = require("../database");

router.get("/get-invoice", async (req, res, next) => {
  //generate new invoice no

  // try {

  connection.query(
    `SELECT invoiceNo FROM payments ORDER BY paymentID DESC LIMIT 1`,
    async function (error, results, fields) {
      if (error) throw error;

      const invoiceNo = results[0].invoiceNo;
      const newInvoiceNo = invoiceNo + 1;

      res.status(200).send(`${newInvoiceNo}`);
    }
  );

  // }
  // catch(e) {
  //     next()
  // }
});

router.post("/", async (req, res, next) => {
  // try{

  const paymentData = req.body.paymentData;
  const previousRecords = req.body.previousRecords;

  //check whether the member available
  connection.query(
    `SELECT memberID FROM members WHERE memberID='${paymentData.paymentRecord.memberID}'`,
    async function (error, results, fields) {
      if (error) throw error;

      if (results.length > 1) {
        res.status(404).send("More than 1 member found. Payment Rejected");
        return;
      }
      if (results.length === 0) {
        res.status(400).send("No member record. Payment Rejected");
        return;
      }
      const memberID = results[0].memberID;
      addPayment(res, paymentData, previousRecords, memberID);
    }
  );
  // }
  // catch(e) {
  //     next()
  // }
});

function addPayment(res, paymentData, previousRecords, memberID) {
  // try{

  const paymentDataSave = [
    paymentData.invoiceNo,
    paymentData.dateTimeSave,
    paymentData.today,
    paymentData.time,
    paymentData.paymentRecord.paymentMethod,
    paymentData.paymentRecord.yearOfPayment,
    paymentData.paymentRecord.admissionFee,
    paymentData.paymentRecord.arrearsFee,
    paymentData.paymentRecord.yearlyFee,
    paymentData.paymentRecord.idCardFee,
    paymentData.total,
    paymentData.paymentRecord.description,
    paymentData.totalWords,
    memberID,
  ];

  //record payment

  connection.query(
    `INSERT INTO payments (invoiceNo, timeStamp, date, time, type, yearOfPayment, admission, arrears, yearlyFee, idCardFee, total ,description \
        ,totalWords, memberID) \
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    paymentDataSave,
    (error, results, fields) => {
      if (error) throw error;

      // ******************************* arrears calculation reserved *******************
      res.status(200).json({
        msg: "Payment Successfully Recorded",
      });
      // updateArrears(res, paymentData, previousRecords, memberID)
    }
  );

  // }
  // catch(e) {
  //     console.log("Add Payment Error : ", e)
  //     res.status(500).send(error);
  // }
}

function updateArrears(res, paymentData, previousRecords, memberID) {
  // try {

  let arrearsPaid = paymentData.paymentRecord.arrearsFee
    ? parseInt(paymentData.paymentRecord.arrearsFee)
    : 0;
  let arrearsContinued = previousRecords.arrearsConti
    ? parseInt(previousRecords.arrearsConti)
    : 0;

  let newArrears = 0;
  let lastYear = "";

  newArrears = arrearsContinued - arrearsPaid;
  if (newArrears < 0) newArrears = 0;

  let today = new Date();
  todayISO = today.toISOString();

  paymentData.paymentRecord.yearOfPayment
    ? (lastYear = paymentData.paymentRecord.yearOfPayment)
    : (lastYear = previousRecords.lastPaidForYear);

  paymentData.paymentRecord.yearOfPayment
    ? (lastMemPaidDate = todayISO)
    : (lastMemPaidDate = previousRecords.lastMembershipPaid);

  //update arrears

  connection.query(
    `UPDATE members
    SET arrearsConti='${newArrears}', lastPaidForYear='${lastYear}', lastMembershipPaid='${lastMemPaidDate}', 
    memPaidLast='${todayISO}'
    WHERE memberID='${memberID}';`,
    (error, results, fields) => {
      if (error) throw error;

      res.status(200).json({
        msg: "Payment Successfully Recorded",
        data: newArrears.toString(),
      });
      return;
    }
  );

  // }
  // catch(e) {
  //     console.log("Update Arrears Error : ", e)
  //     res.status(500).send(error);
  // }
}

module.exports = router;
