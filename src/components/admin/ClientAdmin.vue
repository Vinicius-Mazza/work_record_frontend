<template>
    <div class="client-admin">
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

            <!-- No images -->
            <!-- <b-form-group v-if="mode === 'save'"
                label="Imagem (URL):" label-for="client-imageUrl">
                <b-form-input id="client-imageUrl" type="text"
                    v-model="client.imageUrl" required
                    :readonly="mode === 'remove'"
                    placeholder="Informe a URL da Imagem..." />
            </b-form-group> -->
            <b-form-group v-if="mode === 'save'" 
                label="Categoria:" label-for="client-categoryId">
                <b-form-select id="client-categoryId"
                    :options="categories" v-model="client.categoryId" />
            </b-form-group>
            <!-- No Author -->
            <!-- <b-form-group v-if="mode === 'save'" 
                label="Autor:" label-for="client-userId">
                <b-form-select id="client-userId"
                    :options="users" v-model="client.userId" />
            </b-form-group> -->
            <b-form-group v-if="mode === 'save'"
                label="Observações" label-for="client-obs">
                <VueEditor v-model="client.obs"
                    placeholder="Observações sobre este paciente..." />
            </b-form-group>
            <b-button variant="primary" v-if="mode === 'save'"
                @click="save">Salvar</b-button>
            <b-button variant="danger" v-if="mode === 'remove'"
                @click="remove">Excluir</b-button>
            <b-button class="ml-2" @click="reset">Cancelar</b-button>
        </b-form>
        <hr>
        <b-table hover striped :items="clients" :fields="fields">
            <template slot="actions" slot-scope="data">
                <b-button variant="warning" @click="loadClient(data.item)" class="mr-2">
                    <i class="fa fa-pencil"></i>
                </b-button>
                <b-button variant="danger" @click="loadClient(data.item, 'remove')">
                    <i class="fa fa-trash"></i>
                </b-button>
            </template>
        </b-table>
        <b-pagination size="md" v-model="page" :total-rows="count" :per-page="limit" />
    </div>
</template>

<script>
import { VueEditor } from "vue2-editor"
import { baseApiUrl, showError } from '@/global'
import axios from 'axios'
// import moment from 'moment'

export default {
    name: 'ClientAdmin',
    components: { VueEditor },
    data: function() {
        return {
            mode: 'save',
            client: {},
            clients: [],
            categories: [],
            // users: [], // ATENTION !
            page: 1,
            limit: 0,
            count: 0,
            fields: [
                { key: 'pacientName', label: 'Nome', sortable: true },
                // { key: 'dentist', label: 'Dentista', sortable: true },
                { key: 'workType', label: 'Trabalho', sortable: true },
                { key: 'arrivalDate', label: 'Data chegada', sortable: true },
                { key: 'departureDate', label: 'Data de saida', sortable: true },
                { key: 'stage', label: 'Etapa', sortable: true },
                { key: 'stageStatus', label: 'Status', sortable: true },
                { key: 'actions', label: 'Ações' }
            ]
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
        // loadUsers() {
        //     const url = `${baseApiUrl}/users`
        //     axios.get(url).then(res => {
        //         this.users = res.data.map(user => {
        //             return { value: user.id, text: `${user.name} - ${user.email}` }
        //         })
        //     })
        // }
    },
    watch: {
        page() {
            this.loadClients()
        }
    },
    mounted() {
        // this.loadUsers()
        this.loadCategories()
        this.loadClients()
    }
}
</script>

<style>

</style>