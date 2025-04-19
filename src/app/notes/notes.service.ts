import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Note } from './model/notes.model';

@Injectable({
  providedIn: 'root' // Makes it available application-wide
})
export class NotesService {
  private readonly API_BASE_URL = 'http://localhost:3001';

  constructor(private http: HttpClient) {}

  getAllNotes(): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.API_BASE_URL}/notes`);
  }

  createNote(note: Omit<Note, '_id' | 'createdAt'>): Observable<Note> {
    return this.http.post<Note>(`${this.API_BASE_URL}/notes`, note);
  }

  updateNote(id: string, note: Omit<Note, '_id' | 'createdAt'>): Observable<Note> {
    return this.http.put<Note>(`${this.API_BASE_URL}/notes/${id}`, note);
  }

  deleteNote(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_BASE_URL}/notes/${id}`);
  }
}