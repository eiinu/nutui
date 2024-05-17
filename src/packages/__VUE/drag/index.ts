import Drag from './drag.vue'
import type { ComponentPublicInstance } from 'vue'
import { withInstall } from '@/packages/utils'

withInstall(Drag)

export type { DragProps } from './drag.vue'

export type { } from './types'

export type DragInstance = ComponentPublicInstance & InstanceType<typeof Drag>

export { Drag, Drag as default }
