import { ref } from "vue";

export enum ValidationPresets {
    StringNotEmpty,
    NumberAny,
    NumberPositive,
    FloatAny,
    FloatPositive,
    Year,
    Guid
}

export class ValidateEvent {
    constructor(
        public isValid: boolean,
        public value: unknown,
        public errorText: string | undefined,
    ) { }
}

export class ValidationMarkerMap {
    private readonly validatedComponents;

    constructor(
        private classNameInvalid: string,
        private classNameValid?: string,
        private onChanged?: (e: ValidateEvent) => void
    ) {
        this.validatedComponents = ref<Map<string, boolean>>(new Map<string, boolean>());
    }

    public get(component: string): string | undefined {
        return this.validatedComponents.value.get(component) ? this.classNameValid : this.classNameInvalid;
    }
    public set(component: string, e: ValidateEvent): void {
        this.validatedComponents.value.set(component, e.isValid);

        if(this.onChanged) {
            this.onChanged.call(this, e);
        }
    }
    public validateAll(): boolean {
        let isValid = true;

        this.validatedComponents.value.forEach(v => {
            if(!v)
            {
                isValid = false;
                return;
            }
        });

        return isValid;
    }
}