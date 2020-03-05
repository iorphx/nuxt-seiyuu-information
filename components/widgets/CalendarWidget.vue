<template>
  <div>
    <div class="card widget-calendar">
      <div class="card-header">
        <div class="h3 mb-0 widget-calendar-day">{{ month }} 이벤트 캘린더</div>
      </div>

      <div class="card-body">
        <full-calendar :events="events"
                       :plugins="calendarPlugins"
                       :editable="false"
                       contentHeight="auto"
                       :theme="false"
                       :selectable="true"
                       :selectHelper="true"
                       ref="fullCalendar"
                       :defaultView="defaultView"
                       :locale="locale"
                       @eventClick="onEventClick">
        </full-calendar>
      </div>
    </div>
    
    <modal :show.sync="showEventModal" modal-classes="modal-secondary" bodyClasses="pb-0" footerClasses="pt-0">
      <div class="mb-3">
        <label class="form-control-label">제목</label>
        <h3>{{model.title}}</h3>
      </div>
      <div class="mb-3">
        <label class="form-control-label">프로젝트</label>
        <h3>{{projectStr}}</h3>
      </div>
      <div class="mb-3">
        <label class="form-control-label">설명</label>
        <span v-html="model.description" class="d-block"></span>
      </div>
      <div class="mb-3">
        <label class="form-control-label">참가성우</label>
        <span v-html="model.participant" class="d-block"></span>
      </div>

      <template slot="footer">
        <button type="button" class="btn btn-link ml-auto" @click="showEventModal = false">닫기</button>
      </template>
    </modal>
  </div>
</template>
<script>
  import Modal from '~/components/argon-core/Modal.vue'
  import FullCalendar from '@fullcalendar/vue'
  import dayGridPlugin from '@fullcalendar/daygrid'
  import timeGridPlugin from '@fullcalendar/timegrid'
  import interactionPlugin from '@fullcalendar/interaction'
  import koLocale from '@fullcalendar/core/locales/ko'

  export default {
    name: 'calendar-widget',
    components: {
      Modal,
      FullCalendar
    },
    data() {
      return {
        calendarPlugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        defaultView: 'dayGridWeek',
        events: [],
        showEventModal: false,
        model: {
          title: '',
          description: '',
          participant: '',
          project: ''
        },
        month: '',
        locale: koLocale,
        projects: [
          {value: 'bandori', label: "BanG Dream!"},
          {value: 'revue', label: "레뷰 스타라이트"},
          {value: 'd4dj', label: "D4DJ"},
          {value: 'rebirth', label: "Re버스 for you"},
          {value: 'assaultlily', label: "어썰트 릴리"},
          {value: 'other', label: "기타"}
        ]
      }
    },
    mounted () {
      this.fetchEvent()
      this.getMonth()
    },
    methods: {
      async fetchEvent() {
        this.events = await this.$axios.$get('/api/event')
      },
      calendarApi() {
        return this.$refs.fullCalendar.getApi()
      },
      getMonth() {
        let date = this.calendarApi().getDate()
        this.month = `${date.getMonth() + 1}월 ${Math.ceil(date.getDate() / 7)}주차`
      },
      onEventClick({ el, event }) {
        this.model = {
          title: event.title,
          description: event.extendedProps.description,
          participant: event.extendedProps.participant,
          project: event.extendedProps.project
        }
        this.showEventModal = true
      }
    },
    computed: {
      projectStr() {
        if (this.model.project) return this.projects.filter(projectObj => projectObj.value === this.model.project)[0].label
      }
    }
  }
</script>
<style lang="scss">
  @import "@fullcalendar/core/main.css";
  @import "@/assets/sass/core/vendors/_fullcalendar.scss";
</style>