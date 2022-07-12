export enum ValidationPresets {
    StringNotEmpty,
    NumberAny,
    NumberPositive,
    FloatAny,
    FloatPositive,
    Year,
    Guid
}

export class ValidateEvent extends Event {
    constructor(
        public isValid: boolean,
        public value: unknown,
        public errorText: string | undefined,
    ) {
        super('ValidateEvent');
    }

}