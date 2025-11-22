<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-green-600 to-blue-600 text-white py-20">
      <div class="container mx-auto px-4">
        <h1 class="text-4xl md:text-5xl font-bold mb-6">{{ $t('about.title') }}</h1>
        <p class="text-xl md:text-2xl max-w-3xl">{{ $t('about.subtitle') }}</p>
      </div>
    </section>

    <!-- Mission Section -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-3xl font-bold text-gray-900 mb-6">{{ $t('about.mission.title') }}</h2>
            <p class="text-gray-700 text-lg leading-relaxed mb-4">
              {{ $t('about.mission.description') }}
            </p>
            <p class="text-gray-700 text-lg leading-relaxed">
              {{ $t('about.mission.goal') }}
            </p>
          </div>
          <div class="bg-white p-8 rounded-lg shadow-lg">
            <h3 class="text-2xl font-bold text-gray-900 mb-4">{{ $t('about.objectives.title') }}</h3>
            <ul class="space-y-3">
              <li class="flex items-start">
                <svg class="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span class="text-gray-700">{{ $t('about.objectives.obj1') }}</span>
              </li>
              <li class="flex items-start">
                <svg class="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span class="text-gray-700">{{ $t('about.objectives.obj2') }}</span>
              </li>
              <li class="flex items-start">
                <svg class="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span class="text-gray-700">{{ $t('about.objectives.obj3') }}</span>
              </li>
              <li class="flex items-start">
                <svg class="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span class="text-gray-700">{{ $t('about.objectives.obj4') }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- UEMOA Countries Section -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-gray-900 mb-12 text-center">{{ $t('about.countries.title') }}</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div v-for="country in countries" :key="country.code" class="text-center p-6 bg-gray-50 rounded-lg hover:shadow-lg transition">
            <div class="text-4xl mb-3">{{ country.flag }}</div>
            <h3 class="font-bold text-gray-900">{{ country.name }}</h3>
            <p class="text-sm text-gray-600">{{ country.capital }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Energy Types Section -->
    <section class="py-16 bg-gray-50">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-gray-900 mb-12 text-center">{{ $t('about.energies.title') }}</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition">
            <div class="text-yellow-500 text-4xl mb-4">☀️</div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">{{ $t('about.energies.solar') }}</h3>
            <p class="text-gray-700">{{ $t('about.energies.solarDesc') }}</p>
          </div>
          <div class="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition">
            <div class="text-blue-500 text-4xl mb-4">💨</div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">{{ $t('about.energies.wind') }}</h3>
            <p class="text-gray-700">{{ $t('about.energies.windDesc') }}</p>
          </div>
          <div class="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition">
            <div class="text-blue-700 text-4xl mb-4">💧</div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">{{ $t('about.energies.hydro') }}</h3>
            <p class="text-gray-700">{{ $t('about.energies.hydroDesc') }}</p>
          </div>
          <div class="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition">
            <div class="text-green-700 text-4xl mb-4">🌾</div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">{{ $t('about.energies.biomass') }}</h3>
            <p class="text-gray-700">{{ $t('about.energies.biomassDesc') }}</p>
          </div>
          <div class="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition">
            <div class="text-orange-600 text-4xl mb-4">🌡️</div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">{{ $t('about.energies.geothermal') }}</h3>
            <p class="text-gray-700">{{ $t('about.energies.geothermalDesc') }}</p>
          </div>
          <div class="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition">
            <div class="text-teal-600 text-4xl mb-4">🌊</div>
            <h3 class="text-xl font-bold text-gray-900 mb-3">{{ $t('about.energies.marine') }}</h3>
            <p class="text-gray-700">{{ $t('about.energies.marineDesc') }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-16 bg-gradient-to-r from-green-600 to-blue-600 text-white">
      <div class="container mx-auto px-4 text-center">
        <h2 class="text-3xl font-bold mb-6">{{ $t('about.cta.title') }}</h2>
        <p class="text-xl mb-8 max-w-2xl mx-auto">{{ $t('about.cta.description') }}</p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link
            to="/register"
            class="px-8 py-3 bg-white text-green-600 font-semibold rounded-lg hover:bg-gray-100 transition"
          >
            {{ $t('about.cta.register') }}
          </router-link>
          <router-link
            to="/actors"
            class="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-green-600 transition"
          >
            {{ $t('about.cta.explore') }}
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const countries = ref([
  { code: 'BJ', name: 'Bénin', capital: 'Porto-Novo', flag: '🇧🇯' },
  { code: 'BF', name: 'Burkina Faso', capital: 'Ouagadougou', flag: '🇧🇫' },
  { code: 'CI', name: "Côte d'Ivoire", capital: 'Yamoussoukro', flag: '🇨🇮' },
  { code: 'GW', name: 'Guinée-Bissau', capital: 'Bissau', flag: '🇬🇼' },
  { code: 'ML', name: 'Mali', capital: 'Bamako', flag: '🇲🇱' },
  { code: 'NE', name: 'Niger', capital: 'Niamey', flag: '🇳🇪' },
  { code: 'SN', name: 'Sénégal', capital: 'Dakar', flag: '🇸🇳' },
  { code: 'TG', name: 'Togo', capital: 'Lomé', flag: '🇹🇬' }
])
</script>
