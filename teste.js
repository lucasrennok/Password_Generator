
function printaPessoa(p){
  console.log(p.nome+" "+p.idade);  
};

let notas = [10,5,6,3,2,8];

let pessoa = {
    nome: 'lucas',
    idade: 20,
    familia: {
        tt: true
    },
    notas: [10,7]
};
console.log("data:",pessoa);
console.log(notas);

printaPessoa(pessoa);

console.log(2**4);
2**4>15? console.log("Sim"):console.log("Nao");
if(2**4>15){
    console.log("AAAAAAAAAAAA");
}

for(let i of notas){
    console.log(i);
}

for(let i in notas){
    console.log(notas[i]);
}