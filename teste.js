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
    let password = create_password();
    element.innerHTML = "<il id=\""+id+"\">"+password+"</il>";
    list_of_pass[id] = password;
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
  
    let password = ""

    return list_of_pass.length.toString();
}
