<template>
  <div class="relative w-full overflow-hidden rounded-lg shadow-xl">
    <!-- Slides -->
    <div class="relative h-[400px] md:h-[500px] lg:h-[600px]">
      <TransitionGroup name="slide">
        <div
          v-for="(slide, index) in slides"
          v-show="index === currentSlide"
          :key="index"
          class="absolute inset-0"
        >
          <!-- Image de fond -->
          <div
            class="absolute inset-0 bg-cover bg-center"
            :style="{ backgroundImage: `url(${slide.image})` }"
          >
            <!-- Overlay sombre pour améliorer la lisibilité -->
            <div class="absolute inset-0 bg-black/40"></div>
          </div>

          <!-- Contenu du slide -->
          <div class="relative h-full flex items-center">
            <div class="container mx-auto px-4">
              <div class="max-w-3xl text-white">
                <!-- Badge/Catégorie -->
                <div v-if="slide.badge" class="mb-4">
                  <span class="inline-block px-4 py-2 bg-primary-green rounded-full text-sm font-semibold">
                    {{ slide.badge }}
                  </span>
                </div>

                <!-- Titre -->
                <h2 class="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-4 animate-slide-up">
                  {{ languageStore.getText(slide.title) }}
                </h2>

                <!-- Description -->
                <p class="text-lg md:text-xl mb-8 opacity-90 animate-slide-up animation-delay-200">
                  {{ languageStore.getText(slide.description) }}
                </p>

                <!-- Boutons d'action -->
                <div class="flex flex-wrap gap-4 animate-slide-up animation-delay-400">
                  <router-link
                    v-if="slide.primaryButton"
                    :to="slide.primaryButton.link"
                    class="btn-primary inline-flex items-center"
                  >
                    {{ languageStore.getText(slide.primaryButton.text) }}
                    <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                    </svg>
                  </router-link>

                  <router-link
                    v-if="slide.secondaryButton"
                    :to="slide.secondaryButton.link"
                    class="btn-outline border-white text-white hover:bg-white hover:text-primary-green inline-flex items-center"
                  >
                    {{ languageStore.getText(slide.secondaryButton.text) }}
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TransitionGroup>
    </div>

    <!-- Contrôles de navigation -->
    <div class="absolute bottom-6 left-0 right-0 z-10">
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between">
          <!-- Boutons Précédent/Suivant -->
          <div class="flex gap-2">
            <button
              @click="prevSlide"
              class="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-colors text-white"
              aria-label="Slide précédent"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>

            <button
              @click="nextSlide"
              class="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-colors text-white"
              aria-label="Slide suivant"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>

          <!-- Indicateurs de slide -->
          <div class="flex gap-2">
            <button
              v-for="(slide, index) in slides"
              :key="index"
              @click="goToSlide(index)"
              class="h-2 rounded-full transition-all"
              :class="index === currentSlide ? 'w-8 bg-white' : 'w-2 bg-white/50 hover:bg-white/75'"
              :aria-label="`Aller au slide ${index + 1}`"
            ></button>
          </div>

          <!-- Bouton Play/Pause -->
          <button
            @click="toggleAutoplay"
            class="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm flex items-center justify-center transition-colors text-white"
            :aria-label="isPlaying ? 'Mettre en pause' : 'Lecture automatique'"
          >
            <svg v-if="isPlaying" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"></path>
            </svg>
            <svg v-else class="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useLanguageStore } from '@/stores/language'

const languageStore = useLanguageStore()

// Props
const props = defineProps({
  slides: {
    type: Array,
    required: true,
    default: () => []
  },
  autoplayDelay: {
    type: Number,
    default: 5000 // 5 secondes
  }
})

// State
const currentSlide = ref(0)
const isPlaying = ref(true)
let autoplayInterval = null

// Méthodes
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % props.slides.length
}

const prevSlide = () => {
  currentSlide.value = currentSlide.value === 0
    ? props.slides.length - 1
    : currentSlide.value - 1
}

const goToSlide = (index) => {
  currentSlide.value = index
}

const toggleAutoplay = () => {
  isPlaying.value = !isPlaying.value
  if (isPlaying.value) {
    startAutoplay()
  } else {
    stopAutoplay()
  }
}

const startAutoplay = () => {
  if (autoplayInterval) clearInterval(autoplayInterval)
  autoplayInterval = setInterval(() => {
    nextSlide()
  }, props.autoplayDelay)
}

const stopAutoplay = () => {
  if (autoplayInterval) {
    clearInterval(autoplayInterval)
    autoplayInterval = null
  }
}

// Lifecycle
onMounted(() => {
  if (isPlaying.value) {
    startAutoplay()
  }
})

onUnmounted(() => {
  stopAutoplay()
})

// Pause l'autoplay au survol
const handleMouseEnter = () => {
  if (isPlaying.value) {
    stopAutoplay()
  }
}

const handleMouseLeave = () => {
  if (isPlaying.value) {
    startAutoplay()
  }
}
</script>

<style scoped>
/* Animations de transition des slides */
.slide-enter-active {
  transition: all 0.6s ease;
}

.slide-leave-active {
  transition: all 0.6s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}

/* Animations du contenu */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slideUp 0.8s ease-out forwards;
}

.animation-delay-200 {
  animation-delay: 0.2s;
  opacity: 0;
}

.animation-delay-400 {
  animation-delay: 0.4s;
  opacity: 0;
}
</style>
