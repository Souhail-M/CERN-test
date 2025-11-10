import {Injectable} from '@angular/core';
import {Observable,of , Subject} from "rxjs";
import {delay, map, startWith} from "rxjs/operators";

export interface Todo {
  id: number;
  task: string;
  priority: 1 | 2 | 3;
}

let mockData: Todo[] = [
  { id: 0, task: 'Implement loading - frontend only', priority: 1 },
  { id: 1, task: 'Implement search - frontend only', priority: 2 },
  { id: 2, task: 'Implement delete on click - frontend only', priority: 1 },
  { id: 3, task: 'Replace mock service by integrating backend', priority: 3 },
];

function removeFromMockData(id: number) {
  mockData = mockData.filter(todo => todo.id !== id);
}

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private loadingSubject = new Subject<boolean>();
  public loading$ = this.loadingSubject.asObservable().pipe(
    startWith(true)
  );


  getAll(): Observable<Todo[]> {
    this.loadingSubject.next(true);
    return of(undefined).pipe(
      delay(2_000), map(() => {
      this.loadingSubject.next(false);
      return mockData;
    }));
  }

  remove(id: number): Observable<void> {
    return new Observable<void>(observer => {
      setTimeout(() => {
        if (Math.random() < .8) {
          removeFromMockData(id);
          observer.next();
        } else {
          observer.error('Failed');
        }
        observer.complete();
      }, 2_000)
    })
  }
}
