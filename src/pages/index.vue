<script>
export default {
  name: 'page-index',
  methods: {
    goTo (route) {
      this.$router.push({ path: route })
    }
  },
  data () {
    return {
      cards: [
        {
          title: '<b>Manage</b> Profile',
          img: '../statics/app-icons/my-profile.png',
          description: 'Manage your identity.  Buy, stake, send tokens and discover apps.',
          route: '/profiles/myProfile'
        },
        {
          title: 'Find <b>Contacts</b>',
          img: '../statics/app-icons/my-profile.png',
          description: 'Find and view Telos account profiles.  Add to favorites and send TLOS (Coming soon).',
          route: '/profiles/contacts'
        },
        {
          title: 'Join <b>Groups</b>',
          img: '../statics/app-icons/my-profile.png',
          description: 'Register to vote in Telos Governance and other Decide groups.  Create your own.',
          route: '/trails/treasuries'
        },
        {
          title: '<b>Decide</b> Together',
          img: '../statics/app-icons/my-profile.png',
          description: 'Vote on Works, Amend and other eco-system ballots.',
          route: '/trails/ballots'
        }
      ]
    }
  }
}
</script>

<template>
  <q-page>
    <div class="card-container q-pa-md row items-start">
      <div v-for="card in cards" v-bind:key="card.title" class="landing-card" @click="goTo(card.route)">
        <div class="row">
          <div class="col-8">
            <div v-html="card.title" class="card-title q-pa-md text-h4"></div>
            <div class="card-description q-pa-md text-h6">{{ card.description }}</div>
          </div>
          <div class="col-4">
              <q-avatar color="primary" text-color="white" class="card-avatar q-pa-md">
                <q-img class="card-img" :src="card.img"></q-img>
              </q-avatar>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<style lang="sass" scoped>
.card-container
  margin: auto
  max-width: 1000px

.landing-card
  width: 100%
  min-height: 260px
  max-width: 450px
  border-radius: 25px
  border: 2px solid $primary
  margin: 10px

.card-title
  text-align: left
  color: $primary

.card-description
  text-align: right

.card-avatar
  width: 100%
  height: auto

.card-img
  width: 100%
  height: auto

</style>
