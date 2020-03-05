<template>
  <div>
    <base-header class="pb-6 bg-gradient-secondary">
      <div class="row align-items-center py-4">
        <div class="col-lg-6 col-2">
          <h6 class="h2 d-inline-block mb-0">이벤트 캘린더 수정</h6>
          <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
            <ol class="breadcrumb breadcrumb-links">
              <li class="breadcrumb-item"><nuxt-link to="/"><i class="fas fa-home mr-2"></i>홈</nuxt-link></li>
              <li class="breadcrumb-item"><nuxt-link to="/calendar">이벤트 캘린더</nuxt-link></li>
              <li class="breadcrumb-item active" aria-current="page">이벤트 캘린더 수정</li>
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
                             :editable="true"
                             contentHeight="auto"
                             :theme="false"
                             :selectable="true"
                             :selectHelper="true"
                             ref="fullCalendar"
                             class="calendar"
                             :locale="locale"
                             :defaultView="defaultView"
                             @dateClick="onDateClick"
                             @eventClick="onEventClick"
                             @eventResize="onEventFunc"
                             @eventDrop="onEventFunc"
              >
              </full-calendar>
            </div>
          </div>
        </div>
      </div>
    </div>

    <modal :show.sync="showAddModal" modal-classes="modal-secondary">
      <form @submit.prevent="saveEvent">
        <base-input label="제목"
                    placeholder="제목"
                    v-model.lazy="model.title"
                    input-classes="form-control-alternative">
        </base-input>
        <div class="form-group">
          <base-input label="프로젝트">
            <el-select v-model="model.extendedProps.project">
              <el-option :value="project.value" :key="project.label" :label="project.label" v-for="project in projects">
              </el-option>
            </el-select>
          </base-input>
        </div>
        <div class="form-group">
          <base-input label="카테고리">
            <el-select v-model="model.className">
              <el-option :value="color.value" :label="color.label" :key="color.label" v-for="color in eventColors">
                <label class="btn mr-2 mb-0" :class="color.value"></label>{{ color.label }}
              </el-option>
            </el-select>
          </base-input>
        </div>
        <div class="form-group">
          <label class="form-control-label d-block">설명</label>
          <tinymce id="adddescription" v-model="model.extendedProps.description" :api-key="apikey"
                   :init="initOptions" :plugins="plugin" :toolbar="toolbar"></tinymce>
        </div>
        <div class="form-group">
          <label class="form-control-label d-block">참가 성우</label>
          <tinymce id="addseiyuu" v-model="model.extendedProps.participant" :api-key="apikey"
                   :init="initOptions" :plugins="plugin" :toolbar="toolbar"></tinymce>
        </div>
        <div class="form-group">
          <base-input label="시작일" placeholder="시작일">
            <flat-picker slot-scope="{focus, blur}"
                         @on-open="focus"
                         @on-close="blur"
                         :config="{allowInput: true}"
                         class="form-control form-control-alternative datepicker"
                         v-model="model.start">
            </flat-picker>
          </base-input>
        </div>
        <div class="form-group">
          <base-input label="종료일" placeholder="종료일">
            <flat-picker slot-scope="{focus, blur}"
                         @on-open="focus"
                         @on-close="blur"
                         :config="{allowInput: true}"
                         class="form-control form-control-alternative datepicker"
                         v-model="model.end">
            </flat-picker>
          </base-input>
        </div>
      </form>

      <template slot="footer">
        <button type="submit" class="btn btn-primary" @click="saveEvent">추가</button>
        <button type="button" class="btn btn-link ml-auto" @click="showAddModal = false">닫기</button>
      </template>
    </modal>

    <modal :show.sync="showEditModal" modal-classes="modal-secondary">
      <form @submit.prevent="editEvent">
        <base-input label="제목"
                    placeholder="제목"
                    v-model.lazy="model.title"
                    input-classes="form-control-alternative">
        </base-input>
        <div class="form-group">
          <base-input label="프로젝트">
            <el-select v-model="model.extendedProps.project">
              <el-option :value="project.value" :key="project.label" :label="project.label" v-for="project in projects">
              </el-option>
            </el-select>
          </base-input>
        </div>
        <div class="form-group">
          <base-input label="카테고리">
            <el-select v-model="model.className">
              <el-option :value="color.value" :label="color.label" :key="color.label" v-for="color in eventColors">
                <label class="btn mr-2 mb-0" :class="color.value"></label>{{ color.label }}
              </el-option>
            </el-select>
          </base-input>
        </div>
        <div class="form-group">
          <label class="form-control-label d-block">설명</label>
          <tinymce id="editdescription" v-model="model.extendedProps.description" :api-key="apikey"
                   :init="initOptions" :plugins="plugin" :toolbar="toolbar"></tinymce>
        </div>
        <div class="form-group">
          <label class="form-control-label d-block">참가 성우</label>
          <tinymce id="editseiyuu" v-model="model.extendedProps.participant" :api-key="apikey"
                   :init="initOptions" :plugins="plugin" :toolbar="toolbar"></tinymce>
        </div>
        <div class="form-group">
          <base-input label="시작일" placeholder="시작일">
            <flat-picker slot-scope="{focus, blur}"
                         @on-open="focus"
                         @on-close="blur"
                         :config="flatpickrConfig"
                         class="form-control datepicker"
                         v-model="model.start">
            </flat-picker>
          </base-input>
        </div>
        <div class="form-group">
          <base-input label="종료일" placeholder="종료일">
            <flat-picker slot-scope="{focus, blur}"
                         @on-open="focus"
                         @on-close="blur"
                         :config="flatpickrConfig"
                         class="form-control datepicker"
                         v-model="model.end">
            </flat-picker>
          </base-input>
        </div>
      </form>

      <template slot="footer">
        <base-button native-type="submit" type="primary" @click="editEvent">수정</base-button>
        <base-button type="danger" @click="deleteEvent">삭제</base-button>
        <base-button type="link" class="ml-auto" @click="showEditModal = false">닫기</base-button>
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
  import flatPicker from "vue-flatpickr-component"
  import { Korean } from "flatpickr/dist/l10n/ko.js"
  import tinymceMixin from '~/components/mixins/tinymceMixin'
  import { Select, Option } from 'element-ui'
  import koLocale from '@fullcalendar/core/locales/ko'

  export default {
    mixins: [tinymceMixin],
    name: 'calendar',
    components: {
      Modal,
      FullCalendar,
      flatPicker,
      [Select.name]: Select,
      [Option.name]: Option
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
        showAddModal: false,
        showEditModal: false,
        events: [],
        model: {
          title: '',
          className: 'bg-default',
          extendedProps: {
            description: '',
            participant: '',
            project: 'bandori',
            idx: ''
          },
          start: '',
          end: '',
          allDay: true
        },
        eventColors: [
          {value: 'bg-info', label: "라이브"},
          {value: 'bg-orange', label: "팬미팅/오프이벤트"},
          {value: 'bg-red', label: "방송"},
          {value: 'bg-default', label: "생일"},
          {value: 'bg-blue', label: "게임 업데이트"},
          {value: 'bg-purple', label: "CD,BD,잡지 등 발매일"},
          {value: 'bg-yellow', label: "티켓/뷰잉예매"},
          {value: 'bg-green', label: "기타"}
        ],
        projects: [
          {value: 'bandori', label: "BanG Dream!"},
          {value: 'revue', label: "레뷰 스타라이트"},
          {value: 'd4dj', label: "D4DJ"},
          {value: 'rebirth', label: "Re버스 for you"},
          {value: 'assaultlily', label: "어썰트 릴리"},
          {value: 'other', label: "기타"}
        ],
        month: '',
        flatpickrConfig: {allowInput: true, locale: Korean},
        locale: koLocale
      };
    },
    mounted () {
      this.fetchCalendar()
    },
    methods: {
      fetchCalendar() {
        this.$axios.$get(`/api/event/${this.project}`)
          .then(data => {
            this.events = data
          })
          .catch(err => {
            console.log(err)
          })
        this.month = this.getMonth()
      },
      addCalendar(event) {
        this.$axios.$post('/api/event', {data: event})
          .then(data => {
            //
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => this.fetchCalendar())
      },
      editCalendar(event) {
        this.$axios.$patch(`/api/event/${event.extendedProps.idx}`, {data: event})
          .then(res => {
            //
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => this.fetchCalendar())
      },
      deleteCalendar(uid) {
        this.$axios.$delete(`/api/event/${uid}`)
          .then(res => {
            //
          })
          .catch(err => {
            console.log(err)
          })
          .finally(() => this.fetchCalendar())
      },
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
      onDateClick({ date }) {
        this.model = {
          title: '',
          className: 'bg-default',
          start: '',
          end: '',
          extendedProps: {
            description: '',
            participant: '',
            project: this.project,
            idx: ''
          },
          allDay: true
        }
        this.showAddModal = true
        this.model.start = date
        this.model.end = date
      },
      onEventFunc({ event }) {
        let evt = {
          title: event.title,
          className: event.classNames ? event.classNames.join(' '): '',
          start: event.start,
          end: event.end,
          extendedProps: {
            description: event.extendedProps.description,
            participant: event.extendedProps.participant,
            project: event.extendedProps.project,
            idx: event.extendedProps.idx
          },
          allDay: true
        }
        this.editCalendar(evt)
      },
      onEventClick({ el, event }) {
        let endVal = event.end.toISOString().substring(0, 10)
        this.model = {
          title: event.title,
          className: event.classNames ? event.classNames.join(' '): '',
          start: event.start,
          end: endVal,
          extendedProps: {
            description: event.extendedProps.description,
            participant: event.extendedProps.participant,
            project: event.extendedProps.project,
            idx: event.extendedProps.idx
          },
          allDay: true
        }
        this.showEditModal = true
      },
      saveEvent() {
        if (this.model.title) {
          let genId = Math.random(new Date).toString(36).substr(2, 36)
          let endF = this.model.end.replace(/..$/,`${String("0" + (parseInt(this.model.end.slice(-2)) + 1)).slice(-2)}`)
          let event = {
            ...this.model,
            extendedProps: {
              ...this.model.extendedProps,
              idx: genId
            },
            end: endF
          }
          this.addCalendar(event)

          this.model = {
            title: '',
            className: 'bg-default',
            start: '',
            end: '',
            extendedProps: {
              description: '',
              participant: '',
              project: 'bandori',
              idx: ''
            },
            allDay: true
          }
        }
        this.showAddModal = false
      },
      editEvent() {
        let index = this.events.findIndex(e => e.extendedProps.idx === this.model.extendedProps.idx)
        if (index !== -1) {
          let endF = this.model.end.replace(/..$/,`${String("0" + (parseInt(this.model.end.slice(-2)) + 1)).slice(-2)}`)
          let event = {
            ...this.model,
            end: endF
          }
          this.editCalendar(event)
          this.model = {
            title: '',
            className: 'bg-default',
            start: '',
            end: '',
            extendedProps: {
              description: '',
              participant: '',
              project: 'bandori',
              idx: ''
            },
            allDay: true
          }
        }
        this.showEditModal = false
      },
      deleteEvent() {
        let index = this.events.findIndex(e => e.extendedProps.idx === this.model.extendedProps.idx)
        if (index !== -1) {
          let event = {
            ...this.model,
            allDay: true
          }
          this.deleteCalendar(event.extendedProps.idx)
          this.model = {
            title: '',
            className: 'bg-default',
            start: '',
            end: '',
            extendedProps: {
              description: '',
              participant: '',
              project: 'bandori',
              idx: ''
            },
            allDay: true
          }
        }
        this.showEditModal = false
      }
    }
  };
</script>
<style lang="scss">
  @import "@fullcalendar/core/main.css";
  @import '@fullcalendar/daygrid/main.css';
  @import '@fullcalendar/timegrid/main.css';
  @import "~/assets/sass/core/vendors/_fullcalendar.scss";
  @import "flatpickr/dist/flatpickr.css";
</style>
