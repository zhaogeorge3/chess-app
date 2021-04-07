<template>
  <div v-if="!gameMade">
    <button class="bouncy buttonGame" @click="newGame()">Online 2 Player Game</button>
    <button class="bouncy buttonGame" style="animation-delay:0.07s"><router-link :to="{ name: 'LocalGame' }">Local Game</router-link></button>
  </div>
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
import { inject } from 'vue'

export default defineComponent({


  name: 'NewGame',

  data: function () {
    return {
        url: import.meta.env.VUE_APP_URL,
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
        toastTrigger: null as any
    }
  },

  created(){
    this.toastTrigger = inject('toast') as any;

    if(import.meta.env.MODE == "production"){
      this.url = "https://chess-cb086.web.app/"
    } else {
      this.url = "http://localhost:3000/"
    }
  },

methods: {

    onSucess() {
      this.toastTrigger.success('Successfully Copied To Clipboard!', {position: "top-right", duration: 737});
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
         turn: "not started"
        };
        const firebaseGame = firebase.database().ref("games").push();
        firebaseGame.set(newGame).then(() => {
            this.player1Link = this.url + "game/" + this.player1Link;
            this.player2Link = this.url + "game/" + this.player2Link;
            this.gameMade = true;
        
        }, (err) => { 
         throw err;
        });
   } 
  }
})
</script>

<style scoped>

.bouncy{
  animation:bouncy 3s infinite linear;
  position:relative;
}
@keyframes bouncy {
  0%{top:0em}
  40%{top:0em}
  43%{top:-0.9em}
  46%{top:0em}
  48%{top:-0.4em}
  50%{top:0em}
  100%{top:0em;}
}

a:link {
  color: #09d635;
  background-color: transparent;
  text-decoration: none;
}

a:visited {
  color: #09d635;
  background-color: transparent;
  text-decoration: none;
}

a:hover {
  color: #000000;
  background-color: transparent;
  text-decoration: none;
}

a:active {
  color: #09d635;
  background-color: transparent;
  text-decoration: none;
}

.buttonGame{
  display:inline-block;
  word-wrap: break-word;
  width: 15%;
  padding:0.35em 1.2em;
  border:0.1em solid rgba(122, 118, 118, 0.884);
  margin:0 0.3em 0.3em 0;
  border-radius:0.12em;
  box-sizing: border-box;
  text-decoration:none;
  font-family:'Roboto',sans-serif;
  font-weight:300;
  color:#09d635;
  text-align:center;
  transition: all 0.2s;
  background-color: rgba(122, 118, 118, 0.884);
}
.buttonGame:hover{
  color:#000000;
  background-color:#09d635;
}
@media all and (max-width:30em){
 .buttonGame{
  display:block;
  margin:0.4em auto;
}
}

</style>