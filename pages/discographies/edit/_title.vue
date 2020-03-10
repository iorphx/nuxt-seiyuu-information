<template>
  <div>
    <base-header class="pb-6" type="">
      <div class="row align-items-center py-4">
        <div class="col-12">
          <h6 class="h2 d-inline-block mb-0">가사/콜 수정</h6>
          <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
            <ol class="breadcrumb breadcrumb-links">
              <li class="breadcrumb-item"><nuxt-link to="/"><i class="fas fa-home mr-2"></i>홈</nuxt-link></li>
              <li class="breadcrumb-item"><nuxt-link to="/discographies">가사/콜</nuxt-link></li>
              <li class="breadcrumb-item active" aria-current="page">가사/콜 수정</li>
            </ol>
          </nav>
        </div>
      </div>
    </base-header>
    
    <div class="container-fluid mt--6">
      <div class="row">
        <div class="col-12">
          <card>
            <h1 class="display-4 mb-0" slot="header">정보</h1>
            <div class="row justify-content-center">
              <div class="col-lg-5 col-md-12 mb-3 mb-lg-0">
                <img :src="song.image"
                     class="img-center img-fluid shadow shadow-lg--hover mb-2"
                     style="width:450px;height:450px;object-fit:cover;" v-if="!imgPreview && song.image">
                <img src="https://dummyimage.com/450x450/bbbbbb/ffffff&text=no+image"
                     class="img-center rounded-circle" style="width:450px;"
                     v-else-if="!imgPreview && !song.image">
                <img :src="imgPreview"
                     class="img-center img-fluid shadow shadow-lg--hover mb-2"
                     style="width:450px;height:450px;object-fit:cover;" v-else>
                <file-input @change="filesChange" accept="image/*"></file-input>
              </div>
              <div class="col-lg-7 col-md-12 my-auto">
                <base-input alternative label="제목 (일본어)" v-model="song.title" :rules="{required: true}" name="제목 (일본어)"></base-input>
                <base-input alternative label="제목 (한국어)" v-model="song.titleKR"></base-input>
                <base-input alternative label="아티스트" v-model="song.artist"></base-input>
                <div class="form-group">
                  <base-input label="프로젝트">
                    <el-select v-model="song.project">
                      <el-option :value="project.value" :key="project.label" :label="project.label" v-for="project in projects">
                      </el-option>
                    </el-select>
                  </base-input>
                </div>
                <div class="form-group">
                  <base-input label="태그">
                    <tags-input v-model="song.tags"></tags-input>
                  </base-input>
                </div>
                <hr>
                <div class="row">
                  <div class="col">
                    <base-input alternative label="작사" v-model="song.lyricist"></base-input>
                    <base-input alternative label="작곡" v-model="song.composer"></base-input>
                    <base-input alternative label="편곡" v-model="song.arrange"></base-input>
                    <base-input alternative label="출시일">
                      <flat-picker slot-scope="{focus, blur}"
                        @on-open="focus"
                        @on-close="blur"
                        :config="flatpickrConfig"
                        class="form-control datepicker"
                        v-model="song.release">
                      </flat-picker>
                    </base-input>
                  </div>
                </div>
              </div>
            </div>
          </card>
        </div>
        <div class="col-12">
          <card>
            <div class="form-group">
              <label class="form-control-label d-block">
                음악파일 주소
                <el-tooltip placement="right" class="d-lg-inline-flex d-none">
                  <div slot="content" class="row">
                    <div class="col-12">
                      <p>구글 드라이브에 음악파일을 업로드 한 후, <code>공유 가능한 링크 가져오기</code>를 누르세요.<br>
                      <img src="/google-drive-guide.png" class="w-100 mt-3"></p>
                      <p class="mb-0">이후 복사된 아래와 같은 공유주소에서 <code>id=</code> 이후의 문자열을 입력해주세요.<br>
                      <br>예시<br>
                      <code>https://drive.google.com/open?id=12FWexXyjj-m0ab-IWZoD_KBQ7BeL9XaH</code>가<br>구글 드라이브 파일공유 주소라면<br>
                      <code>12FWexXyjj-m0ab-IWZoD_KBQ7BeL9XaH</code>를 입력하시면됩니다.</p>
                    </div>
                  </div>
                  <i class="fas fa-question-circle"></i>
                </el-tooltip>
                <i class="fas fa-question-circle d-inline-flex d-lg-none" @click="modals.linkHelp = true"></i>
                <modal :show.sync="modals.linkHelp" body-classes="p-0" modal-classes="modal-dialog-centered modal-sm">
                  <card type="secondary" shadow header-classes="bg-white pb-5" class="border-0 mb-0">
                    <template>
                      <div class="row">
                        <div class="col-12">
                          <p>구글 드라이브에 음악파일을 업로드 한 후, <code>공유 가능한 링크 가져오기</code>를 누르세요.<br>
                          <img src="/google-drive-guide.png" class="w-100 mt-3"></p>
                          <p class="mb-0">이후 복사된 아래와 같은 공유주소에서 <code>id=</code> 이후의 문자열을 입력해주세요.<br>
                          <br>예시<br>
                          <code>https://drive.google.com/open?id=12FWexXyjj-m0ab-IWZoD_KBQ7BeL9XaH</code>가<br>구글 드라이브 파일공유 주소라면<br>
                          <code>12FWexXyjj-m0ab-IWZoD_KBQ7BeL9XaH</code>를 입력하시면됩니다.</p>
                        </div>
                      </div>
                    </template>
                  </card>
                </modal>
              </label>
              <base-input alternative v-model="song.music"></base-input>
            </div>
            <div class="form-group mb-0">
              <label class="form-control-label d-block">가사</label>
              <tinymce id="adddescription" v-model="song.lyric" :api-key="apikey"
                       :init="initOptions" :plugins="plugin" :toolbar="toolbar">
              </tinymce>
            </div>
          </card>
        </div>
      </div>
      <div class="row justify-content-center">
        <base-button outline type="danger" @click="$router.go(-1)">취소</base-button>
        <base-button outline type="default" @click="submitData(song._id)">저장</base-button>
      </div>
    </div>
  </div>
</template>
<script>
  // Components
  import BaseHeader from '@/components/argon-core/BaseHeader';
  import RouteBreadCrumb from '@/components/argon-core/Breadcrumb/RouteBreadcrumb';
  import { Select, Option } from 'element-ui';
  import FileInput from '@/components/argon-core/Inputs/FileInput';
  import TagsInput from '@/components/argon-core/Inputs/TagsInput'
  import Modal from '@/components/argon-core/Modal.vue';
  import tinymceMixin from '~/components/mixins/tinymceMixin'
  import flatPicker from "vue-flatpickr-component"
  import { Korean } from "flatpickr/dist/l10n/ko.js"
  
  export default {
    mixins: [tinymceMixin],
    middleware: 'editor',
    components: {
      BaseHeader,
      RouteBreadCrumb,
      FileInput,
      TagsInput,
      Modal,
      [Select.name]: Select,
      [Option.name]: Option,
      flatPicker
    },
    data() {
      return {
        song: {
          project: this.$route.query.project,
          title: '',
          titleKR: '',
          artist: '',
          lyricist: '',
          composer: '',
          arrange: '',
          release: '',
          image: '',
          music: '',
          lyric: '',
          tags: []
        },
        projects: [
          {value: 'bandori', label: "BanG Dream!"},
          {value: 'revue', label: "레뷰 스타라이트"},
          {value: 'd4dj', label: "D4DJ"},
          {value: 'rebirth', label: "Re버스 for you"},
          {value: 'assaultlily', label: "어썰트 릴리"},
          {value: 'other', label: "기타"}
        ],
        file: null,
        imgPreview: null,
        modals: {
          linkHelp: false
        },
        flatpickrConfig: {allowInput: true, locale: Korean}
      }
    },
    methods: {
      filesChange(files) {
        this.file = files[0]
        let reader = new FileReader()
        reader.onload = () => {
          this.imgPreview = reader.result
        }
        reader.readAsDataURL(files[0])
      },
      submitData(uid) {
        let formData = new FormData()
        
        if (this.file) formData.append('albumImage', this.file, this.file.name)
        formData.append('data', JSON.stringify(this.song))
        this.$axios.$patch(`/api/discography/${uid}`, formData, {headers: {'Content-Type': 'multipart/form-data'}})
          .then(data => {
            this.$notify({type: 'success', message: '정보를 성공적으로 업데이트 했습니다', timeout: 3000})
            this.$router.push(`/discographies/${encodeURIComponent(data.title)}`)
          })
          .catch(err => {
            let sentry = this.$sentry.captureException(err)
            this.$sentry.showReportDialog({
              eventId: sentry.eventId,
              title: '오류가 발생했습니다.',
              subtitle: '어떤 오류가 발생했는지 알려주세요!',
              subtitle2: '',
              labelName: '닉네임',
              labelEmail: '이메일',
              labelComments: '어떻게 오류가 발생했나요?',
              labelClose: '닫기',
              labelSubmit: '보내기',
              errorGeneric: '오류 보고서를 제출하는 도중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
              errorFormEntry: '일부 필드에 내용이 작성되어있지 않습니다. 모든 필드를 채워주신 후 다시 시도해주세요.',
              successMessage: '피드백이 전송되었습니다. 감사합니다!'
            })
          })
      }
    },
    mounted() {
      this.$axios.$get(`/api/discography/${encodeURIComponent(this.$route.params.title)}`)
        .then(data => {
          this.song = data
        })
        .catch(err => {
          this.$sentry.captureException(err)
        })
    }
  };
</script>
<style>
  @import "flatpickr/dist/flatpickr.css";

  p {
    font-size: inherit;
    font-weight: inherit;
    line-height: inherit;
    margin: 0;
  }
</style>
