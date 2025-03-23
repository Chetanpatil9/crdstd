const db = require('../config/connection');

// Add a new student
const addnewstudent = async (req, res) => {
    try {
        // console.log(' Received body:', req.body); 

        const { name, email, mobile, age } = req.body;
        if (!name || !email || !mobile || !age) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const result = await db.query(
            'INSERT INTO studentinfo (name, email, mobile, age) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, email, mobile, age]
        );
        res.status(201).json({ message: 'Student added successfully', student: result.rows[0] });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
};

// Update student
const updatestudent = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, mobile, age } = req.body;
        const result = await db.query(
            'UPDATE studentinfo SET name=$1, email=$2, mobile=$3, age=$4 WHERE id=$5 RETURNING *',
            [name, email, mobile, age, id]
        );
        res.json({ message: 'Student updated successfully', student: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};

// Delete student
const deletestudent = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM studentinfo WHERE id=$1', [id]);
        res.json({ message: 'Student deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};

// Get a single student
const getsinglestudent = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await db.query('SELECT * FROM studentinfo WHERE id=$1', [id]);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};

// Get all students
const getallstudent = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM studentinfo ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};

// Add data for a student
const addstudentmarks = async (req, res) => {
    try {
        const { student_id, subject, marks } = req.body;
        const result = await db.query(
            'INSERT INTO marks (student_id, subject, marks) VALUES ($1, $2, $3) RETURNING *',
            [student_id, subject, marks]
        );
        res.status(201).json({ message: 'Marks added successfully', marks: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};

// Get data of a single student
const getstudentmarks = async (req, res) => {
    try {
        const { sid } = req.params;
        const result = await db.query('SELECT * FROM marks WHERE student_id=$1', [sid]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};

// Get data of all students
const getallstudentmarks = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM marks');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
};

module.exports = {
    addnewstudent,
    updatestudent,
    deletestudent,
    getallstudent,
    getsinglestudent,
    addstudentmarks,
    getstudentmarks,
    getallstudentmarks
};
