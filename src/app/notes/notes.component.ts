import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
}

@Component({
  selector: 'app-notes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.scss']
})
export class NotesComponent implements OnInit {
  private API_BASE_URL = 'http://localhost:3001';

  notes: Note[] = [];
  formData = { title: '', content: '' };
  editId: string | null = null;
  isLoading = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchNotes();
  }

  fetchNotes(): void {
    this.isLoading = true;
    this.http.get<Note[]>(`${this.API_BASE_URL}/notes`).subscribe({
      next: (data) => {
        this.notes = data.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      },
      error: (error) => {
        console.error('Error fetching notes:', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  handleInputChange(event: Event, field: 'title' | 'content'): void {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    this.formData = { ...this.formData, [field]: target.value };
  }

  handleSubmit(event: Event): void {
    event.preventDefault();
    const request = this.editId
      ? this.http.put(`${this.API_BASE_URL}/notes/${this.editId}`, this.formData)
      : this.http.post(`${this.API_BASE_URL}/notes`, this.formData);

    request.subscribe({
      next: () => {
        this.formData = { title: '', content: '' };
        this.editId = null;
        this.fetchNotes();
      },
      error: (error) => {
        console.error('Error saving note:', error);
      }
    });
  }

  handleEdit(note: Note): void {
    this.formData = { title: note.title, content: note.content };
    this.editId = note._id;
  }

  handleDelete(id: string): void {
    if (confirm('Are you sure you want to delete this note?')) {
      this.http.delete(`${this.API_BASE_URL}/notes/${id}`).subscribe({
        next: () => {
          this.fetchNotes();
        },
        error: (error) => {
          console.error('Error deleting note:', error);
        }
      });
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString();
  }
}