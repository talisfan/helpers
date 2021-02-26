// Função para dar uma "pausa/timer" na aplicação
module.exports = (milliseconds) =>{    
    let start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
      if ((new Date().getTime() - start) > milliseconds){
        break;
      }
    }
}