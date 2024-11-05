import {BehaviorSubject} from 'rxjs';

export const spinnerState$$ = new BehaviorSubject<boolean>(false)

export const loading = new BehaviorSubject<boolean>(false)
