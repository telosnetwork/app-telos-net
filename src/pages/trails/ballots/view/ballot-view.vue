<script>
import { mapActions, mapGetters } from 'vuex'
import BallotStatus from '../components/ballot-status'
import BallotChip from '../components/ballot-chip'
import Btn from '../../../../components/btn'

const regex = new RegExp(/Qm[1-9A-HJ-NP-Za-km-z]{44}(\/.*)?/, 'm') // ipfs hash detection, detects CIDv0 46 character strings starting with 'Qm'
const regexWithUrl = new RegExp(/https?\:\/\/.*Qm[1-9A-HJ-NP-Za-km-z]{44}(\/.*)?/, 'm') // ipfs hash detection, detects CIDv0 46 character strings starting with 'Qm'

export default {
  name: 'ballot-view',
  components: { BallotStatus, BallotChip, Btn },
  props: {
    isBallotOpened: { type: Function, required: true },
    displayWinner: { type: Function, required: true },
    votingHasBegun: { type: Function, required: true },
    getStartTime: { type: Function, required: true },
    getEndTime: { type: Function, required: true },
    getLoser: { type: Function, required: true },
    ballotContentImg: { type: Function, required: true }
  },
  data () {
    return {
      loading: true,
      voting: false,
      votes: [],
      defaultSlide: 0,
      scrollPosition: null,
      notice: false
    }
  },
  async mounted () {
    await this.fetchBallot(this.$route.params.id)
    window.addEventListener('scroll', this.updateScroll)
    this.loading = false
  },
  beforeDestroy () {
    // this.$router.push(`/trails/ballots/`)
    // This resets the route on modal close but also glitches out the scroll position for it's parent.
    // Commenting out to prevent the bug as it doesn't really cause any problems when the route isn't reset.
  },
  computed: {
    ...mapGetters('notifications', ['notifications']),
    ...mapGetters('accounts', ['isAuthenticated', 'account']),
    ...mapGetters('trails', ['ballot']),
    daysSinceStarted () {
      const oneDay = 24 * 60 * 60 * 1000
      const today = Date.now()
      const startDate = new Date(this.ballot.begin_time).getTime()
      const diffDays = Math.round(Math.abs((today - startDate) / oneDay))
      return diffDays
    },
    getWinner () {
      if (!this.ballot.total_voters) return 'No votes'
      let winnerValue = -1
      let winner
      this.ballot.options.forEach((option, index) => {
        if (parseFloat(option.value) > winnerValue) {
          winnerValue = parseFloat(option.value)
          winner = index
        }
      })
      // console.log('winner', winner)
      return this.ballot.options[winner]
    },
    ballotDescription () {
      if (this.getIPFShash) {
        return this.ballot.description.replace(regexWithUrl, '').replace(regex, '')
      }

      const descriptionWithLinks = this.findLinks(this.ballot.description)

      return descriptionWithLinks
    },
    ballotContent () {
      if (this.ballot.content.match(regex)) {
        return this.ballot.content.replace(regexWithUrl, '').replace(regex, '')
      }

      return this.ballot.content
    },
    ballotContentOptionData () {
      try {
        const data = Object.values(JSON.parse(this.ballot.content).optionData)
        return data
      } catch (error) {
        return null
      }
    },
    getIPFShash () {
      if (this.ballot.description.match(regex)) {
        const r = regex.exec(this.ballot.description)[0]
        return r
      } else if (this.ballot.content.match(regex)) {
        const r = regex.exec(this.ballot.content)[0]
        return r
      } else {
        return false
      }
      // https://api.ipfsbrowser.com/ipfs/get.php?hash=QmS6QwbGDde7cdyvWfUSX5PPWrFkiumqTHouBV3jYhPXme
    }
  },
  methods: {
    ...mapActions('trails', ['fetchBallot', 'castVote', 'cancelBallot']),
    openUrl (url) {
      window.open(`${process.env.BLOCKCHAIN_EXPLORER}/account/${url}`)
    },
    getPercentofTotal (option) {
      const total = ((Number(option.value.split(' ')[0]) / Number(this.ballot.total_raw_weight.split(' ')[0])) * 100)
      return Number.isInteger(total) ? total : +total.toFixed(2)
    },
    async onCastVote ({ options, option, ballotName }) {
      this.voting = true
      await this.castVote({
        ballotName,
        options: options || [option]
      })
      this.voting = false
      this.votes = []
    },
    showNotification () {
      this.$q.notify({
        icon: this.notifications[0].icon,
        message: this.notifications[0].status === 'success'
          ? this.$t('notifications.trails.successSigning')
          : this.$t('notifications.trails.errorSigning'),
        color: this.notifications[0].status === 'success' ? 'positive' : 'negative'
      })
    },
    async vote () {
      await this.onCastVote({ options: this.votes, ballotName: this.ballot.ballot_name })
      this.showNotification()
    },
    async cancel () {
      await this.cancelBallot(this.ballot)
      this.showNotification()
    },
    nextSlide () {
      if (this.ballotContentOptionData.length - 1 > this.defaultSlide) {
        this.defaultSlide++
      }
    },
    prevSlide () {
      if (this.defaultSlide > 0) {
        this.defaultSlide--
      }
    },
    updatePopupScroll (e) {
      this.scrollPosition = e.target.scrollTop
    },
    getPartOfTotal (option) {
      if (option) {
        return !isNaN(this.getPercentofTotal(option)) ? this.getPercentofTotal(option) / 100 : 0
      }
    },
    openNotice () {
      this.notice = true
    },

    toggleOption (key) {
      if (this.ballot.max_options === 1) {
        this.votes = this.votes.includes(key) ? [key] : []
      }
    },
    findLinks (text) {
      const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig
      return text.replace(urlRegex, (url) => `<a href="${url}">${url}</a>`)
    }
  }
}
</script>

<template lang="pug">
.row.bg-white.justify-between.popup-wrapper(@scroll="updatePopupScroll")
  template(v-if="!loading && ballot")
    .col-xs.col-sm-auto(style="min-width: 240px;").popup-left-col-wrapper
      q-card.popup-left-col.poll-item(
        :class="ballot.status === 'voting' && isBallotOpened(ballot) ? '' : 'view-poll-ended'"
        id="ballot-card"
        flat
        square
        bordered
      )
        q-card-section.card-img-section
          div.card-img-wrapper
            template(v-if="ballotContentImg(ballot)")
              q-img(:src="ballotContentImg(ballot)").poll-item-image-wrapper
                template(v-slot:error)
                  q-icon(size="lg" name="far fa-image")
            template(v-else)
              template(v-if="isBallotOpened(ballot) && ballot.status === 'voting'")
                img(:src="`statics/app-icons/${ballot.category.toLowerCase()}-bgr-icon1.png`").bgr-icon1
                img(:src="`statics/app-icons/${ballot.category.toLowerCase()}-bgr-icon2.png`").bgr-icon2
              template(v-else)
                img(:src="`statics/app-icons/inactive-bgr-icon1.png`").bgr-icon1
                img(:src="`statics/app-icons/inactive-bgr-icon2.png`").bgr-icon2
            ballot-chip(:type="ballot.category", :isBallotOpened="isBallotOpened(ballot)").absolute-top-left
            ballot-status(
              :ballot="ballot"
              :isBallotOpened="isBallotOpened(ballot)"
              :getEndTime="getEndTime(ballot)"
              :votingHasBegun="votingHasBegun(ballot)"
              :getStartTime="getStartTime(ballot)"
            )

          q-list(dense).options-list.list-620
            div.options-wrapper
              q-item.ballot-view-option(
                v-for="option in ballot.options"
                :key="option.key"
                :class="displayWinner(ballot) ? displayWinner(ballot) === option.key ? 'option-winner' : '' : 'option-clear'"
              ).no-padding.capitalize.column
                div.row.option-item
                  q-item-section()
                    q-checkbox(
                      size="sm"
                      v-model="votes"
                      :disable="ballot.status !== 'cancelled' && !isBallotOpened"
                      keep-color
                      :class="displayWinner(ballot) ? displayWinner(ballot) === option.key ? 'visible-checkbox' : '' : ''"
                      color="$primary"
                      :val="option.key"
                      @click.native="toggleOption(option.key)"
                    )
                      div.checkbox-text.row.space-between
                        div {{ option.key }}
                        div(v-if="getPartOfTotal(option)") {{ getPartOfTotal(option) * 100 }}%&nbsp
                div.linear-progress(v-if="displayWinner(ballot)")
                  q-linear-progress(rounded size="6px" :value="getPartOfTotal(option)" color="$primary")
            q-item(v-if="ballot.status !== 'cancelled' && isBallotOpened(ballot)").capitalize.options-btn
              q-item-section.btn-wrapper
                btn(
                  :labelText="$t('pages.trails.ballots.vote')"
                  btnWidth='220'
                  fontSize='16'
                  hoverBlue=true
                  @clickBtn="isAuthenticated ? vote() : openNotice()"
                )
                btn(
                  v-if="isAuthenticated && ballot.publisher === account"
                  :labelText="$t('common.buttons.cancel')"
                  btnWidth='220'
                  fontSize='16'
                  hoverRed=true
                  @clickBtn="cancel()"
                )
        q-card-section().q-pb-none.cursor-pointer.statics-section.statics-section-620
          div.text-section.column
            div.statics-section-item(v-if="ballot.total_voters > 0")
              span.text-weight-bold {{ getPercentofTotal(getWinner) }}%&nbsp
              span.opacity06  {{ getWinner.key.toUpperCase() }} {{ getLoser.key ? ` lead over ${getLoser.key.toUpperCase()}` : ` lead over others` }}
            div.statics-section-item(v-else)
              span  {{ getWinner }}
            div.statics-section-item
              span.text-weight-bold {{ `${ballot.total_voters} Accounts` }}
              span.opacity06 &nbspvoted
            div.statics-section-item
              span.text-weight-bold {{ ballot.total_raw_weight.split(' ')[0].split('.')[0] }}&nbsp
              span.opacity06 {{ ballot.total_raw_weight.split(' ')[1]  }}&nbsp
              span.opacity06 tokens
    .col-xs-12.col-sm.popup-right-col-wrapper
      q-card(
        flat
        square
      ).popup-right-col
        q-card-section.description-section-title
          q-btn(icon="close" flat v-close-popup).absolute-top-right.gt-xs.close-popup-btn
          div.text-section.row.ballot-card-title-wrapper
            span.ballot-card-title {{ ballot.title || "Untitled Ballot" }}
          div.ballot-card-sub-title-wrapper.row
            template(v-if="ballot.treasury.icon && ballot.treasury.icon !== '' && ballot.treasury.icon !== 'null'")
              div.sub-title-card-img-wrapper
                q-img(:src="ballot.treasury.icon")
              div
                div
                  span.opacity04 By&nbsp
                  a(@click="openUrl(ballot.publisher)").link.cursor-pointer  {{ ballot.publisher }}
                div.sub-title-group-wrapper
                  span.opacity04 in&nbsp
                  span.opacity06 {{ ballot.treasury.title || "No treasury" }}
            template(v-else)
              span.opacity04 By&nbsp
              a(@click="openUrl(ballot.publisher)").link.cursor-pointer  {{ ballot.publisher }}
              span.opacity04 &nbspin&nbsp
              span.opacity06 {{ ballot.treasury.title || "No treasury" }}
          q-btn(icon="close" flat v-close-popup).absolute-top-right.lt-sm
        q-separator.popup-separator
        q-card-section.description-section-wrapper
          div.description-section
            div.description-section-title(:class="getIPFShash ? `q-pb-md` : `q-pb-xl q-mb-lg`")
              p(v-html="ballotDescription")
            div(
              v-if="ballotContentOptionData && ballotContentOptionData[0] && ballotContentOptionData[0].hasOwnProperty('imageUrl')"
            ).q-pb-md.ballot-content-carousel
              q-carousel(
                swipeable
                animated
                v-model="defaultSlide"
                infinite
                ref="carousel"
              )
                q-carousel-slide(
                  v-for="(slide, index) in ballotContentOptionData"
                  :key="index"
                  :name="index"
                  :img-src="slide.imageUrl"
                )
                  div.absolute-bottom.custom-caption(v-if="slide.displayText")
                    div.caption-text {{ slide.displayText }}
                template(v-slot:control)
                  q-carousel-control(
                    position="bottom-left"
                    :offset="[18, 18]"
                    class="q-gutter-md"
                  )
                    q-btn.round-btn(
                      color="white"
                      text-color="black"
                      icon="fas fa-chevron-left"
                      @click="prevSlide()"
                    )
                    q-btn.round-btn(
                      color="white"
                      text-color="black"
                      icon="fas fa-chevron-right"
                      @click="nextSlide()"
                    )
            embed(
              v-if="getIPFShash"
              :src="`https://ipfs.io/ipfs/${getIPFShash}`"
              type="application/pdf"
            ).kv-preview-data.file-preview-pdf.file-zoom-detail.shadow-1
            div(v-else).text-center
              img(src="/statics/app-icons/no-pdf.svg" style="width: 60px;")
              p(style="color: #a1c1ff").text-caption No PDF found
            q-list(dense).options-list.list-320
              div.options-wrapper
                q-item.ballot-view-option(
                  v-for="option in ballot.options"
                  :key="option.key"
                  :class="displayWinner(ballot) ? displayWinner(ballot) === option.key ? 'option-winner' : '' : 'option-clear'"
                ).no-padding.capitalize.column
                  div.row.option-item
                    q-item-section()
                      q-checkbox(
                        size="sm"
                        v-model="votes"
                        :disable="ballot.status !== 'cancelled' && !isBallotOpened"
                        keep-color
                        :class="displayWinner(ballot) ? displayWinner(ballot) === option.key ? 'visible-checkbox' : '' : ''"
                        color="$primary"
                        :val="option.key"
                      )
                        div.checkbox-text.row.space-between
                          div {{ option.key }}
                          div(v-if="getPartOfTotal(option)") {{ getPartOfTotal(option) * 100 }}%&nbsp
                  div.linear-progress(v-if="displayWinner(ballot)")
                    q-linear-progress(rounded size="6px" :value="getPartOfTotal(option)" color="$primary")
              q-item(v-if="ballot.status !== 'cancelled' && isBallotOpened(ballot)").capitalize.options-btn
                q-item-section.btn-wrapper
                  btn.btn-vote-320(
                    :labelText="$t('pages.trails.ballots.vote')"
                    btnWidth='220'
                    fontSize='16'
                    hoverBlue=true
                    @clickBtn="isAuthenticated ? vote() : openNotice()"
                  )
                  btn.btn-vote-320(
                    v-if="isAuthenticated && ballot.publisher === account"
                    :labelText="$t('common.buttons.cancel')"
                    btnWidth='220'
                    fontSize='16'
                    hoverRed=true
                    @clickBtn="cancel()"
                  )
            q-card-section().q-pb-none.cursor-pointer.statics-section.statics-section-320
              div.text-section.column
                div.statics-section-item(v-if="ballot.total_voters > 0")
                  span.text-weight-bold {{ getPercentofTotal(getWinner) }}%&nbsp
                  span.opacity06  {{ getWinner.key.toUpperCase() }} {{ getLoser.key ? ` lead over ${getLoser.key.toUpperCase()}` : ` lead over others` }}
                div.statics-section-item(v-else)
                  span  {{ getWinner }}
                div.statics-section-item
                  span.text-weight-bold {{ `${ballot.total_voters} Accounts` }}
                  span.opacity06 &nbspvoted
                div.statics-section-item
                  span.text-weight-bold {{ ballot.total_raw_weight.split(' ')[0].split('.')[0] }}&nbsp
                  span.opacity06 {{ ballot.total_raw_weight.split(' ')[1]  }}&nbsp
                  span.opacity06 tokens
      div.back-btn.row(v-close-popup :class="{scrolled: scrollPosition > 50}")
        q-icon(name="fas fa-chevron-left")
        div Go back
    q-dialog(v-model="notice")
      q-card.notice
        q-card-section.row.no-wrap
          div You have to be logged in to vote. If you don't have account please register
            q-btn(flat size="14px" color="primary" label="here" to="/accounts/add" no-caps).register-link
        q-card-actions(align="right" class="bg-white")
          q-btn(flat label="OK" v-close-popup)
  q-inner-loading(v-else)
    q-spinner(size="3em")
</template>
<style lang="sass">
  .btn-wrapper
    width: 100%
    display: flex
    flex-direction: row
    flex-wrap: nowrap
    gap: 12px
    & > button:nth-child(2)
      width: 45% !important
      &:hover
        background-color: #f44336 !important
  embed
    width: 90%
    height: 100%
    min-height: 480px
  .open-sans
    font-family: open sans,arial,sans-serif;
  .link
    color: $primary
  .ballot-status
    right: 0
    top: 0
  .winner
    color: green
    font-size: 15px
    font-weight: 600
  .dashed-bottom
    border-bottom: 1px dashed rgba(0, 0, 0, 0.12)
  .card-img-section
    padding: 0
  .popup-wrapper
    max-width: 1180px !important
    max-height: 640px !important
    width: 100%
    box-shadow: 0px 20px 48px rgba(0, 9, 26, 0.08), 0px 7px 15px rgba(0, 9, 26, 0.05), 0px 3px 6px rgba(0, 9, 26, 0.04), 0px 1px 2.25px rgba(0, 9, 26, 0.0383252) !important
    border-radius: 12px !important
    overflow: hidden !important
    & .poll-item
      border: none
    & .ballot-card-title-wrapper
      height: auto
    & .bgr-icon1
      top: -2px
      right: 70px
    & .bgr-icon2
      top: 74px
      right: 15px
    & .card-img-wrapper
      overflow: visible
    & .absolute-top-left
      top: -6px
      left: -12px
    & .left-tag
      top: 126px
      left: -12px
  .popup-right-col-wrapper
    border-left: 1px solid #F2F3F4
  .popup-left-col
    width: 268px
    & .card-img-wrapper
      margin: 12px
      padding: 16px
      height: 176px
      width: 244px
  .description-section-wrapper
    height: 500px
    overflow: auto
    scrollbar-color: #caccce #EFEFF0
    scrollbar-width: thin
    &::-webkit-scrollbar
      width: 6px
      background-color: #EFEFF0
    &::-webkit-scrollbar-thumb
      background-color: #caccce
      border-radius: 5px
  .description-section
    width: 100%
    height: max-content
  .popup-right-col
    max-width: 912px
  .popup-separator
    background: #F2F3F4
  .options-list
    padding: 0 24px
  .options-wrapper
    max-height: 200px !important
    overflow: auto
    scrollbar-color: #caccce #EFEFF0
    scrollbar-width: thin
    &::-webkit-scrollbar
      width: 6px
      background-color: #EFEFF0
    &::-webkit-scrollbar-thumb
      background-color: #caccce
      border-radius: 5px
  .popup-wrapper .statics-section .text-section
    width: 220px
    & .statics-section-item
      width: 220px
      & > span
        line-height: 130%
  .options-btn
    width: 100%
    padding: 0 !important
    margin: 6px 0 0
  .round-btn
    width: 48px
    height: 48px
    border-radius: 50%
    font-size: 10px
  .ballot-content-carousel
    border-radius: 12px
    & > div
      border-radius: 12px
  .custom-caption
    width: 100%
    display: flex
    justify-content: flex-end
    text-align: right
    padding: 24px
    color: white
    background-color: rgba(0, 0, 0, .3)
    & > .caption-text
      max-width: 300px
      font-size: 24px
  .back-btn
    position: fixed
    top: 0
    left: 0
    display: none
    align-items: center
    height: 70px
    width: 100%
    padding-left: 24px
    cursor: pointer
    background: #FFF
    z-index: 10
    & > div
      margin-left: 10px
      font-size: 16px
  .scrolled
    box-shadow: 0px 7px 15px rgba(0, 9, 26, 0.05), 0px 3px 6px rgba(0, 9, 26, 0.04), 0px 1px 2.25px rgba(0, 9, 26, 0.0383252)
  .list-320,
  .statics-section-320
    display: none
  .ballot-view-option
    max-width: 220px
    height: 55px
    overflow: hidden
    flex-wrap: nowrap
    border: 2px solid #F2F3F4
    border-radius: 8px
    margin: 8px 0
    &.option-winner
      border: none
      background: #F4F7FF
    & .option-item
      width: 100%
      padding: 6px 12px 0 12px
      & > div
        width: 100%
        & > div
          width: 100%
          & > .q-checkbox__label
            width: 100%
            & > .checkbox-text
              width: 100%
              justify-content: space-between
    & .linear-progress
      padding: 0 12px 10px 12px
    &:hover
      border: none
      background: #FFFFFF
      box-shadow: 0px 7px 15px rgba(21, 0, 77, 0.05), 0px 3px 6px rgba(21, 0, 77, 0.04)
  .invisible-checkbox .q-checkbox__inner
    display: none
  .invisible-checkbox .checkbox-text
      margin: 0 0 4px 4px
  .checkbox-text
    flex-wrap: nowrap
    max-width: 220px
    font-size: 16px
    font-weight: 600
    line-height: 24px
  .option-clear > .option-item
    padding: 6px 12px 0 12px
  .notice
    border-radius: 12px !important
  .register-link > .q-btn__wrapper
    padding: 0 6px
  .sub-title-card-img-wrapper
    margin-right: 8px
    width: 50px
    height: 50px
    border-radius: 6px
    overflow: hidden
  .sub-title-group-wrapper
    margin-top: 6px
  @media screen and (max-width: 1200px), screen and (max-height: 640px)
    .q-dialog__inner
      overflow-y: auto
    .no-pointer-events
      pointer-events: auto !important
  @media (max-width: 1000px)
    .custom-caption
      & > .caption-text
        max-width: 230px
        font-size: 18px
  @media (max-width: 768px)
    .back-btn
      display: flex
    .popup-wrapper
      position: relative
      padding-top: 70px
      position: fixed
      overflow-y: auto !important
      top: 0
      right: 0
      bottom: 0
      left: 0
      height: 100vh
      max-height: none !important
      border-radius: 0
    .close-popup-btn,
    .popup-separator
      display: none
    .description-section-wrapper
      height: max-content
    @media (max-width: 620px)
      .btn-wrapper
        & > button:nth-child(2)
          width: 35% !important
      .popup-wrapper
        & > .popup-left-col-wrapper,
        & > .popup-right-col-wrapper
          width: 100%
          display: flex
          justify-content: center
        & > .popup-right-col-wrapper
          flex: auto !important
      .popup-right-col
        width: 100%
      .description-section-wrapper
        padding: 0
      .ballot-content-carousel
        border-radius: 0
        & > div
          border-radius: 0
      .description-section-title
        padding: 12px
      .card-img-section,
      .popup-left-col,
      .statics-section .text-section,
      .statics-section-item
        width: 100%
      .popup-left-col .card-img-wrapper,
        width: auto
      .options-list
        display: flex
        flex-direction: column
        align-items: center
        padding: 0 12px
      .list-320,
      .statics-section-320
        display: flex
      .statics-section-320
        padding-top: 24px
      .list-620,
      .statics-section-620,
      .popup-right-col > .q-card__section > .q-btn-item
        display: none
      .btn-vote-320
        width: 100% !important
      .custom-caption > .caption-text
        font-size: 16px
      .options-wrapper
        max-height: none !important
        overflow: visible
      .ballot-view-option,
      .options-wrapper
        width: 100%
      .ballot-view-option,
      .checkbox-text
        max-width: none
    @media (max-width: 400px)
      .custom-caption > .caption-text
        max-width: 150px
</style>
