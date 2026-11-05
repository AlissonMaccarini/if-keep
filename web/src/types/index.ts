export interface Note {
  id: number;
  title: string;
  content: string;
  color: string;
  subject: string;
  archived: boolean;
  date: string;
  lastEdited?: string;
  archived_at?: string;
}