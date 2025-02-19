const bcrypt = require('bcrypt');

let eleves = [];

const generateId = () => {
    let id;
    id = Math.floor(10000000 + Math.random() * 90000000);
    while (eleves.some(eleve => eleve.id === id)) {
        id = Math.floor(10000000 + Math.random() * 90000000);
    }
    return id;
};

const getEleves = (req, res) => {
    res.json(eleves);
};

const addEleve = async (req, res) => {
    const { name, firstname, classe, cours, password } = req.body;

    if (!name || !firstname || !classe || !password) {
        return res.status(400).json({ error: 'Invalid input: missing fields' });
    }

    const hasNumber = /\d/;
    if (hasNumber.test(name) || hasNumber.test(firstname)) {
        return res.status(400).json({ error: 'Invalid input: name and firstname must not contain numbers' });
    }

    if (typeof name !== 'string') {
        return res.status(400).json({ error: 'Invalid input: name must be a string' });
    }

    if (typeof firstname !== 'string') {
        return res.status(400).json({ error: 'Invalid input: firstname must be a string' });
    }

    if (typeof classe !== 'string') {
        return res.status(400).json({ error: 'Invalid input: classe must be a string' });
    }


    if (!Array.isArray(cours)) {
        return res.status(400).json({ error: 'Invalid input: cours must be an array' });
    }

    if (typeof password !== 'string') {
        return res.status(400).json({ error: 'Invalid input: password must be a string' });
    }

    try {
        const hashedMdp = await bcrypt.hash(password, 10);
        const eleve = { id: generateId(), name, firstname, password: hashedMdp, classe, cours };
        eleves.push(eleve);
        console.log(eleves);
        res.status(201).json(eleve);
    } catch (error) {
        res.status(500).json({ error: 'Error hashing password' });
    }
};

const addEleveList = async (req, res) => {
    const newEleves = req.body;

    if (!Array.isArray(newEleves)) {
        return res.status(400).json({ error: 'Invalid input: body must be an array of students' });
    }

    try {
        for (const eleve of newEleves) {
            const { name, firstname, classe, cours, password } = eleve;

            if (typeof name !== 'string') {
                return res.status(400).json({ error: `Invalid input: name must be a string for student ${JSON.stringify(eleve)}` });
            }

            if (typeof firstname !== 'string') {
                return res.status(400).json({ error: `Invalid input: firstname must be a string for student ${JSON.stringify(eleve)}` });
            }

            if (typeof classe !== 'string') {
                return res.status(400).json({ error: 'Invalid input: classe must be a string' });
            }
        
        
            if (!Array.isArray(cours)) {
                return res.status(400).json({ error: 'Invalid input: cours must be an array' });
            }

            if (typeof password !== 'string') {
                return res.status(400).json({ error: `Invalid input: password must be a string for student ${JSON.stringify(eleve)}` });
            }

            const hashedMdp = await bcrypt.hash(password, 10);
            eleves.push({ id: generateId(), name, firstname, password: hashedMdp, classe, cours });
        }
        console.log(eleves);
        res.status(201).json(eleves);
    } catch (error) {
        res.status(500).json({ error: 'Error hashing passwords' });
    }
};

const deleteEleve = (req, res) => {
    const { id } = req.body;
    if (typeof id !== 'number') {
        return res.status(400).json({ error: 'Invalid input: id must be a number' });
    }

    const index = eleves.findIndex(eleve => eleve.id === id);

    if (index === -1) {
        return res.status(404).json({ error: 'Student not found' });
    }

    eleves.splice(index, 1);
    res.status(200).json({ message: 'Student deleted successfully' });
};

const deleteEleveList = (req, res) => {
    const ids = req.body;

    if (!Array.isArray(ids)) {
        return res.status(400).json({ error: 'Invalid input: body must be an array of ids' });
    }

    try {
        ids.forEach(id => {
            console.log(`Trying to delete student with id: ${id}`);
            const index = eleves.findIndex(eleve => eleve.id === id);
            if (index !== -1) {
                console.log(`Deleting student with id: ${id}`);
                eleves.splice(index, 1);
            } else {
                console.log(`Student with id: ${id} not found`);
            }
        });
        res.status(200).json({ message: 'Students deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting students' });
    }
};

const updateEleve = async (req, res) => {
    const { id } = req.params;
    const { name, firstname, classes, password } = req.body;

    const eleve = eleves.find(eleve => eleve.id === parseInt(id));

    if (!eleve) {
        return res.status(404).json({ error: 'Student not found' });
    }

    if (name && typeof name !== 'string') {
        return res.status(400).json({ error: 'Invalid input: name must be a string' });
    }

    if (firstname && typeof firstname !== 'string') {
        return res.status(400).json({ error: 'Invalid input: firstname must be a string' });
    }

    if (classes && !Array.isArray(classes)) {
        return res.status(400).json({ error: 'Invalid input: classes must be an array' });
    }

    if (password && typeof password !== 'string') {
        return res.status(400).json({ error: 'Invalid input: password must be a string' });
    }

    try {
        if (name) eleve.name = name;
        if (firstname) eleve.firstname = firstname;
        if (classes) eleve.classes = classes;
        if (password) eleve.password = await bcrypt.hash(password, 10);

        res.status(200).json(eleve);
    } catch (error) {
        res.status(500).json({ error: 'Error updating student' });
    }
};

const getEleveById = (req, res, internalCall = false) => {
    const { id } = req.params;
    const eleve = eleves.find(eleve => eleve.id === parseInt(id));

    if (!eleve) {
        if (internalCall) {
            return null;
        }
        return res.status(404).json({ error: 'Student not found' });
    }

    if (internalCall) {
        return eleve;
    }

    res.status(200).json(eleve);
};

const loginEleve = async (req, res) => {
    const { id, password } = req.body;

    if (typeof id !== 'number') {
        return res.status(400).json({ error: 'Invalid input: id must be a number' });
    }

    if (typeof password !== 'string') {
        return res.status(400).json({ error: 'Invalid input: password must be a string' });
    }

    const eleve = eleves.find(eleve => eleve.id === id);

    if (!eleve) {
        return res.status(404).json({ error: 'Student not found' });
    }

    try {
        const match = await bcrypt.compare(password, eleve.password);
        if (!match) {
            return res.status(401).json({ error: 'Invalid password' });
        }
        
        const { password: _, ...eleveWithoutPassword } = eleve;
        res.status(200).json({ message: 'Login successful', eleve: eleveWithoutPassword });
    } catch (error) {
        res.status(500).json({ error: 'Error checking password' });
    }
};

module.exports = {
    getEleves,
    addEleve,
    addEleveList,
    deleteEleve,
    deleteEleveList,
    updateEleve,
    getEleveById,
    loginEleve
};

