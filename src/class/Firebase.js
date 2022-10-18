
const { initializeApp } = require('firebase/app')
const { Auth, getAuth, signInWithEmailAndPassword } = require('firebase/auth')
const { doc,
  getDocs,
  Firestore,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  collection} = require('firebase/firestore')


// TODO: Replace the following with your app's Firebase project configuration
//TODO: Installer les packets webpack et webpack-cli (pas de co la)


class Firebase {
    constructor(){

      
      initializeApp({
        apiKey: "AIzaSyBZgx-VyV36fqlFbLRt48f67xiHJkRySQw",
        authDomain: "bot-dr-mundo.firebaseapp.com",
        projectId: "bot-dr-mundo",
        storageBucket: "bot-dr-mundo.appspot.com",
        messagingSenderId: "109146785947",
        appId: "1:109146785947:web:fe6f4a447f57b799669e3e",
        measurementId: "G-KYH1BMN1HQ"
      });

      this.auth = getAuth();
      this.db = getFirestore();
      this.addDocToPlayers(); 
      this.getPlayersData();

      
      
      
    }

    async getPlayersData() {
      

      const c = collection(this.db, 'players');
      const docs = await getDocs(c);
      docs.forEach((document) => {
          console.log(document.id, ' => ', document.data(), '\n');
      });
      
    }

    addDocToPlayers(){

      //TODO CA FONCTIONNE , VOIR COMMENT RE AFFICHER LES DONNES MTNNN !!!

      
      const document = doc(this.db, 'players/testdoc');
      let myplayer = {
        guildId: 'idTestFromCode',
        name: 'nameFromCode',

      };
      setDoc(document, myplayer, { merge: true })
          .then(() => {
              console.log("good")
          })
          .catch(() => {
            console.log("not good")
          });

     
    }

}

exports.Firebase = Firebase;