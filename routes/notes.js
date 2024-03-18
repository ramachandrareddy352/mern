const express = require('express')
const router = express.Router();
const Note = require("../modals/Note");
const fetchuser = require('../middleware/fetchuser')
const { body, validationResult } = require('express-validator');

router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        //find note and update
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(401).send("not found note") }

        if (note.user.toString() !== req.user.id) {   //checking the user is correct or not 
            return res.status(401).send("not owner")
        }

        note = await Note.findByIdAndDelete(req.params.id);
        res.json({ "sucess": "note was sucessfully deleted", note: note })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
})
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {
        const { title, description, tag } = req.body;

        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        //find note and update
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(401).send("not found note") }

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("not allowed")
        }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note })
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
})
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
})

router.post('/addnote', fetchuser, [
    body('title', 'Enter valid title').isLength({ min: 5 }),
    body('description', 'Minimum length is 5').isLength({ min: 5 }),
], async (req, res) => {
    try {
        const { title, description, tag, } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const note = new Note({
            title, description, tag, user: req.user.id
        })

        const savedNote = await note.save()
        res.json(savedNote)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
})
module.exports = router