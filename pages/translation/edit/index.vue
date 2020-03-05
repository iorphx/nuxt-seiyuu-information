<template>
  <div>
    <base-header class="pb-6" type="">
      <div class="row align-items-center py-4">
        <div class="col-12">
          <h6 class="h2 d-inline-block mb-0">번역 추가</h6>
          <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
            <ol class="breadcrumb breadcrumb-links">
              <li class="breadcrumb-item"><nuxt-link to="/"><i class="fas fa-home mr-2"></i>홈</nuxt-link></li>
              <li class="breadcrumb-item"><nuxt-link to="/translation">번역</nuxt-link></li>
              <li class="breadcrumb-item active" aria-current="page">번역 추가</li>
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
              <div class="col-12 my-auto">
                <base-input alternative label="제목" v-model="article.title"></base-input>
                <base-input alternative label="출처" v-model="article.source" placeholder="본인이 번역한 번역물이 아닐 경우 입력"></base-input>
                <div class="form-group">
                  <base-input label="프로젝트">
                    <el-select v-model="article.project">
                      <el-option :value="project.value" :key="project.label" :label="project.label" v-for="project in projects">
                      </el-option>
                    </el-select>
                  </base-input>
                </div>
                <div class="form-group">
                  <base-input label="태그">
                    <tags-input v-model="article.tags"></tags-input>
                  </base-input>
                </div>
              </div>
              <div class="col-12">
                <div class="form-group">
                  <tinymce id="adddescription" v-model="article.html" :api-key="apikey"
                       :init="initOptions" :plugins="plugin" :toolbar="toolbar">
                  </tinymce>
                </div>
              </div>
            </div>
            <div class="row justify-content-center">
              <base-button outline type="danger" @click="$router.go(-1)">취소</base-button>
              <base-button outline type="default" @click="submitData">저장</base-button>
            </div>
          </card>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import BaseHeader from '@/components/argon-core/BaseHeader'
  import RouteBreadCrumb from '@/components/argon-core/Breadcrumb/RouteBreadcrumb'
  import { Select, Option } from 'element-ui'
  import FileInput from '@/components/argon-core/Inputs/FileInput'
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
      [Option.name]: Option
    },
    data() {
      return {
        article: {
          project: 'bandori',
          source: '',
          title: '',
          html: '',
          tags: []
        },
        projects: [
          {value: 'bandori', label: "BanG Dream!"},
          {value: 'revue', label: "레뷰 스타라이트"},
          {value: 'd4dj', label: "D4DJ"},
          {value: 'rebirth', label: "Re버스 for you"},
          {value: 'assaultlily', label: "어썰트 릴리"},
          {value: 'other', label: "기타"}
        ]
      }
    },
    methods: {
      submitData() {
        this.article.author = this.$store.state.authUser.username
        this.article.date = new Date()
        this.$axios.$post(`/api/translation`, {data: this.article})
          .then(data => {
            this.$notify({type: 'success', message: '성공적으로 글을 작성했습니다', timeout: 3000})
            this.$router.push(`/translation/${data._id}`)
          })
          .catch(err => {
            this.$notify({type: 'danger', message: '오류가 발생했습니다', timeout: 3000})
            this.$router.go(-1)
          })
      }
    }
  }
</script>
<style>
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
