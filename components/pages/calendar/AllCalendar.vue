<template>
  <div>
    <base-header class="pb-6 bg-gradient-secondary">
      <div class="row align-items-center py-4">
        <div class="col-lg-6 col-2">
          <h6 class="h2 d-inline-block mb-0">이벤트 캘린더</h6>
          <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
            <ol class="breadcrumb breadcrumb-links">
              <li class="breadcrumb-item"><nuxt-link to="/"><i class="fas fa-home mr-2"></i>홈</nuxt-link></li>
              <li class="breadcrumb-item active" aria-current="page">이벤트 캘린더</li>
            </ol>
          </nav>
        </div>          
          <div class="col-lg-6 col-10 text-right">
          <a href="#" @click.prevent="prev" class="fullcalendar-btn-prev btn btn-sm btn-default">
            <i class="fas fa-angle-left"></i>
          </a>
          <a href="#" @click.prevent="next" class="fullcalendar-btn-next btn btn-sm btn-default">
            <i class="fas fa-angle-right"></i>
          </a>
          <base-button class="btn btn-sm btn-default"
                       :class="{'active': defaultView === 'dayGridMonth'}"
                       @click="changeView('dayGridMonth')">
            월별
          </base-button>
          <base-button class="btn btn-sm btn-default"
                       :class="{'active': defaultView === 'dayGridWeek'}"
                       @click="changeView('dayGridWeek')">
            주별
          </base-button>
          <div v-if="this.$store.state.authUser" class="d-inline-flex">
            <base-button type="default" class="btn btn-sm btn-default mr-2" v-if="['editor', 'admin'].includes(this.$store.state.authUser.role)" @click="$router.push(`/calendar/edit?project=${project}`)">수정</base-button>
          </div>
        </div>
      </div>
    </base-header>

    <div class="container-fluid mt--6">
      <div class="row">
        <div class="col">
          <!-- Fullcalendar -->
          <div class="card card-calendar">
            <!-- Card header -->
            <div class="card-header">
              <!-- Title -->
              <h5 class="h3 mb-0">{{ month }}월</h5>
            </div>
            <!-- Card body -->
            <div class="card-body p-0 card-calendar-body">
              <full-calendar :events="events"
                             :plugins="calendarPlugins"
                             :editable="false"
                             contentHeight="auto"
                             :theme="false"
                             :selectable="true"
                             :selectHelper="true"
                             ref="fullCalendar"
                             class="calendar"
                             :locale="locale"
                             :defaultView="defaultView"
                             @eventClick="onEventClick"
              >
              </full-calendar>
            </div>
          </div>
        </div>
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
    name: 'calendar',
    components: {
      Modal,
      FullCalendar
    },
    props: {
      project: {
        type: String,
        default: ""
      }
    },
    data() {
      return {
        calendarPlugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
        defaultView: 'dayGridMonth',
        showEventModal: false,
        events: [],
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
      };
    },
    mounted () {
      this.$axios.$get(`/api/event/${this.project}`)
        .then(data => {
          this.events = data
        })
        .catch(err => {
          console.log(err)
        })
      this.month = this.getMonth()
    },
    methods: {
      calendarApi() {
        return this.$refs.fullCalendar.getApi()
      },
      changeView(viewType) {
        this.defaultView = viewType
        this.calendarApi().changeView(viewType)
      },
      next() {
        this.calendarApi().next()
        this.month = this.getMonth()
      },
      prev() {
        this.calendarApi().prev()
        this.month = this.getMonth()
      },
      getMonth() {
        return this.calendarApi().getDate().getMonth() + 1
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
  };
</script>
<style lang="scss">
  @import "@fullcalendar/core/main.css";
  @import '@fullcalendar/daygrid/main.css';
  @import '@fullcalendar/timegrid/main.css';
  @import "~/assets/sass/core/vendors/_fullcalendar.scss";
  .form-control:disabled, .form-control[readonly] {
    background-color: transparent !important;
  }
  img {
    max-width: 100%;
    height: auto;
  }
</style>
