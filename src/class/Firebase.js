
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

      
      
    }

    async getPlayersList(guildId) {

      if(!await this.isExistPlayerDoc(guildId)){
        console.log('Doc did not exist (class)')
        return false;
      }
      const document = await getDoc(doc(this.db, 'players/'+guildId));
			return document.data().listPlayers;
      
    }

    async addPlayerToList(guildId, playerName){
      await this.initDocument(guildId);

      const document = doc(this.db, 'players/'+guildId); //TODO remplacer ici par ('players/{{guildId}}') et bien sur mettre le guildId en nom de document sur la base
      const tempTab = [playerName]; 

      await updateDoc(document, 'listPlayers', arrayUnion(...tempTab))
      .then(() => {
        console.log("player successfully added (class)")
      })
      .catch(() => {
        console.log("error")
      });
     
    }

    async deletePlayerFromList(guildId, playerName){
      
      if(!await this.isExistPlayerDoc(guildId)){
        console.log('document did not exist (class)')
        return false;
      }

      if(!await this.isExistPlayer(guildId,playerName)){
        console.log('player did not exist (class)');
        return false;
      }

      const document = doc(this.db, 'players/'+guildId); 
      
      await updateDoc(document, 'listPlayers', arrayRemove(playerName))
        .then(() => {
          console.log("player successfully deleted (class)")
        })
        .catch(() => {
          console.log("error")
        });
				
      return true;

    }



    async initDocument(currentGuildId){
      
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

      if(typeof document.data() === 'undefined'){
        
        return false;
      }
      
      return true;

    }


    
    async isExistPlayer(guildId, playerName){
      const list = await this.getPlayersList(guildId);
      if(list.includes(playerName))
        return true;
      return false;
      
    }

    

}

exports.Firebase = Firebase;