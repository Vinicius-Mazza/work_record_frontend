<template>
  <div class="client-by-id">
    <!-- <PageTitle icon="fa fa-user" :main="client.pacientName" :sub="client.dentist" /> -->
      <!-- <div class="client-obs" v-html="client.obs"></div> -->
    <b-form>
      <input id="client-id" type="hidden" v-model="client.id" />
      <b-form-group label="Nome do Paciente:" label-for="client-pacientName">
        <b-form-input id="client-pacientName" type="text"
          v-model="client.pacientName" required
          :readonly="mode === 'remove'"
          placeholder="Informe o nome do cliente..." />
        </b-form-group>
      <b-form-group label="Dentista Responsavel:" label-for="client-dentist">
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
            <b-form-input id="client-arrivalDate"
              v-model="client.arrivalDate" required
              :readonly="mode === 'remove'"
              placeholder="Informe a data de chegada..." />
          </div>
          <div class="col-md-6 col-xs-4">
            <b-form-input id="client-departureDate"
              v-model="client.departureDate" required
              :readonly="mode === 'remove'"
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
      <b-button class="ml-2" @click="cancel">Cancelar</b-button>
    </b-form>
  </div>
</template>

<script>
import 'highlightjs/styles/dracula.css'
import hljs from 'highlightjs/highlight.pack.js'
import { VueEditor } from "vue2-editor"
import { baseApiUrl, showError } from '@/global'
import axios from 'axios'
// import PageTitle from '../template/PageTitle'

// Função ao pressionar o botão esc
document.onkeyup = function(e) {
  e = e || window.event; //compatibilidade com navegadores antigos IE

  if (e.keyCode == 27) {
    history.back(); //ou history.go(-1); 
  }
}

export default {
  name: 'ClientById',
  components: { VueEditor },
  data: function() {
    return {
      mode: 'save',
      client: {},
      categories: []
    }
  },
  methods: {
    loadClient(client, mode = 'save') {
      this.mode = mode
      axios.get(`${baseApiUrl}/clients/${client.id}`)
        .then(res => this.client = res.data)
      },
      save() {
        const method = this.client.id ? 'put' : 'post'
        const id = this.client.id ? `/${this.client.id}` : ''
        axios[method](`${baseApiUrl}/clients${id}`, this.client)
          .then(() => {
            this.$toasted.global.defaultSuccess()
            history.back() // Tentando voltar a pagina anterior...
          })
          .catch(showError)
      },
      cancel() {
        history.back();
      },
      loadCategories() {
        const url = `${baseApiUrl}/categories`
        axios.get(url).then(res => {
          this.categories = res.data.map(category => {
            return { value: category.id, text: category.path }
          })
        })
      },
  },
  mounted() {
    const url = `${baseApiUrl}/clients/${this.$route.params.id}`
    axios.get(url).then(res => this.client = res.data)
    this.loadCategories()
  },
  updated() {
    document.querySelectorAll('.client-content pre.ql-syntax').forEach(e => {
      hljs.highlightBlock(e)
    })
  }
}
</script>

<style>
  /* .client-obs {
    background-color: #FFF;
    border-radius: 8px;
    padding: 25px;
  } */
/* 
  .client-obs pre {
    padding: 20px;
    border-radius: 8px;
    font-size: 1.2rem;
    background-color: #1e1e1e;
    color: #FFF;
  } */
</style>