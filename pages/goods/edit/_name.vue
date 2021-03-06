<template>
  <div>
    <base-header class="pb-6" type="">
      <div class="row align-items-center py-4">
        <div class="col-12">
          <h6 class="h2 d-inline-block mb-0">굿즈 정보 수정</h6>
          <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
            <ol class="breadcrumb breadcrumb-links">
              <li class="breadcrumb-item"><nuxt-link to="/"><i class="fas fa-home mr-2"></i>홈</nuxt-link></li>
              <li class="breadcrumb-item"><nuxt-link to="/goods">굿즈</nuxt-link></li>
              <li class="breadcrumb-item"><nuxt-link :to="`/goods/${project.value}`">{{project.label}} 굿즈</nuxt-link></li>
              <li class="breadcrumb-item active" aria-current="page">굿즈 정보 수정</li>
            </ol>
          </nav>
        </div>
      </div>
    </base-header>
    
    <div class="container-fluid mt--6">
      <div class="row">
        <div class="col-12">
          <card>
            <div class="row justify-content-center">
              <div class="col-lg-5 col-md-12 mb-3 mb-lg-0">
                <img :src="goods.image"
                     class="img-center img-fluid shadow shadow-lg--hover mb-2"
                     style="width: 450px;" v-if="!imgPreview && goods.image">
                <img src="https://dummyimage.com/450x450/bbbbbb/ffffff&text=no+image"
                     class="img-center img-fluid shadow shadow-lg--hover mb-2" style="width:450px;"
                     v-else-if="!imgPreview && !goods.image">
                <img :src="imgPreview"
                     class="img-center img-fluid shadow shadow-lg--hover mb-2"
                     style="width: 450px;" v-else>
                <file-input @change="filesChange" accept="image/*"></file-input>
              </div>
              <div class="col-lg-7 col-md-12 my-auto">
                <base-input alternative label="이름" v-model="goods.name" :rules="{required: true}" name="이름"></base-input>
                <base-input alternative label="이름 (일본어)" v-model="goods.nameJP"></base-input>
                <span>
                  <div class="form-group">
                    <label class="form-control-label">발매일</label>
                    <el-date-picker
                      type="date"
                      class="w-100"
                      v-model="goods.release">
                    </el-date-picker>
                  </div>
                </span>
                <base-input alternative label="가격" v-model="goods.price"></base-input>
                <base-input alternative label="종류" v-model="goods.goodsType"></base-input>
                <base-input alternative label="링크" v-model="goods.link"></base-input>
                <div class="form-group">
                  <base-input label="프로젝트">
                    <el-select v-model="goods.project">
                      <el-option :value="project.value" :key="project.label" :label="project.label" v-for="project in projects">
                      </el-option>
                    </el-select>
                  </base-input>
                </div>
                <div class="form-group">
                  <base-input label="태그">
                    <tags-input v-model="goods.tags"></tags-input>
                  </base-input>
                </div>
              </div>
              <div class="col-12">
                <div class="form-group">
                  <label class="form-control-label d-block">설명</label>
                  <tinymce id="adddescription" v-model="goods.description" :api-key="apikey"
                           :init="initOptions" :plugins="plugin" :toolbar="toolbar">
                  </tinymce>
                </div>
              </div>
            </div>
            <div class="row justify-content-center">
              <base-button outline type="danger" @click="$router.go(-1)">취소</base-button>
              <base-button outline type="default" @click="submitData(goods._id)">저장</base-button>
            </div>
          </card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import BaseHeader from '@/components/argon-core/BaseHeader';
  import RouteBreadCrumb from '@/components/argon-core/Breadcrumb/RouteBreadcrumb';
  import { Select, Option, DatePicker } from 'element-ui';
  import FileInput from '@/components/argon-core/Inputs/FileInput';
  import TagsInput from '@/components/argon-core/Inputs/TagsInput'
  import tinymceMixin from '~/components/mixins/tinymceMixin'
  
  export default {
    mixins: [tinymceMixin],
    middleware: 'editor',
    components: {
      BaseHeader,
      RouteBreadCrumb,
      FileInput,
      TagsInput,
      [Select.name]: Select,
      [Option.name]: Option,
      [DatePicker.name]: DatePicker
    },
    data() {
      return {
        goods: {
          project: this.$route.query.project,
          name: '',
          nameJP: '',
          description: '',
          goodsType: '',
          price: '',
          release: '',
          image: '',
          link: ''
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
        imgPreview: null
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
        
        if (this.file) formData.append('goodsImage', this.file, this.file.name)
        formData.append('data', JSON.stringify(this.goods))
        this.$axios.$patch(`/api/goods/${uid}`, formData, {headers: {'Content-Type': 'multipart/form-data'}})
          .then(data => {
            this.$notify({type: 'success', message: '정보를 성공적으로 업데이트 했습니다.', timeout: 3000})
            this.$router.push(`/goods/${encodeURIComponent(data.name)}`)
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
    asyncData ({ params, $axios, $sentry }) {
      return $axios.$get(`/api/goods/${encodeURIComponent(params.name)}`)
        .then(data => {
          let projects = [
            {label: 'BanG Dream!', value: 'bandori'},
            {label: '레뷰 스타라이트', value: 'revue'},
            {label: 'D4DJ', value: 'd4dj'},
            {label: 'Re버스 for you', value: 'rebirth'},
            {label: "어썰트 릴리", value: 'assaultlily'}
          ]
          let project = projects.filter(project => project.value === data.project)
          return {
            goods: data,
            project: project[0]
          }
        })
        .catch(err => {
          $sentry.captureException(err)
        })
    }
  }
</script>
<style>
  .el-date-editor input.el-input__inner {
    height: calc(1.5em + 1.25rem + 5px) !important;
  }
  
  a.text-default:hover {
    color: #fff !important;
  }
  p {
    font-size: inherit;
    font-weight: inherit;
    line-height: inherit;
    margin: 0;
  }
</style>
