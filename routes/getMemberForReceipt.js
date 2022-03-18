const express = require("express");
const router = express.Router();

const connection = require("../database");

router.get("/:memNo", async (req, res) => {
  // try {

  //Get member records for receipt

  connection.query(
    `SELECT memberID, membershipNo, gradeOfMembership, nameWinitials, nic, memPaidLast, lastPaidForYear, lastMembershipPaid, arrearsConti, arrearsUpdated
        FROM members
        WHERE membershipNo = "${req.params.memNo}";`,

    async function (error, results, fields) {
      if (error) throw error;

      if (results.length === 0) return res.status(404).send("No Member Found");
      //get grade details
      connection.query(
        `SELECT * FROM grades WHERE grade = "${results[0].gradeOfMembership}";`,

        async function (error, results2, fields) {
          if (error) throw error;

          let lastDate = results[0].memPaidLast
            ? new Date(results[0].memPaidLast).toLocaleDateString()
            : "";
          let lastMembershipPaidDate = results[0].lastMembershipPaid
            ? new Date(results[0].lastMembershipPaid).toLocaleDateString()
            : "";
          results[0].memPaidLast = lastDate;
          results[0].gradeFee = results2[0].membershipFee;

          res.send(results[0]);
        }
      );
    }
  );
  // }
  // catch(e) {
  //     console.log("Get member records for receipt Error : ", e)
  //     res.status(500).send(error);
  // }
});

module.exports = router;
