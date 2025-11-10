import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable,of , Subject} from "rxjs";
import {delay, map, startWith, switchMap} from "rxjs/operators";

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
  private refreshTrigger$ = new BehaviorSubject<void>(undefined);


 getAll(): Observable<Todo[]> {
    // 🆕 NOUVEAU: Utiliser switchMap pour re-exécuter à chaque refresh
    return this.refreshTrigger$.pipe(
      switchMap(() => {
        this.loadingSubject.next(true);
        return of(undefined).pipe(
          delay(2000),
          map(() => {
            this.loadingSubject.next(false);
            return [...mockData];  // 🆕 Retourner une COPIE
          })
        );
      })
    );
  }

  remove(id: number): Observable<void> {
    return new Observable<void>(observer => {
      removeFromMockData(id);
      observer.next();
      observer.complete();
      this.refreshTrigger$.next(undefined);

    })
  }
}
