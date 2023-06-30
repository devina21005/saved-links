const inputButtonEl = document.getElementById("input-btn");
const deleteButtonEl = document.getElementById("delete-btn");
const tabButtonEl = document.getElementById("tab-btn");
const inputEl = document.getElementById("input-el");
const inputLst = document.getElementById("input-lst");
const contextMenu = document.getElementById("context-menu");
const bodyEl = document.querySelector("body");
const deleteLeadEl = document.getElementById("delete-lead");
let leadsLst = '';
let ourLeads = [];


if (localStorage.getItem("ourList") === null) {
    localStorage.setItem("ourList", "");
} else if(localStorage.getItem("ourList") !== "") {
    ourLeads = JSON.parse(localStorage.getItem("ourList"));
    renderLeads();
}

inputButtonEl.addEventListener(
    "click", function() {
        inputToLocalStorage(inputEl.value);
        inputEl.value = '';
    }

)

bodyEl.addEventListener(
    "click", function(event) {
        if (event.target.offsetParent != contextMenu) {
            contextMenu.classList.remove("visible");
        }
    }
)

deleteButtonEl.addEventListener(
    "click", function() {
        if (confirm("Are you sure to delete all of your saved links?")) {
            localStorage.removeItem("ourList");
            inputLst.innerHTML = '';
            ourLeads = [];
        }
    }
)

tabButtonEl.addEventListener(
    "click", function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            inputToLocalStorage(tabs[0].url.replace("https://", ""));
        })
    }
)

function inputToLocalStorage(value) {
    if (value.startsWith("https://")) {
        value = value.replace("https://", "");
    }
    ourLeads.push(value);
    localStorage.setItem("ourList", JSON.stringify(ourLeads));
    renderLeads();
}
    

function renderLeads() {
    let myLeads = JSON.parse(localStorage.getItem("ourList"));
    let strList = '';
    for (let i = 0; i < myLeads.length; i++) {
        strList += `
            <li id="leads-${i}" class="leads">
                <a href="https://${myLeads[i]}" target="_blank">${myLeads[i]}</a>
            </li>`;
            
        // inputLst.innerHTML += `<li>${myLeads[i]}</li>`;

        // const liEl = document.createElement("li");
        // liEl.textContent = myLeads[i];
        // inputLst.append(liEl);
    }
    inputLst.innerHTML = strList; 
    deleteLead();
}

function deleteLead() {
    leadsLst = document.getElementsByClassName('leads');

    for (let i = 0; i < leadsLst.length; i++) {
        const id = `leads-${i}`;
        const leadsToBeDeleted = document.getElementById(id);
        leadsToBeDeleted.addEventListener("contextmenu", (event) => {
            event.preventDefault();
            console.log(leadsToBeDeleted);
            const { clientX: mouseX, clientY: mouseY } = event;
            
            contextMenu.style.top = `${mouseY}px`;
            contextMenu.style.left = `${mouseX}px`;
            
            contextMenu.classList.add("visible");
            deleteLeadEl.addEventListener("click", function() {
                console.log("berhasil")
                ourLeads.splice(i,1);
                localStorage.setItem("ourList", JSON.stringify(ourLeads));
                renderLeads();
                contextMenu.classList.remove("visible");
            }); 
        });
    }
}
