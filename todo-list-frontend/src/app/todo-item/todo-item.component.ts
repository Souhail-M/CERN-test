import {Component, Input, Output, EventEmitter} from '@angular/core';
import {Todo} from "../todo.service";

@Component({
  selector: 'app-todo-item',
  template: `
      <div class="task-indicator">
        {{ item.task }}
      </div>
      <div class="priority-indicator" [style.background-color]="color">
        {{ item.priority }}
      </div>
      <div class="delete-button" (click)="onDelete()">Delete</div>

  `,
  styleUrls: ['todo-item.component.scss']
})
export class TodoItemComponent {

  @Input() item!: Todo;
  @Output() delete = new EventEmitter<number>()

  onDelete(): void {
    this.delete.emit(this.item.id);
  }

  get color() {
    switch (this.item.priority) {
      case 1:
        return 'green';
      case 2:
        return 'yellow';
      case 3:
        return 'red';
    }
  }
}
