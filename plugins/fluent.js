import {
  provideFluentDesignSystem,
  fluentAccordion,
  fluentAccordionItem,
  fluentCard,
  fluentButton,
  fluentDivider,
  fluentOption,
  fluentRadio,
  fluentRadioGroup,
  fluentSearch,
  fluentSelect,
  fluentTab,
  fluentTabPanel,
  fluentTabs,
  fluentTooltip
} from '@fluentui/web-components';

export default defineNuxtPlugin(nuxtApp => {
  provideFluentDesignSystem()
    .register(
      fluentAccordion(),
      fluentAccordionItem(),
      fluentCard(),
      fluentButton(),
      fluentDivider(),
      fluentOption(),
      fluentRadio(),
      fluentRadioGroup(),
      fluentSearch(),
      fluentSelect(),
      fluentTab(),
      fluentTabPanel(),
      fluentTabs(),
      fluentTooltip()
    )
})