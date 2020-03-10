export const state = () => ({
  authUser: null
})

export const mutations = {
  SIGNIN: function (state, user) {
    state.authUser = user
  },
  SIGNOUT: function () {
    state.authUser = null
  },
  SET_USER: function (state, user) {
    state.authUser = user
  }
}

export const actions = {
  async nuxtServerInit({ commit }, { req }) {
    if (req.session && req.session.authUser) {
      commit('SET_USER', req.session.authUser)
    }
  },
  async signin({ commit }, { email, password, $sentry }) {
    if (!email || !password) throw new Error('이메일과 비밀번호를 입력해주세요.')
    try {
      const data = await this.$axios.$post('/api/signin', { email, password })
      commit('SIGNIN', data)
    } catch (error) {
      $sentry.captureException(error)
      throw new Error('이메일 혹은 비밀번호가 일치하지 않습니다.')
    }
  },
  async register ({ commit }, { email, password, username, role, $sentry }) {
    if (!email || !password || !username) throw new Error('모든 필드를 입력해주세요.')
    try {
      const data = await this.$axios.$post('/api/register', { email, password, username, role })
      commit('SET_USER', data)
    } catch (error) {
      $sentry.captureException(error)
      switch (error.response.status || 500) {
        case 409: throw new Error('이미 등록된 이메일입니다.')
        case 500: throw new Error('내부서버 오류가 발생했습니다.')
      }
    }
  },
  async signout ({ commit }) {
    const data = await this.$axios.$post('/api/signout')
    if (data.ok) commit('SIGNOUT')
  },
  async reset ({ commit }, { token, password, $sentry }) {
    if (!password) throw new Error('비밀번호를 입력해주세요.')
    try {
      const data = await this.$axios.$post('/api/reset/' + token, { password })
      commit('SET_USER', data)
    } catch (error) {
      $sentry.captureException(error)
      switch (error.response.status || 500) {
        case 404: throw new Error('유효하지 않거나 만료된 토큰입니다.')
        case 500: throw new Error('내부서버 오류가 발생했습니다.')
      }
    }
  }
}
