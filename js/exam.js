function startExam(){

    studentId=document
        .getElementById("studentId")
        .value
        .trim();

    studentName=document
        .getElementById("studentName")
        .value
        .trim();

    if(!studentId || !studentName){

        alert("入力してください");

        return;
    }

    startTime=now();

    document.getElementById(
        "startScreen"
    ).style.display="none";

    document.getElementById(
        "main"
    ).style.display="flex";

    document.getElementById(
        "userInfo"
    ).innerText=
        `学籍番号：${studentId} / 名前：${studentName}`;
}

function collectAnswers(){

    const data=[];

    let i=0;

    const f=document.getElementById("examForm");

    mergedQuestions.forEach(item=>{

        if(item.type==="single"){

            const type=
                (item.data.type||"")
                .toLowerCase();

            let v=
                (type==="normal")
                ? ""
                : (f[`q${i}`]?.value||"");

            v=`"${v.replace(/"/g,'""')}"`;

            data.push(
                `${i+1},'${item.data.id||""},${v}`
            );

            i++;

        }else{

            item.data.children.forEach(c=>{

                const type=
                    (c.type||"")
                    .toLowerCase();

                let v=
                    (type==="normal")
                    ? ""
                    : (f[`q${i}`]?.value||"");

                v=`"${v.replace(/"/g,'""')}"`;

                data.push(
                    `${i+1},'${c.id||""},${v}`
                );

                i++;
            });
        }
    });

    return data.join("\n");
}

function submitExam(forced, reason){

    if(examEnded) return;

    examEnded=true;

    clearInterval(timerInterval);

    const csv=
`提出タイプ
"${reason}"

studentId,studentName
"${studentId}","${studentName}"

問題番号,ID,解答
${collectAnswers()}
`;

    const bom=new Uint8Array([
        0xEF,
        0xBB,
        0xBF
    ]);

    const blob=new Blob(
        [bom,csv],
        {type:"text/csv"}
    );

    const a=document.createElement("a");

    a.href=URL.createObjectURL(blob);

    a.download=
        `${studentId}_${studentName}.csv`;

    a.click();

    document.getElementById(
        "main"
    ).style.display="none";

    document.getElementById(
        "endScreen"
    ).style.display="flex";

    document.getElementById(
        "endMessage"
    ).innerText=
        `提出種別：${reason}`;
}