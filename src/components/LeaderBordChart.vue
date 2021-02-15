<template>
    <v-data-table
        :headers="headers"
        :items="champions"
        :items-per-page="20"
        no-data-text="No champions yet"
        />
</template>

<script>
export default {
    name: 'LeaderBoardChart',
    data: ()=>({
        headers:[
            {
                text:'Name',
                align:'',
                sortable: false,
                value:'username'
            },
            {
                text:'Elo',
                align:'',
                sortable: false,
                value:'elo'
            },
            {
                text:'Games solved',
                align:'',
                sortable: false,
                value:'resolvedGamesCount'
            },
        ],
        champions:[]
    }),
    mounted(){
        let self = this;

        self.fetchData();
    },
    methods:{
        fetchData(){
            let self = this;

            self.$store.dispatch('user/getLeaderboard').then(response=>{
                self.processData(response.data)
            })
        },
        processData(data){
            let self = this;

            data.forEach(element => {
                self.champions.push(element);
            });
        }
    }
}
</script>
<style scoped>

</style>