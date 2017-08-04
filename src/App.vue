<template>
       <v-app id="app"  standalone>
        <v-toolbar fixed >
            <v-toolbar-title class="blue--text">The Feeling 2</v-toolbar-title>
        </v-toolbar>
        <main>
            <v-container fluid>
               <router-view></router-view>
            </v-container>
        </main>
         <v-footer class="pa-5">
      <span class="blue--text">© {{ new Date().getFullYear() }} aofdev</span>
    </v-footer>
    </v-app>
</template>

<script>
export default {

}
</script>


