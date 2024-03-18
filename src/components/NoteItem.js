import React, { useContext } from 'react'
import noteContext from '../context/notes/NoteContext'

export const NoteItem = (props) => {
    const context = useContext(noteContext);
    const { deleteNote } = context;
    const { note, updateNote } = props;
    return (
        <div className="col-md-3 my-2">
            <div className="card-body" style={{ border: "1px solid black" }}>
                <div className='d-flex'>
                    <h5 className="card-title  mx-3" >{note.title}</h5>
                    <i className="fa-solid fa-trash-can mx-3" onClick={() => { deleteNote(note._id); props.showAlert("Note deleted successfully ", "success") }}></i>
                    <i className="fa-solid fa-pen-to-square mx-3" onClick={() => { updateNote(note) }}></i>
                </div>
                <p className="card-text mx-3">{note.description}</p>
            </div>
        </div >
    )
}
export default NoteItem