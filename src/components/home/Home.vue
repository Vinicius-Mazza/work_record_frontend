<template>
  <div class="home">
    <div class="page-title">
      <h1><i class="fa fa-home"></i> Dashboard</h1>
      <h2>Menu</h2>
      <hr>
    </div>
    <div class="stats">
      <Stat title="Categorias" :value="stat.categories"
        icon="fa fa-folder" color="#d54d50" />
      <router-link to="/allClients">
        <Stat title="Clientes" :value="stat.clients"
          icon="fa fa-file" color="#3bc480" />
      </router-link>
      <!-- <Stat title="Usuários" :value="stat.users"
        icon="fa fa-user" color="#3282cd" /> -->
    </div>
  </div>
</template>

<script>
import Stat from './Stat'
import axios from 'axios'
import { baseApiUrl } from '@/global'

export default {
  name: 'Home',
  components: { Stat },
  data: function() {
    return {
      stat: {}
    }
  },
  methods: {
    getStats() {
      axios.get(`${baseApiUrl}/stats`).then(res => this.stat = res.data)
    }
  },
  mounted() {
    this.getStats()
  }
}
</script>

<style>
  .stats {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .stats a {
    flex: 1;
    display: flex;
    border-radius: 8px;
    text-decoration: none;
    color: #212529;
  }
  .stats a:hover {
    text-decoration: none;
    color: #212529;
  }
  .page-title h1 {
    margin: 0px;
  }

  .page-title h2 {
    color: #777;
    margin-top: 5px;
    font-size: 1.3rem;
  }
</style>