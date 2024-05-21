import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import {
  Observable,
  filter,
  interval,
  map,
  of,
  reduce,
  switchMap,
  tap,
  from,
  debounceTime,
  distinctUntilChanged,
  catchError,
  take,
  timer,
  takeUntil,
  forkJoin,
} from 'rxjs';
import { ajax } from 'rxjs/ajax';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule],
  template: `
    <h1>Welcome to {{ title }}!</h1>

    From: {{ from$ | async }} <br />
    Pipe: {{ pipe$ | async }} <br />
    Filter: {{ filter$ | async }}<br />

    Map: {{ map$ | async }}<br />
    Map2: {{ map2$ | async }} <br />
    Of: {{ of$ | async }}<br />
    switchMap: {{ switchMap$ | async }}<br />
    tap: {{ tap$ | async }} <br />

    <form [formGroup]="formGitHub">
      <label for=""> Input de Dados para buscar dados do GitHub:</label>
      <input
        type="text"
        formControlName="buscarDoGitHub"
        placeholder="Buscar GitHub"
      />
    </form>

    <p>
      <b>{{ usuarioGithub?.login }}</b>
    </p>
    <img [src]="usuarioGithub?.avatar_url" alt="Imagem Usuário GitHub" />

    <p>{{ usuarioGithub | json }}</p>

    
    <router-outlet />
  `,
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'rxjs';

  numeros$ = from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  numerosTake$ = interval(2000);
  observable1$ = of('Valor1');
  observable2$ = of('Valor2');
  observable3$ = of('Valor3');

  timer$ = timer(8000)

  formGitHub = new FormGroup({
    buscarDoGitHub: new FormControl(''),
  });
  usuarioGithub: any;
  ngOnInit(): void {
    this.formGitHub.controls['buscarDoGitHub'].valueChanges
      .pipe(
        debounceTime(500),
        filter((valor) => valor != ''),
        distinctUntilChanged(),
        switchMap((query: any) => {
          console.log('Log do switchMap:', query);
          return ajax.getJSON(`https://api.github.com/users/${query}`).pipe(
            catchError((err: any) => {
              alert(err);
              return of([]);
            })
          );
        })
      )
      .subscribe((resposta) => (this.usuarioGithub = resposta));

    this.operadorTake();
    this.operadorTakeUntil();
    this.operadorForkJoin();
  }

  operadorTake() {
    const emissao$ = this.numerosTake$.pipe(take(5));
    emissao$.subscribe((value) => console.log('LOG de Take', value));
  }
  operadorTakeUntil() {
    const emissao$ = this.numerosTake$.pipe(takeUntil(this.timer$));
    emissao$.subscribe((value) => console.log('LOG de TakeUntil:', value));
  }

  operadorForkJoin(){
    const resultado$ = forkJoin([this.observable1$, this.observable2$, this.observable3$])
    resultado$.subscribe((values) => {
      const valuesObservables = values;
      valuesObservables.forEach(valor => console.log(valor));
    });
  }
  // repassa o dado com uma lista iteravel
  from$ = this.numeros$.pipe(
    filter((numero) => numero < 4),
    tap((value: any) => {
      console.log('Log do from:', value);
      return value;
    })
  );

  map2$ = this.numeros$.pipe(
    filter((numero) => numero % 2 !== 0),
    map((numero) => `Esse número é impar: ${numero}`),
    tap(console.log)
  );

  pessoas = [
    { nome: 'João', sexo: 'masculino', idade: 20 },
    { nome: 'Maria', sexo: 'feminino', idade: 25 },
    { nome: 'José', sexo: 'masculino', idade: 30 },
    { nome: 'Pedro', sexo: 'masculino', idade: 17 },
    { nome: 'Ana', sexo: 'feminino', idade: 40 },
  ];

  maioresAgrupadosPorGenero = () => (source$: any) =>
    source$.pipe(
      filter((pessoa: any) => pessoa.idade >= 18),
      reduce((a: any, b: any) => ({
        ...a,
        [b.sexo]: [...(a[b.sexo] || []), b],
      }))
    );
  //from(pessoas: any)
  //.pipe(maioresAgrupadosPorGenero())
  //.subscribe(e => console.log(e)), err => console.log(err)

  pipe$ = interval(1000).pipe((valor) => {
    return valor;
  });
  filter$ = interval(1000).pipe(filter((value) => value % 4 === 0));
  map$ = interval(1000).pipe(
    map((valor: any) => `Map = ${valor} x 4 = ${valor * 4}`)
  );
  of$ = of('Repassa um dado Síncrono');

  switchMap$ = interval(2000).pipe(
    switchMap((value: any) => {
      return new Observable((subscriber) => {
        subscriber.next(value);
      });
    })
  );

  tap$ = interval(2000).pipe(
    tap((value: any) => {
      console.log('LOG:', value);
    })
  );
}
