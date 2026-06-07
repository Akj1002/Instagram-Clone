import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Plus } from 'lucide-react';
import './NotesBar.css';

const NotesBar = () => {
  const { user } = useContext(AuthContext);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get('/notes');
        setNotes(res.data);
      } catch (error) {
        console.error('Failed to fetch notes', error);
      }
    };
    fetchNotes();
  }, []);

  const handleAddNote = async () => {
    const text = window.prompt("Share a thought...");
    if (!text) return;

    try {
      const res = await axios.post('/notes', { text: text.substring(0, 60) }); // limit to 60 chars
      // Filter out our old note if it existed, add new one
      setNotes([res.data, ...notes.filter(n => n.user.id !== user.id)]);
    } catch (error) {
      console.error('Failed to add note', error);
    }
  };

  const myNote = notes.find(n => n.user.id === user.id);
  const otherNotes = notes.filter(n => n.user.id !== user.id);

  return (
    <div className="notes-bar">
      <div className="note-item my-note" onClick={handleAddNote}>
        <div className="note-bubble">
          {myNote ? myNote.text : "Note..."}
          {!myNote && <div className="add-note-badge"><Plus size={12} color="white" /></div>}
        </div>
        <img src={user?.avatar || 'https://via.placeholder.com/150'} alt="Me" className="note-avatar" />
        <span className="note-username">Your note</span>
      </div>

      {otherNotes.map(note => (
        <div key={note.id} className="note-item">
          <div className="note-bubble">
            {note.text}
          </div>
          <img src={note.user.avatar || 'https://via.placeholder.com/150'} alt={note.user.username} className="note-avatar" />
          <span className="note-username">{note.user.username}</span>
        </div>
      ))}
    </div>
  );
};

export default NotesBar;
