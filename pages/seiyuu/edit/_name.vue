<template>
  <div>
    <base-header class="pb-6" type="">
      <div class="row align-items-center py-4">
        <div class="col-12">
          <h6 class="h2 d-inline-block mb-0">성우 정보 수정</h6>
          <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
            <ol class="breadcrumb breadcrumb-links">
              <li class="breadcrumb-item"><nuxt-link to="/"><i class="fas fa-home mr-2"></i>홈</nuxt-link></li>
              <li class="breadcrumb-item"><nuxt-link to="/seiyuu">성우</nuxt-link></li>
              <li class="breadcrumb-item"><nuxt-link :to="`/seiyuu/${$route.params.name}`">{{$route.params.name}}</nuxt-link></li>
              <li class="breadcrumb-item active" aria-current="page">성우 정보 수정</li>
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
              <div class="col-lg-3 order-lg-2">
                <img :src="seiyuu.image" class="img-center rounded-circle" style="width:200px;height:200px;object-fit:cover;" v-if="!imgPreview && seiyuu.image">
                <img src="https://dummyimage.com/450x450/bbbbbb/ffffff&text=no+image" class="img-center rounded-circle" style="width:200px;" v-else-if="!imgPreview && !seiyuu.image">
                <img :src="imgPreview" class="img-center rounded-circle" style="width:200px;height:200px;object-fit:cover;" v-else>
              </div>
            </div>
            <div class="row justify-content-center mt-3">
              <div class="col-12 col-lg-4">
                <file-input @change="filesChange" accept="image/*"></file-input>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="card-profile-stats d-flex justify-content-center">
                  <div>
                    <base-input alternative label="이름" v-model="seiyuu.name" :rules="{required: true}" name="이름"></base-input>
                    <base-input alternative label="이름 (일본어)" v-model="seiyuu.japaneseName"></base-input>
                    <base-input alternative label="이름 (영어 독음)" v-model="seiyuu.englishPr"></base-input>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <div class="row card-profile-stats d-flex justify-content-center">
                  <div class="col-6 col-lg-3 mx-0">
                    <span>
                      <div class="form-group">
                        <label class="form-control-label">생일</label>
                        <el-date-picker
                          type="date"
                          class="w-100"
                          v-model="seiyuu.birthday">
                        </el-date-picker>
                      </div>
                    </span>
                  </div>
                  <div class="col-6 col-lg-3 mx-0">
                    <base-input alternative label="별자리" v-model="seiyuu.constellation"></base-input>
                  </div>
                  <div class="col-6 col-lg-3 mx-0">
                    <base-input alternative label="혈액형" v-model="seiyuu.blood"></base-input>
                  </div>
                  <div class="col-6 col-lg-3 mx-0">
                    <base-input alternative label="신장" v-model="seiyuu.height"></base-input>
                  </div>
                  <div class="col-6 col-lg-3 mx-0">
                    <base-input alternative label="출신지" v-model="seiyuu.born"></base-input>
                  </div>
                  <div class="col-6 col-lg-3 mx-0">
                    <base-input alternative label="특기" v-model="seiyuu.specialty"></base-input>
                  </div>
                  <div class="col-6 col-lg-3 mx-0">
                    <base-input alternative label="취미" v-model="seiyuu.hobbies"></base-input>
                  </div>
                  <div class="col-6 col-lg-3 mx-0">
                    <base-input alternative label="소속사" v-model="seiyuu.agent"></base-input>
                  </div>
                  <div class="col-12">
                    <div class="row justify-content-center">
                      <div class="col-12 col-lg-6">
                        <base-input alternative label="트위터" v-model="seiyuu.links.twitter" prependIcon="fab fa-twitter"></base-input>
                      </div>
                      <div class="col-12 col-lg-6">
                        <base-input alternative label="인스타그램" v-model="seiyuu.links.instagram" prependIcon="fab fa-instagram"></base-input>
                      </div>
                      <div class="col-12 col-lg-6">
                        <base-input alternative label="블로그" v-model="seiyuu.links.blog" prependIcon="fas fa-blog"></base-input>
                      </div>
                      <div class="col-12 col-lg-6">
                        <base-input alternative label="공식 홈페이지" v-model="seiyuu.links.homepage" prependIcon="fas fa-home"></base-input>
                      </div>
                      <div class="col-12 col-lg-6">
                        <base-input alternative label="소속사 프로필" v-model="seiyuu.links.agentpage" prependIcon="fas fa-address-card"></base-input>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </card>
        </div>
        <div class="col-12">
          <card body-classes="p-0" footer-classes="border-0 p-0">
            <h1 class="display-4 mb-0" slot="header">활동</h1>
            <div v-for="activity in seiyuu.activities" v-if="seiyuu.activities" class="border m-4 p-4 rounded">
              <base-input alternative label="활동명" v-model="activity.title"></base-input>
              <ul>
                <li v-for="content in activity.contents" class="mb-3">
                  <div class="row">
                    <div class="col-10 col-lg-11 pr-0">
                      <base-input alternative v-model="content.value" class="mb-0"></base-input>
                    </div>
                    <div class="col-1 my-auto pl-lg-4">
                      <div @click="deleteContent(activity.contents, content)">
                        <span class="btn-inner--icon"><i class="ni ni-fat-delete"></i></span>
                      </div>
                    </div>
                  </div>
                </li>
                <div class="text-center mt-3 py-2 py-lg-3 border rounded">
                  <base-button type="neutral" class="btn-icon-only btn-sm rounded-circle text-default" @click="addContent(activity.contents)">
                    <span class="btn-inner--icon"><i class="ni ni-fat-add"></i></span>
                  </base-button>
                </div>
              </ul>
              <div class="text-center">
                <base-button type="neutral" class="btn-icon-only rounded-circle text-default" @click="deleteActivity(seiyuu.activities, activity)">
                  <span class="btn-inner--icon"><i class="ni ni-fat-delete"></i></span>
                </base-button>
              </div>
            </div>
            <div class="card-body" slot="footer">
              <div class="text-center p-4 border rounded">
                <base-button type="neutral" class="btn-icon-only rounded-circle text-default" @click="addActivity">
                  <span class="btn-inner--icon"><i class="ni ni-fat-add"></i></span>
                </base-button>
              </div>
            </div>
          </card>
        </div>
      </div>
      <div class="row justify-content-center">
        <base-button outline type="danger" @click="$router.go(-1)">취소</base-button>
        <base-button outline type="default" @click="submitData">저장</base-button>
      </div>
    </div>
  </div>
</template>
<script>
  import BaseHeader from '@/components/argon-core/BaseHeader';
  import RouteBreadCrumb from '@/components/argon-core/Breadcrumb/RouteBreadcrumb';
  import FileInput from '@/components/argon-core/Inputs/FileInput';
  import { DatePicker } from 'element-ui';
  
  export default {
    middleware: 'editor',
    components: {
      BaseHeader,
      RouteBreadCrumb,
      FileInput,
      [DatePicker.name]: DatePicker
    },
    data() {
      return {
        seiyuu: {
          name: '',
          japaneseName: '',
          englishPr: '',
          birthday: '',
          constellation: '',
          blood: '',
          height: '',
          hobbies: '',
          specialty: '',
          agent: '',
          born: '',
          image: '',
          links: {twitter: '', instagram: '', blog: '', homepage: '', agentpage: ''},
          activities: [{title: '', contents: [{value: ''}]}]
        },
        file: null,
        imgPreview: null
      }
    },
    mounted() {
      this.$axios.$get(`/api/seiyuu/${this.$route.params.name}`)
        .then(data => {
          this.seiyuu = data
        })
        .catch(err => {
          this.$sentry.captureException(err)
        })
    },
    methods: {
      addActivity() {
        this.seiyuu.activities.push({title: '', contents: [{value: ''}]})
      },
      addContent(arr) {
        arr.push({value: ''})
      },
      deleteContent(arr, obj) {
        let idx = arr.findIndex(function(item) {return item === obj})
        if (idx > -1) {
          arr.splice(idx, 1)
        }
      },
      deleteActivity(arr, obj) {
        let idx = arr.findIndex(function(item) {return item === obj})
        if (idx > -1) {
          arr.splice(idx, 1)
        }
      },
      filesChange(files) {
        this.file = files[0]
        let reader = new FileReader()
        reader.onload = () => {
          this.imgPreview = reader.result
        }
        reader.readAsDataURL(files[0])
      },
      submitData() {
        let formData = new FormData()
        
        if (this.file) {
          formData.append('profileImage', this.file, this.file.name)
        }
        formData.append('data', JSON.stringify(this.seiyuu))
        this.$axios.$patch(`/api/seiyuu/${this.seiyuu._id}`, formData, {headers: {'Content-Type': 'multipart/form-data'}})
          .then(data => {
            this.$notify({type: 'success', message: '정보를 성공적으로 업데이트 했습니다', timeout: 3000})
            this.$router.push(`/seiyuu/${data.name}`)
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
    }
  }
</script>
<style>
  .el-date-editor input.el-input__inner {
    height: calc(1.5em + 1.25rem + 5px) !important;
  }
</style>
