let config = document.getElementById("config");
let more = document.getElementById("more");
let generate = document.getElementById("generate");
let delete_pass = document.getElementById("delete");
let download = document.getElementById("download");

config.addEventListener("click",configClicked);
more.addEventListener("click",moreClicked);
generate.addEventListener("click",generateClicked);
delete_pass.addEventListener("click",deleteClicked);
download.addEventListener("click",downloadClicked);

let list_of_pass = [""]

function configClicked(){
    let element = document.getElementById("config_menu");
    if(element.style.display=="none")
        element.style.display = "block";
    else
        element.style.display = "none";
}
function moreClicked(){
    let element = document.getElementById("list_pass");
    let new_id = list_of_pass.length;
    element.innerHTML = "<il id=\""+new_id+"\">Press Generate</il>"+element.innerHTML;
    list_of_pass[new_id]="";
}
function generateClicked(){
    let id = list_of_pass.length-1;
    let element = document.getElementById(id.toString());
    let password = "■";
    while(password=="■"){
        password = create_password();
        if(password==""){
            window.alert("Config is wrong.")
            return;
        }
    }
    element.innerHTML = "<il id=\""+id+"\">"+password+"</il>";
    list_of_pass[id] = password;
    console.log(list_of_pass);
}
function deleteClicked(){
    if(document.getElementById("all_checkbox").checked){
        //clean all
        let element = document.getElementById("list_pass");
        element.innerHTML = "<il id=\"0\">Press Generate</il>";
        list_of_pass = [""];
        return;
    }
    let id = list_of_pass.length-1;
    if(list_of_pass.length==1){
        let element = document.getElementById("list_pass");
        element.innerHTML = "<il id=\"0\">Press Generate</il>";
        list_of_pass = [""];
    }else{
        let element = document.getElementById(id.toString());
        element.innerHTML =  "";
        list_of_pass.pop();
    }
}
function downloadClicked(){
    console.log(list_of_pass);
}

function create_password(){
    let quant = parseInt(document.getElementById("quantity").value,10);
    let acceptable_inputs = "";
    let correctlow = false;
    let correctup = false;
    let correctn = false;
    let correctsym = false;
    let aux=0;
    const low = "abcdefghijklmnopqrstuvwxyz";
    const up = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const n = "0123456789";
    const sym = "\'\"!@#$%&*()_-=+\\|{}[]:;.,<>/?";
    if(document.getElementById("lowercase").checked){
        acceptable_inputs+=low;
        aux++;
    }
    if(document.getElementById("uppercase").checked){
        acceptable_inputs+=up;
        aux++;
    }
    if(document.getElementById("numbers").checked){
        acceptable_inputs+=n;
        aux++;
    }
    if(document.getElementById("symbols").checked){
        acceptable_inputs+=sym;
        aux++;
    }
    if(aux<=4 && quant<aux && document.getElementById("all_selected").checked){
        return ""
    }
    let password = "";
    for(let i=0; i<quant; i++){
        password+=acceptable_inputs.charAt(Math.floor(Math.random()*acceptable_inputs.length));
    }
    if(document.getElementById("all_selected").checked){
        if(document.getElementById("lowercase").checked){
            for(let j of low){
                for(let y of password){
                    if(j==y){
                        correctlow = true;
                        break;
                    }
                }
                if(correctlow==true)
                    break;
            }
        }else
            correctlow = true;
        if(document.getElementById("uppercase").checked){
            for(let j of up){
                for(let y of password){
                    if(j==y){
                        correctup = true;
                        break;
                    }
                }
                if(correctup==true)
                    break;
            }
        }else
            correctup = true;
        if(document.getElementById("numbers").checked){
            for(let j of n){
                for(let y of password){
                    if(j==y){
                        correctn = true;
                        break;
                    }
                }
                if(correctn==true)
                    break;
            }
        }else
            correctn = true;
        if(document.getElementById("symbols").checked){
            for(let j of sym){
                for(let y of password){
                    if(j==y){
                        correctsym = true;
                        break;
                    }
                }
                if(correctsym==true)
                    break;
            }
        }else
            correctsym = true;
    }else{
        correctlow = true;
        correctup = true;
        correctn = true;
        correctsym = true;
    }
    if(correctlow && correctn && correctup && correctsym){
        return password;
    }else{
        return "■";
    }
}
