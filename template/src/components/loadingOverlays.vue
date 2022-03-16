<template>
  <v-dialog
    :value="overlay"
    width="400"
    persistent
  >
    <v-card style="overflow: hidden;">
      <v-card-title class="mt-4" style="font-size: 16px;">
        {{ title }}
      </v-card-title>
      <v-card-text class="my-4">
        <v-progress-linear
          :color="color"
          class="mb-0"
          height="15"
          rounded
          :value="progress"
        >
          <template v-slot:default="{ value }">
            <span>{{ Math.ceil(value) }}%</span>
          </template>
        </v-progress-linear>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'loadingOverlays',
  props: {
    overlay: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: 'var(--v-primary-base)'
    },
    progress: {
      type: Number,
      default: 0
    },
    title: {
      type: String,
      default: '正在导入...'
    }
  },
  mounted () {},
  methods: {}
};
</script>

<style scoped>

</style>
