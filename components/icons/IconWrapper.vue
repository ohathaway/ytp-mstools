<template>
  <component
    :is="iconComponent"
    v-bind="$attrs"
    :width="width"
    :height="height"
    :color="color"
  />
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  icon: {
    type: [String, Object],
    required: true
  },
  width: {
    type: [Number, String],
    default: 24
  },
  height: {
    type: [Number, String],
    default: 24
  },
  color: {
    type: String,
    default: 'currentColor'
  }
});

const iconComponent = computed(() => {
  if (typeof props.icon === 'string') {
    // Assuming the icon is a string representing the component name
    return resolveComponent(props.icon);
  } else {
    // If it's an object, assume it's already a component
    return props.icon;
  }
})
</script>