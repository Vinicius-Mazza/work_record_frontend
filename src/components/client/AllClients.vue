<template>
    <div class="all-clients">
      <PageTitle icon="fa fa-folder-o"
        main="Todos os clientes" />

      <div class="action-client">
        <b-button pill variant="primary" @click="show=true">
          <i class="fa fa-plus"></i>
        </b-button>
      </div>
      <stack-modal
        :show="show"
        title="Criar novo cliente"
        @close="show=false"
        :saveButton="{ visible: false }"
        :cancelButton="{ visible: false }"
      >
        <b-form>
            <input id="client-id" type="hidden" v-model="client.id" />
            <b-form-group label="Nome do Paciente:" 
              label-for="client-pacientName">
              <b-form-input id="client-pacientName" type="text"
                v-model="client.pacientName" required
                :readonly="mode === 'remove'"
                placeholder="Informe o nome do cliente..." />
            </b-form-group>
            <b-form-group label="Dentista Responsavel:" 
              label-for="client-dentist">
              <b-form-input id="client-dentist" type="text"
                v-model="client.dentist" required
                :readonly="mode === 'remove'"
                placeholder="Informe o nome do dentista responsavel..." />
            </b-form-group>
            <b-form-group label="Trabalho:" label-for="client-workType">
              <b-form-input id="client-workType" type="text"
                v-model="client.workType" required
                :readonly="mode === 'remove'"
                placeholder="Informe o nome do trabalho a ser realizado..." />
            </b-form-group>
            <b-form-group label="Datas:" label-for="client-arrivalDate">
              <div class="row">
                <div class="col-md-6 col-xs-4">
                  <b-form-datepicker hide-header v-model="client.arrivalDate" 
                    placeholder="Data de chegada..." 
                    class="mb-2"></b-form-datepicker>
                </div>
                <div class="col-md-6 col-xs-4">
                  <b-form-datepicker hide-header v-model="client.departureDate" 
                    placeholder="Data de saida..." 
                    class="mb-2"></b-form-datepicker>
                </div>
              </div>
            </b-form-group>
            <b-form-group 
              label-cols-sm = "3" 
              label = "Etapa do trabalho:" 
            >
              <b-form-input id="client-name" type="text"
                v-model="client.stage" required
                :readonly="mode === 'remove'"
                placeholder="Informe a Etapa do trabalho" class = "mb-2" />
              <b-form-radio-group  
                v-model="client.stageStatus" required
                :readonly="mode === 'remove'"
                :options = " ['Etapa 1', 'Etapa 2', 'Etapa 3'] " />
            </b-form-group> 
            <b-form-group v-if="mode === 'save'" 
              label="Categoria:" label-for="client-categoryId">
              <b-form-select id="client-categoryId"
                :options="categories" v-model="client.categoryId" />
            </b-form-group>
            <b-form-group v-if="mode === 'save'"
              label="Observações" label-for="client-obs">
              <VueEditor v-model="client.obs"
                placeholder="Observações sobre este paciente..." />
            </b-form-group>
            <b-button variant="primary" v-if="mode === 'save'"
              @click="save">Salvar</b-button>
            <b-button class="ml-2" @click="show=false">Cancelar</b-button>
        </b-form>
      </stack-modal>
      <b-pagination size="md" v-model="page" :total-rows="count" 
        :per-page="limit" />
        <ul>
          <li v-for="client in clients" :key="client.id">
            <ClientItem :client="client" />
          </li>
        </ul>
      <b-pagination size="md" v-model="page" :total-rows="count" 
        :per-page="limit" />
    </div>
</template>

<script>
import { VueEditor } from "vue2-editor"
import { baseApiUrl, showError } from '@/global'
import axios from 'axios'
import StackModal from '@innologica/vue-stackable-modal'
import ClientItem from './ClientItem'
import PageTitle from '../template/PageTitle'

export default {
  name: 'AllClients',
  components: { VueEditor, StackModal, PageTitle, ClientItem },
  data: function() {
    return {
      mode: 'save',
      show: false,
      client: {},
      clients: [],
      categories: [],
      page: 1,
      limit: 0,
      count: 0
    }
  },
  methods: {
    loadClients() {
      const url = `${baseApiUrl}/clients?page=${this.page}`
      axios.get(url).then(res => {
        this.clients = res.data.data
        this.count = res.data.count
        this.limit = res.data.limit
      })
    },
    reset() {
      this.mode = 'save'
      this.client = {}
      this.loadClients()
    },
    save() {
      const method = this.client.id ? 'put' : 'post'
      const id = this.client.id ? `/${this.client.id}` : ''
      axios[method](`${baseApiUrl}/clients${id}`, this.client)
        .then(() => {
          this.$toasted.global.defaultSuccess()
          this.reset()
          window.location.reload() // Refresh page
        })
        .catch(showError)
    },
    remove() {
      const id = this.client.id
      axios.delete(`${baseApiUrl}/clients/${id}`)
        .then(() => {
          this.$toasted.global.defaultSuccess()
          this.reset()
        })
        .catch(showError)
    },
    loadClient(client, mode = 'save') {
      this.mode = mode
      axios.get(`${baseApiUrl}/clients/${client.id}`)
        .then(res => this.client = res.data)
    },
    loadCategories() {
      const url = `${baseApiUrl}/categories`
      axios.get(url).then(res => {
        this.categories = res.data.map(category => {
          return { value: category.id, text: category.path }
        })
      })
    }
  },
  watch: {
    page() {
      this.loadClients()
    }
  },
  mounted() {
    this.loadCategories()
    this.loadClients()
  }
}
</script>

<style>
  .all-clients .action-client {
    display: flex;
    position: fixed;
    z-index: 999;
    right: 20px; 
    bottom: 60px;
  }
  .all-clients ul {
    list-style-type: none;
    padding: 0px;
  }
</style>