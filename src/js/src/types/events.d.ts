declare namespace ELGEvents {
    function eventEmitter(name: any, fn: any): Readonly<{
        on: (name: any, fn: any) => any;
        has: (name: any) => boolean;
        emit: (name: any, data: any) => any;
        eventList: Map<any, any>;
    }>;
    function pubSub(): Readonly<{
        pub: (data: any) => void;
        sub: (fn: any) => () => void;
    }>;
}
declare const EventEmitter: Readonly<{
    on: (name: any, fn: any) => any;
    has: (name: any) => boolean;
    emit: (name: any, data: any) => any;
    eventList: Map<any, any>;
}>;
