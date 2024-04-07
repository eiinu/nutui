import { getCurrentInstance, computed, inject, onUnmounted, InjectionKey } from 'vue'

export const useParent = <T>(key: symbol | InjectionKey<T>) => {
  const parent = inject<T & {
    unlink: (child: any) => void
    link: (child: any) => void
    children: any[]
    internalChildren: any[]
  } | null>(key, null)

  if (parent) {
    const instance = getCurrentInstance()!
    const { link, unlink, internalChildren } = parent

    link(instance)
    onUnmounted(() => {
      unlink(instance)
    })
    const index = computed(() => internalChildren.indexOf(instance))

    return { parent, index }
  }

  return {
    parent,
    index: computed(() => -1)
  }
}
