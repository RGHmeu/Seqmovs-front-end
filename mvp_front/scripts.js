/*
  --------------------------------------------------------------------------------------
  Função para estabelecer o token para a seção do usuário via requisição POST
  --------------------------------------------------------------------------------------
*/
criarToken()
geoloc()




/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/

const getList = async (todos) => {
  console.log("dentro do getList");
  console.log(todos);
  let url = 'http://127.0.0.1:5000/movimentos';
  fetch(url, {
    method: 'get',
  })
    .then((response) => response.json())
    .then((data) => {

      console.log("resposta getList");
      console.log(data.movimentos);
      console.log(data.movimentos[0]);
      var listaRecup = [];
      console.log(listaRecup);

      if (todos == "Todos") {
        data.movimentos.forEach(item => insertList(item.codigo, item.descr, item.foco, item.tipo))
        data.movimentos.forEach(item =>listaRecup.push(item.codigo))
      } 
      else if(todos !== "Todos") {
        for (let i = 0; i < data.movimentos.length; i++) {  
          if (data.movimentos[i].tipo === todos) {
            item = data.movimentos[i];
            insertList(item.codigo, item.descr, item.foco, item.tipo)
            listaRecup.push(item.codigo);
          }
        }
      }
      console.log(listaRecup);
      inserir(listaRecup);
    })
        .catch((error) => {
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/
var todos = "Todos";
console.log("antes do getList");
console.log(todos);
getList(todos);


/*
  --------------------------------------------------------------------------------------
  Função para colocar um item na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postItem = async (inputCodigo, inputDescr, inputFoco, inputTipo) => {
  const formData = new FormData();
  formData.append('codigo', inputCodigo);
  formData.append('descr', inputDescr);
  formData.append('foco', inputFoco);
  formData.append('tipo', inputTipo);

  let url = 'http://127.0.0.1:5000/movimento';
  fetch(url, {
    method: 'post',
    body: formData
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}


/*
  --------------------------------------------------------------------------------------
  Função para criar um botão close para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertButton = (parent) => {
  let span = document.createElement("span");
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  parent.appendChild(span);
}


/*
  --------------------------------------------------------------------------------------
  Função para remover um item da lista de acordo com o click no botão close
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
  let close = document.getElementsByClassName("close");
  // var table = document.getElementById('myTable');
  let i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const nomeItem = div.getElementsByTagName('td')[0].innerHTML
      if (confirm("Você tem certeza?")) {
        div.remove()
        deleteItem(nomeItem)
        alert("Removido!")
      }
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para deletar um item da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = (item) => {
  console.log(item)
  let url = 'http://127.0.0.1:5000/movimento?codigo=' + item;
  fetch(url, {
    method: 'delete'
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo item com nome, quantidade e valor 
  --------------------------------------------------------------------------------------
*/
const newItem = () => {
  let inputCodigo = document.getElementById("newCodigo").value;
  let inputDescr = document.getElementById("newDescr").value;
  let inputFoco = document.getElementById("newFoco").value;
  let inputTipo = document.getElementById("newTipo").value;

  if (inputCodigo === '') {
    alert("Escreva o código de um movimento!");

  } else {
    insertList(inputCodigo, inputDescr, inputFoco, inputTipo)
    postItem(inputCodigo, inputDescr, inputFoco, inputTipo)
    alert("Item adicionado!")
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/
const insertList = (codigo, descr, foco, tipo) => {
  var item = [codigo, descr, foco, tipo]
  var table = document.getElementById('myTable');
  var row = table.insertRow();

  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
  }
  insertButton(row.insertCell(-1))
  document.getElementById("newCodigo").value = "";
  document.getElementById("newDescr").value = "";
  document.getElementById("newFoco").value = "";
  document.getElementById("newTipo").value = "";

  removeElement()
}

/*
  --------------------------------------------------------------------------------------
  Função para filtrar a lista exibida na tabela
  --------------------------------------------------------------------------------------
*/

function filtrar() {
    var select = document.getElementById('tipo-selecionado');
    var option = select.options[select.selectedIndex];
    let linhas = document.getElementById('myTable').rows;
    for (i= linhas.length - 1; i> 0; i--){
      document.getElementById('myTable').deleteRow(i);
    }
  getList(option.text);
}

/*
  --------------------------------------------------------------------------------------
  Função para mostrar o video do movimento associado ao código
  --------------------------------------------------------------------------------------
*/
function mostrar() {
  let e = document.getElementById('mostravideo');
  let valor = e.value;
  let text = e.name;
  console.log(valor);
  lugar = document.getElementById('aqui');
  if (valor == "Agaxa001") {
    lugar.insertAdjacentHTML("afterend", 
    "<video src='img/Agaxa001.mkv' controls='controls' autoplay='autoplay' loop='loop' height='80'</video>");
  }
  if (valor == "Aquece001") {
      lugar.insertAdjacentHTML("afterend", 
      "<video src='img/Aquece001.mkv' controls='controls' autoplay='autoplay' loop='loop' height='80'</video>");
  }
} 


/*
  --------------------------------------------------------------------------------------
  Função para excluir os vídeos da coluna de movimentos recuperados da base
  --------------------------------------------------------------------------------------
*/

function removeNextNode(vid) {
  let el = document.getElementById("recuperados").nextElementSibling;
    while(el.nextElementSibling !== null) {
        el.nextElementSibling.remove();
    }

}

/*
  --------------------------------------------------------------------------------------
  Função para inserir na faixa à esquerda, os videos dos movimentos recuperados da base
  --------------------------------------------------------------------------------------
*/

function inserir(listaRecup) {
 
    var linha = document.getElementById('recuperados');
    console.log("antes do for");
    console.log(listaRecup.length);
  for (var i = 0; i < listaRecup.length; i++) {

      console.log("dentro do for");
      console.log(i);
      console.log(listaRecup[i]);
      if (listaRecup[i] === 'Agaxa001') {
          linha.insertAdjacentHTML('afterend',
'<button type="button" class="op" onclick="console.log(i)"> Escolher Agaxa001 </button>');
          linha.insertAdjacentHTML('afterend',
'<p><center><video class="quadros" src="img/Agaxa001.mkv" width="250" height="200" controls="controls" autoplay="autoplay" dragable="false" loop="loop" ondragstart="mostrar"></p>');
      }

      if (listaRecup[i] === 'Aquece001') {
          linha.insertAdjacentHTML('afterend',
'<button type="button" class="op" >Escolher Aquece001</button>');          
          linha.insertAdjacentHTML('afterend',
'<p><center><video class="quadros" src="img/Aquece001.mkv" width="250" height="200" controls="controls" autoplay="autoplay" dragable="false" loop="loop" ondragstart="mostrar"></p>');
      }

      if (listaRecup[i] === 'Cadeira001') {
        linha.insertAdjacentHTML('afterend',
'<button type="button" class="op">Escolher Cadeira001</button>');          
                linha.insertAdjacentHTML('afterend',
'<p><center><video class="quadros" src="img/Cadeira001.mkv" width="250" height="200" controls="controls" autoplay="autoplay" dragable="false" loop="loop" ondragstart="mostrar"></p>');
    }
    if (listaRecup[i] === 'Cadeira003') {
      linha.insertAdjacentHTML('afterend',
'<button type="button" class="op">Escolher Cadeira003</button>');          
              linha.insertAdjacentHTML('afterend',
'<p><center><video class="quadros" src="img/Cadeira003.mkv" width="250" height="200" controls="controls" autoplay="autoplay" dragable="false" loop="loop" ondragstart="mostrar"></p>');
  }

      if (listaRecup[i] === 'Desenv001') {
        linha.insertAdjacentHTML('afterend',
'<button type="button" class="op">Escolher Desenv001</button>');          
                linha.insertAdjacentHTML('afterend',
'<p><center><video class="quadros" src="img/Desenv001.mkv" width="250" height="200" controls="controls" autoplay="autoplay" dragable="false" loop="loop" ondragstart="mostrar"></p>');
    }

    if (listaRecup[i] === 'Tornoz005') {
      linha.insertAdjacentHTML('afterend',
'<button type="button" class="op">Escolher Tornoz005</button>');          
              linha.insertAdjacentHTML('afterend',
'<p><center><video class="quadros" src="img/Tornoz005.mkv" width="250" height="200" controls="controls" autoplay="autoplay" dragable="false" loop="loop" ondragstart="mostrar"></p>');
    }

  }
  console.log("depois do for");
  console.log(lista.length);

}

/*
  --------------------------------------------------------------------------------------
  Função para obter identificação para a seção do usuário 
  --------------------------------------------------------------------------------------
*/

function criarToken(){
        let tempo = new Date().getTime();
        console.log(tempo);
}

/*
  --------------------------------------------------------------------------------------
  Função para obter a geolocalização do usuário 
  --------------------------------------------------------------------------------------
*/

function geoloc(){
    if('geolocation' in navigator){
        navigator.geolocation.getCurrentPosition(function(position){
        console.log(position.coords.latitude);
        console.log(position.coords.longitude);        

        }, function(error){
               console.log(error)
})
    }else{
        alert('geolocalização: tem não');
    }
}
    