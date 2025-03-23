const express = require('express');
const router = express.Router();
const {
    addnewstudent, updatestudent, deletestudent, getsinglestudent, getallstudent,
    addstudentmarks, getstudentmarks, getallstudentmarks
} = require('../controller/ctrlstudent');

// Student routes
router.post('/addstudent', addnewstudent);
router.put('/updatestudent/:id', updatestudent);
router.delete('/deletestudent/:id', deletestudent);
router.get('/getsinglestudent/:id', getsinglestudent);
router.get('/getallstudent', getallstudent);

// Marks routes  
router.post('/addstudentmarks', addstudentmarks);
router.get('/getstudentmarks/:sid', getstudentmarks);
router.get('/getallstudentmarks', getallstudentmarks);

module.exports = router;
