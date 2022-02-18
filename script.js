const input = document.querySelectorAll('.no-spam input');
const submit = document.querySelector('form button');
const pages = document.querySelector('input:nth-child(3)');
const box = document.querySelector('.spammers');
const space = document.querySelector('.space');
let inputEdit;
let isEdit = false;

let spammer = {};

pages.addEventListener('input', checkP);

function checkBtns(){
    const buttons = document.querySelectorAll('.spammers button');
    buttons.forEach(el => {
        if (el.classList.contains('modify')){
            doEdit();
        } else if (el.classList.contains('cancel')){
            cancelEdit(el);
        }
    })
}

function checkP(){
    return pages.value = pages.value < 1 ? 1 : pages.value;
}

function loadHTML(){
    if(!window.localStorage.getItem('data')) return;
    const data = JSON.parse(window.localStorage.getItem('data'));
    spammer = data;
    Object.keys(spammer).map(key => add(spammer[key], key));
    doEdit();
    show();
    delObj();
}

window.addEventListener('load', loadHTML);

submit.addEventListener('click', check);

function checkBtn(){
    doneEdit()
    cancelEdit();
    doEdit();
    delObj();
    show();
}

function check(e){
    e.preventDefault();
    for (let i = 0; i < input.length; i++){
        if (input[i].value === ''){
            return;
        }
    }
    input[2].value = input[2].value < 0 ? 0 : input[2].value;
    const timestamp = Date.now();
    spammer[timestamp] = {
        title: input[0].value,
        author: input[1].value,
        pages: input[2].value,
    }
    add(spammer[timestamp], timestamp);
    saveObj();
    doEdit();
    reset();
    delObj();
    show();
}

function add(obj, key){
    if (!obj.title) return;
    const html = 
    `
    <div class="spammer-name">
        <h4>${obj.title}</h4>
    </div>
    <div class="address">
        <p>${obj.author}</p>
    </div>
    <div class="num">
        <p>${obj.pages}</p>
    </div>
    <button class="btns modify">✏️</button>
    <button class="btns remove">🚫</button>
    `
    const div = document.createElement('div');
    div.classList.add('spammer');
    div.setAttribute('data-key', key);
    div.innerHTML = html;
    box.insertBefore(div, space.nextElementSibling);
}

function reset(){
    for (let i = 0; i < input.length; i++){
        input[i].value = '';
    }
}

function delObj(){
    const del = document.querySelectorAll('.remove');
    const delAll = document.querySelector(('.remove-all button'));
    del.forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.parentNode.getAttribute('data-key');
            delete spammer[key];
            btn.parentNode.remove();
            show();
            saveObj();
        })
    })
    delAll.addEventListener('click', () => {
        const div = document.querySelectorAll('.spammers div');
        div.forEach(el => {
            if (el.classList.contains('spammer')){
                const key = el.getAttribute('data-key');
                delete spammer[key];
                el.remove();
            }
        })
        show();
        saveObj();
    })
}

function saveObj(){
    window.localStorage.setItem('data', JSON.stringify(spammer));
}

function show(){
    const placeholder = document.querySelector('.placeholder');
    if (space.nextElementSibling === null){
        placeholder.style.display = 'inline';
    } else {
        placeholder.style.display = 'none';
    }
    saveObj();
}

function doEdit(){
    const edit = document.querySelectorAll('.modify');
    edit.forEach(btn =>  {
        btn.addEventListener('click', () => {
            if (!isEdit){
                let input = btn.parentElement;
                let text = input.getAttribute('data-key');
                let data = spammer[text];
                input.innerHTML = 
                `
                <input type="text" name="titleE" placeholder="Title" class="mod namei edit">
                <input type="text" name="authorE" placeholder="Author" class="mod edit author">
                <input type="number" name="pagesE" placeholder="Pages" class="mod edit page">
                <button class="btns done">✔️</button>
                <button class="btns cancel">❌</button> 
                `
                inputEdit = document.querySelectorAll('.spammer input');
                inputEdit[0].value = data.title;
                inputEdit[1].value = data.author;
                inputEdit[2].value = data.pages;
                isEdit = true;
                checkBtn();
            } else {
                return;
            }
        })
    })
}

function cancelEdit(){
    const cancel = document.querySelectorAll('.cancel');
    cancel.forEach(z => {
        z.addEventListener('click', () => {
            let text = z.parentNode.getAttribute('data-key');
            const t = z.parentNode;
            text = spammer[text];
            const html = 
            `
            <div class="spammer-name">
                <h4>${text.title}</h4>
            </div>
            <div class="address">
                <p>${text.author}</p>
            </div>
            <div class="num">
                <p>${text.pages}</p>
            </div>
            <button class="btns modify">✏️</button>
            <button class="btns remove">🚫</button>
            `
            t.innerHTML = html;
            isEdit = false;
            checkBtn();
        })
    })
}

function doneEdit(){
    const done = document.querySelectorAll('.done');
    done.forEach(z => {
        z.addEventListener('click', () => {
            inputEdit[2].value = inputEdit[2].value < 1 ? 1 : inputEdit[2].value;
            let text = z.parentNode.getAttribute('data-key');
            const t = z.parentNode;
            spammer[text] = {
                title: inputEdit[0].value,
                author: inputEdit[1].value,
                pages: inputEdit[2].value
            }
            text = spammer[text];
            const html = 
            `
            <div class="spammer-name">
                <h4>${text.title}</h4>
            </div>
            <div class="address">
                <p>${text.author}</p>
            </div>
            <div class="num">
                <p>${text.pages}</p>
            </div>
            <button class="btns modify">✏️</button>
            <button class="btns remove">🚫</button>
            `
            t.innerHTML = html;
            isEdit = false;
            saveObj();
            checkBtn();
        })
    })
}