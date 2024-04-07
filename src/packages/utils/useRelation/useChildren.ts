import { reactive, provide, InjectionKey } from 'vue'

export const useChildren = <T>(key: symbol | InjectionKey<T>) => {
  const publicChildren = reactive<any[]>([])
  const internalChildren = reactive<any[]>([])

  const linkChildren = (value?: T) => {
    const link = (child: any) => {
      if (child.proxy) {
        internalChildren.push(child)
        publicChildren.push(child.proxy)
      }
    }

    const unlink = (child: any) => {
      if (child.proxy) {
        const internalIndex = internalChildren.indexOf(child)
        if (internalIndex > -1) {
          internalChildren.splice(internalIndex, 1)
        }

        const publicIndex = publicChildren.indexOf(child.proxy)
        if (internalIndex > -1) {
          publicChildren.splice(publicIndex, 1)
        }
      }
    }

    provide(key, {
      unlink,
      link,
      children: publicChildren,
      internalChildren,
      ...value
    })
  }

  return {
    children: publicChildren,
    linkChildren
  }
}
