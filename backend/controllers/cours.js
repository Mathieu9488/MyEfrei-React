const { getEleveById } = require('./eleves.js');
let cours = [];

const getCours = (req, res) => {
    res.json(cours);
};

const addCour = async (req, res) => {
    const { name, students } = req.body;
    if (!name || !Array.isArray(students)) {
        return res.status(400).json({ error: 'Name & list of students required.' });
    }
    const newClass = { name, students: [] };
    
    for (const studentId of students) {
        const student = getEleveById({ params: { id: studentId } }, null, true);
        if (student) {
            newClass.students.push(student);
        } else {
            return res.status(404).json({ error: `ID student ${studentId} not found` });
        }
    }

    cours.push(newClass);
    res.status(201).json(newClass);
};

module.exports = { getCours, addCour };