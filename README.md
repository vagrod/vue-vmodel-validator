# Simple validation component for vuejs 3.0+

This validator will work only with components which implement `v-model` or `v-model:value` functionality (more on this [here](https://v3-migration.vuejs.org/breaking-changes/v-model.html)). It will work, for example, with [naiveui](https://naiveui.com) or [primevue](https://primefaces.org/primevue) components, or any other suite that implements `modelValue` or `value` props with `update:modelValue` or `update:value` events.

# Installation

`npm install vue-vmodel-validator`

You can use it as a plugin:
``` ts
import { createApp } from 'vue'
import App from './App.vue'

import validationControl from 'vue-vmodel-validator';

const app = createApp(App);

app.use(validationControl);
app.mount('#app')
```
This way, component `validator` will be available everywhere in a project.

Or you can import it manually:

``` ts
import { Validator } from 'vue-vmodel-validator';
```

# Usage

## Simple
Preset `StringNotEmpty` will be used by default.
``` html
<validator>
  <n-input v-model:value="Entity.Name" />
</validator>
```

## Using validation presets
``` ts
import { ValidationPresets } from 'vue-vmodel-validator';
```
``` html
<validator :validate-as="ValidationPresets.Guid">
  <select-box v-model:value="Entity.OrderId" />
</validator>
```

Presets are
```
StringNotEmpty
NumberAny
NumberPositive
FloatAny
FloatPositive
Year
Guid
```

You can override default error message with `error-text` prop:
``` ts
import { ValidationPresets } from 'vue-vmodel-validator';
```
``` html
<validator :validate-as="ValidationPresets.Year" error-text="Enter a valid birth year">
  <n-input v-model:value="Entity.BirthYear" />
</validator>
```

## Using custom validation function
If you want to implement some different or more complex logic, use `validation-function` props. It receives component value and should return `undefined` or error text.
``` ts
const validateAge = (value: unknown): string | undefined => {
  const n = Number(value);

  if(isNaN(n))
    return 'Enter a valid number';

  if(n < 1 || n > 200)
    return "Age must be in a range between 1 and 200";

  return undefined; // no errors here
}
```
``` html
<validator :validation-function="validateAge">
  <n-input v-model:value="Entity.Age" />
</validator>
```
When `validation-function` is used, `error-text` prop will be ignored.

# Events

`validate`: when validation occurs. Passes `ValidateEvent` object.

# Templating

You can define any visual representation of a validation error by overriding `message` slot:
``` html
<validator ... >
   ...
   <template #message={text}>
       <span class="my-error-class">{{text}}</span>
   </template>
</validator>
```

# Checking validation status

In order to check the overall validation status and use it to, for example, disable some buttons if the form has invalid fields, you need to use the `ValidationMarkerMap` class.
It should be created once, and its `set` method must be called every time the validation status changes.

When you call `set`, you tell it to "remember" the result of this particular validation under some unique key name. For example,

``` html
<validation @validate="v.set('my-field', $event)" ... >
  ...
</validation>
```

When constructing this class, you must specify one or two strings: some string value that will be returned if validation is failed, and a string for succeeded validation. These strings can be used, for example, in a markdown to dynamically change "valid-invalid" css classes of components that are being validated. For example:

``` ts
import { ValidationMarkerMap } from 'vue-vmodel-validator';
...
setup() {
  return {
    ...
    v: new ValidationMarkerMap('invalid-field', 'valid-field'),
  };
}
``` 
``` html
<validation @validate="v.set('name-field', $event)" ... >
  <n-input v-model:value="Entity.Name" :class="v.get('name-field')" />
</validation>
```
``` css
.invalid-field {
  background-color: red;
},
.valid-field {
  background-color: white;
}
```
or omitting "valid css class":
``` ts
import { ValidationMarkerMap } from 'vue-vmodel-validator';
...
setup() {
  return {
    ...
    v: new ValidationMarkerMap('invalid-field'),
  };
}
``` 
``` html
<validation @validate="v.set('name-field', $event)" ... >
  <n-input v-model:value="Entity.Name" :class="v.get('name-field')" />
</validation>
```
``` css
.invalid-field {
  background-color: red;
}
```

To check overall validation status, call `validateAll`:
``` html
<n-button :disabled="!v.validateAll()" ... />
```
