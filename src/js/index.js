const boardEl = document.querySelector('.game');
let cellsArr = Array.from(document.querySelectorAll('.cell'));

boardEl.addEventListener('click',  (e) => {
      if(!e.target.classList.contains('cell')){
        return;
      }
      let spanEl = e.target.querySelector('span');
      if(spanEl.classList.contains('bombed')){
        let spans = document.querySelectorAll('.bombed');
        spans.forEach((el) => {
          el.classList.remove('bombed');
          // el.closest('.cell').classList.add('open');
          el.closest('.cell').style.backgroundColor = 'red';
        });
        setTimeout(() => alert('You lost'), 500)
      }
    e.target.classList.add('open');
})

function shuffle(array) {
    let currentIndex = array.length;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
  }

let resultArr = shuffle(cellsArr);

const TABLE_LENGTH = 10;
for(let i = 0 ; i < TABLE_LENGTH; i++ ){
   let currNode = resultArr[i];
   currNode.querySelector('span').textContent = '💣';
   currNode.querySelector('span').classList.add('bombed');
}