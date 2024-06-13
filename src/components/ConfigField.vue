<script setup lang="ts">
import { json } from '@codemirror/lang-json'
import { ref } from 'vue'
import { Codemirror } from 'vue-codemirror'
import { AutoFormLabel, type FieldProps } from './ui/auto-form'
import { beautifyObjectName } from './ui/auto-form/utils'
import { FormControl, FormField, FormItem, FormMessage } from './ui/form'

defineProps<FieldProps>()

const value = ref()
</script>

<template>
  <FormField :name="fieldName" v-model="value">
    <FormItem>
      <AutoFormLabel v-if="!config?.hideLabel" :required="required">
        {{ config?.label || beautifyObjectName(label ?? fieldName) }}
      </AutoFormLabel>
      <FormControl>
        <input class="hidden" />
      </FormControl>
      <Codemirror
        v-model="value"
        :extensions="[json()]"
        style="
          margin-top: 9px;
          border-color: hsl(var(--input));
          border-width: 1px;
        "
      />
      <FormMessage />
    </FormItem>
  </FormField>
</template>
