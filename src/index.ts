import Validator from "./Validator.vue";
import { ValidateEvent, ValidationPresets } from "./Shared";

export default {
    install(Vue, options) {
        Vue.component("validator", Validator);
    }
};
export {
    Validator,
    ValidationPresets,
    ValidateEvent
}