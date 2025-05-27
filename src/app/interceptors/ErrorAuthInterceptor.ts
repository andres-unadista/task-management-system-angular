import { HttpInterceptorFn } from "@angular/common/http";
import { catchError, throwError } from "rxjs";

export const errorAuthInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error) => {
      if (
        error.status === 401 &&
        typeof window !== 'undefined'
      ) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        // NO navegues aquí, deja que el guard lo haga en la siguiente navegación
      }
      return throwError(() => error);
    })
  );
};