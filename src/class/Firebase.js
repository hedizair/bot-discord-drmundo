
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
      this.isExistPlayerDoc();
      //this.addPlayerToList("kekGuildId","playerInfinite2"); 
      //this.getPlayerLists("myOtherGuildId");
      //this.initDocument("newColl");
      
    }

    async getPlayerLists(guildId) {
      
      const playersColl = collection(this.db, 'players');
      const playersDocs = await getDocs(playersColl);
      
      playersDocs.forEach((document) => {
          playerArray.push({"documentId":document.id, "data":document.data()});
      });
      console.log(playerArray);
      
    }

    async addPlayerToList(currentGuildId, playerName){

      const document = doc(this.db, 'players/testdoc'); //TODO remplacer ici par ('players/{{guildId}}') et bien sur mettre le guildId en nom de document sur la base
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
      //TODO Fonctionne, manque plus qu'a renommer certains truc (je crois ?)
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
    }

    async isExistPlayerDoc(guildId){
      const document = doc(this.db, 'players/fkljsdlfsdk'); 
      //TODO Voir comment vérifier si un document existe (par serveur) et vérifer à chaque fois que la commande se lance

      /*const tempTab = [playerName]; 

      updateDoc(document, 'listPlayers', arrayUnion(...tempTab))
      .then(() => {
        console.log("player successfully added")
      })
      .catch(() => {
        console.log("error")
      });*/
    }
}

exports.Firebase = Firebase;