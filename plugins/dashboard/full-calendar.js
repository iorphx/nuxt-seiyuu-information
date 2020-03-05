// We initialize calendar components here since they don't have SSR support.
// We will render them on the client only by making this plugin ssr:false
import Vue from 'vue'
import AllCalendarEdit from '@/components/pages/calendar/AllCalendarEdit'
import AllCalendar from '@/components/pages/calendar/AllCalendar'
import CalendarWidget from '@/components/widgets/CalendarWidget'
Vue.component('AllCalendarEdit', AllCalendarEdit)
Vue.component('AllCalendar', AllCalendar)
Vue.component(CalendarWidget.name, CalendarWidget)
