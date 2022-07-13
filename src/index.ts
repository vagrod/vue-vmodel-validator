import { App } from 'vue';
import Validator from "./Validator.vue";
import { ValidateEvent, ValidationPresets, ValidationMarkerMap } from "./Shared";

export default {
    install(app: App) {
        app.component("validator", Validator);
    }
};
export {
    Validator,
    ValidationPresets,
    ValidateEvent,
    ValidationMarkerMap
}