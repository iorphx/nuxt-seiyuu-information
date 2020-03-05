import Vue from 'vue'
import VueAplayer from '@/components/pages/aplayer/aplayer'
import VueVideoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css'
import 'videojs-contrib-hls'
import InfiniteLoading from 'vue-infinite-loading'

Vue.component('VueAplayer', VueAplayer)
Vue.use(VueVideoPlayer)
Vue.use(InfiniteLoading)