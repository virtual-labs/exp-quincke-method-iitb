imagepath = "images/";
function readTextFile(file, callback) {
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
readTextFile("lab-manual/posttest.json", function (text) {
    postdata = JSON.parse(text);
    loadquestions();
    console.log("postdata", postdata);
});
function loadquestions() {
    for (let i = 0; i < postdata.length; i++) {
        var qdiv = document.createElement("div");
        qdiv.innerHTML = `<br><br>Question ${i + 1}: ${((postdata[i].question != null) ? postdata[i].question : '')}<br><img src="${imagepath}po${postdata[i].qid}.jpg" onerror="this.style.display='none'">
                <br>
                <div class="row">
                    <div class="col-md-12">
                        <div id=${postdata[i].qid}a>
                            A <input type="radio" id="a${postdata[i].qid}" name="${postdata[i].qid}" value="a">
                            <label >${((postdata[i].option_a != null) ? postdata[i].option_a : '')}</label>
                            <img id="img${postdata[i].qid}a" src="${imagepath}po${postdata[i].qid}a.jpg" onerror="hidediv(${postdata[i].qid}, 'a', ${i})">
                        </div>
                    </div>
                </div>

                <br>
                <div class="row">
                    <div class="col-md-12">
                        <div id=${postdata[i].qid}b>
                            B <input type="radio" id="b${postdata[i].qid}" name="${postdata[i].qid}" value="b">
                            <label >${((postdata[i].option_b != null) ? postdata[i].option_b : '')}</label>
                            <img id="img${postdata[i].qid}b" src="${imagepath}po${postdata[i].qid}b.jpg" onerror="hidediv(${postdata[i].qid}, 'b', ${i})">
                        </div>
                    </div>
                </div>

                <br>
                <div class="row">
                    <div class="col-md-12">
                        <div id=${postdata[i].qid}c>
                            C <input type="radio" id="c${postdata[i].qid}" name="${postdata[i].qid}" value="c">
                            <label >${((postdata[i].option_c != null) ? postdata[i].option_c : '')}</label>
                            <img id="img${postdata[i].qid}c" src="${imagepath}po${postdata[i].qid}c.jpg" onerror="hidediv(${postdata[i].qid}, 'c', ${i})">
                        </div>
                    </div>
                </div>

                <br>
                <div class="row">
                    <div class="col-md-12">
                        <div id=${postdata[i].qid}d>
                            D <input type="radio" id="d${postdata[i].qid}" name="${postdata[i].qid}" value="d">
                            <label>${((postdata[i].option_d != null) ? postdata[i].option_d : '')}</label>
                            <img id="img${postdata[i].qid}d" src="${imagepath}po${postdata[i].qid}d.jpg" onerror="hidediv(${postdata[i].qid}, 'd', ${i})">
                        </div>
                    </div>
                </div>

                <br> `;
        document.getElementById("qwt").innerHTML = document.getElementById("qwt").innerHTML + qdiv.innerHTML;
    }
    document.getElementById("qwt").innerHTML = document.getElementById("qwt").innerHTML + `<br><input type="button" id="submitans" style="background-color: #009beaff; color: #fff; border: 0px solid #009beaff" onclick="submitans();" value="Submit"> `;
}
function hidediv(id, option1, option1data) {
    document.getElementById(`img${id}${option1}`).style.display = 'none';
    console.log(option1data);
    //console.log(option1);
    //console.log(postdata[option1data].option_d);
    if (option1 == 'a' && postdata[option1data].option_a === null) {
        document.getElementById(`${postdata[option1data].qid}a`).style.display = 'none';
    }
    if (option1 == 'b' && postdata[option1data].option_b === null) {
        document.getElementById(`${postdata[option1data].qid}b`).style.display = 'none';
    }
    if (option1 == 'c' && postdata[option1data].option_c === null) {
        document.getElementById(`${postdata[option1data].qid}c`).style.display = 'none';
    }
    if (option1 == 'd' && postdata[option1data].option_d === null) {
        document.getElementById(`${postdata[option1data].qid}d`).style.display = 'none';
        console.log(postdata[option1data].option_d);
    }
    // if(option1value == null)
    // {
    //     document.getElementById(`${id}${option1}`).style.display='none';
    // }
}
function submitans() {
    option_selected = [];
    correctans = [];
    for (i = 0; i < postdata.length; i++) {
        try {
            option_selected.push(document.querySelector(`input[name="${postdata[i].qid}"]:checked`).value);
            if (option_selected[i] == postdata[i].correct_option) {
                correctans.push("correct");
                document.getElementById(`${postdata[i].qid}${option_selected[i]}`).style.color = "green";
            }
            else {
                correctans.push("incorrect");
                document.getElementById(`${postdata[i].qid}${option_selected[i]}`).style.color = "red";
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
//# sourceMappingURL=posttest 2.js.map