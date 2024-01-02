import { useDark as useVueUseDark, useToggle } from '@vueuse/core';

export const useDark = () => {
  const isDark = useVueUseDark();
  const toggleDark = useToggle(isDark);
  return {
    isDark,
    toggleDark
  };
};
