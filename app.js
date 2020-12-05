const fs = require('fs');
const UModExtractor = require('./api/umodextractor');



function displayStartUpMessages(){

    console.log(`[--------------------------------------------------------]`);

    console.log(`[--------------Unreal Tournament UMOD extractor----------]`);
    console.log(`[--------------------Version 1.0-------------------------]`);
    console.log(`[-----------------5th December 2020----------------------]`);
    console.log(`[---------------Created By Scott Adkin-------------------]`);
    console.log(`[----------------github.com/scottadkin-------------------]`);
    
    console.log(`[--------------------------------------------------------]`);

}





function run(){

    try{

        const args = process.argv;

        if(args.length >= 3){

            const filesToProcess = [];

            const commaReg = /,/i;

            let currentFile = '';

            for(let i = 2; i < args.length; i++){

                if(commaReg.test(args[i])){

                    currentFile += ` ${args[i]}`;
                    filesToProcess.push(currentFile);
                    currentFile = '';

                }else{
                    if(currentFile !== ''){
                        currentFile += ` ${args[i]}`;
                    }else{
                        currentFile = args[i];
                    }
                }

            }

            if(currentFile !== ''){
                filesToProcess.push(currentFile);
            }

            //remove commas from names
            for(let i = 0; i < filesToProcess.length; i++){

                filesToProcess[i] = filesToProcess[i].replace(',','').trim();
            }

            for(let i = 0; i < filesToProcess.length; i++){

                new UModExtractor(`${filesToProcess[i]}.umod`);
            }

        }else{
            throw new error('[ERROR]: No file was specified.');
        }

    }catch(err){
        console.log(err);
    }

}


displayStartUpMessages();
run();