// ==UserScript==
// @name         LightCounter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Плаваюча таблиця підрахунку годин
// @author       The Man of Greed (https://github.com/TheManofGreed), Michael Chabanov(https://github.com/m-chabanov)
// @match        https://off.energy.mk.ua/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mk.ua
// @grant        none
// @updateURL https://github.com/TheManofGreed/mk_lightcounter/raw/refs/heads/main/mk_LightCounter.user.js
// @downloadURL https://github.com/TheManofGreed/mk_lightcounter/raw/refs/heads/main/mk_LightCounter.user.js
// ==/UserScript==

(function() {
    'use strict';


    function waitForTable() {
        const table = document.querySelector(".tabSchedule");
        if (!table) {
            setTimeout(waitForTable, 500);
            return;
        }
        createFloatingTable(table);
    }

    function createFloatingTable(table) {
        const tbody = table.querySelector("tbody");

        const t = {
            1.1: { "item-enable": 0, "item-off": 0, "item-probably": 0 },
            1.2: { "item-enable": 0, "item-off": 0, "item-probably": 0 },
            2.1: { "item-enable": 0, "item-off": 0, "item-probably": 0 },
            2.2: { "item-enable": 0, "item-off": 0, "item-probably": 0 },
            3.1: { "item-enable": 0, "item-off": 0, "item-probably": 0 },
            3.2: { "item-enable": 0, "item-off": 0, "item-probably": 0 },
            4.1: { "item-enable": 0, "item-off": 0, "item-probably": 0 },
            4.2: { "item-enable": 0, "item-off": 0, "item-probably": 0 },
            5.1: { "item-enable": 0, "item-off": 0, "item-probably": 0 },
            5.2: { "item-enable": 0, "item-off": 0, "item-probably": 0 },
            6.1: { "item-enable": 0, "item-off": 0, "item-probably": 0 },
            6.2: { "item-enable": 0, "item-off": 0, "item-probably": 0 }
        };

        const rows = tbody.querySelectorAll(".tabSchedule-row");

        for (let row of rows) {
            for (let cell of row.children) {
                if (!Object.keys(t).includes(cell.outerText)) continue;
                const cls = cell.className.split(" ").find(c => c.includes("item-"));
                if (cls === "item-sure-off") {
                    t[cell.outerText]["item-off"] += 0.5;
                } else {
                    t[cell.outerText][cls] += 0.5;
                }
            }
        }


        const floatDiv = document.createElement("div");
        floatDiv.style.position = "fixed";
        floatDiv.style.top = "10px";
        floatDiv.style.right = "10px";
        floatDiv.style.backgroundColor = "white";
        floatDiv.style.border = "2px solid #333";
        floatDiv.style.padding = "10px";
        floatDiv.style.zIndex = 9999;
        floatDiv.style.maxHeight = "80vh";
        floatDiv.style.overflowY = "auto";
        floatDiv.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";
        floatDiv.style.fontFamily = "Arial, sans-serif";
        floatDiv.style.fontSize = "12px";


        const newTable = document.createElement("table");
        newTable.style.borderCollapse = "collapse";
        newTable.style.width = "100%";


        const header = document.createElement("tr");
        ["Черга","Є","Немає","Можливо"].forEach(text => {
            const th = document.createElement("th");
            th.innerText = text;
            th.style.border = "1px solid #000";
            th.style.padding = "4px";
            th.style.textAlign = "center";
            header.appendChild(th);
        });
        newTable.appendChild(header);


        for (let [key, val] of Object.entries(t)) {
            const tr = document.createElement("tr");
            [key, val["item-enable"], val["item-off"], val["item-probably"]].forEach((v, i) => {
                const td = document.createElement("td");
                td.innerText = v;
                td.style.border = "1px solid #000";
                td.style.padding = "4px";
                td.style.textAlign = "center";
                if (i===1) td.style.color = "green";
                if (i===2) td.style.color = "red";
                if (i===3) td.style.color = "orange";
                tr.appendChild(td);
            });
            newTable.appendChild(tr);
        }

        floatDiv.appendChild(newTable);
        document.body.appendChild(floatDiv);
    }

    waitForTable();
})();
