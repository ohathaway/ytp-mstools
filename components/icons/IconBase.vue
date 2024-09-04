<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    :height="height"
    :viewBox="viewBox"
    :aria-labelledby="iconName"
    role="presentation"
    :fill="fill"
  >
    <title :id="iconName" lang="en">{{ iconName }} icon</title>
    <g>
      <slot></slot>
    </g>
  </svg>
</template>

<script setup>
const props = defineProps({
  iconName: {
    type: String,
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
  fill: {
    type: String,
    default: 'currentColor'
  },
  viewBox: {
    type: String,
    default: '0 0 24 24'
  }
});

const parsedWidth = computed(() => typeof props.width === 'number' ? `${props.width}px` : props.width);
const parsedHeight = computed(() => typeof props.height === 'number' ? `${props.height}px` : props.height);
</script>