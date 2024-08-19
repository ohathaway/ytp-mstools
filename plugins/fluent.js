import {
  provideFluentDesignSystem,
  fluentCard,
  fluentButton,
  fluentRadio,
  fluentRadioGroup,
  fluentSearch,
  fluentTab,
  fluentTabPanel,
  fluentTabs
} from '@fluentui/web-components';

export default defineNuxtPlugin(nuxtApp => {
  provideFluentDesignSystem()
    .register(
      fluentCard(),
      fluentButton(),
      fluentRadio(),
      fluentRadioGroup(),
      fluentSearch(),
      fluentTab(),
      fluentTabPanel(),
      fluentTabs()
    )
})