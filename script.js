let keyboard = document.querySelector('.piano_keyboard');
let controls = document.querySelectorAll('.piano_control_option');
let pianoNotes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
let keyboardMap = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N'];
let playButton = document.querySelector('.piano_play_button');
let tempoSelect = document.querySelector('.piano_tempo');
let songSelect = document.querySelector('.piano_song_list');
let keys = [];

let happyBirthday = `G4,,G4,,A4,,G4,,C5,,B4,,,
                    G4,,G4,,A4,,G4,,D5,,C5,,,
                    G4,,G4,,G5,,E5,,C5,,B4,,A4,,,
                    F5,F5,E5,C5,,D5,,C5,,,`;

let jingleBells  = `B3,,B3,,B3,,,,B3,,B3,,B3,,,,
                    B3,,D4,,G3,,A3,,B3,,,,,,,,,,
                    C4,,C4,,C4,,,,C4,,C4,,B3,,B3,,,,
                    B3,,B3,,B3,,A3,,A3,,B3,,A3,,,,D4,,,,
                    B3,,B3,,B3,,,,B3,,B3,,B3,,,,
                    B3,,D4,,G3,,A3,,B3,,,,,,,,,,
                    C4,,C4,,C4,,,,C4,,C4,,B3,,B3,,,,
                    B3,,B3,,D4,,D4,,C4,,A3,,G3,,,,`;

let furElise = `E4,D#4,E4,D#4,E4,B3,,D4,C4,A3,,,,,
                C3,,E3,A3,B3,,,,
                 E3,G#3,B3,C4,,,,
                 E3,E4,D#4,E4,D#4,E4,B3,D4,C4,A3,,,,
                 C3,E3,A3,B3,,,,
                E3,C4,B3,A3`;

let playSong = (notesString, tempo, songInterval, enablePlayButton) => {
  let notes = notesString.split(',');
  let currNote = 0;
  let mousedown = new Event('mousedown');
  let mouseup = new Event('mouseup');
  let btn;
  let interval = setInterval(() => {
    if (currNote < notes.length) {
      if (btn) btn.dispatchEvent(mouseup);
      if (notes[currNote].trim() != '') {
  
        btn = document.querySelector(`[data-letter-notes="${notes[currNote].trim()}"]`);
        btn.dispatchEvent(mousedown);
      }

      currNote++;

    } else {
      btn.dispatchEvent(mouseup);
      clearInterval(interval);
      enablePlayButton();
    }
  }, songInterval / tempo);
}

playButton.addEventListener('mousedown', () => {

  let tempo = +tempoSelect.value;
  let song = +songSelect.value;
  playButton.disabled = true;
  let enablePlayButton = () =>{
    playButton.disabled = false;
  }
  switch(song){
    case 3 : playSong(furElise, tempo, 400, enablePlayButton); break;
    case 1 : playSong(jingleBells, tempo, 350, enablePlayButton); break;
    case 2 : playSong(happyBirthday, tempo, 500, enablePlayButton); break;
  
    default: break;
  }
})

let init = () => {
  for (let i = 1; i <= 5; ++i) {
    for (let j = 0; j < 7; ++j) {
      let key = createKey('white', pianoNotes[j], i);
      key.dataset.keyboard = keyboardMap[j + (i - 1) * 7];
      keyboard.appendChild(key);

      if (j != 2 && j != 6) {
        key = createKey('black', pianoNotes[j], i);
        key.dataset.keyboard = '⇧' + keyboardMap[j + (i - 1) * 7];

        let emptySpace = document.createElement('div');
        emptySpace.className = 'empty_space';
        emptySpace.appendChild(key);
        keyboard.appendChild(emptySpace);
      }
    }
  }
}

let createKey = (type, note, octave) => {
  let key = document.createElement('button');
  key.className = `piano_key piano_key--${type}`;
  key.dataset.letterNotes = type == 'white' ? note + octave : note + '#' + octave;
  key.dataset.letterNoteFileName = type == 'white' ? note + octave : note + 's' + octave;
  key.textContent = key.dataset.letterNotes;
  keys.push(key);

  key.addEventListener('mousedown', () => {
    playSound(key);
    key.classList.add('piano_key_playing');
  })

  key.addEventListener('mouseup', () => {
    key.classList.remove('piano_key_playing');
  })

  key.addEventListener('mouseleave', () => {
    key.classList.remove('piano_key_playing');
  })

  return key;
}

let pressKey = (MouseEvent, e) => {
  let lastLetter = e.code.substring(e.code.length - 1);
  console.log(e);
  console.log(lastLetter);
  let isShiftPressed = e.shiftKey;
  let selector;
  if (isShiftPressed) {
    selector = `[data-keyboard="⇧${lastLetter}"]`;
  } else {
    selector = `[data-keyboard="${lastLetter}"]`;
    console.log(selector);
  }

  let key = document.querySelector(selector);

  if (key != null) {
    let event = new Event(MouseEvent);
    key.dispatchEvent(event);
  }
  console.log(key);

}

document.addEventListener('keydown', async (e) => {
  if (e.repeat) return;
  pressKey('mousedown', e);
})


document.addEventListener('keyup', async (e) => {
  pressKey('mouseup', e);
})

let playSound = (key) => {
  let audio = document.createElement('audio');
  audio.src = 'sounds/' + key.dataset.letterNoteFileName + '.mp3';
  audio.play().then(() => {
    audio.remove();

  });
}

controls.forEach((input) => {
  input.addEventListener('input', () => {
    let value = input.value;
    console.log(value);
    keys.forEach((key) => {
      key.textContent = key.dataset[value];
    })
  })
})


init();