function addPersonal(personalData,res,id) {
    const personal = [personalData.title, personalData.nameWinitials, personalData.nameInFull, personalData.firstName, personalData.lastName, 
        personalData.gender, personalData.dob, personalData.nic,  personalData.mobileNo, personalData.landNo, personalData.email, id];
                
        connection.query(`INSERT INTO member_personal (title,nameWinitials,fullName,commonFirst,commomLast,gender,dob,nic,mobileNo,fixedNo,email,resAddrsID)\
        VALUES (?,?,?,?,?,?,?,?,?,?,?,(SELECT resAddrsID FROM member_res_addresses WHERE resAddrsID=${id}))` , personal, (error, results, fields) => {
            // (error) ? res.status(404).json(error) : addResAddress()
            // if(error) databaseError = error;
            (!error) ? res.status(200).send("Successfully Added Member " + personal[3]) : res.status(404).json(error);
            // console.log(id)
            
        });
};

function addResAddress(personalData,res,id) {
    const personalAddrs = [id, personalData.resAddOne, personalData.resAddTwo , personalData.resAddThree, personalData.resAddFour, 
    personalData.resAddFive];
    connection.query("INSERT INTO member_res_addresses (resAddrsID, lineOne,lineTwo,lineThree,lineFour,lineFive)\
    VALUES (?,?,?,?,?,?)" , personalAddrs, (error, results, fields) => {
        if(error) return res.status(404).json(error)
        addPersonal(personalData,res,id)
        
        // if(error) databaseError = error;

    });
};

exports.addPersonal = addPersonal;
exports.addResAddress = addResAddress;