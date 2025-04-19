import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-notes',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './notes.component.html',
  styleUrl: './notes.component.scss'
})
export class NotesComponent {
  notes: { id: string; content: string }[] = [];
  newNoteContent = '';

  ngOnInit() {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      this.notes = JSON.parse(savedNotes);
    }
  }

  addNote() {
    if (this.newNoteContent.trim() === '') return;
    
    const newNote = {
      id: Date.now().toString(),
      content: this.newNoteContent
    };
    
    this.notes = [newNote, ...this.notes];
    this.newNoteContent = '';
    this.saveNotes();
  }

  deleteNote(id: string) {
    this.notes = this.notes.filter(note => note.id !== id);
    this.saveNotes();
  }

  private saveNotes() {
    localStorage.setItem('notes', JSON.stringify(this.notes));
  }
}
