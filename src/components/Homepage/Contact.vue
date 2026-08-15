<script setup lang="ts">
import { ref } from 'vue'
import Envelope from '../Envelope.vue'

const CONTACT_EMAIL = 'idlan9114@gmail.com'

const form = ref({
  name: '',
  email: '',
  message: '',
  'bot-field': '',
})

type SubmitStatus = 'idle' | 'sending' | 'success' | 'error'
const submitStatus = ref<SubmitStatus>('idle')

const encodeFormData = (data: Record<string, string>) =>
  Object.keys(data)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join('&')

const handleSubmit = async () => {
  if (form.value['bot-field']) return // honeypot tripped, silently drop

  submitStatus.value = 'sending'

  try {
    const response = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encodeFormData({ 'form-name': 'contact', ...form.value }),
    })

    if (!response.ok) throw new Error(`Request failed: ${response.status}`)

    submitStatus.value = 'success'
    form.value = { name: '', email: '', message: '', 'bot-field': '' }
  } catch {
    submitStatus.value = 'error'
  }
}

const emailCopied = ref(false)
let copyResetTimeout: number | undefined

const copyEmail = async () => {
  try {
    await navigator.clipboard.writeText(CONTACT_EMAIL)
  } catch {
    return
  }

  emailCopied.value = true
  window.clearTimeout(copyResetTimeout)
  copyResetTimeout = window.setTimeout(() => {
    emailCopied.value = false
  }, 2000)
}
</script>

<template>
  <section id="contact" class="bg-[#ecebeb] py-20">
    <div class="container mx-auto">
      <div class="mb-14 text-center">
        <h1 class="text-center text-[40px] font-sans text-black">Contact Me</h1>
        <p class="mt-4 text-[20px] text-black">
          Have a project in mind or just want to say hi? Send me a message.
        </p>
      </div>

      <div class="flex flex-col lg:flex-row gap-12 lg:justify-center items-center lg:items-start">
        <form
          name="contact"
          data-netlify="true"
          netlify-honeypot="bot-field"
          @submit.prevent="handleSubmit"
          class="w-full lg:w-1/3 flex flex-col gap-5"
        >
          <input type="hidden" name="form-name" value="contact" />
          <input
            v-model="form['bot-field']"
            type="text"
            name="bot-field"
            tabindex="-1"
            autocomplete="off"
            class="hidden"
            aria-hidden="true"
          />

          <div class="flex flex-col gap-2">
            <label for="name" class="text-sm font-medium text-[#4e4539]">Name</label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              placeholder="Your name"
              class="rounded-full border border-[#d8d2c6] bg-white px-6 py-3 text-black placeholder:text-neutral-400 outline-none transition focus:border-[#4e4539] focus:ring-2 focus:ring-[#b4a899]"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label for="email" class="text-sm font-medium text-[#4e4539]">Email</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              placeholder="your@email.com"
              class="rounded-full border border-[#d8d2c6] bg-white px-6 py-3 text-black placeholder:text-neutral-400 outline-none transition focus:border-[#4e4539] focus:ring-2 focus:ring-[#b4a899]"
            />
          </div>

          <div class="flex flex-col gap-2">
            <label for="message" class="text-sm font-medium text-[#4e4539]">Message</label>
            <textarea
              id="message"
              v-model="form.message"
              required
              rows="5"
              placeholder="Tell me about your project..."
              class="rounded-[24px] border border-[#d8d2c6] bg-white px-6 py-3 text-black placeholder:text-neutral-400 outline-none transition focus:border-[#4e4539] focus:ring-2 focus:ring-[#b4a899] resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            :disabled="submitStatus === 'sending'"
            class="mt-2 w-full lg:w-auto self-center lg:self-start cursor-pointer px-8 py-3 bg-[#4e4539] text-white rounded-full hover:bg-[#5e5850] transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            {{ submitStatus === 'sending' ? 'Sending...' : 'Send Message' }}
          </button>

          <p v-if="submitStatus === 'success'" class="text-sm text-center lg:text-left text-green-700">
            Thanks! Your message has been sent.
          </p>
          <p v-else-if="submitStatus === 'error'" class="text-sm text-center lg:text-left text-red-700">
            Something went wrong. Please try emailing me directly.
          </p>
        </form>

        <div class="w-full lg:w-1/2 flex flex-col items-center gap-6">
          <Envelope />

          <button
            type="button"
            @click="copyEmail"
            class="flex items-center gap-3 px-6 py-3 rounded-full bg-white border border-[#d8d2c6] text-[#4e4539] hover:bg-[#f4f0eb] transition-colors cursor-pointer"
          >
            <svg v-if="!emailCopied" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            {{ emailCopied ? 'Copied to clipboard!' : CONTACT_EMAIL }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
