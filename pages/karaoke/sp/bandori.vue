<template>
  <div>
    <base-header class="pb-6" type="">
      <div class="row align-items-center py-4">
        <div class="col-12">
          <h6 class="h2 d-inline-block mb-0">BanG Dream! 노래방 번호표</h6>
          <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
            <ol class="breadcrumb breadcrumb-links">
              <li class="breadcrumb-item"><nuxt-link to="/"><i class="fas fa-home mr-2"></i>홈</nuxt-link></li>
              <li class="breadcrumb-item"><nuxt-link to="/karaoke">노래방</nuxt-link></li>
              <li class="breadcrumb-item active" aria-current="page">BanG Dream! 노래방 번호표</li>
            </ol>
          </nav>
        </div>
      </div>
    </base-header>
    
    <div class="container-fluid mt--6">
      <div>
        <card class="no-border-card" body-classes="px-0 py-0" footer-classes="pb-2 border-0" header-classes="border-0">
          <template slot="header">
            <div class="row">
              <div class="col-auto pb-3 pb-lg-0 my-auto">
                <h3 class="mb-0">BanG Dream!</h3>
              </div>
              <div class="col-lg"></div>
              <div class="col col-lg-auto">
                <base-input v-model="searchQuery"
                            prepend-icon="fas fa-search"
                            placeholder="검색..." alternative
                            formGroupClasses="mb-0">
                </base-input>
              </div>
              <div class="col-auto" v-if="this.$store.state.authUser">
                <base-button type="neutral" v-if="['editor', 'admin'].includes(this.$store.state.authUser.role)" @click="addSongInit">
                  <span class="btn-inner--icon"><i class="fas fa-plus"></i></span>
                  <span class="btn-inner--text">추가</span>
                </base-button>
              </div>
            </div>
          </template>
          <div>
            <el-table :data="tableDataProcess"
                      height="600"
                      row-key="no"
                      header-row-class-name="thead-light"
                      @sort-change="sortChange"
                      @filter-change="filterChange"
                      @selection-change="selectionChange">
              <el-table-column :key="stypeCol.label" :column-key="stypeCol.label" v-bind="stypeCol"></el-table-column>
              <el-table-column :key="titleCol.label" :column-key="titleCol.label" v-bind="titleCol">
                <template slot-scope="{row}">
                  {{ row.title }}
                  <small class="d-block mt--1" v-if="row.titleKR">{{ row.titleKR }}</small>
                </template>
              </el-table-column>
              <el-table-column
                v-for="column in tableColumns"
                :key="column.label"
                :column-key="column.label"
                v-bind="column"
              >
              </el-table-column>
              <template v-if="this.$store.state.authUser">
                <el-table-column align="center" v-if="['editor', 'admin'].includes(this.$store.state.authUser.role)">
                  <template slot-scope="{row}">
                    <el-tooltip content="수정" placement="top">
                      <div class="d-inline-flex px-1" @click.prevent="onEdit(row)">
                       <i class="fas fa-edit"></i>
                      </div>
                    </el-tooltip>
                    <el-tooltip content="삭제" placement="top">
                      <div class="d-inline-flex px-1" @click.prevent="onDelete(row)">
                        <i class="fas fa-trash"></i>
                      </div>
                    </el-tooltip>
                  </template>
                </el-table-column>
              </template>
            </el-table>
          </div>
          <div
            slot="footer"
            class="col-12 d-flex justify-content-center justify-content-sm-between flex-wrap"
          >
            <div class="">
              <p class="card-category">
                전체 {{ total }}개의 검색결과 중 {{ from + 1 }} ~ {{ to }} 항목 표시 중

                <span v-if="selectedRows.length">
                  &nbsp; &nbsp; {{selectedRows.length}}개의 열이 선택되었습니다
                </span>
              </p>

            </div>
            <base-pagination
              class="pagination-no-border"
              v-model="pagination.currentPage"
              :per-page="pagination.perPage"
              :total="total"
            >
            </base-pagination>
          </div>
        </card>
      </div>
    </div>
    
    <modal :show.sync="showModal" modal-classes="modal-secondary">
      <form @submit.prevent="saveSong">
        <div class="form-group">
          <base-input label="종류">
            <el-select v-model="model.stype">
              <el-option :value="stype.value" :key="stype.label" :label="stype.label" v-for="stype in stypes">
              </el-option>
            </el-select>
          </base-input>
        </div>
        <base-input label="제목"
                    v-model.lazy="model.title"
                    input-classes="form-control-alternative">
        </base-input>
        <base-input label="제목 (한국어)"
                    v-model.lazy="model.titleKR"
                    input-classes="form-control-alternative">
        </base-input>
        <div class="form-group">
          <base-input label="검색어">
            <tags-input v-model="model.tags"></tags-input>
          </base-input>
        </div>
        <base-input label="가수"
                    v-model.lazy="model.singer"
                    input-classes="form-control-alternative">
        </base-input>
        <base-input label="TJ"
                    v-model.lazy="model.tj"
                    input-classes="form-control-alternative">
        </base-input>
        <base-input label="KY"
                    v-model.lazy="model.ky"
                    input-classes="form-control-alternative">
        </base-input>
        <base-input label="JOYSOUND"
                    v-model.lazy="model.joysound"
                    input-classes="form-control-alternative">
        </base-input>
        <base-input label="DAM"
                    v-model.lazy="model.dam"
                    input-classes="form-control-alternative">
        </base-input>
        <base-input label="UGA"
                    v-model.lazy="model.uga"
                    input-classes="form-control-alternative">
        </base-input>
      </form>
      <template slot="footer">
        <button type="submit" class="btn btn-primary" @click="saveSong(model._id)">확인</button>
        <button type="button" class="btn btn-link ml-auto" @click="showModal = false">닫기</button>
      </template>
    </modal>
  </div>
</template>
<script>
  // Components
  import { Table, TableColumn, Select, Option } from 'element-ui';
  import { BasePagination } from '@/components/argon-core';
  import BaseHeader from '@/components/argon-core/BaseHeader';
  import RouteBreadCrumb from '@/components/argon-core/Breadcrumb/RouteBreadcrumb';
  import Modal from '~/components/argon-core/Modal.vue'
  import TagsInput from '@/components/argon-core/Inputs/TagsInput'
  import swal from 'sweetalert2'
  
  export default {
    head () {
      return {
        title: 'BanG Dream! 노래방 번호표',
        meta: [
          { name: 'og:title', content: 'BanG Dream! 노래방 번호표', hid: 'og:title', template: chunk => `${chunk} - 부시로드 성우 정보` },
          { name: 'og:url', content: `https://bushiroad.seiyuus.com${this.$route.fullPath}`, hid: 'og:url' }
        ]
      }
    },
    components: {
      Modal,
      TagsInput,
      BasePagination,
      BaseHeader,
      RouteBreadCrumb,
      [Table.name]: Table,
      [TableColumn.name]: TableColumn,
      [Select.name]: Select,
      [Option.name]: Option
    },
    data() {
      return {
        showModal: false,
        model: {
          stype: 'normal',
          project: 'bandori',
          title: '',
          titleKR: '',
          tags: [],
          singer: '',
          tj: '',
          ky: '',
          joysound: '',
          dam: '',
          uga: ''
        },
        stypes: [
          {value: 'normal', label: "오리지널"},
          {value: 'anime', label: "커버"}
        ],
        stypeCol: {
          prop: 'stype',
          label: '종류',
          minWidth: 110,
          sortable: true,
          filters: [
            {text: '오리지널', value: '오리지널'},
            {text: '커버', value: '커버'}
          ],
          filterMethod: this.filterType
        },
        titleCol: {
          prop: 'title',
          label: '제목',
          minWidth: 190,
          sortable: true
        },
        tableColumns: [
          {
            prop: 'singer',
            label: '가수',
            minWidth: 140,
            sortable: true,
            filters: [
              {text: "Poppin'Party", value: "Poppin'Party"},
              {text: 'Afterglow', value: 'Afterglow'},
              {text: 'Pastel*Palettes', value: 'Pastel*Palettes'},
              {text: 'Roselia', value: 'Roselia'},
              {text: 'ハロー、ハッピーワールド!', value: 'ハロー、ハッピーワールド!'},
              {text: 'RAISE A SUILEN', value: 'RAISE A SUILEN'},
              {text: 'Morfonica', value: 'Morfonica'},
              {text: 'Glitter*Green', value: 'Glitter*Green'},
              {text: 'GBP!スペシャルバンド', value: 'GBP!スペシャルバンド'},
              {text: "Poppin'Party×グリグリ", value: "Poppin'Party×グリグリ"},
              {text: "Poppin'Party×彩×こころ", value: "Poppin'Party×彩×こころ"},
              {text: 'Roselia×蘭', value: 'Roselia×蘭'},
              {text: 'ハロハピ×蘭×彩', value: 'ハロハピ×蘭×彩'},
              {text: '山吹沙綾', value: '山吹沙綾'},
              {text: '市ヶ谷有咲', value: '市ヶ谷有咲'},
              {text: '彩×モカ×リサ×花音×つぐみ', value: '彩×モカ×リサ×花音×つぐみ'},
              {text: '戸山香澄', value: '戸山香澄'},
              {text: '牛込りみ', value: '牛込りみ'},
              {text: '花園たえ', value: '花園たえ'},
              {text: '香澄×Afterglow', value: '香澄×Afterglow'},
              {text: '香澄×蘭×彩×友希那×こころ', value: '香澄×蘭×彩×友希那×こころ'}
            ],
            filterMethod: this.filterHandler
          },
          {
            prop: 'tj',
            label: 'TJ',
            minWidth: 90,
            sortable: false
          },
          {
            prop: 'ky',
            label: 'KY',
            minWidth: 90,
            sortable: false
          },
          {
            prop: 'joysound',
            label: 'JOYSOUND',
            minWidth: 120,
            sortable: false
          },
          {
            prop: 'dam',
            label: 'DAM',
            minWidth: 100,
            sortable: false
          },
          {
            prop: 'uga',
            label: 'UGA',
            minWidth: 100,
            sortable: false
          }
        ],
        tableData: [],
        selectedRows: [],
        pagination: {
          perPage: 25,
          currentPage: 1,
          total: 0
        },
        searchQuery: '',
        filters: {
          stype: [],
          singer: []
        }
      }
    },
    async asyncData({$axios}) {
      let data = await $axios.$get('/api/karaoke/bandori')
      data.filter(val => {
        if(val.titleKR === undefined) val.titleKR = ''
        if(val.tags === undefined) val.tags = []
        if(val.stype === 'normal') return val.stype = '오리지널'
        else return val.stype = '커버'
      })
      return {
        tableData: data
      }
    },
    methods: {
      selectionChange(selectedRows) {
        this.selectedRows = selectedRows
      },
      filterHandler(value, row, column) {
        const property = column['property'];
        return row[property] === value
      },
      filterType(value, row) {
        return row.stype === value
      },
      filterChange(filters) {
        if (filters.종류)
          this.filters.stype = filters.종류
        if (filters.가수)
          this.filters.singer = filters.가수
      },
      sortChange({ prop, order }) {
        if (prop) {
          this.tableData.sort((a, b) => {
            let aVal = a[prop]
            let bVal = b[prop]
            if (order === 'ascending') {
              return aVal > bVal ? 1 : -1
            }
            return bVal - aVal ? 1 : -1
          })
        } else {
          this.tableData.sort((a, b) => {
            return a.id - b.id
          })
        }
      },
      saveSong(uid) {
        if (uid === undefined) {
          this.$axios.$post('/api/karaoke', {data: this.model})
            .then(res => {
              this.$notify({type: 'success', message: '요청을 처리완료했습니다', timeout: 3000})
              this.showModal = false
              this.reloadData()
            })
            .catch(err => {
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
        } else {
        this.$axios.$put(`/api/karaoke/${uid}`, {data: this.model})
          .then(res => {
            this.$notify({type: 'success', message: '요청을 처리완료했습니다', timeout: 3000})
            this.showModal = false
            this.reloadData()
          })
          .catch(err => {
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
        }
      },
      onEdit(row) {
        this.model = {...row}
        if (this.model.stype === '오리지널') this.model.stype = 'normal'
        else this.model.stype = 'anime'
        this.showModal = true
      },
      onDelete(row) {
        swal.fire({
          icon: 'question',
          title: '해당 곡 정보를 삭제하시겠습니까?',
          html: `<strong>제목 : ${row.title}</strong>`,
          showCancelButton: true,
          customClass: {
            confirmButton: 'btn btn-danger btn-fill',
            cancelButton: 'btn btn-default btn-fill'
          },
          confirmButtonText: '삭제',
          cancelButtonText: '취소',
          buttonsStyling: false,
          reverseButtons: true
        })
        .then((result) => {
          if (result.value) {
            this.$axios.$delete('/api/karaoke/' + row._id)
              .then(res => {
                this.reloadData()
                this.$notify({type: 'success', message: '삭제했습니다', timeout: 3000})
              })
              .catch(err => {
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
          }
        })
      },
      addSongInit() {
        this.model = {
          stype: 'normal',
          project: 'bandori',
          title: '',
          titleKR: '',
          tags: [],
          singer: '',
          tj: '',
          ky: '',
          joysound: '',
          dam: '',
          uga: ''
        }
        this.showModal = true
      },
      reloadData() {
        this.$axios.$get('/api/karaoke/bandori')
          .then(data => {
            data.filter(val => {
              if(val.titleKR === undefined) val.titleKR = ''
              if(val.tags === undefined) val.tags = []
              if(val.stype === 'normal') return val.stype = '오리지널'
              else return val.stype = '커버'
            })
            this.tableData = data
          })
          .catch(err => {
            this.$sentry.captureException(err)
          })
      }
    },
    computed: {
      to() {
        let highBound = this.from + this.pagination.perPage;
        if (this.total < highBound) {
          highBound = this.total;
        }
        return highBound;
      },
      from() {
        return this.pagination.perPage * (this.pagination.currentPage - 1);
      },
      total() {
        return this.searchQueryProcess.length
      },
      tableDataProcess() {
        return this.searchQueryProcess.slice(this.from, this.to)
      },
      searchQueryProcess() {
        let result = this.tableData
        result = result.filter(data => {
          return (data.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                  data.singer.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                  data.titleKR.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                  data.tags.join().toLowerCase().includes(this.searchQuery.toLowerCase()))
        })
        if (!this.filters.stype.length && !this.filters.singer.length)
          return result
        if (this.filters.stype.length && !this.filters.singer.length)
          return result
            .filter(row => this.filters.stype.includes(row.stype))
        if (!this.filters.stype.length && this.filters.singer.length)
          return result
            .filter(row => this.filters.singer.includes(row.singer))
        if (this.filters.stype.length && this.filters.singer.length)
          return result
            .filter(row => this.filters.singer.includes(row.singer))
            .filter(row => this.filters.stype.includes(row.stype))
      }
    }
  }
</script>
<style>
.no-border-card .card-footer{
  border-top: 0;
}
.el-table .cell, .el-table th div {
  overflow: visible;
}
.el-table .cell {
  word-break: keep-all;
}
</style>