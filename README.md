# Simple validation component for vuejs 3.0+

This validator will work only with components which implement `v-model` or `v-model:value` functionality (more on this [here](https://v3-migration.vuejs.org/breaking-changes/v-model.html)).

# Installation

`npm install vue-vmodel-validator`

You can use it as a plugin:
``` ts
import validationControl from 'vue-vmodel-validator';

app.use(validationControl);
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
  <input v-model:text="Entity.Name" />
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

You can ocerride default error message with `error-text` prop:
``` ts
import { ValidationPresets } from 'vue-vmodel-validator';
```
``` html
<validator :validate-as="ValidationPresets.Year" error-text="Enter a valid birth year">
  <input v-model:text="Entity.BirthYear" />
</validator>
```

## Using custom validation function
If you want to implement some different or more complex logic, use `validation-function` props. It receives component value and should return `undefined` or error text.
``` ts
const validateAge = (value: number): string | undefined => {
  if(value < 1 || value > 200)
      return "Age must be in a range between 1 and 200";
      
  return undefined;
}
```
``` html
<validator :validate-function="validateAge">
  <input v-model:text="Entity.Age" />
</validator>
```
When `validation-function` is used, `error-text` prop will be ignored.

# Events

`validate`: when validation occures. Passes `ValidateEvent` object.

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
