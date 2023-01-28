(function () {
  let caseArr = []; // создаем массив списка дел
  let listName = ''; // переменная для хранения ключа localStorage

  // создаем локальное хранилище списка дел
  function saveChangeCaseArr(keyName, arr) {
    localStorage.setItem(keyName, JSON.stringify(arr));
  }

  // создаем уникальный id
  function createId(arr) {
    let id;
    if (arr.length === 0) {
      id = 1;
    } else {
      id = arr.reduce((prev, cur) => (cur.id > prev.id ? cur : prev), { id: -1 }).id + 1;
    }
    return id;
  }
  // создаем и возвращаем заголовок приложения
  function createAppTitle(title = 'Заголовок списка дел') {
    let appTitle = document.createElement('h2'); // создаем элемент h2
    appTitle.innerHTML = title; // добавляем текст в созданный элемент
    return appTitle; // возвращием созданный элемент
  }

  // создаем и возвращаем форму для создания дела
  function createTodoItemForm() {
    let form = document.createElement('form'); // создаем элемент форма
    let input = document.createElement('input'); // создаем элемент инпут
    let buttonWrapper = document.createElement('div'); // создаем контейнер для кнопок
    let button = document.createElement('button'); // создаем кнопку

    form.classList.add('input-group', 'mb-3'); // добавляем класс для формы
    input.classList.add('form-control'); // добавляем для инпута класс
    input.placeholder = 'Введите название нового дела'; // заполняем плейсхолдер для инпута
    buttonWrapper.classList.add('input-group-append'); // добавляем класс для обертки кнопок
    button.classList.add('btn', 'btn-primary'); // добавляем класс для кнопки
    button.textContent = 'Добавить дело'; // добавляем текст в кнопку
    button.setAttribute('disabled', 'disabled');// добавляем кнопке атрибут disbled

    buttonWrapper.append(button); // в контейнер для кнопки добавляем кнопку
    form.append(input); // в форму добавляем инпут
    form.append(buttonWrapper); // добавлем в форму контейнер с кнопками

    return {
      form,
      input,
      button,
    }; // возвращаем созданные элементы для возможности взаимодействия с ними
  }

  // создаем и возвращаем список элементов
  function createTodoList() {
    let list = document.createElement('ul'); // создаем элемент пустой список дел
    list.classList.add('list-group'); // добавляем класс для списка
    return list; // возвращаем  созданный список
  }

  // создать дело
  function createTodoItem(objectCase) {
    let item = document.createElement('li'); // создаем элемент списка
    let buttonGroup = document.createElement('div'); // создаем контейнера для кнопок
    let doneButton = document.createElement('button'); // создаем кнопку "выполнено"
    let deleteButton = document.createElement('button'); // создаем кнопку "удалить"

    item.setAttribute('id', `${objectCase.id}`);// присваеваем id элементу списка
    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-item-center'); // добавляем классы для элемента списка дел
    item.textContent = objectCase.name; // добавлем текст для элемента списка дел

    buttonGroup.classList.add('btn-group', 'btn-group-sm'); // добавляем класс для обертки кнопок
    doneButton.classList.add('btn', 'btn-success'); // добавляем классы для кнопки выполнить
    doneButton.textContent = 'Готово'; // добавлем текст в кнопку выполнено
    deleteButton.classList.add('btn', 'btn-danger'); // добавляем классы для кнопки удалить дело
    deleteButton.textContent = 'Удалить'; // добавляем текст в кнопку удалить дело

    buttonGroup.append(doneButton); // добавляем в обертку для кнопок кнопку выполнено
    buttonGroup.append(deleteButton); // добавляем в обертку для кнопок кнопку удалить дело
    item.append(buttonGroup); // добавляем в элемент списка обертку для кнопок

    if (objectCase.done) item.classList.add('list-group-item-success');

    doneButton.addEventListener('click', () => {
      item.classList.toggle('list-group-item-success');
      const currentId = item.id;

      for (let caseArrItem of caseArr) {
        if (`${caseArrItem.id}` === currentId) {
          if (!caseArrItem.done) {
            caseArrItem.done = true;
            saveChangeCaseArr(listName, caseArr);
            break;
          } else {
            caseArrItem.done = false;
            saveChangeCaseArr(listName, caseArr);
            break;
          }
        }
      }
    });

    deleteButton.addEventListener('click', () => {
      if (confirm('Вы уверены?')) {
        const currentId = item.id;
        for (let i = 0; i < caseArr.length; i++) {
          if (`${caseArr[i].id}` === currentId) caseArr.splice(i, 1);
          saveChangeCaseArr(listName, caseArr);
        }
        item.remove();
      }
    });

    return {
      item,
      doneButton,
      deleteButton,
      objectCase,
    };
  }

  function createTodoApp(container, title = 'Список дел', keyName) {
    listName = keyName; // присваиваем значение для ключа localStorage
    let appContainer = document.getElementById(container); // получаем контейнер приложения

    let todoAppTitle = createAppTitle(title); // создаем заголовок
    let todoItemForm = createTodoItemForm(); // создаем форму
    let todoList = createTodoList(); // создаем список дел

    appContainer.append(todoAppTitle);
    appContainer.append(todoItemForm.form);
    appContainer.append(todoList);

    // достаем из localStorage сохраненные списки дел
    let localCaseArr = localStorage.getItem(keyName);
    if (localCaseArr !== null && localCaseArr !== '') caseArr = JSON.parse(localCaseArr);

    saveChangeCaseArr(listName, caseArr);

    for (const caseArrItem of caseArr) {
      let todoItem = createTodoItem(caseArrItem);
      todoList.append(todoItem.item);
    }

    // следим за состоянием todoItemForm.input если поле пустое кнопка не доступна
    todoItemForm.input.addEventListener('input', () => {
      if (!todoItemForm.input.value) {
        todoItemForm.button.setAttribute('disabled', 'disabled');
      } else {
        todoItemForm.button.removeAttribute('disabled');
      }
    });

    todoItemForm.form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!todoItemForm.input.value) {
        return;
      }

      let todoItem = createTodoItem({
        name: todoItemForm.input.value,
        id: createId(caseArr),
        done: false,
      });

      caseArr.push(todoItem.objectCase);
      saveChangeCaseArr(listName, caseArr);
      todoList.append(todoItem.item);
      todoItemForm.input.value = '';
    });
  }

  window.createTodoApp = createTodoApp;
}());
