<template>
  <component
    :is="iconComponent"
    v-bind="$attrs"
    :width="width"
    :height="height"
    :color="color"
    :class="{ 'shake-animation': isShaking }"
    @click="handleClick"
  />
</template>

<script setup>
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
  },
  shakeOnClick: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const iconComponent = computed(() => {
  if (typeof props.icon === 'string') {
    // Assuming the icon is a string representing the component name
    return resolveComponent(props.icon);
  } else {
    // If it's an object, assume it's already a component
    return props.icon;
  }
})

const isShaking = ref(false)

const triggerShake = () => {
  isShaking.value = true
  setTimeout(() => {
    isShaking.value = false
  }, 500)
}

const handleClick = event => {
  (props.shakeOnClick) && triggerShake()
  emit('click', event)
}
</script>

<style scoped>
@keyfrrames shake {
  0% { transform: translate(1px, 1px) rotate(0deg); }
  10% { transform: translate(-1px, -2px) rotate(-1deg); }
  20% { transform: translate(-3px, 0px) rotate(1deg); }
  30% { transform: translate(3px, 2px) rotate(0deg); }
  40% { transform: translate(1px, -1px) rotate(1deg); }
  50% { transform: translate(-1px, 2px) rotate(-1deg); }
  60% { transform: translate(-3px, 1px) rotate(0deg); }
  70% { transform: translate(3px, 1px) rotate(-1deg); }
  80% { transform: translate(-1px, -1px) rotate(1deg); }
  90% { transform: translate(1px, 2px) rotate(0deg); }
  100% { transform: translate(1px, -2px) rotate(-1deg); }
}

.shake-animation {
  animation: shake 0.5s;
  animation-iteration-count: 1;
}
</style>