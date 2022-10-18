class Game {
    constructor(startTime,gameDuration,result,mode){
        this.startTime = startTime;
        this.gameDuration = gameDuration
        this.result = result;
        this.mode = mode;   
    }

    getResult(){
        if(this.result){
            return 'WIN'
        }
        return 'LOOSE';
    }

    getMode(){
        return this.mode;
    }

    getStartTime(){
        return this.startTime;
    }

    getGameDuration(){
        return ''+this.gameDuration;
    }

    setResult(r){
        this.result = r;
    }




}

exports.Game = Game;