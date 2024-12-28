import { Injectable } from '@angular/core';
import {BehaviorSubject, map, Observable, takeWhile, timer} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CountdownService {
  private countdownSubject = new BehaviorSubject<number>(0);

  getCountdown(): Observable<number> {
    return this.countdownSubject.asObservable();
  }

  startCountdown(targetTime: number): Observable<number> {
    const remainingTime = Math.max(0, Math.floor((targetTime - new Date().getTime()) / 1000));
    this.countdownSubject.next(remainingTime);

    return timer(0, 1000).pipe(
      map(() => {
        const currentTime = new Date().getTime();
        const newRemainingTime = Math.max(0, Math.floor((targetTime - currentTime) / 1000));
        this.countdownSubject.next(newRemainingTime);
        return newRemainingTime;
      }),
      takeWhile(remainingTime => remainingTime > 0),
    );
  }

}
