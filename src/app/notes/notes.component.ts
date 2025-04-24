import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { Note } from './model/notes.model';
import { NotesService } from './notes.service';

// Component
@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {
  notes: Note[] = [];
  form: FormGroup;
  formData: Omit<Note, '_id' | 'createdAt'> = { title: '', content: '' };
  editId: string | null = null;
  isLoading = false;

  constructor(private notesService: NotesService, private fb: FormBuilder) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
  }

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
    if (this.form.invalid) return;
  
    const formValue = this.form.value;
    const operation = this.editId
      ? this.notesService.updateNote(this.editId, formValue)
      : this.notesService.createNote(formValue);
  
    operation.subscribe({
      next: () => {
        this.form.reset();
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
    this.form.patchValue({
      title: note.title,
      content: note.content
    });
    this.editId = note._id;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString();
  }
}