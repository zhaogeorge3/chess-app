<template>
    <button v-if="!gameMade" @click="newGame()">new 2 player game</button>
    <button v-if="!gameMade"><router-link :to="{ name: 'LocalGame' }">Local Game</router-link></button>
    <div v-if="gameMade">
        <button><a :href="player1Link">click here to play</a></button>
        <br>
        <div class="container">
            <input type="text" v-model="player2Link">
            <button type="button"
                v-clipboard:copy="player2Link"
                @click="onSucess()">Copy to clipboard and send to friend!</button>
        </div>
    </div>

</template>

<script lang="ts">
import { defineComponent } from 'vue';
import firebase from "firebase/app";
import 'firebase/auth';
import 'firebase/database';


export default defineComponent({


  name: 'NewGame',
  data: function () {
    return {
      firebaseConfig: {
        apiKey: "AIzaSyA20nb9TOGBG6oVXIlxQYxXfz1vV-GcWR4",
        authDomain: "chess-cb086.firebaseapp.com",
        projectId: "chess-cb086",
        storageBucket: "chess-cb086.appspot.com",
        messagingSenderId: "1084426781021",
        appId: "1:1084426781021:web:44b03423c77b5b9885a8b4",
        measurementId: "G-M1W5RX8G78"
      },
      player1Link: "",
      player2Link: "",
      gameMade: false,
    }
  },
  methods: {

    onSucess() {
    },
    generateToken(length: number = 7){
      return Math.random().toString(20).substr(2, length);
    },
    newGame() {
        firebase.initializeApp(this.firebaseConfig);
        this.player1Link = this.generateToken(7);
        this.player2Link = this.generateToken(7);
        const newGame = {
         p1_token: this.player1Link,
         p2_token: this.player2Link,
         white: this.player1Link,
         turn: "w"
        };
        const firebaseGame = firebase.database().ref("games").push();
        firebaseGame.set(newGame).then(() => {
            this.player1Link = "https://chess-cb086.web.app/game/"+this.player1Link;
            this.player2Link = "https://chess-cb086.web.app/game/"+this.player2Link;
            this.gameMade = true;
        
        }, (err) => { 
         throw err;
        });
   } 
  }
})
</script>

<style scoped>

</style>