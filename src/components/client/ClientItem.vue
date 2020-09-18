<template>
  <div class="client-item">
    <router-link :to="{ name: 'clientById', params: { id: client.id } }">
      <div class="client-item-info">
        <h2>Paciente: {{ client.pacientName }}</h2>
        <p>Dentista responsavel: {{ client.dentist }}</p>
        <p>Trabalho a ser realizado: {{ client.workType }}</p>
        <p>Data de chegada: {{ client.arrivalDate }}</p>
        <p>Data de saida: {{ client.departureDate }}</p>
        <p>{{client.stageStatus}} <i class="fa fa-angle-double-right"></i> Tipo: {{ client.stage }}</p>
        <!-- <p>Clique no card para mais informações...</p> -->
      </div>
    </router-link>
    <b-button variant="danger" @click="remove">Excluir cliente</b-button>
  </div>
</template>

<script>
import { baseApiUrl, showError } from '@/global'
import axios from 'axios'

export default {
  name: 'ClientItem',
  props: ['client'],
  methods: {
    remove() {
    const id = this.client.id
    axios.delete(`${baseApiUrl}/clients/${id}`)
      .then(() => {
        this.$toasted.global.defaultSuccess()
        this.reset()
      })
      .catch(showError)
      window.location.reload() // Refresh page
    },
    loadClient(client, mode = 'save') {
      this.mode = mode
      axios.get(`${baseApiUrl}/clients/${client.id}`)
        .then(res => this.client = res.data)
    }
  }
}
</script>

<style>
  .client-item {
    border-radius: 8px;
    margin-bottom: 20px;
    background-color: #FFF;
    padding: 20px;
    border: 1px solid rgba(0, 0, 0, 0.2);
    box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
  }

  .client-item a {
    display: flex;
    align-items: flex-start;
    text-decoration: none;
    color: #000;
  }

  .client-item h2 {
    font-size: 1.7rem;
  }
</style>