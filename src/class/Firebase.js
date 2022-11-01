
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
      // this.initDocument('oneGuildId');
      //this.isExistPlayerDoc("testdoc");
      //TODO plus qu'a implementer tous ça ( et virer la fonction test )
      
      
    }

    async getPlayersList(guildId) {

      const document = await getDoc(collection(this.db, 'players/'+guildId));
			if (caches.exists()) return document.data().listPlayers;
      
    }

    async addPlayerToList(currentGuildId, playerName){
      await this.initDocument(currentGuildId);
      
      const document = doc(this.db, 'players/'+currentGuildId); //TODO remplacer ici par ('players/{{guildId}}') et bien sur mettre le guildId en nom de document sur la base
      const tempTab = [playerName]; 

      updateDoc(document, 'listPlayers', arrayUnion(...tempTab))
      .then(() => {
        console.log("player successfully added")
      })
      .catch(() => {
        console.log("error")
      });
     
    }

    async initDocument(currentGuildId){
      //console.log('Value of coll : ', await this.isExistPlayerDoc(currentGuildId))
      if(!await this.isExistPlayerDoc(currentGuildId)){
        const document = doc(this.db, 'players/'+currentGuildId);
        const object = {
          listPlayers : []
        }
        setDoc(document, object, { merge: true })
        .then(() => {
          console.log("initialisation Ok")
        })
        .catch(() => {
          console.log("initialisation failed")
        });
        return;
      }
      console.log("players list already exist")
      return;
      

      
    }

    async isExistPlayerDoc(guildId){

      const document = await getDoc(doc(this.db, 'players/'+guildId));
      console.log(document.data());

      if(typeof document.data() === 'undefined'){
        console.log("false")
        return false;
      }
      console.log("true")
      return true;

    }


}

exports.Firebase = Firebase;