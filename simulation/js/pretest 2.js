imagepath = "images/";
function readTextFile1(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    };
    rawFile.send(null);
}
readTextFile1("lab-manual/pretest.json", function (text) {
    postdata1 = JSON.parse(text);
    loadquestions1();
    console.log("postdata1", postdata1);
});
function loadquestions1() {
    for (let i = 0; i < postdata1.length; i++) {
        var qdiv = document.createElement("div");
        qdiv.innerHTML = `<br><br>Question ${i + 1}: ${((postdata1[i].question != null) ? postdata1[i].question : '')}<br><img src="${imagepath}pr${postdata1[i].qid}.jpg" onerror="this.style.display='none'">
                <br>
                <div class="row">
                    <div class="col-md-12">
                        <div id=pr${postdata1[i].qid}a>
                            A <input type="radio" id="pra${postdata1[i].qid}" name="pr${postdata1[i].qid}" value="a">
                            <label >${((postdata1[i].option_a != null) ? postdata1[i].option_a : '')}</label>
                            <img id="primg${postdata1[i].qid}a" src="${imagepath}pr${postdata1[i].qid}a.jpg" onerror="hidediv1(${postdata1[i].qid}, 'a', ${i})">
                        </div>
                    </div>
                </div>

                <br>
                <div class="row">
                    <div class="col-md-12">
                        <div id=pr${postdata1[i].qid}b>
                            B <input type="radio" id="prb${postdata1[i].qid}" name="pr${postdata1[i].qid}" value="b">
                            <label >${((postdata1[i].option_b != null) ? postdata1[i].option_b : '')}</label>
                            <img id="primg${postdata1[i].qid}b" src="${imagepath}pr${postdata1[i].qid}b.jpg" onerror="hidediv1(${postdata1[i].qid}, 'b', ${i})">
                        </div>
                    </div>
                </div>

                <br>
                <div class="row">
                    <div class="col-md-12">
                        <div id=pr${postdata1[i].qid}c>
                            C <input type="radio" id="prc${postdata1[i].qid}" name="pr${postdata1[i].qid}" value="c">
                            <label >${((postdata1[i].option_c != null) ? postdata1[i].option_c : '')}</label>
                            <img id="primg${postdata1[i].qid}c" src="${imagepath}pr${postdata1[i].qid}c.jpg" onerror="hidediv1(${postdata1[i].qid}, 'c', ${i})">
                        </div>
                    </div>
                </div>

                <br>
                <div class="row">
                    <div class="col-md-12">
                        <div id=pr${postdata1[i].qid}d>
                            D <input type="radio" id="prd${postdata1[i].qid}" name="pr${postdata1[i].qid}" value="d">
                            <label>${((postdata1[i].option_d != null) ? postdata1[i].option_d : '')}</label>
                            <img id="primg${postdata1[i].qid}d" src="${imagepath}pr${postdata1[i].qid}d.jpg" onerror="hidediv1(${postdata1[i].qid}, 'd', ${i})">
                        </div>
                    </div>
                </div>

                <br> `;
        document.getElementById("qwt1").innerHTML = document.getElementById("qwt1").innerHTML + qdiv.innerHTML;
    }
    document.getElementById("qwt1").innerHTML = document.getElementById("qwt1").innerHTML + `<br><input type="button" id="submitans" style="background-color: #009beaff; color: #fff; border: 0px solid #009beaff" onclick="submitans1();" value="Submit"> `;
}
function hidediv1(id, option1, option1data) {
    document.getElementById(`primg${id}${option1}`).style.display = 'none';
    console.log(option1data);
    //console.log(option1);
    //console.log(postdata1[option1data].option_d);
    if (option1 == 'a' && postdata1[option1data].option_a === null) {
        document.getElementById(`pr${postdata1[option1data].qid}a`).style.display = 'none';
    }
    if (option1 == 'b' && postdata1[option1data].option_b === null) {
        document.getElementById(`pr${postdata1[option1data].qid}b`).style.display = 'none';
    }
    if (option1 == 'c' && postdata1[option1data].option_c === null) {
        document.getElementById(`pr${postdata1[option1data].qid}c`).style.display = 'none';
    }
    if (option1 == 'd' && postdata1[option1data].option_d === null) {
        document.getElementById(`pr${postdata1[option1data].qid}d`).style.display = 'none';
        console.log(postdata1[option1data].option_d);
    }
    // if(option1value == null)
    // {
    //     document.getElementById(`${id}${option1}`).style.display='none';
    // }
}
function submitans1() {
    option_selected = [];
    correctans = [];
    for (i = 0; i < postdata1.length; i++) {
        try {
            option_selected.push(document.querySelector(`input[name="pr${postdata1[i].qid}"]:checked`).value);
            if (option_selected[i] == postdata1[i].correct_option) {
                correctans.push("correct");
                document.getElementById(`pr${postdata1[i].qid}${option_selected[i]}`).style.color = "green";
            }
            else {
                correctans.push("incorrect");
                document.getElementById(`pr${postdata1[i].qid}${option_selected[i]}`).style.color = "red";
            }
        }
        catch (_a) {
            alert("Please select all option");
            return;
        }
    }
    console.log(option_selected);
    console.log(correctans);
}
//# sourceMappingURL=pretest 2.js.map