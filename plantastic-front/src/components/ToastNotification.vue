<template>
  <Teleport to="body">
    <Transition name="toast">
      <div v-if="visible" class="toast">
        {{ message }}
      </div>
    </Transition>
  </Teleport>
</template>

<script>
import { useToast } from '@/composables/useToast'

export default {
  name: 'ToastNotification',
  setup() {
    const { message, visible } = useToast()
    return { message, visible }
  }
}
</script>

<style scoped>
.toast {
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  background: #78A882;
  color: #fff;
  padding: 12px 28px;
  border-radius: 8px;
  font-family: var(--font-principal, 'Figtree', sans-serif);
  font-size: 0.95rem;
  font-weight: 500;
  box-shadow: 0 4px 16px rgba(0,0,0,0.18);
  z-index: 2000;
  white-space: nowrap;
}

.toast-enter-active { transition: all 0.25s ease; }
.toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from { opacity: 0; transform: translateX(-50%) translateY(16px); }
.toast-leave-to  { opacity: 0; transform: translateX(-50%) translateY(16px); }
</style>
