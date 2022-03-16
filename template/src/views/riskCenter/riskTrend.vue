<template>
  <div>
    <!-- <v-card
      max-width="600"
      class="mx-auto pa-3 px-5"
      style="margin-top:50px;"
    >
      <div class="d-flex">
        <div class="v-card--material__heading theme--dark v-sheet mb-n6 success pa-7">
          <div class="display-2 font-weight-light">Employuess Stats</div>
          <div class="subtitle-1 font-weight-light">New eemployse on 15sh September,2016</div>
        </div>
      </div>

      <v-container>
        <v-row dense>
          <v-col cols="12">
            <v-card
              color="#385F73"
              dark
            >
              <v-card-title class="headline">Unlimited music now</v-card-title>

              <v-card-subtitle>Listen to your favorite artists and albums whenever and wherever, online and offline.</v-card-subtitle>

              <v-card-actions>
                <v-btn text>Listen Now</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>

          <v-col
            v-for="(item, i) in items"
            :key="i"
            cols="12"
          >
            <v-card
              :color="item.color"
              dark
            >
              <div class="d-flex flex-no-wrap justify-space-between">
                <div>
                  <v-card-title
                    class="headline"
                    v-text="item.title"
                  ></v-card-title>

                  <v-card-subtitle v-text="item.artist"></v-card-subtitle>
                </div>

                <v-avatar
                  class="ma-3"
                  size="125"
                  tile
                >
                  <v-img :src="item.src"></v-img>
                </v-avatar>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card> -->
    <h3>风险趋势页</h3>
  </div>
</template>
<script>
export default {
  name: 'riskTrend',
  data: () => ({
    items: [
      {
        color: '#1F7087',
        src: 'https://cdn.vuetifyjs.com/images/cards/foster.jpg',
        title: 'Supermodel',
        artist: 'Foster the People'
      },
      {
        color: '#952175',
        src: 'https://cdn.vuetifyjs.com/images/cards/halcyon.png',
        title: 'Halcyon Days',
        artist: 'Ellie Goulding'
      }
    ]
  })
};
</script>
<style lang="stylus" scoped>
  .v-card--material__heading
    position: relative;
    top: -40px;
    -webkit-transition: .3s ease;
    transition: .3s ease;
    z-index: 1;
</style>
