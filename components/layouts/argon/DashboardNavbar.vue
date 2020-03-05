<template>
  <base-nav
    container-classes="container-fluid"
    class="navbar-top border-bottom navbar-expand"
  >
    <!-- Navbar links -->
    <ul class="navbar-nav align-items-center ml-md-auto">
      <li class="nav-item d-xl-none">
        <!-- Sidenav toggler -->
        <div class="pr-3 sidenav-toggler"
             :class="{active: $sidebar.showSidebar, 'sidenav-toggler-dark': type === 'default', 'sidenav-toggler-light': type === 'light'}"
             @click="toggleSidebar">
          <div class="sidenav-toggler-inner">
            <i class="sidenav-toggler-line bg-dark"></i>
            <i class="sidenav-toggler-line bg-dark"></i>
            <i class="sidenav-toggler-line bg-dark"></i>
          </div>
        </div>
      </li>
      <el-popover placement="bottom" visible-arrow class="rounded"
                  width="300" v-if="$route.path.startsWith('/karaoke')"
                  v-model="searchModal">
        <template>
          <div class="row px-3">
            <div class="col-6 px-1">
              <el-select v-model="brand">
                <el-option value="all" label="ALL" key="all"></el-option>
                <el-option value="tj" label="TJ" key="tj"></el-option>
                <el-option value="kumyoung" label="KY" key="kumyoung"></el-option>
                <el-option value="joysound" label="JOYSOUND" key="joysound"></el-option>
                <el-option value="dam" label="DAM" key="dam"></el-option>
                <el-option value="uga" label="UGA" key="uga"></el-option>
              </el-select>
            </div>            
            <div class="col-6 px-1">
              <el-select v-model="stype">
                <el-option value="title" label="제목" key="title"></el-option>
                <el-option value="singer" label="가수" key="singer"></el-option>
              </el-select>
            </div>
            <div class="col-12 px-1 mt-2">
              <div class="input-group">
                <input type="text" valid="true" class="form-control" v-model="keyword" @keyup.enter="karaokeSearch">
                <div class="input-group-append" @click="karaokeSearch">
                  <span class="input-group-text">
                    <span><i class="fas fa-search"></i></span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </template>
        <li slot="reference" class="nav-item dropdown">
          <a class="nav-link">
            <i class="fas fa-search"></i>
          </a>
        </li>
      </el-popover>
    </ul>
    <ul class="navbar-nav align-items-center ml-auto ml-md-0" v-if="this.$store.state.authUser">
      <base-dropdown menu-on-right
                     class="nav-item"
                     tag="li"
                     title-tag="a"
                     title-classes="nav-link pr-0">
        <a class="nav-link pr-0" @click.prevent slot="title-container">
          <div class="media align-items-center">
                  <span class="avatar avatar-sm rounded-circle bg-white">
                    <img alt="Profile Image" src="/img/theme/default-avatar.svg">
                  </span>
            <div class="media-body ml-2 d-block">
              <span class="mb-0 text-sm  font-weight-bold">{{ this.$store.state.authUser.username }}</span>
            </div>
          </div>
        </a>

        <template>
          <div class="dropdown-header noti-title">
            <h6 class="text-overflow m-0">환영합니다! {{ this.$store.state.authUser.username }}님</h6>
          </div>
          <div class="dropdown-divider"></div>
          <div class="dropdown-item" @click="$router.push('/admin')" v-if="this.$store.state.authUser.role === 'admin'">
            <i class="fas fa-sliders-h"></i>
            <span>사이트 관리</span>
          </div>
          <div class="dropdown-item" @click="signout()">
            <i class="fas fa-sign-out-alt"></i>
            <span>로그아웃</span>
          </div>
        </template>
      </base-dropdown>
    </ul>
    <ul class="navbar-nav align-items-center ml-auto ml-md-0" v-else>
      <base-button outline block type="default" class="my-0 text-nowrap" @click="modals.signin = true">
        로그인
      </base-button>
      <base-button outline block type="default" class="my-0 text-nowrap" @click="modals.signup = true">
        회원가입
      </base-button>
      <modal :show.sync="modals.signin"
               body-classes="p-0"
               modal-classes="modal-dialog-centered modal-sm">
            <card type="secondary" shadow
                  header-classes="bg-white pb-5"
                  body-classes="px-lg-5 py-lg-5"
                  class="border-0 mb-0">
                <template>
                    <div class="text-center text-muted mb-4">
                        <small>로그인</small>
                    </div>
                    <div class="checklist-item checklist-item-danger mb-4" v-if="signInForm.error">
                        <div class="checklist-info">{{ signInForm.error }}</div>
                    </div>
                    <form role="form" @submit.prevent="signin">
                        <base-input alternative
                                    class="mb-3"
                                    type="email"
                                    name="이메일"
                                    placeholder="이메일"
                                    v-model="signInForm.email"
                                    prependIcon="ni ni-email-83">
                        </base-input>
                        <base-input alternative
                                    type="password"
                                    name="비밀번호"
                                    placeholder="비밀번호"
                                    v-model="signInForm.password"
                                    prependIcon="ni ni-lock-circle-open"
                                    @keyup.enter="signin()">
                        </base-input>
                        <div class="text-center">
                          <div @click="modals.signin = false"><nuxt-link class="d-block" to="/forgot">비밀번호를 잊으셨나요?</nuxt-link></div>
                          <base-button type="primary" class="my-4 mr-2" @click="signUpModal()">회원가입</base-button>
                          <base-button type="primary" class="my-4 ml-2" @click="signin()">로그인</base-button>
                        </div>
                    </form>
                </template>
            </card>
      </modal>
      <modal :show.sync="modals.signup"
               body-classes="p-0"
               modal-classes="modal-dialog-centered">
            <card type="secondary" shadow
                  header-classes="bg-white pb-5"
                  body-classes="px-lg-5 py-lg-5"
                  class="border-0 mb-0">
                <template>
                    <div class="text-center text-muted mb-4">
                        <small>회원가입</small>
                    </div>
                    <div class="checklist-item checklist-item-danger mb-4" v-if="signUpForm.error">
                        <div class="checklist-info">{{ signUpForm.error }}</div>
                    </div>
                    <form role="form" @submit.prevent="signup">
                        <base-input alternative
                                    class="mb-3"
                                    type="email"
                                    name="이메일"
                                    placeholder="이메일"
                                    v-model="signUpForm.email"
                                    prependIcon="ni ni-email-83">
                        </base-input>
                        <base-input alternative
                                    type="password"
                                    name="비밀번호"
                                    placeholder="비밀번호"
                                    v-model="signUpForm.password"
                                    prependIcon="ni ni-lock-circle-open">
                        </base-input>
                        <base-input alternative
                                    type="password"
                                    name="비밀번호"
                                    placeholder="비밀번호 재확인"
                                    v-model="signUpForm.passwordAgain"
                                    prependIcon="ni ni-lock-circle-open">
                        </base-input>
                        <base-input alternative
                                    type="text"
                                    placeholder="닉네임"
                                    name="닉네임"
                                    v-model="signUpForm.username"
                                    prependIcon="ni ni-badge">
                        </base-input>
                        <div class="text-center">
                          <base-checkbox class="mb-3" v-model="signUpForm.policy">
                            <nuxt-link to="/policy" target="_blank">개인정보수집 및 처리방침</nuxt-link>에 관한 동의
                          </base-checkbox>
                          <base-button type="primary" class="my-4" @click="signup()">가입하기</base-button>
                        </div>
                    </form>
                </template>
            </card>
      </modal>
    </ul>
  </base-nav>
</template>
<script>
  import { CollapseTransition } from 'vue2-transitions';
  import BaseNav from '@/components/argon-core/Navbar/BaseNav.vue';
  import Modal from '@/components/argon-core/Modal.vue';
  import { Select, Option } from 'element-ui';

  export default {
    components: {
      CollapseTransition,
      BaseNav,
      Modal,
      [Select.name]: Select,
      [Option.name]: Option
    },
    props: {
      type: {
        type: String,
        default: 'light', // default|light
        description: 'Look of the dashboard navbar. Default (Green) or light (gray)'
      }
    },
    computed: {
      routeName() {
        const { name } = this.$route;
        return this.capitalizeFirstLetter(name);
      }
    },
    data() {
      return {
        modals: {
          signin: false,
          signup: false
        },
        signInForm: {
          error: null,
          email: '',
          password: ''
        },
        signUpForm: {
          error: null,
          email: '',
          password: '',
          passwordAgain: '',
          username: '',
          policy: false
        },
        brand: 'all',
        stype: 'title',
        keyword: '',
        searchModal: false
      };
    },
    methods: {
      capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      },
      toggleSidebar() {
        this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
      },
      hideSidebar() {
        this.$sidebar.displaySidebar(false);
      },
      signUpModal() {
        this.modals.signin = false;
        this.modals.signup = true;
      },
      validateEmail(email) {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        return re.test(email)
      },
      karaokeSearch() {
        this.searchModal = false
        this.$router.push(`/karaoke/search/${this.stype}/${this.brand}/${this.keyword}`)
      },
      async signin() {
        try {
          await this.$store.dispatch('signin', {
            email: this.signInForm.email,
            password: this.signInForm.password
          }).then(() => {
            this.modals.signin = false
            this.$router.go()
          })
        } catch(err) {
          this.signInForm.error = err.message
        }
      },
      async signup() {
        try {
          if (this.signUpForm.password !== this.signUpForm.passwordAgain) throw Error('비밀번호가 일치하지 않습니다.')
          if (this.validateEmail(this.signUpForm.email) === false) throw Error('올바른 형식의 이메일을 입력해주세요.')
          if (this.signUpForm.policy !== true) throw Error('개인정보 수집 및 개인정보 처리방침에 관한 동의를 하셔야 회원가입이 가능합니다.')
          await this.$store.dispatch('register', {
            email: this.signUpForm.email,
            password: this.signUpForm.password,
            username: this.signUpForm.username,
            role: 'default'
          }).then(() => {
            this.modals.signin = false
            this.$router.go()
          })
        } catch(err) {
          this.signUpForm.error = err.message
        }
      },
      async signout() {
        try {
          await this.$store.dispatch('signout').then(() => this.$router.go())
        } catch(err) {
          this.$notify({type: 'danger', message: '오류가 발생했습니다.', timeout: 3000})
          console.log(err)
        }
      }
    }
  };
</script>
<style>
.el-select .el-input .el-input__inner {
  height: calc(1.5em + 1.25rem + 5px) !important;
}
</style>