<template>
  <div>
    <base-header class="pb-6" type="">
      <div class="row align-items-center py-4">
        <div class="col">
          <h6 class="h2 d-inline-block mb-0">{{project}} 성우 정보</h6>
          <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
            <ol class="breadcrumb breadcrumb-links">
              <li class="breadcrumb-item"><nuxt-link to="/"><i class="fas fa-home mr-2"></i>홈</nuxt-link></li>
              <li class="breadcrumb-item"><nuxt-link to="/seiyuu">성우</nuxt-link></li>
              <li class="breadcrumb-item active" aria-current="page">{{project}}</li>
            </ol>
          </nav>
        </div>
        <template v-if="$store.state.authUser">
          <div class="col-auto mr-2" @click.prevent="addGroup" v-if="['editor', 'admin'].includes($store.state.authUser.role)">
            <i class="fa-users fas pr-2"></i><h4 class="d-inline-flex mb-0">그룹 추가</h4>
          </div>
        </template>
      </div>
    </base-header>
    <div class="container-fluid mt--6">
      <div class="row">
        <div class="col-12" v-for="(group, groupIndex) in info">
          <card class="text-center">
            <template slot="header">
              <div class="row">
                <div class="col">
                  <el-tooltip content="그룹 컬러" placement="bottom" v-if="group.color">
                    <span :style="{background: group.color}" class="px-2 rounded-circle mx-1"
                      v-clipboard:copy="group.color" v-clipboard:success="onCopy" v-clipboard:error="onError">&nbsp;</span>
                  </el-tooltip>
                  <h3 class="d-inline-block mb-0">{{ group.name }}</h3>
                </div>
                <div class="col-auto" v-if="$store.state.authUser">
                  <i class="fas fa-user-plus px-1" v-if="['editor', 'admin'].includes($store.state.authUser.role)" @click.prevent="addSeiyuuInit(groupIndex)"></i>
                  <i class="fas fa-edit px-1" v-if="['editor', 'admin'].includes($store.state.authUser.role)" @click.prevent="editGroup(group, groupIndex)"></i>
                  <i class="fas fa-trash px-1" v-if="['editor', 'admin'].includes($store.state.authUser.role)" @click.prevent="deleteGroup(group._id)"></i>
                </div>
              </div>
            </template>
            <template>
              <draggable v-model="group.members" :group="group.name" @end="dragSave(group)" handle=".handle" :animation="0">
                <transition-group type="transition" name="flip-list">
                  <ul class="list-group list-group-flush list d-inline-flex mx-lg-5 my-4 mx-md-5 mx-5" v-for="(member, memberIndex) in group.members" :key="member.name">
                    <lazy-component :key="member.image">
                      <img :src="member.image"
                        class="rounded-circle img-center img-fluid shadow shadow-lg--hover"
                        style="width:200px;height:200px;object-fit:cover;" v-if="member.image">
                      <img src="https://dummyimage.com/450x450/bbbbbb/ffffff&text=no+image"
                        class="rounded-circle img-center img-fluid shadow shadow-lg--hover mb-2" style="width:200px;height:200px;object-fit:cover;"
                        v-else>
                      <template v-if="$store.state.authUser">
                        <span v-if="['editor', 'admin'].includes($store.state.authUser.role)" class="badge-circle border-0"
                              :id="`${group.name}${memberIndex}`"
                              style="transform: translateY(-1000%) translateX(450%) !important;" @click.prevent="editSeiyuu(member, groupIndex, memberIndex)">
                          <i class="fas fa-edit mx-1"></i>
                          <i class="fas fa-arrows-alt handle mx-1"></i>
                        </span>
                      </template>
                    </lazy-component>
                    <div class="pt-4 text-center">
                      <h5 class="h3 title">
                        <span class="d-block mb-1">{{ member.name }}</span>
                        <small class="h4 font-weight-light text-muted">{{ member.character }}</small>
                      </h5>
                      <div class="mt-3">
                        <el-tooltip content="트위터" placement="bottom" v-if="member.twitter">
                          <base-button target="_blank" tag="a"
                                       :href="member.twitter" type="outline-default"
                                       class="btn-icon-only rounded-circle"><span class="btn-inner--icon"><i class="fab fa-twitter"></i></span></base-button>
                        </el-tooltip>
                        <el-tooltip content="인스타그램" placement="bottom" v-if="member.instagram">
                          <base-button target="_blank" tag="a"
                                       :href="member.instagram" type="outline-default"
                                       class="btn-icon-only rounded-circle"><span class="btn-inner--icon"><i class="fab fa-instagram"></i></span></base-button>
                        </el-tooltip>
                        <el-tooltip content="블로그" placement="bottom" v-if="member.blog">
                          <base-button target="_blank" tag="a"
                                       :href="member.blog" type="outline-default"
                                       class="btn-icon-only rounded-circle"><span class="btn-inner--icon"><i class="fas fa-blog"></i></span></base-button>
                        </el-tooltip>
                        <el-tooltip content="퍼스널 컬러" placement="bottom" v-if="member.color">
                          <base-button tag="a" type="outline-default" round icon-only
                                       class="btn-icon-only rounded-circle text-default"
                                       v-clipboard:copy="member.color"
                                       v-clipboard:success="onCopy"
                                       v-clipboard:error="onError"><span class="btn-inner--icon"><i class="fas fa-palette"></i></span>
                                       <span class="badge-circle badge-floating border-0" :style="{'background-color':member.color}"
                                             style="transform: translateY(80%) translateX(-50%) !important; width: 1rem !important; height: 1rem !important;">&nbsp; </span></base-button>
                        </el-tooltip>
                      </div>
                    </div>
                  </ul>
                </transition-group>
              </draggable>
            </template>
          </card>
        </div>
      </div>
    </div>
    <modal :show.sync="showModal" modal-classes="modal-secondary">
      <form @submit.prevent="saveSeiyuu">
        <div class="row">
          <div class="col-12 mb-3">
            <img :src="model.image"
              class="rounded-circle img-center img-fluid shadow shadow-lg--hover mb-2"
              style="width:200px;height:200px;object-fit:cover;" v-if="!imgPreview && model.image">
            <img src="https://dummyimage.com/450x450/bbbbbb/ffffff&text=no+image"
              class="rounded-circle img-center img-fluid shadow shadow-lg--hover mb-2" style="width:200px;height:200px;object-fit:cover;"
              v-else-if="!imgPreview && !model.image">
            <img :src="imgPreview"
              class="rounded-circle img-center img-fluid shadow shadow-lg--hover mb-2"
              style="width:200px;height:200px;object-fit:cover;" v-else>
            <file-input @change="filesChange" accept="image/*"></file-input>
          </div>
          <div class="col-12">
            <base-input label="이름"
              v-model="model.name"
              input-classes="form-control-alternative">
            </base-input>
          </div>
          <div class="col">
            <base-input label="캐릭터 이름"
              v-model="model.character"
              input-classes="form-control-alternative">
            </base-input>
          </div>
          <div class="col-auto">
            <base-input label="퍼스널 컬러"
              input-classes="form-control-alternative" class="text-center">
              <el-color-picker v-model="model.color"></el-color-picker>
            </base-input>
          </div>
          <div class="col-12">
            <base-input label="트위터"
              v-model="model.twitter"
              input-classes="form-control-alternative">
            </base-input>
          </div>
          <div class="col-12">
            <base-input label="인스타그램"
              v-model="model.instagram"
              input-classes="form-control-alternative">
            </base-input>
          </div>
          <div class="col-12">
            <base-input label="블로그"
              v-model="model.blog"
              input-classes="form-control-alternative">
            </base-input>
          </div>
        </div>
      </form>
      <template slot="footer">
        <button type="submit" class="btn btn-primary" @click="saveSeiyuu">확인</button>
        <base-button type="danger" @click="deleteSeiyuu">삭제</base-button>
        <button type="button" class="btn btn-link ml-auto" @click="showModal = false">닫기</button>
      </template>
    </modal>
    
    <modal :show.sync="showModalGroup" modal-classes="modal-secondary">
      <form @submit.prevent="saveGroup">
        <div class="row">
          <div class="col">
            <base-input label="이름"
              formGroupClasses="my-0"
              v-model="groupModel.name"
              input-classes="form-control-alternative">
            </base-input>
          </div>
          <div class="col-auto">
            <base-input label="그룹 컬러"
              input-classes="form-control-alternative" class="text-center">
              <el-color-picker v-model="groupModel.color"></el-color-picker>
            </base-input>
          </div>
        </div>
      </form>
      <template slot="footer">
        <button type="submit" class="btn btn-primary" @click="saveGroup">확인</button>
        <button type="button" class="btn btn-link ml-auto" @click="showModalGroup = false">닫기</button>
      </template>
    </modal>
  </div>
</template>

<script>
  import Vue from 'vue'
  import VueClipboard from 'vue-clipboard2'
  Vue.use(VueClipboard)
  // Components
  import BaseHeader from '@/components/argon-core/BaseHeader'
  import RouteBreadCrumb from '@/components/argon-core/Breadcrumb/RouteBreadcrumb'
  import Modal from '~/components/argon-core/Modal.vue'
  import { ColorPicker } from 'element-ui'
  import FileInput from '@/components/argon-core/Inputs/FileInput';
  import draggable from 'vuedraggable'
  import swal from 'sweetalert2'
  
  export default {
    asyncData ({ params, $axios, $sentry }) {
      return $axios.$get(`/api/seiyuu/special/${params.project}`)
        .then(data => {
          let projects = [
            {label: 'BanG Dream!', value: 'bandori'},
            {label: '레뷰 스타라이트', value: 'revue'},
            {label: 'D4DJ', value: 'd4dj'},
            {label: 'Re버스 for you', value: 'rebirth'},
            {label: "어썰트 릴리", value: 'assaultlily'}
          ]
          let project = projects.filter(project => project.value === params.project)
          return {
            info: data,
            project: project[0].label
          }
        })
        .catch(err => {
          $sentry.captureException(err)
        })
    },
    head () {
      return {
        title: `${this.project} 성우 정보`,
        meta: [
          { name: 'og:title', content: `${this.project} 성우 정보`, hid: 'og:title', template: chunk => `${chunk} - 성우 정보 - 부시로드 성우 정보` },
          { name: 'og:url', content: `https://bushiroad.seiyuus.com${this.$route.fullPath}`, hid: 'og:url' }
        ]
      }
    },
    components: {
      BaseHeader,
      RouteBreadCrumb,
      [ColorPicker.name]: ColorPicker,
      Modal,
      FileInput,
      draggable
    },
    data() {
      return {
        model: {
          name: '',
          character: '',
          image: '',
          twitter: '',
          instagram: '',
          blog: '',
          color: ''
        },
        groupModel: {
          name: '',
          color: '',
          project: this.$route.params.project,
          members: []
        },
        memberIndex: null,
        groupIndex: null,
        showModal: false,
        showModalGroup: false,
        file: null,
        imgPreview: null,
        isDelete: ''
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
      onCopy() {
        this.$notify({type: 'info', message: '색상코드를 복사했습니다.', timeout: 3000})
      },
      onError() {
        this.$notify({type: 'danger', message: '오류가 발생했습니다.', timeout: 3000})
      },
      editSeiyuu(seiyuu, groupIndex, memberIndex) {
        this.model = {...seiyuu}
        this.groupIndex = groupIndex
        this.memberIndex = memberIndex
        this.file, this.imgPreview = null
        if (this.isDelete) this.isDelete = ''
        this.showModal = true
      },
      editGroup(group, groupIndex) {
        this.groupModel = {...group}
        this.groupIndex = groupIndex
        this.showModalGroup = true
      },
      addSeiyuuInit(groupIndex) {
        this.model = {
          name: '',
          character: '',
          image: '',
          twitter: '',
          instagram: '',
          blog: '',
          color: ''
        }
        this.groupIndex = groupIndex
        this.file = null
        this.imgPreview = null
        this.memberIndex = null
        if (this.isDelete) this.isDelete = ''
        this.showModal = true
      },
      addGroup() {
        this.groupModel = {
          name: '',
          color: '',
          project: this.$route.params.project,
          members: []
        }
        this.showModalGroup = true
      },
      saveSeiyuu() {
        if (this.isDelete) {}
        else if (this.memberIndex !== null) this.info[this.groupIndex].members[this.memberIndex] = this.model
        else this.info[this.groupIndex].members.push(this.model)
        
        let formData = new FormData()
        
        if (this.file) formData.append('seiyuuImage', this.file, this.file.name)
        formData.append('data', JSON.stringify(this.info[this.groupIndex]))
        if (this.file && !this.memberIndex) this.memberIndex = this.info[this.groupIndex].members.length - 1
        if (!this.file && this.isDelete) formData.append('delete', this.isDelete)
        formData.append('memberIndex', this.memberIndex)
        this.$axios.$patch(`/api/seiyuu/special/${this.info[this.groupIndex]._id}`, formData, {headers: {'Content-Type': 'multipart/form-data'}})
          .then(data => {
            this.$notify({type: 'success', message: '정보를 성공적으로 업데이트 했습니다.', timeout: 3000})
            this.isDelete = ''
            this.showModal = false
            this.reloadData()
          })
          .catch(err => {
            this.isDelete = ''
            this.showModal = false
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
      },
      saveGroup() {
        if (this.groupModel._id === undefined) {
          this.$axios.$post(`/api/seiyuu/special`, {data: this.groupModel})
            .then(data => {
              this.$notify({type: 'success', message: '정보를 성공적으로 추가 했습니다.', timeout: 3000})
              this.reloadData()
              this.showModalGroup = false
            })
            .catch(err => {
              this.showModalGroup = false
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
        } else {
          this.$axios.$patch(`/api/seiyuu/special/group/${this.groupModel._id}`, {data: this.groupModel})
            .then(data => {
              this.$notify({type: 'success', message: '정보를 성공적으로 수정 했습니다.', timeout: 3000})
              this.reloadData()
              this.showModalGroup = false
            })
            .catch(err => {
              this.showModalGroup = false
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
      deleteSeiyuu() {
        if (!this.info[this.groupIndex].members[this.memberIndex].image) this.isDelete = 'true'
        else this.isDelete = this.info[this.groupIndex].members[this.memberIndex].image
        this.info[this.groupIndex].members.splice(this.memberIndex, 1)
        this.saveSeiyuu()
      },
      deleteGroup(groupId) {
        swal.fire({
          icon: 'question',
          title: '해당 그룹 정보를 삭제하시겠습니까?',
          showCancelButton: true,
          customClass: { confirmButton: 'btn btn-danger btn-fill', cancelButton: 'btn btn-default btn-fill' },
          confirmButtonText: '삭제',
          cancelButtonText: '취소',
          buttonsStyling: false,
          reverseButtons: true
        })
        .then((result) => {
          if (result.value) {
            this.$axios.$delete(`/api/seiyuu/special/${groupId}`)
              .then(data => {
                this.$notify({type: 'success', message: '정보를 성공적으로 삭제 했습니다.', timeout: 3000})
                this.reloadData()
              })
              .catch(err => {
                this.showModalGroup = false
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
        })
      },
      async reloadData() {
        this.info = await this.$axios.$get(`/api/seiyuu/special/${this.$route.params.project}`)
      },
      dragSave(group) {
        let formData = new FormData()
        
        formData.append('data', JSON.stringify(group))
        this.$axios.$patch(`/api/seiyuu/special/${group._id}`, formData, {headers: {'Content-Type': 'multipart/form-data'}})
          .then(data => {
            this.$notify({type: 'success', message: '정보를 성공적으로 업데이트 했습니다.', timeout: 3000})
            this.reloadData()
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
  };
</script>
<style>
a.text-default:hover {
  color: #fff !important;
}
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
</style>
