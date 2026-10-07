document.getElementById("fileInput")
.addEventListener("change",e=>{

    let f=e.target.files[0];

    if(!f) return;

    let r=new FileReader();

    r.onload=ev=>{

        const raw=parseCSV(
            ev.target.result
        );

        mergedQuestions=
            buildQuestionBlocks(raw);

        render();

        startTimer();
    };

    r.readAsText(f,"utf-8");
});

window.addEventListener(
    "beforeunload",
    e=>{

        if(!examEnded){

            e.preventDefault();

            e.returnValue='';
        }
    }
);