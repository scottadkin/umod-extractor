const fs = require('fs');


class UModExtractor{

    constructor(file){

        this.file = file;

        this.buffer = fs.readFileSync(file);
        this.setupLines = [];

        this.createSetup();

        console.log(this.setupLines);
        
    }

    createSetup(){

        this.createSetupLines();
    }

    createSetupLines(){

        const data = [];

        const test = this.buffer.toString();

        const reg = /^(.+?)$/img;

        const lines = test.match(reg)
        //console.log(lines);

        const blockReg = /^\[(.+?)\]$/i;
        const keyValueReg = /.+?=.+?/i;

        //the second [setup] is the last block we need
        let currentSetupBlock = 0;

        let result = 0;

        for(let i = 0; ; i++){

            if(blockReg.test(lines[i])){

                if(currentSetupBlock >= 2){
                    console.log(`Got all setup data we needed.`);
                    break;
                }

                this.setupLines.push(lines[i]);

                result = blockReg.exec(lines[i]);

                if(result[1].toLowerCase() === 'setup'){
                    currentSetupBlock++;
                }

            }else if(keyValueReg.test(lines[i])){
                this.setupLines.push(lines[i]);
            }
   
        }
    }
}


const test = new UModExtractor('Timmy Version 2.umod');