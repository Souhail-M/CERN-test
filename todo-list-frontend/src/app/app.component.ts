import {Component, OnInit, OnDestroy, ChangeDetectionStrategy} from '@angular/core';
import {Todo, TodoService} from "./todo.service";
import {Observable, Subscription, combineLatest} from "rxjs";
import {FormControl} from "@angular/forms";
import {startWith, debounceTime, distinctUntilChanged, map} from "rxjs/operators";

@Component({
  selector: 'app-root',
  template: `
    <div class="title">
      <h1>
        A list of TODOs
      </h1>
    </div>
    <div class="list">
      <label for="search">Search...</label>
      <input id="search" type="text" [formControl]="searchControl"/>
      <app-progress-bar *ngIf="(loading$ | async)"></app-progress-bar>
      <app-todo-item *ngFor="let todo of filteredTodos$ | async" [item]="todo" (delete)="onDelete($event)"></app-todo-item>
    </div>
  `,
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  readonly todos$: Observable<Todo[]>;
  readonly loading$: Observable<boolean>;
  readonly searchControl = new FormControl('');
  readonly filteredTodos$: Observable<Todo[]>;

  private subscription!: Subscription;

  constructor(private todoService: TodoService) {
    this.todos$ = todoService.getAll();
    this.loading$ = todoService.loading$;


    
 this.filteredTodos$ = combineLatest([
  this.todos$,
  this.searchControl.valueChanges.pipe(
    startWith(''),
    debounceTime(300),
    distinctUntilChanged()
  )
]).pipe(
  map(([todos, searchTerm]: [Todo[], string]) => 
    todos.filter(todo => 
      todo.task.toLowerCase().includes(searchTerm.toLowerCase())
    )
  )
);
  }


  ngOnInit() {
    this.subscription = this.todos$.subscribe();
  }

  onDelete(id: number): void {
    this.todoService.remove(id).subscribe(() => {
      console.log('Todo deleted:', id);
      
    },
  (error: any) => {
    console.error(error);
    
  }
  );
  }

  ngOnDestroy(): void {
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}