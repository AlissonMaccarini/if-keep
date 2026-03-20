import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Note {
  id: string;
  title: string;
  content: string[];
  date: string;
  isArchived: boolean;
  ytUrl?: string;
  color?: string;
  fontSize?: number;
}

export interface Subject {
  id: string;
  name: string;
  isArchived: boolean;
  notes: Note[];
  color?: string;
  category?: string;
}

interface NotesContextData {
  subjects: Subject[];
  themeColor: string;
  userName: string;
  setSubjects: (subjects: Subject[]) => void;
  setThemeColor: (color: string) => void;
  setUserName: (name: string) => void;
  addSubject: (name: string, category?: string) => void;
  addNoteToSubject: (subjectId: string, title: string, body: string, color?: string) => void;
  archiveSubject: (id: string) => void;
  unarchiveSubject: (id: string) => void;
  removeSubject: (id: string) => void;
  archiveNote: (subId: string, noteId: string) => void;
  unarchiveNote: (subId: string, noteId: string) => void;
  removeNote: (subId: string, noteId: string) => void;
  updateNote: (subId: string, noteId: string, data: Partial<Note>) => void;
}

const NotesContext = createContext<NotesContextData>({} as NotesContextData);

export const NotesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [subjects, setSubjectsState] = useState<Subject[]>([]);
  const [userName, setUserNameState] = useState(() => localStorage.getItem('@IFkeep:user') || 'Estudante');
  const [themeColor, setThemeColorState] = useState(() => localStorage.getItem('@IFkeep:theme') || '#1a73e8');

  useEffect(() => {
    const saved = localStorage.getItem('@IFkeep:subjects');
    if (saved) setSubjectsState(JSON.parse(saved));
  }, []);

  const persist = (data: Subject[]) => {
    setSubjectsState(data);
    localStorage.setItem('@IFkeep:subjects', JSON.stringify(data));
    window.dispatchEvent(new Event('storage'));
  };

  const setThemeColor = (color: string) => {
    setThemeColorState(color);
    localStorage.setItem('@IFkeep:theme', color);
  };

  const setUserName = (name: string) => {
    setUserNameState(name);
    localStorage.setItem('@IFkeep:user', name);
  };

  const addSubject = (name: string, category = 'Geral') => {
    const newSub: Subject = {
      id: Date.now().toString(),
      name,
      category,
      isArchived: false,
      notes: [],
      color: themeColor
    };
    persist([...subjects, newSub]);
  };

  const addNoteToSubject = (subjectId: string, title: string, body: string, color = '#ffffff') => {
    const newList = subjects.map(s => {
      if (s.id === subjectId) {
        const newNote: Note = {
          id: Date.now().toString(),
          title: title || 'Sem Título',
          content: [body],
          date: new Date().toLocaleDateString(),
          isArchived: false,
          color
        };
        return { ...s, notes: [newNote, ...(s.notes || [])] };
      }
      return s;
    });
    persist(newList);
  };

  const updateNote = (subId: string, noteId: string, data: Partial<Note>) => {
    persist(subjects.map(s => s.id === subId ? {
      ...s, notes: s.notes.map(n => n.id === noteId ? { ...n, ...data } : n)
    } : s));
  };

  const archiveSubject = (id: string) => persist(subjects.map(s => s.id === id ? { ...s, isArchived: true } : s));
  const unarchiveSubject = (id: string) => persist(subjects.map(s => s.id === id ? { ...s, isArchived: false } : s));
  const removeSubject = (id: string) => persist(subjects.filter(s => s.id !== id));
  const archiveNote = (subId: string, noteId: string) => persist(subjects.map(s => s.id === subId ? { ...s, notes: s.notes.map(n => n.id === noteId ? { ...n, isArchived: true } : n) } : s));
  const unarchiveNote = (subId: string, noteId: string) => persist(subjects.map(s => s.id === subId ? { ...s, notes: s.notes.map(n => n.id === noteId ? { ...n, isArchived: false } : n) } : s));
  const removeNote = (subId: string, noteId: string) => persist(subjects.map(s => s.id === subId ? { ...s, notes: s.notes.filter(n => n.id !== noteId) } : s));

  return (
    <NotesContext.Provider value={{ 
      subjects, themeColor, userName, setSubjects: persist, setThemeColor, setUserName,
      addSubject, addNoteToSubject, archiveSubject, unarchiveSubject, 
      removeSubject, archiveNote, unarchiveNote, removeNote, updateNote
    }}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => useContext(NotesContext);