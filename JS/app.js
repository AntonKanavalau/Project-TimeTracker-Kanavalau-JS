import {projectsStorage} from "./ProjectsData.js"; //хранилище проектов и их методы
import {changeProject} from "./changeProject.js"; //чекаем изменение на цвет и имя
import {projectModal, drawModal} from "./openModalWindow.js"; //открываем модальное окно
import {tracker} from "./timeTracker.js"; //немножко работы с трекером
import {openContextMenu, toggleMenuOff} from "./contextMenu.js"; //контекстное меню на очистку и удаление проекта
import {headerActiv} from "./headerButton.js"; //описание действий кнопки в header
import {TemporaryStorage} from "./TemporaryData.js"; //временное хранили активных проектов
import {checkReload} from "./reloadPage.js"; //действия на f5 и на закрытие страницы
import {drawDiagram} from "./drawDiagram.js"; //отрисовываем диаграмму

//очещаем временное хрнилище при первой загрузке
if (TemporaryStorage.tHash.length !== 0){
  TemporaryStorage.tHash = [];
  localStorage.setItem("Temporary", JSON.stringify(TemporaryStorage.tHash));
}

//create header element
const header = document.createElement('header');
header.className = 'header';
const headerContent = `
   <h3 id="headerProjectTitle"></h3>
    <p id="headerText">
      <span id="hours">00</span>:
      <span id="minutes">00</span>:
      <span id="seconds">00</span>
    </p>
    <button>
      <i id="headerBtn" class="material-icons" title="Start Tracker">play_arrow</i>
    </button>
    `;

header.insertAdjacentHTML('beforeend', headerContent);

//create main (body) element
const main = document.createElement('main');
drawMainElem(main);

document.body.append(header, main);
document.getElementById('headerBtn').addEventListener('click',headerActiv);

drawProjects();

function drawMainElem(main) {
  //Контейнер, где будет таймер с кругляшом и активные задачи
  const timerContainer = document.createElement('div');
  timerContainer.id = 'timerContainer';

  //блок кругляша с таймером
  const diagramBlock = document.createElement('div');
  diagramBlock.id = 'diagramBlock';

  //блок активных задач
  const taskBlock = document.createElement('div');
  taskBlock.id = 'taskBlock';
  taskBlock.addEventListener('click', tracker);
  timerContainer.append(diagramBlock, taskBlock);

  //Контейнер, где будут проекты
  const projectContainer = document.createElement('div');
  projectContainer.id = 'projectContainer';

  const container = document.createElement('div');
  container.className = 'projectContainer';

  projectContainer.append(container);

  //блок с названием и кнопкой добавления проектов
  const projectHeader = document.createElement('header');
  projectHeader.id = 'projectHeader';

  //назыание блока
  const projectHeaderTitle = document.createElement('h3');
  projectHeaderTitle.innerText = 'project dashboard';

  //кнопка для открытия модального окна
  const projectHeaderButton = document.createElement('button');
  projectHeaderButton.id = 'btn-createProject';
  projectHeaderButton.innerText = '+ create new project';
  projectHeaderButton.type = 'button';
  projectHeaderButton.addEventListener('click', function () {
    drawModal(projectModal);
  });

  projectHeader.append(projectHeaderTitle, projectHeaderButton);

  //блок с проектами
  const projectBlock = document.createElement('div');
  projectBlock.id = 'projectBlock';
  projectBlock.addEventListener('click', changeProject); //слушатель на изменение названия,цвета
  projectBlock.addEventListener('click', tracker); //слушатель на старт трекера
  projectBlock.addEventListener("contextmenu", openContextMenu, false); //слушатель при всплытии, контекстное меню
  container.append(projectHeader, projectBlock);

  main.append(timerContainer, projectContainer);
}

//отрисовываем проекты при загрузки страницы
function drawProjects() {
  let Hash = JSON.parse(localStorage.getItem("Projects"));

  for (let key in Hash) {
    document.getElementById('projectBlock').insertAdjacentHTML('beforeend', projectsStorage.draw(Hash[key].id));
  }
}

//ставим на паузу трекер и обновляем страницу по нажатию F5
document.addEventListener('keydown',  checkReload);

//добавляем канвас
const canvas = document.createElement('canvas');
canvas.id = 'myChart';
document.getElementById('diagramBlock').append(canvas);
drawDiagram();

