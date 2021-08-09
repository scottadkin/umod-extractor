const fs = require('fs');
const path = require('path');



class UModExtractor{

    constructor(file){

        console.log(`[Note]: Starting unpack of package ${file}.`);
        this.file = file;

        try{
            this.buffer = fs.readFileSync(this.file);
        }catch(err){
            console.log(`[ERROR]: Failed to open file ${file}: ${err.code}`);
            console.log(`[ERROR]: Files must be entered in with comma separated list without the file extension as follows: fileone, filetwo`);
            return;
        }
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

        try{

            for(let i = 0; i < this.files.length; i++){

                const f = this.files[i];

                // Convert src to format used by host system
                //const src = f.src.split(/[/\\]/).join(path.sep);
                const src = path.join(...f.src.split(/[/\\]/));
                const dir = path.dirname(src);

                fs.mkdirSync(dir, {recursive: true});
                const currentData = this.buffer.slice(f.offset + this.startIndex, f.offset + f.size + this.startIndex);
                console.log(`[Note]: Creating file ${src}`);
                fs.writeFileSync(src, currentData);

            }

            console.log(`[Pass]: Finished unpacking of ${this.file}.`);

        }catch(err){
            console.log(err);
        }
    }

}

module.exports = UModExtractor;