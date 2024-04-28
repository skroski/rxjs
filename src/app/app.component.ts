import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Observable, filter, interval, map, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  template: `
    <h1>Welcome to {{title}}!</h1>
     Pipe: {{ pipe$ | async }} <br>
     Filter: {{ filter$ | async }}<br>
     Map: {{ map$ | async }}<br>
     Of: {{ of$ | async}}<br>
     switchMap: {{ switchMap$ | async}}<br>
     tap: {{ tap$ | async }}
    <router-outlet />
  `,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'rxjs';
  pipe$ = interval(1000).pipe((valor) => {return valor});
  filter$ = interval(1000).pipe(filter((value) => value % 4 === 0));
  map$ = interval(1000).pipe(map((valor:any) => `Map = ${valor} x 4 = ${valor * 4}`))
  of$ = of('Repassa um dado Síncrono');

  switchMap$ = interval(2000).pipe(
    switchMap((value:any) => {
      return new Observable((subscriber) => {
        subscriber.next(value);
      })
    })
  )

  tap$ = interval(2000).pipe(
    tap((value:any) => {
      console.log("LOG:", value);
      
    })
  )

}
