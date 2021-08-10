const config = require('config');
const express = require('express');
const app = express();
const mysql = require('mysql');
const cors = require('cors')
const envVariables = require('./envVariables')

const dbConnection = require('./database')

dbConnection.connect((err) => {
    if(!err) return console.log("Successfully Connected to the MySql Database");

    else console.log("Database Connection Failed" , JSON.stringify(err));
});

var path = require('path');
global.appRoot = path.resolve(__dirname);

const users = require('./routes/userRoute');
const userLogin = require('./routes/loginUsers')
const members = require('./routes/memberRoute');
const uploadMembers = require('./routes/csvUploadRoute');
const viewMembers = require('./routes/viewMemberRoute');
const searchMember = require('./routes/searchMembersRoute')
const addPayment = require('./routes/addPaymentRoute')
const viewPayments = require('./routes/viewPayments')
const viewProfile = require('./routes/viewProfile')
const profilePicUpload = require('./routes/uploadProfilePic')
const viewProfilePic = require('./routes/viewProfilePic')
const proposerAseconder = require('./routes/getProposerSeconderRoute')
const getMembershipNo = require('./routes/getMembershipNo')
const memberForReceipt = require('./routes/getMemberForReceipt')
const terminateMember = require('./routes/terminateMemberRoute')
const paymentsHistory = require('./routes/paymentsHistoryRoute')
const sendMails = require('./routes/sendEmailRoute')
const outdated = require('./routes/getOutdatedMemberships')
const filterPayments = require('./routes/filterPayments')
const calculateArrears = require('./routes/calculateArrears')
const grades = require('./routes/gradesRoute')
const sections = require('./routes/sectionsRoute')
const continueMembership = require('./routes/continueTerminatedRoute')
const terminationSettings = require('./routes/terminateSettingsRoute')
const getCommitties = require('./routes/CommittiesRoute')
const getCommMembers = require('./routes/committyMembersRoute')
const MemberForSetCommity = require('./routes/MemberForCommittee')
const updateMemberData = require('./routes/updateMemberProfileData')
const getTerminated = require('./routes/getTerminatedMembers')
const sendReminderMails = require('./routes/sendReminderEmails')
const autoTerminate = require('./routes/autoTerminateMembers')
const getMailSettingsData = require('./routes/emailSettingsData')
const calculateArrearsOne = require('./routes/calculateOneArrears')


app.use(cors())
app.use(express.json());
app.use('/slaas/api/login-user', userLogin);
app.use('/slaas/api/register-user', users);
app.use('/slaas/api/user/search', searchMember);
app.use('/slaas/api/user/register-member', members);
app.use('/slaas/api/user/add-profilepic', profilePicUpload);
app.use('/slaas/api/user/get-profilepic', viewProfilePic);
app.use('/slaas/api/user/upload-members', uploadMembers);
app.use('/slaas/api/user/view/members', viewMembers);
app.use('/slaas/api/user/member/profile', viewProfile)
app.use('/slaas/api/user/payment', addPayment);
app.use('/slaas/api/user/refrees', proposerAseconder);
app.use('/slaas/api/user/membershipNo', getMembershipNo)
app.use('/slaas/api/user/receipt', memberForReceipt)
app.use('/slaas/api/user/payment/view', viewPayments);
app.use('/slaas/api/user/payment/filter', filterPayments);
app.use('/slaas/api/user/mails', sendMails);
app.use('/slaas/api/user/terminate-member', terminateMember);
app.use('/slaas/api/user/continue-terminated', continueMembership)
app.use('/slaas/api/user/member/payment-records', paymentsHistory);
app.use('/slaas/api/user/outdated', outdated);
app.use('/slaas/api/user/terminated', getTerminated);
app.use('/slaas/api/user/calculate-arrears', calculateArrears);
app.use('/slaas/api/user/grades', grades);
app.use('/slaas/api/user/sections', sections);
app.use('/slaas/api/user/terminate-settings', terminationSettings);
app.use('/slaas/api/user/committies', getCommitties);
app.use('/slaas/api/user/members/commity', getCommMembers);
app.use('/slaas/api/user/commity/set', MemberForSetCommity);
app.use('/slaas/api/user/member/update', updateMemberData);
app.use('/slaas/api/user/reminder-mails', sendReminderMails);
app.use('/slaas/api/user/auto-terminate', autoTerminate);
app.use('/slaas/api/user/mailsettings', getMailSettingsData);
app.use('/slaas/api/user/cal-arrears', calculateArrearsOne);


app.get('/slaas/api/',(req,res) => {
    
    res.status(200).send('SLAAS API is Ready')
    res.set('Content-Type', 'text/html');
    res.send(Buffer.from('<h2>SLAAS API is Ready</h2>'));

});


const port = process.env.PORT || 3002;
app.listen(port, () => console.log(`Listening on port ${port} ...`));

// module.exports = connection;


