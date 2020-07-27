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
    element = document.getElementById("list_pass");
    let new_id = list_of_pass.length;
    element.innerHTML = "<il id=\""+new_id+"\"></il></br>"+element.innerHTML;
    list_of_pass[new_id]="";
}
function generateClicked(){
    let id = list_of_pass.length-1;
    element = document.getElementById(id.toString());
    let password = "dasdas";
    /* GERAR ALEATORIAMENTE A SENHA PELOS PARAMETROS DO CONFIG */
    element.innerHTML = "<il id=\""+id+"\">"+password+"</il>";
    list_of_pass[id] = password;
    console.log(list_of_pass);
}
function deleteClicked(){
    if(document.getElementById("all_checkbox").checked){
        //clean all
        element = document.getElementById("list_pass")
        element.innerHTML = "<il id=\"0\"></il></br>"
        list_of_pass = [""]
        return;
    }
    let id = list_of_pass.length-1;
    element = document.getElementById(id.toString());
}
function downloadClicked(){
}
