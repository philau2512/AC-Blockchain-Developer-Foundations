export class SmartContract {
    private message : string;

    constructor (initialMessage : string ) {
        this.message = initialMessage;
    }

    public updateMessage (newMessage : string) : void {
        this.message = newMessage; 
    }

    public getMessage () : string {
        return this.message; 
    }
}