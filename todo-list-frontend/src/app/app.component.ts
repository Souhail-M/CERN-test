import {Component, OnDestroy, OnInit} from '@angular/core';
import {Todo, TodoService} from "./todo.service";
import {Observable, Subscription} from "rxjs";

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
      <input id="search" type="text">
      <app-progress-bar *ngIf="(loading$ | async)"></app-progress-bar>
      <app-todo-item *ngFor="let todo of todos$ | async" [item]="todo"></app-todo-item>
    </div>
  `,
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  readonly todos$: Observable<Todo[]>;
  readonly loading$: Observable<boolean>;

  private subscription!: Subscription

 constructor(todoService: TodoService) {
      this.todos$ = todoService.getAll();
      this.loading$ = todoService.loading$;
    }
  ngOnInit(): void {
    this.subscription = this.todos$.subscribe();
  }

  ngOnDestroy(): void {
    if(this.subscription){
      this.subscription.unsubscribe();

    }
  }

   
}
