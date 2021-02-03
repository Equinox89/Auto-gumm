export interface NextObserver<T> {
    closed?: boolean;
    next: (value: T) => void;
    error?: (err: any) => void;
    complete?: () => void;
}

export interface ErrorObserver<T> {
    closed?: boolean;
    next?: (value: T) => void;
    error: (err: any) => void;
    complete?: () => void;
}

export interface CompletionObserver<T> {
    closed?: boolean;
    next?: (value: T) => void;
    error?: (err: any) => void;
    complete: () => void;
}
