import React, { useEffect, useState } from "react";
import axios from "axios";
import "./NotesListDark.css"; 

function NotesList() {
    const [notes, setNotes] = useState([]);
    const [userName, setUserName] = useState("");
    const [userLast, setLast] = useState("");
    const [editingNote, setEditingNote] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");
    const [newNoteTitle, setNewNoteTitle] = useState("");
    const [newNoteContent, setNewNoteContent] = useState("");
    const [showAddNoteForm, setShowAddNoteForm] = useState(false); 

    useEffect(() => {
        fetchNotes();
        const storedName = localStorage.getItem("first");
        const storedLast = localStorage.getItem("last");
        if (storedName && storedLast) {
            setUserName(storedName);
            setLast(storedLast);
        }
    }, []);

    const fetchNotes = async () => {
        try {
            const token = localStorage.getItem("token");
            const resp = await axios.get('https://notes.devlop.tech/api/notes', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setNotes(resp.data);
        } catch (err) {
            console.error("Error fetching notes:", err.response ? err.response.data : err.message);
            alert("Failed to fetch notes. Please try again.");
        }
    };

    const addNewNote = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const resp = await axios.post(
                "https://notes.devlop.tech/api/notes",
                { title: newNoteTitle, content: newNoteContent },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setNotes([...notes, resp.data]);
            setNewNoteTitle("");
            setNewNoteContent("");
            setShowAddNoteForm(false); 
        } catch (err) {
            console.error("Error adding note:", err.response ? err.response.data : err.message);
            alert("Failed to add the note. Please try again.");
        }
    };

    const delet = async (noteId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`https://notes.devlop.tech/api/notes/${noteId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
        } catch (err) {
            console.error("Error deleting note:", err.response ? err.response.data : err.message);
            alert("Failed to delete the note. Please try again.");
        }
    };

    const updateNote = async (noteId, updatedData) => {
        try {
            const token = localStorage.getItem("token");
            await axios.put(
                `https://notes.devlop.tech/api/notes/${noteId}`,
                updatedData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setNotes((prevNotes) =>
                prevNotes.map((note) =>
                    note.id === noteId ? { ...note, ...updatedData } : note
                )
            );
            setEditingNote(null);
        } catch (err) {
            console.error("Error updating note:", err.response ? err.response.data : err.message);
            alert("Failed to update the note. Please try again.");
        }
    };

    return (
        <div className="notes-dark-container">
            <div className="notes-header">
                <h1>Notes List</h1>
                <h4>Welcome, {userName} {userLast}</h4>
                <div className="header-buttons">
                    <button className="btn logout-btn" onClick={() => alert('Logged out')}>
                        Log Out
                    </button>
                </div>
            </div>

            <div className="header-buttons">
                <button
                    className="btn add-note-btn"
                    onClick={() => setShowAddNoteForm(!showAddNoteForm)}
                >
                    {showAddNoteForm ? "Cancel" : "Add Note"}
                </button>
            </div>

            {showAddNoteForm && (
                <div className="add-note-form">
                    <form onSubmit={addNewNote}>
                        <input
                            type="text"
                            placeholder="New Note Title"
                            value={newNoteTitle}
                            onChange={(e) => setNewNoteTitle(e.target.value)}
                            required
                        />
                        <textarea
                            placeholder="New Note Content"
                            value={newNoteContent}
                            onChange={(e) => setNewNoteContent(e.target.value)}
                            required
                        />
                        <button type="submit" className="btn add-note-btn">
                            Add Note
                        </button>
                    </form>
                </div>
            )}

            {notes.length > 0 ? (
                <table className="notes-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Title</th>
                            <th>Content</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notes.map((note, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{note.title}</td>
                                <td>{note.content}</td>
                                <td className="actions">
                                    <button
                                        className="btn update-btn"
                                        onClick={() => {
                                            setEditingNote(note);
                                            setEditTitle(note.title);
                                            setEditContent(note.content);
                                        }}
                                    >
                                        Update
                                    </button>
                                    <button
                                        className="btn delete-btn"
                                        onClick={() => delet(note.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="no-notes">No notes available.</p>
            )}

            {editingNote && (
                <div className="edit-form-container">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            updateNote(editingNote.id, { title: editTitle, content: editContent });
                        }}
                    >
                        <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            placeholder="Edit Title"
                            required
                        />
                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            placeholder="Edit Content"
                            required
                        />
                        <button type="submit" className="btn save-btn">Save</button>
                        <button
                            type="button"
                            className="btn cancel-btn"
                            onClick={() => setEditingNote(null)}
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default NotesList;
