import type { Component, App } from 'vue';

export type ComponentWithInstall<T> = T & {
  install: (vue: App) => void;
};

export const withInstall = <T extends Component>(component: T): ComponentWithInstall<T> => {
  (component as ComponentWithInstall<T>).install = (vue: App) => {
    if (component.name) {
      vue.component(component.name, component);
    }
  };
  return component as ComponentWithInstall<T>;
};
