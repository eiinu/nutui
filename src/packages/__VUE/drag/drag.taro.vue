<template>
  <view :id="'myDrag' + refRandomId" ref="myDrag" class="nut-taro-drag myDrag" :catch-move="true" :style="{
          transform: `translate(${state.left + 'px'}, ${state.top + 'px'})`,
          top: state.top + 'px',
          left: state.left + 'px'
        }"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="handleTouchEnd"
  >
    <slot></slot>
  </view>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useTaroRect } from '@/packages/utils/useTaroRect'
import Taro from '@tarojs/taro'
import type { DragDirection } from './types'

defineOptions({
  name: 'NutDrag'
})

export type DragProps = Partial<{
  direction: DragDirection
}>

const props = withDefaults(defineProps<DragProps>(), {
  direction: 'all'
})

const myDrag = ref()
const refRandomId = Math.random().toString(36).slice(-8)

const state = reactive({
  elWidth: 0,
  elHeight: 0,
  screenWidth: 0,
  screenHeight: 0,
  startTop: 0,
  startLeft: 0,
  initTop: 0,
  initLeft: 0,
  nx: 0,
  ny: 0,
  xPum: 0,
  yPum: 0,
  top: 0,
  left: 0,
  position: { x: 0, y: 0 },
  boundary: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  } as Record<string, any>
})

const getInfo = () => {
  const domElem = Taro.getSystemInfoSync()
  useTaroRect(myDrag).then(
    (rec: any) => {
      state.elWidth = rec.width
      state.elHeight = rec.height
      state.initTop = rec.top
      state.initLeft = rec.left
      state.screenWidth = domElem.screenWidth
      state.screenHeight = domElem.screenHeight
    },
    () => { }
  )
}

const handleTouchMove = (e: TouchEvent) => {
  e.preventDefault()
  if (e.touches.length === 1) {
    const touch = e.touches[0]
    state.nx = touch.clientX - state.position.x
    state.ny = touch.clientY - state.position.y
    state.xPum = state.startLeft + state.nx
    state.yPum = state.startTop + state.ny

    const rightLocation = state.screenWidth - state.elWidth - state.boundary.right
    if (Math.abs(state.xPum + state.initLeft) > rightLocation) {
      state.xPum = rightLocation - state.initLeft
    } else if (state.xPum + state.initLeft <= state.boundary.left) {
      state.xPum = state.boundary.left - state.initLeft
    }

    if (state.yPum + state.initTop < state.boundary.top) {
      state.yPum = state.boundary.top - state.initTop
    } else if (state.yPum + state.initTop > state.screenHeight - state.elHeight - state.boundary.bottom) {
      state.yPum = state.screenHeight - state.elHeight - state.boundary.bottom - state.initTop
    }

    if (props.direction != 'y') {
      state.left = state.xPum
    }
    if (props.direction != 'x') {
      state.top = state.yPum
    }
  }
}

const handleTouchEnd = (e: TouchEvent) => {
  const touch = e.changedTouches[0]
  let currX = touch.clientX
  const rightLocation = state.screenWidth - state.elWidth - state.boundary.right
  if (currX > rightLocation) {
    currX = rightLocation
  } else if (currX < state.boundary.left) {
    currX = state.boundary.left
  } else {
    currX = currX < state.screenWidth / 2 ? state.boundary.left : rightLocation
  }
  if (props.direction !== 'x') {
    state.top = state.yPum
  }
}

const handleTouchStart = (e: TouchEvent) => {
  const query = Taro.createSelectorQuery()
  let id = (e as any)?.mpEvent?.currentTarget.id
  let offsetTop = (e as any)?.currentTarget?.offsetTop
  let offsetLeft = (e as any)?.currentTarget?.offsetLeft
  const touches = e.touches[0]
  const mobileTop = (e.touches[0]?.target as any)?.parentNode?.style.top
  const mobileLeft = (e.touches[0]?.target as any)?.parentNode?.style.left
  query
    .selectAll('.myDrag')
    .boundingClientRect((rec: any) => {
      // 判断当前是要拖拽哪个元素
      rec.forEach((element: any) => {
        // 微信环境
        if (id && id == element.id) {
          state.startTop = element.top - offsetTop
          state.startLeft = element.left - offsetLeft
        } else if (mobileTop) {
          // h5环境
          state.startTop = Number(mobileTop.slice(0, -2))
          state.startLeft = Number(mobileLeft.slice(0, -2))
        }
      })
    })
    .exec()
  state.position.x = touches.clientX
  state.position.y = touches.clientY
}

onMounted(() => {
  setTimeout(() => {
    getInfo()
  }, 200)
})

</script>
