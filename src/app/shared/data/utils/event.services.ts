import { Injectable } from '@angular/core';
import { filter, map, Subject, Subscription } from 'rxjs';
import { EventData } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root',
})
export class EventBusService {
  private subject$ = new Subject<EventData>();

  emit(event: EventData) {
    this.subject$.next(event);
  }

  on(eventName: string, action: (value: any, data?: any) => void): Subscription {
    return this.subject$
      .pipe(
        filter(
          (e: EventData) =>
            e.name.toLocaleLowerCase() === eventName.toLocaleLowerCase()
        ),
        map((e: EventData) => e)
      )
      .subscribe(action);
  }
}
