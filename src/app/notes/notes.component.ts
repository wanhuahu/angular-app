import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

import { Note } from './model/notes.model';
import { NotesService } from './notes.service';

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {
  notes: Note[] = [];
  formData: Omit<Note, '_id' | 'createdAt'> = { title: '', content: '' };
  editId: string | null = null;
  isLoading = false;

  constructor(private notesService: NotesService) {}

  ngOnInit(): void {
    this.fetchNotes();
  }

  fetchNotes(): void {
    this.isLoading = true;
    this.notesService.getAllNotes()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (data) => {
          this.notes = data.sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        },
        error: (error) => console.error('Error fetching notes:', error)
      });
  }

  handleSubmit(event: Event): void {
    event.preventDefault();
    const operation = this.editId
      ? this.notesService.updateNote(this.editId, this.formData)
      : this.notesService.createNote(this.formData);

    operation.subscribe({
      next: () => {
        this.formData = { title: '', content: '' };
        this.editId = null;
        this.fetchNotes();
      },
      error: (error) => console.error('Error saving note:', error)
    });
  }

  handleDelete(id: string): void {
    if (confirm('Are you sure you want to delete this note?')) {
      this.notesService.deleteNote(id).subscribe({
        next: () => this.fetchNotes(),
        error: (error) => console.error('Error deleting note:', error)
      });
    }
  }

  handleEdit(note: Note): void {
    this.formData = { title: note.title, content: note.content };
    this.editId = note._id;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString();
  }
}