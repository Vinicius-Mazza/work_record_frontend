<template>
    <div class="page-title">
        <h1><i v-if="icon" :class="icon"></i> {{ main }}</h1>
        <h2>{{ sub }}</h2>
        <!-- Em Observação -->
        <!-- <div class="client-filter">
            <i class="fa fa-search fa-lg"></i>
            <input type="text" placeholder="Digite o nome do cliente..."
                class="filter-field">
        </div> -->
        <hr>
    </div>
</template>

<script>
export default {
    name: 'PageTitle',
    props: ['icon', 'main', 'sub'],
    data: function() {
        return {
            searchClients: ''
        }
    }
}
</script>

<style>
    .page-title h1 {
        margin: 0px;
    }

    .page-title h2 {
        color: #777;
        margin-top: 5px;
        font-size: 1.3rem;
    }
    /* .page-title .client-filter {
        display: flex;
        direction: rtl;
        align-items: center;

        margin: 20px;
        padding-bottom: 8px;
    }

    .page-title .client-filter i {
        color: #AAA;
        margin-right: 10px;
        
    }

    .page-title input {
        color: #000;
        font-size: 1.1rem;
        border: 0;
        outline: 0;
        width: 30%;
        background: transparent;
        border-bottom: 1px solid #AAA;
        display: block;
        direction: ltr;
    } */
</style>
