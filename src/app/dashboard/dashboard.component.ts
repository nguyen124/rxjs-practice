import { Component, OnInit } from '@angular/core';
import { map, retry, pluck, bufferCount, tap } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { Observable, interval, fromEvent } from 'rxjs';
export const fruits = ["Apple", "Orange", "Mango", "Shoe"];
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  ngOnInit(): void {
    this.getFood3().subscribe(
      (f) => {
        console.log("Fruit: " + f);
      },
      (err) => {
        console.log("It a shoe not fruit: " + err)
      },
      () => {
        console.log("complete");
      }
    );

    this.playLotto().subscribe(
      (k) => {
        console.log("Lotto result: " + JSON.stringify(k));
      },
      (err) => {
        console.log("Key Error");
      },
      () => {
        console.log("complete");
      }
    );
  }

  getFood(): Observable<string> {
    return Observable.create(observer => {
      for (let f of fruits) {
        if (f == "Shoe") {
          observer.error("its a shoe");
        }
        observer.next(f);
      }
      observer.complete();
    }).pipe(this.passOnlyStartsWithVowel(), retry(2))
  }


  getFood2(): Observable<string> {
    return Observable.create(function (observer) {
      let index = 0;
      setInterval(() => {
        var f = fruits[index];
        if (f == "Shoe") {
          observer.error("its a shoeee");
        }
        observer.next(f);
        index++;
      }, 1000)

      if (index == fruits.length) {
        observer.complete();
      }

    });
  }

  getFood3(): Observable<string> {
    let fruit$ = interval(2000).pipe(
      map(time => {
        console.log("time: " + time);
        return 'random fruit: ' + fruits[Math.floor((Math.random() * (fruits.length)))];
      })
    )
    return fruit$;
  }

  passOnlyStartsWithVowel = () => (<T>(source: Observable<T>) =>
    new Observable<T>(observer => {
      source.subscribe({
        next(x) {
          let char = x.toString().charAt(0).toLowerCase();
          if (char == "a" || char == "o") {
            observer.next(x);
          }
        }
      })
    }))

  playLotto(): Observable<any> {
    var winning = "ALA"
    let keyPress$ = fromEvent(document, "keypress");
    return keyPress$.pipe(
      pluck("key"),
      tap(key => console.log(`Key press: ${key}`)),
      bufferCount(3),
      map((ticketChars: string[]) => {
        var ticket = ticketChars.join("");
        console.log(`ticket: ${ticket}`)
        if (ticket.toUpperCase() == winning) {
          return { winner: true, ticket: ticket }
        } else {
          return { winner: false, ticket: ticket }
        }
      })
    );
  }
  /** Based on the screen size, switch from standard to one column per row */
  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Card 1', cols: 1, rows: 1 },
          { title: 'Card 2', cols: 1, rows: 1 },
          { title: 'Card 3', cols: 1, rows: 1 },
          { title: 'Card 4', cols: 1, rows: 1 }
        ];
      }

      return [
        { title: 'Card 1', cols: 2, rows: 1 },
        { title: 'Card 2', cols: 1, rows: 1 },
        { title: 'Card 3', cols: 1, rows: 2 },
        { title: 'Card 4', cols: 1, rows: 1 }
      ];
    })
  );

  constructor(private breakpointObserver: BreakpointObserver) { }
}
