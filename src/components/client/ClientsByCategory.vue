<template>
  <div class="clients-by-category">
    <PageTitle icon="fa fa-folder-o"
      :main="category.name" sub="Categoria" />

    <div class="action-client">
      <b-button variant="primary" @click="show=true">
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
        <b-form-group label="Nome do Paciente:" label-for="client-pacientName">
        <b-form-input id="client-pacientName" type="text"
          v-model="client.pacientName"
          placeholder="Informe o nome do cliente..." />
        </b-form-group>
        <b-form-group label="Dentista Responsavel:" label-for="client-dentist">
          <b-form-input id="client-dentist" type="text"
            v-model="client.dentist" required
            placeholder="Informe o nome do dentista responsavel..." />
          </b-form-group>
        <b-form-group label="Trabalho:" label-for="client-workType">
          <b-form-input id="client-workType" type="text"
            v-model="client.workType" required
            placeholder="Informe o nome do trabalho a ser realizado..." />
        </b-form-group>
        <b-form-group label="Datas:" label-for="client-arrivalDate">
          <div class="row">
            <div class="col-md-6 col-xs-4">
              <b-form-input id="client-arrivalDate"
                v-model="client.arrivalDate" required
                placeholder="Informe a data de chegada..." />
            </div>
            <div class="col-md-6 col-xs-4">
              <b-form-input id="client-departureDate"
                v-model="client.departureDate" required
                placeholder="Informe a data de saida..." />
            </div>
          </div>
        </b-form-group>
        <b-form-group 
          label-cols-sm = "3" 
          label = "Etapa do trabalho:" 
          >
          <b-form-input id="client-name" type="text"
            v-model="client.stage" required
            placeholder="Informe a Etapa do trabalho" class = "mb-2" />
          <b-form-radio-group  
            v-model="client.stageStatus" required
            :options = " ['Etapa 1', 'Etapa 2', 'Etapa 3'] " />
        </b-form-group> 
        <b-form-group 
          label="Categoria:" label-for="client-categoryId">
          <b-form-select id="client-categoryId"
            :options="categories" v-model="client.categoryId" />
        </b-form-group>
        <b-form-group
          label="Observações" label-for="client-obs">
          <VueEditor v-model="client.obs"
            placeholder="Observações sobre este paciente..." />
        </b-form-group>
          <b-button variant="primary"
            @click="save">Salvar</b-button>
          <b-button class="ml-2" @click="show=false">Cancelar</b-button>
      </b-form>
    </stack-modal>

    <ul>
      <li v-for="client in clients" :key="client.id">
        <ClientItem :client="client" />
      </li>
    </ul>
    <div class="load-more">
      <button v-if="loadMore"
        class="btn btn-lg btn-outline-primary"
        @click="getClients">Carregar Mais Clientes</button>
    </div>
  </div>
</template>

<script>
import { baseApiUrl } from '@/global'
import axios from 'axios'
import { VueEditor, showError } from "vue2-editor"
import PageTitle from '../template/PageTitle'
import ClientItem from './ClientItem'
import StackModal from '@innologica/vue-stackable-modal'

export default {
  name: 'ClientsByCategory',
  components: { PageTitle, ClientItem, StackModal, VueEditor },
  data: function() {
    return {
      category: {},
      categories: [],
      clients: [],
      client: {},
      page: 1,
      loadMore: true,
      show: false
    }
  },
  methods: {
    getCategory() {
      const url = `${baseApiUrl}/categories/${this.category.id}`
      axios(url).then(res => this.category = res.data)
    },
    getClients() {
      const url = `${baseApiUrl}/categories/${this.category.id}/clients?page=${this.page}`
      axios(url).then(res => {
        this.clients = this.clients.concat(res.data)
        this.page++

        if(res.data.length === 0) this.loadMore = false
      })
    },
    loadCategories() {
      const url = `${baseApiUrl}/categories`
      axios.get(url).then(res => {
        this.categories = res.data.map(category => {
          return { value: category.id, text: category.path }
        })
      })
    },
    save() {
      const method = this.client.id ? 'put' : 'post'
      const id = this.client.id ? `/${this.client.id}` : ''
      axios[method](`${baseApiUrl}/clients${id}`, this.client)
        .then(() => {
          this.$toasted.global.defaultSuccess()
          window.location.reload()
        })
        .catch(showError)
    }
  },
  watch: {
    $route(to) {
      this.category.id = to.params.id
      this.clients = []
      this.page = 1
      this.loadMore = true

      this.getCategory()
      this.getClients()
    }
  },
  mounted() {
    console.log(this.$route.params.id)
    this.category.id = this.$route.params.id
    this.getCategory()
    this.getClients()
    this.loadCategories()
  }
}
</script>

<style>
  .clients-by-category ul {
    list-style-type: none;
    padding: 0px;
  }

  .clients-by-category .load-more {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 25px;
  }

  .clients-by-category .action-client {
    display: flex;
    position: fixed;
    z-index: 999;
    right: 20px; 
    bottom: 60px;
  }
</style>