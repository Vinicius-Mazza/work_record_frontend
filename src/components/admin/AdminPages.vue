<template>
    <div class="admin-pages">
        <PageTitle icon="fa fa-cogs" main="Administração do Sistema"
            sub="Cadastros & Cia" />
        <div class="admin-pages-tabs">
            <b-card no-body>
                <b-tabs card>
                    <!-- <b-tab title="Clientes" active>
                        <ClientAdmin />
                    </b-tab> -->
                    <b-tab title="Categorias">
                        <CategoryAdmin />
                    </b-tab>
                    <!-- <b-tab title="Usuários">
                        <UserAdmin />
                    </b-tab> -->
                </b-tabs>
            </b-card>
        </div>
    </div>
</template>

<script>
import PageTitle from '../template/PageTitle'
import CategoryAdmin from './CategoryAdmin'
// import ClientAdmin from './ClientAdmin'
// import UserAdmin from './UserAdmin'
export default {
    name: 'AdminPages',
    components: { PageTitle, CategoryAdmin }
}
</script>

<style>

</style>
