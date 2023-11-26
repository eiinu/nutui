import { App, defineComponent, ComponentOptions } from 'vue';
const camelize = (s: string) => s.replace(/-./g, (x) => x[1].toUpperCase());

export function createComponent(name: string) {
  // TODO: It will be deprecated someday.
  const componentName = 'nut-' + name;
  const n = 'Nut' + camelize('-' + name);
  return {
    name: n,
    componentName,
    create: function (_component: ComponentOptions) {
      _component.name = n;
      _component.install = (vue: App) => {
        vue.component(_component.name as string, _component as any);
      };
      return defineComponent(_component as ComponentOptions);
    } as typeof defineComponent
  };
}
