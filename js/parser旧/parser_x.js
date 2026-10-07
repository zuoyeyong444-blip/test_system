function parseCSV(data){

    data=data
        .replace(/^\uFEFF/, '')
        .replace(/\r\n/g,'\n')
        .replace(/\r/g,'\n');

    let rows=[];
    let row=[];
    let cur="";
    let inQ=false;

    for(let i=0;i<data.length;i++){

        let c=data[i];

        if(c==='"'){

            if(inQ && data[i+1]==='"'){
                cur+='"';
                i++;
            }else{
                inQ=!inQ;
            }

        }else if((c===','||c==='\t') && !inQ){

            row.push(cur);
            cur="";

        }else if(c==='\n' && !inQ){

            row.push(cur);

            rows.push(row);

            row=[];

            cur="";

        }else{

            cur+=c;
        }
    }

    if(cur || row.length){

        row.push(cur);

        rows.push(row);
    }

    let headers=(rows[0]||[]).map(
        h=>h.trim()
    );

    return rows.slice(1)
        .filter(r=>
            r.some(v=>
                String(v||"").trim()!==""
            )
        )
        .map(r=>{

            let o={};

            headers.forEach((h,i)=>{
                o[h]=(r[i]||"").trim();
            });

            return o;
        });
}

function buildQuestionBlocks(list){

    const map=new Map();

    list.forEach((q,index)=>{

        const id=String(q.id||"").trim();

        if(!id) return;

        const root=rootId(id);

        const isChild=id.includes("-");

        if(!map.has(root)){

            map.set(root,{
                root,
                parent:null,
                children:[],
                originalIndex:index
            });
        }

        const group=map.get(root);

        if(isChild){

            group.children.push({
                ...q,
                _originalIndex:index
            });

        }else{

            group.parent={
                ...q,
                _originalIndex:index
            };

            group.originalIndex=index;
        }
    });

    const blocks=[];

    [...map.values()]
        .sort((a,b)=>
            a.originalIndex-b.originalIndex
        )
        .forEach(group=>{

            group.children.sort(
                (a,b)=>
                    a._originalIndex-b._originalIndex
            );

            if(group.parent && group.children.length){

                blocks.push({
                    type:"group",
                    data:{
                        parent:group.parent,
                        children:group.children
                    }
                });

                return;
            }

            if(group.parent){

                blocks.push({
                    type:"single",
                    data:group.parent
                });

                return;
            }

            group.children.forEach(child=>{

                blocks.push({
                    type:"single",
                    data:child
                });
            });
        });

    shuffle(blocks);

    return blocks;
}