import {
  provideFluentDesignSystem,
  fluentAccordion,
  fluentAccordionItem,
  fluentCard,
  fluentButton,
  fluentDivider,
  fluentRadio,
  fluentRadioGroup,
  fluentSearch,
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
      fluentRadio(),
      fluentRadioGroup(),
      fluentSearch(),
      fluentTab(),
      fluentTabPanel(),
      fluentTabs(),
      fluentTooltip()
    )
})