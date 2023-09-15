<template>
  <v-select active v-model="languageModel" :items="locales" density="comfortable" flat
            hide-selected item-title="text" item-value="value"
            variant="outlined" class="v-select-astra">
    <template v-slot:prepend-inner>
      <PhGlobe :size="22" color="gray"/>
    </template>
  </v-select>
</template>

<script setup>
import {onMounted, ref, watch} from "vue";
import {useRouter} from "vue-router"
import Tr from "@/util/translations"
import {useI18n} from 'vue-i18n';
import {PhGlobe} from "@phosphor-icons/vue";

const {t, locale} = useI18n();

const supportedLocales = Tr.supportedLocales;
let locales = ref([]);

for (let trLocale of Tr.supportedLocales) {
  let value = trLocale === 'cn' ? 'cn' : t('lang.' + trLocale);
  locales.value.push({
    text: t('lang.' + trLocale).toUpperCase(),
    value: value
  });
}

let languageModel = ref()

const router = useRouter()

const switchLanguage = async () => {
  const newLocale = languageModel
  await Tr.switchLanguage(newLocale.value)

  try {
    await router.replace({params: {locale: newLocale.value}})
  } catch (e) {
    console.log(e)
    await router.push("/")
  }
}
onMounted(() => {
  languageModel.value = supportedLocales[supportedLocales.indexOf(router.currentRoute.value.params.locale)];
})

watch(languageModel, () => {
  switchLanguage();
})
</script>
<style scoped lang="scss">

.v-select-astra {
  min-width: 125px;
}
</style>
