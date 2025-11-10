import { Injectable } from "@angular/core";
import { Observable, Subject, BehaviorSubject, throwError } from "rxjs";
import { catchError, startWith, switchMap, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

export interface Todo {
  id: number;
  task: string;
  priority: 1 | 2 | 3;
}

@Injectable({
  providedIn: "root",
})
export class TodoService {
  private apiUrl = "/api/todos";
  private loadingSubject = new Subject<boolean>();
  public loading$ = this.loadingSubject.asObservable();
  private refreshTrigger$ = new BehaviorSubject<void>(undefined);

  constructor(private http: HttpClient) {}

  getAll(): Observable<Todo[]> {
    return this.refreshTrigger$.pipe(
      startWith(undefined),
      switchMap(() => {
        this.loadingSubject.next(true);
        return this.http.get<Todo[]>(this.apiUrl).pipe(
          tap(() => {
            this.loadingSubject.next(false);
          }),
          catchError((error) => {
            this.loadingSubject.next(false);
            console.error("Erreur:", error);
            return throwError(error);
          })
        );
      })
    );
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.refreshTrigger$.next(undefined);
      }),
      catchError((error) => {
        console.error("Erreur lors de la suppression:", error);
        return throwError(error);
      })
    );
  }
}
