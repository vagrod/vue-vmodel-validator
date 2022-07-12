<template>
  <slot />
  <slot name="message" v-bind:text="finalErrorText" v-if="finalErrorText">
    <small>{{ finalErrorText }}</small>
  </slot>
</template>

<script lang="ts">
import { defineComponent, onMounted, PropType, ref, watch } from "vue";
import { ValidateEvent, ValidationPresets } from "./Shared";

const isNullOrEmpty = (s: string | undefined | null) => {
  return s === undefined || s === null || s === '' || (s.trim !== undefined && s.trim() === '');
}
const EmptyGuid = '00000000-0000-0000-0000-000000000000';

function validatePreset(value: unknown, p: ValidationPresets, errorText: string | undefined): string | undefined {
  const isFloat = (n: number): boolean => {
    return n % 1 !== 0;
  };

  if(value instanceof Object){
    if(!value)
      return errorText ?? 'Option must be selected';

    return undefined;
  }

  if (p === ValidationPresets.StringNotEmpty) {
    const s = value as string;

    if(isNullOrEmpty(s))
      return errorText ?? 'Value must be provided';
  }
  if (p === ValidationPresets.Guid) {
    const s = value as string;

    if(isNullOrEmpty(s) || s === EmptyGuid)
      return errorText ?? 'Option must be selected';

    if (s.length !== EmptyGuid.length)
      return errorText ?? 'Incorrect key value';
  }
  if (p === ValidationPresets.NumberAny || p === ValidationPresets.NumberPositive) {
    const s = value as string;

    if(isNullOrEmpty(s))
      return errorText ?? 'Value must be entered';

    if (isNaN(Number(s)))
      return errorText ?? 'Incorrect number provided';

    const n = value as number;

    if(isFloat(n))
      return errorText ?? 'Enter an integer value';

    if (p === ValidationPresets.NumberPositive){
      if (n < 0)
        return errorText ?? 'Enter a positive value';
    }
  }
  if (p === ValidationPresets.FloatAny || p === ValidationPresets.FloatPositive) {
    const s = value as string;

    if(isNullOrEmpty(s))
      return errorText ?? 'Value must be entered';

    if (isNaN(Number(s)))
      return errorText ?? 'Incorrect number provided';

    const n = value as number;

    if(!isFloat(n))
      return errorText ?? 'Incorrect number provided';

    if (p === ValidationPresets.FloatPositive) {
      const n = value as number;

      if (n < 0)
        return errorText ?? 'Enter a positive value';
    }
  }

  if (p === ValidationPresets.Year) {
    const s = value as string;

    if(isNullOrEmpty(s))
      return errorText ?? 'Value must be entered';

    if (!Number.isInteger(s))
      return errorText ?? 'Enter a correct year number';

    const n = value as number;

    if (n < 1800 || n > 2200)
      return errorText ?? 'Enter a correct year number';
  }

  return undefined;
}

export default defineComponent({
  name: "VModelValidator",
  emits: [ 'validate' ],
  props: {
    validationFunction: {
      type: Function as PropType<(value: unknown) => string | undefined>,
      default: undefined
    },
    validateAs: {
      type: Number as PropType<ValidationPresets>,
      default: ValidationPresets.StringNotEmpty
    },
    errorText: {
      type: String as PropType<string>,
      default: undefined
    },
  },
  setup(props, options) {
    const finalErrorText = ref<string | undefined>();

    onMounted(() => {
      if(!options.slots.default)
        return;

      const childrenCount = (options.slots.default.call(undefined).length ?? 0);

      if (childrenCount === 0){
        // eslint-disable-next-line no-console
        console.error(`Validator expects at least one child element`);
      } else {
        const elProps = options.slots.default.call(undefined)[0].props;
        if(!elProps)
        {
          // eslint-disable-next-line no-console
          console.error("Validator: child element doesn't seem to have props");
          return;
        }

        const currentValue: unknown = elProps.modelValue ?? elProps.value;

        const doValidate = (value: unknown) => {
          let errorResult;

          if(props.validationFunction) {
            errorResult = props.validationFunction(value);
          } else {
            errorResult = validatePreset(value, props.validateAs, props.errorText);
          }

          finalErrorText.value = errorResult;

          options.emit('validate', new ValidateEvent(errorResult === undefined, value, errorResult ));
        };

        doValidate(currentValue);

        // Both !'s are true here -- we just checked
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        watch(() => options.slots.default!.call(undefined)[0].props!.modelValue, newValue => {
          doValidate(newValue);
        });
        // Let's watch 'value' prop as well
        // Both !'s are true here -- we just checked
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        watch(() => options.slots.default!.call(undefined)[0].props!.value, newValue => {
          doValidate(newValue);
        });
      }
    });

    return {
      finalErrorText
    };
  }
});
</script>