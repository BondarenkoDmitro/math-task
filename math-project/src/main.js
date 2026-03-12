import './style.css';
// 4 екрани
var page1 = document.getElementById('screen-welcome');
var page2 = document.getElementById('screen-size');
var page3 = document.getElementById('screen-elements');
var page4 = document.getElementById('screen-results');

// Поля вводу
var sizeAInput = document.getElementById('sizeA');
var sizeBInput = document.getElementById('sizeB');
var inputA     = document.getElementById('inputA');
var inputB     = document.getElementById('inputB');

// Підписи
var labelA = document.getElementById('labelA');
var labelB = document.getElementById('labelB');

// Помилки
var errSizeA = document.getElementById('errSizeA');
var errSizeB = document.getElementById('errSizeB');
var errA     = document.getElementById('errA');
var errB     = document.getElementById('errB');

// Блоки результатів
var resSets      = document.getElementById('resSets');
var resOperation = document.getElementById('resOperation');
var resRelation  = document.getElementById('resRelation');
var resMatrix    = document.getElementById('resMatrix');

// Зберігаємо розміри множин
var sizeA = 0;
var sizeB = 0;


// ============================================
// ФУНКЦІЯ: показати потрібний екран
// ============================================
function showScreen(page) {
    // Ховаємо всі
    page1.classList.remove('active');
    page2.classList.remove('active');
    page3.classList.remove('active');
    page4.classList.remove('active');

    // Показуємо потрібний
    page.classList.add('active');

    // Ховаємо всі помилки
    errSizeA.classList.remove('show');
    errSizeB.classList.remove('show');
    errA.classList.remove('show');
    errB.classList.remove('show');
}


// ============================================
// КНОПКА "Стартуємо!" → йдемо на крок 1
// ============================================
document.getElementById('btn-start').onclick = function () {
    showScreen(page2);
};


// ============================================
// КНОПКА "Далі" на кроці 1 → перевіряємо розмір
// ============================================
document.getElementById('btn-sizes-next').onclick = function () {
    var a = parseInt(sizeAInput.value);
    var b = parseInt(sizeBInput.value);
    var ok = true;

    // Перевірка A
    if (isNaN(a) || a < 1 || a > 20) {
        errSizeA.classList.add('show');
        ok = false;
    }

    // Перевірка B
    if (isNaN(b) || b < 1 || b > 20) {
        errSizeB.classList.add('show');
        ok = false;
    }

    if (!ok) return;

    // Запам'ятовуємо
    sizeA = a;
    sizeB = b;

    // Оновлюємо підписи
    labelA.textContent = 'Множина A (' + sizeA + ' елементів):';
    labelB.textContent = 'Множина B (' + sizeB + ' елементів):';

    // Чистимо поля
    inputA.value = '';
    inputB.value = '';

    showScreen(page3);
};


// ============================================
// КНОПКИ "Назад"
// ============================================
document.getElementById('btn-sizes-back').onclick = function () {
    showScreen(page1);
};

document.getElementById('btn-elements-back').onclick = function () {
    showScreen(page2);
};


// ============================================
// КНОПКА "Обчислити" → головна логіка
// ============================================
document.getElementById('btn-elements-next').onclick = function () {

    // Читаємо текст з полів
    var textA = inputA.value.trim();
    var textB = inputB.value.trim();

    // Розбиваємо рядок на масив чисел
    var A = textA.split(/\s+/).map(Number);
    var B = textB.split(/\s+/).map(Number);

    var ok = true;

    // Перевірка кількості
    if (textA === '' || A.length !== sizeA) {
        errA.textContent = 'Потрібно ' + sizeA + ' чисел';
        errA.classList.add('show');
        ok = false;
    }

    if (textB === '' || B.length !== sizeB) {
        errB.textContent = 'Потрібно ' + sizeB + ' чисел';
        errB.classList.add('show');
        ok = false;
    }

    if (!ok) return;

    // Сортуємо
    A.sort(function (x, y) { return x - y; });
    B.sort(function (x, y) { return x - y; });


    // ------------------------------------------
    // 1) РІЗНИЦЯ A \ B
    //    Беремо з A тільки ті, яких НЕМАЄ в B
    // ------------------------------------------
    var diff = [];

    for (var i = 0; i < A.length; i++) {
        var found = false;

        for (var j = 0; j < B.length; j++) {
            if (A[i] === B[j]) {
                found = true;
                break;
            }
        }

        if (!found) {
            diff.push(A[i]);
        }
    }


    // ------------------------------------------
    // 2) ВІДНОШЕННЯ ρ
    //    Пари (a, b) де сума a+b ділиться на 2
    // ------------------------------------------
    var pairs = [];

    for (var i = 0; i < A.length; i++) {
        for (var j = 0; j < B.length; j++) {
            if ((A[i] + B[j]) % 2 === 0) {
                pairs.push('(' + A[i] + ', ' + B[j] + ')');
            }
        }
    }


    // ------------------------------------------
    // 3) МАТРИЦЯ
    //    Рядки = A, Стовпці = B
    //    1 якщо (a+b) парне, 0 якщо ні
    // ------------------------------------------
    var table = '<table class="matrix-table">';

    // Шапка
    table += '<tr><th>A \\ B</th>';
    for (var j = 0; j < B.length; j++) {
        table += '<th>' + B[j] + '</th>';
    }
    table += '</tr>';

    // Рядки
    for (var i = 0; i < A.length; i++) {
        table += '<tr>';
        table += '<th>' + A[i] + '</th>';

        for (var j = 0; j < B.length; j++) {
            if ((A[i] + B[j]) % 2 === 0) {
                table += '<td class="one">1</td>';
            } else {
                table += '<td>0</td>';
            }
        }

        table += '</tr>';
    }

    table += '</table>';


    // ------------------------------------------
    // 4) ВИВОДИМО НА ЕКРАН
    // ------------------------------------------
    resSets.innerHTML = 'A = { ' + A.join(', ') + ' }<br>B = { ' + B.join(', ') + ' }';

    if (diff.length > 0) {
        resOperation.innerHTML = 'A \\ B = { ' + diff.join(', ') + ' }';
    } else {
        resOperation.innerHTML = 'A \\ B = ∅ (порожня множина)';
    }

    if (pairs.length > 0) {
        resRelation.innerHTML = 'ρ = { ' + pairs.join(', ') + ' }';
    } else {
        resRelation.innerHTML = 'ρ = ∅ (порожня множина)';
    }

    resMatrix.innerHTML = table;

    showScreen(page4);
};


// ============================================
// КНОПКА "Почати знову"
// ============================================
document.getElementById('btn-reset').onclick = function () {
    sizeAInput.value = '';
    sizeBInput.value = '';
    inputA.value = '';
    inputB.value = '';
    sizeA = 0;
    sizeB = 0;
    showScreen(page1);
};