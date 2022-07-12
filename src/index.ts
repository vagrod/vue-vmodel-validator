import Validator from "./Validator.vue";
import { ValidateEvent, ValidationPresets, ValidationMarkerMap } from "./Shared";

export default {
    install(Vue) {
        Vue.component("validator", Validator);
    }
};
export {
    Validator,
    ValidationPresets,
    ValidateEvent,
    ValidationMarkerMap
}