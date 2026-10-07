function render(){

    const form=document.getElementById("examForm");

    form.innerHTML="";

    let idx=0;

    mergedQuestions.forEach(item=>{

        /* =========================================
           単独問題
        ========================================= */

        if(item.type==="single"){

            form.appendChild(
                createQuestion(item.data, idx)
            );

            idx++;

            return;
        }

        /* =========================================
           グループ問題
        ========================================= */

        const wrap=document.createElement("div");

        wrap.className="group-block";

        /* =========================================
           親問題（normal）
        ========================================= */

        if(item.data.parent){

            const p=document.createElement("div");

            p.className="group-parent";

            p.innerHTML=`
                <div class="group-parent-title">
                    【問題】
                </div>

                <div class="question-text">
                    ${renderQuestionText(
                        item.data.parent.question||""
                    )}
                </div>
            `;

            /* =========================================
               親問題画像表示
            ========================================= */

            if(item.data.parent.image){

                const fileName=String(
                    item.data.parent.image
                ).trim();

                if(fileName){

                    const img=document.createElement("img");

                    img.className="question-image";

                    img.src=`images/${fileName}`;

                    img.loading="lazy";

                    img.draggable=false;

                    img.alt="";

                    img.onerror=function(){

                        console.error(
                            "親問題画像読み込み失敗:",
                            img.src
                        );

                        this.style.display="none";
                    };

                    p.appendChild(img);
                }
            }

            wrap.appendChild(p);
        }

        /* =========================================
           子問題
        ========================================= */

        item.data.children.forEach(c=>{

            wrap.appendChild(
                createQuestion(c, idx)
            );

            idx++;
        });

        form.appendChild(wrap);
    });
}

function createQuestion(q,i){

    const d=document.createElement("div");

    d.className="question";

    const type=(q.type||"").trim().toLowerCase();

    /* =========================================
       タイトル
    ========================================= */

    const title=document.createElement("p");

    title.textContent=
        `問題${i+1}（${q["配点"]||0}点）`;

    d.appendChild(title);

    /* =========================================
       PG問題
    ========================================= */

    if(type==="pg"){

        const pre=document.createElement("pre");

        pre.className="code-block";

        pre.textContent=q.question||"";

        d.appendChild(pre);

        addQuestionImage(d,q);

        const ta=document.createElement("textarea");

        ta.name=`q${i}`;

        d.appendChild(ta);

        return d;
    }

    /* =========================================
       問題文
    ========================================= */

    const qText=document.createElement("div");

    qText.className="question-text";

    qText.innerHTML=
        renderQuestionText(q.question||"");

    d.appendChild(qText);

    /* =========================================
       画像表示
    ========================================= */

    addQuestionImage(d,q);

    /* =========================================
       normal
       → 問題文のみ
    ========================================= */

    if(
        type==="normal"
    ){

        return d;
    }

    /* =========================================
       選択問題
    ========================================= */

    if(type==="select"||type==="fill"){

        [
            q.choice1,
            q.choice2,
            q.choice3,
            q.choice4,
            q.choice5,
            q.choice6,
            q.choice7,
            q.choice8,
            q.choice9,
            q.choice10
        ]
        .filter(c=>c)
        .forEach(c=>{

            const label=document.createElement("label");

            const input=document.createElement("input");

            input.type="radio";

            input.name=`q${i}`;

            input.value=c;

            label.appendChild(input);

            label.appendChild(
                document.createTextNode(" "+c)
            );

            d.appendChild(label);
        });

    }else{

        /* =========================================
           記述問題
           text / 空欄 / その他
        ========================================= */

        const ta=document.createElement("textarea");

        ta.name=`q${i}`;

        d.appendChild(ta);
    }

    return d;
}

/* =========================================
   問題画像追加
========================================= */

function addQuestionImage(parent,q){

    if(!q.image) return;

    const fileName=String(q.image).trim();

    if(!fileName) return;

    const img=document.createElement("img");

    img.className="question-image";

    img.src=`images/${fileName}`;

    img.loading="lazy";

    img.draggable=false;

    img.alt="";

    img.onerror=function(){

        console.error(
            "画像読み込み失敗:",
            img.src
        );

        this.style.display="none";
    };

    parent.appendChild(img);
}

/* =========================================
   問題文レンダリング
========================================= */

function renderQuestionText(text){

    if(!text) return "";

    let s=String(text);

    s=esc(s);

    /* =========================================
       imgタグ復元
    ========================================= */

    s=s.replace(

        /&lt;img\s+src=["']([^"']+)["']\s*&gt;/gi,

        (m,src)=>{

            return `
                <img
                    class="question-image"
                    src="${src}"
                    loading="lazy"
                    draggable="false"
                    onerror="this.style.display='none'"
                >
            `;
        }
    );

    /* =========================================
       改行反映
    ========================================= */

    s=s.replace(/\n/g,"<br>");

    return s;
}