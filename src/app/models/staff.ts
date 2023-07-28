export class Staff {
    id             : number;
    firstName      : string;
    lastName       : string;
    organizationId?: number;
    positionId?    : number;
    organization   : string;
    position       : string;
    userId         : number;

    get fullName(): string {
        return this.firstName + ' ' + this.lastName;
    }
}
