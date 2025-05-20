import { Injectable, Type } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface DialogConfig {
    data?: any;
    width?: string;
    height?: string;
}

export interface DialogRef {
    afterClosed(): Observable<any>;
    close(result?: any): void;
}

@Injectable({
    providedIn: 'root'
})
export class DialogService {
    private isOpen = new BehaviorSubject<boolean>(false);
    private componentType = new BehaviorSubject<Type<any> | null>(null);
    private dialogData = new BehaviorSubject<any>(null);
    private dialogResult = new BehaviorSubject<any>(null);
    private config = new BehaviorSubject<DialogConfig>({});

    isOpen$ = this.isOpen.asObservable();
    componentType$ = this.componentType.asObservable();
    dialogData$ = this.dialogData.asObservable();
    config$ = this.config.asObservable();

    open(component: Type<any>, config: DialogConfig = {}): DialogRef {
        this.componentType.next(component);
        this.dialogData.next(config.data);
        this.config.next(config);
        this.isOpen.next(true);

        const dialogRef: DialogRef = {
            afterClosed: () => this.dialogResult.asObservable(),
            close: (result: any) => {
                this.dialogResult.next(result);
                this.isOpen.next(false);
                this.componentType.next(null);
                this.dialogData.next(null);
            }
        };

        return dialogRef;
    }
}
