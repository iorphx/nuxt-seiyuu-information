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
                <base-input alternative label="발매일">
                  <flat-picker slot-scope="{focus, blur}"
                    @on-open="focus"
                    @on-close="blur"
                    :config="flatpickrConfig"
                    class="form-control datepicker"
                    v-model="goods.release">
                  </flat-picker>
                </base-input>
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
  import { Select, Option } from 'element-ui';
  import FileInput from '@/components/argon-core/Inputs/FileInput';
  import TagsInput from '@/components/argon-core/Inputs/TagsInput'
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
      [Select.name]: Select,
      [Option.name]: Option,
      flatPicker
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
        imgPreview: null,
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
        
        if (this.file) formData.append('goodsImage', this.file, this.file.name)
        formData.append('data', JSON.stringify(this.goods))
        this.$axios.$patch(`/api/goods/${uid}`, formData, {headers: {'Content-Type': 'multipart/form-data'}})
          .then(data => {
            this.$notify({type: 'success', message: '정보를 성공적으로 업데이트 했습니다.', timeout: 3000})
            this.$router.push(`/goods/${encodeURIComponent(data.name)}`)
          })
          .catch(err => {
            this.$notify({type: 'danger', message: '오류가 발생했습니다.', timeout: 3000})
            this.$router.go(-1)
          })
      }
    },
    mounted () {
      this.$axios.$get(`/api/goods/${encodeURIComponent(this.$route.params.name)}`)
        .then(data => {
          this.goods = data
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
</script>
<style>
  @import "flatpickr/dist/flatpickr.css";

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
