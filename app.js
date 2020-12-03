const fs = require('fs');


class UModExtractor{

    constructor(file){

        this.file = file;

        this.buffer = fs.readFileSync(file);
        this.logoLine = null;
        this.startIndex = 0;

        this.setupLines = [];

        this.files = [];
   
        this.createSetupLines();

        if(this.logoLine !== null){

            // + 2 for newline
            this.startIndex = this.buffer.indexOf(this.logoLine) + this.logoLine.length + 2; 

        }

        this.createSetup();

        this.createFiles();
        
    }

    createSetup(){

        

        //File=(Src=System\TIMMYVB.u,Size=1839442)
        const fileReg = /^file=\(src=(.+),size=(\d+)\)$/i;

        let result = 0;

        let s = 0;
        let offset = 0;

        for(let i = 0; i < this.setupLines.length; i++){

            s = this.setupLines[i];

            if(fileReg.test(s)){

                result = fileReg.exec(s);

                this.files.push(
                    {
                        "src": result[1],
                        "size": parseInt(result[2]),
                        "offset": offset
                    }
                );

                offset += parseInt(result[2])
            }
        }

       // console.log(this.files);
    }

    createSetupLines(){

        const data = [];

        const test = this.buffer.toString();

        const reg = /^(.+?)$/img;

        const lines = test.match(reg)
        //console.log(lines);

        const blockReg = /^\[(.+?)\]$/i;
        const keyValueReg = /(.+?)=.+?/i;

        //the second [setup] is the last block we need
        let currentSetupBlock = 0;

        let result = 0;

        for(let i = 0; ; i++){

            if(blockReg.test(lines[i])){

                if(currentSetupBlock >= 2){
                    break;
                }

                this.setupLines.push(lines[i]);

                result = blockReg.exec(lines[i]);

                if(result[1].toLowerCase() === 'setup'){
                    currentSetupBlock++;
                }

            }else if(keyValueReg.test(lines[i])){
                this.setupLines.push(lines[i]);

                result = keyValueReg.exec(lines[i]);

                if(result[1] === 'Logo'){
                    this.logoLine = lines[i];
                }
            }
        }
    }

    createFiles(){


        let f = 0;

        let currentData = 0;

        for(let i = 0; i < this.files.length; i++){

            f = this.files[i];

            currentData = this.buffer.slice(f.offset + this.startIndex, f.offset + f.size + this.startIndex);
            fs.writeFileSync(f.src, currentData);

        }
    }
}


const test = new UModExtractor('Butters Version 2.umod');