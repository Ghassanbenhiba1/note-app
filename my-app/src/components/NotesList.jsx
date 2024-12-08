import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function NotesList(props) {
    const [notes, setNotes] = useState([]);
    const [userName, setUserName] = useState("");
    const [userLast, setLast] = useState("");

    const [newNoteTitle, setNewNoteTitle] = useState("");
    const [newNoteContent, setNewNoteContent] = useState("");
    const [showAddForm, setShowAddForm] = useState(false);

    const [editingNote, setEditingNote] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");

    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchNotes();
        const storedName = localStorage.getItem("first");
        const storedlast = localStorage.getItem("last");
        if (storedName && storedlast) {
            setUserName(storedName);
            setLast(storedlast);
        }
    }, []);

    const fetchNotes = async () => {
        try {
            const resp = await axios.get("https://notes.devlop.tech/api/notes", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotes(resp.data);
        } catch (err) {
            console.error("Error fetching notes:", err.response ? err.response.data : err.message);
            alert("Failed to fetch notes. Please try again.");
        }
    };

    const addNewNote = async () => {
        if (!newNoteTitle || !newNoteContent) {
            alert("Please provide a title and content for the note.");
            return;
        }
        try {
            const resp = await axios.post(
                "https://notes.devlop.tech/api/notes",
                { title: newNoteTitle, content: newNoteContent },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setNotes([...notes, resp.data]);
            setNewNoteTitle("");
            setNewNoteContent("");
            setShowAddForm(false); // Hide the form after adding the note
        } catch (err) {
            console.error("Error adding note:", err.response ? err.response.data : err.message);
            alert("Failed to add the note. Please try again.");
        }
    };

    const deleteNote = async (noteId) => {
        try {
            await axios.delete(`https://notes.devlop.tech/api/notes/${noteId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
        } catch (err) {
            console.error("Error deleting note:", err.response ? err.response.data : err.message);
            alert("Failed to delete the note. Please try again.");
        }
    };

    const updateNote = async (noteId) => {
        try {
            const updatedNote = { title: editTitle, content: editContent };
            await axios.put(`https://notes.devlop.tech/api/notes/${noteId}`, updatedNote, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setNotes((prevNotes) =>
                prevNotes.map((note) =>
                    note.id === noteId ? { ...note, ...updatedNote } : note
                )
            );
            setEditingNote(null);
        } catch (err) {
            console.error("Error updating note:", err.response ? err.response.data : err.message);
            alert("Failed to update the note. Please try again.");
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("first");
        localStorage.removeItem("last");
        props.setisConect(false);
        navigate("/");
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Notes List</h1>
            <h4>Welcome, {userName} {userLast}</h4>
            <div className="mb-3 d-flex justify-content-between">
                <button className="btn btn-danger" onClick={logout}>Log Out</button>
                <button
                    className="btn btn-success"
                    onClick={() => setShowAddForm(!showAddForm)}
                >
                    {showAddForm ? "Close Form" : "Add New Note"}
                </button>
            </div>

            {/* Conditionally render Add New Note Form */}
            {showAddForm && (
                <div className="mb-4">
                    <h5>Add New Note</h5>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            addNewNote();
                        }}
                    >
                        <div className="mb-3">
                            <label htmlFor="newNoteTitle" className="form-label">Title</label>
                            <input
                                type="text"
                                id="newNoteTitle"
                                className="form-control"
                                value={newNoteTitle}
                                onChange={(e) => setNewNoteTitle(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="newNoteContent" className="form-label">Content</label>
                            <textarea
                                id="newNoteContent"
                                className="form-control"
                                value={newNoteContent}
                                onChange={(e) => setNewNoteContent(e.target.value)}
                                required
                            ></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary">Save Note</button>
                    </form>
                </div>
            )}

            {notes.length > 0 ? (
                <table className="table table-striped table-bordered">
                    <thead className="table-dark text-center">
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Title</th>
                            <th scope="col">Content</th>
                            <th scope="col">Shared With</th>
                            <th scope="col">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notes.map((note, index) => (
                            <React.Fragment key={note.id}>
                                <tr>
                                    <th scope="row">{index + 1}</th>
                                    <td>{note.title}</td>
                                    <td>{note.content}</td>
                                    <td>
                                        {note.shared_with?.length > 0
                                            ? note.shared_with.map((user) => user.first_name).join(", ")
                                            : "Not shared"}
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-success mr-2"
                                            onClick={() => {
                                                setEditingNote(note);
                                                setEditTitle(note.title);
                                                setEditContent(note.content);
                                            }}
                                        >
                                            Update
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => deleteNote(note.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                                {editingNote && editingNote.id === note.id && (
                                    <tr>
                                        <td colSpan="5">
                                            <form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    updateNote(editingNote.id);
                                                }}
                                            >
                                                <div className="mb-3">
                                                    <label htmlFor="editTitle" className="form-label">Title</label>
                                                    <input
                                                        type="text"
                                                        id="editTitle"
                                                        className="form-control"
                                                        value={editTitle}
                                                        onChange={(e) => setEditTitle(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="mb-3">
                                                    <label htmlFor="editContent" className="form-label">Content</label>
                                                    <textarea
                                                        id="editContent"
                                                        className="form-control"
                                                        value={editContent}
                                                        onChange={(e) => setEditContent(e.target.value)}
                                                        required
                                                    ></textarea>
                                                </div>
                                                <button type="submit" className="btn btn-primary">Save</button>
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary"
                                                    onClick={() => setEditingNote(null)}
                                                >
                                                    Cancel
                                                </button>
                                            </form>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-center text-muted">No notes available.</p>
            )}
        </div>
    );
}

export default NotesList;
