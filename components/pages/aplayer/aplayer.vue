<template>
  <aplayer
    :music="music"
    :mini="mini"
    :float="float"
    :showLrc="showLrc"
    controls
    preload="auto"
    :volume="1.0"
  />
</template>

<script>
import Aplayer from 'vue-aplayer'
Aplayer.disableVersionBadge = true
export default {
  name: 'vue-aplayer',
  components: {
    Aplayer
  },
  props: {
    music: Object,
    mini: {
      type: Boolean,
      default: false
    },
    float: {
      type: Boolean,
      default: false
    },
    showLrc: {
      type: Boolean,
      default: false
    }
  }
}
</script>
