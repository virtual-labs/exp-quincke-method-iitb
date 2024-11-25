let img_slider;
let img_led;
let assembly_image;
var led_color;
let power = false;
let current_ele;
let l_ele;
let x_ele;
let msr_show;
let vsr_show;
let n_rings;
let ib_dsp;
let ic_dsp;
let vbe_dsp;
let vce_dsp;
let extra_vce_dsp;
let extra_ib_dsp;
let record_btn;
let all_canvas = `
<canvas style="position: absolute; left: 0; top: 0;"  width="500" height="500" id="mycanvas1">

</canvas>

<canvas style="position: absolute; left:3.5vw; top: 2.7vw;" width="500" height="500" id="mycanvas2">

</canvas>

<canvas style="position: absolute; left: 0;" width="500" height="500" id="mycanvas3">

</canvas>
`;
let readings = `
    <div id='act2-readings'>

		<div style='display: flex; flex-direction: row; justify-content: space-between;'>

			<div>
				<p style='margin: 0;'>Current (Amp)</p>
				<input  style='height: 3vw; font-size: 1.5vw;' id='i-dsp' class='form-control' disabled value='00' />
			</div>


			<div>
				<p style='margin: 0;'>Magnetic Field (gauss)</p>
				<input style='height: 3vw; font-size: 1.5vw;' id='b-dsp' class='form-control' disabled value='00' />
			</div>
		
		</div>

		<div style='display: flex; flex-direction: row; justify-content: space-between;'>

			<div style='width: 50%;'>
				<button onclick='increase_current()' class='btn btn-primary' style='width: 90%; margin: 5%; font-size: 1vw;'>Increase Current</button>
			</div>


			<div style='width: 50%;'>
				<button onclick='decrease_current()' class='btn btn-primary' style='width: 90%; margin: 5%; font-size: 1vw;'>Decrease Current</button>
			</div>
	
		</div>

		<div style='display: flex; flex-direction: row; justify-content: space-between;'>

			<div>
				<p style='margin: 0;'>Main Scale (cm)</p>
				<input  style='height: 3vw; font-size: 1.5vw;' id='msr-inp' class='form-control' disabled value='00' />
			</div>


			<div>
				<p style='margin: 0;'>Vernier Scale (cm)</p>
				<input style='height: 3vw; font-size: 1.5vw;' id='vsr-inp' class='form-control' disabled value='00' />
			</div>
		
		</div>
		
		<div><button onclick='record_observation()' class='btn btn-success' disabled style='width: 100%; margin: 2px; font-size: 1vw;' id='rbtn'  >Add Reading</button></div>
		<div><button onclick='' class='btn btn-danger' style='width: 100%; margin: 2px; font-size: 1vw;' disabled id='dbtn' >Delete Reading</button></div>

    </div>
`;
let all_btns = `
<div style='position: absolute; z-index: 5; width: 20vw; height: 20vw;'>
    <button id='a2-btn-up' style='transform: rotate(90deg);'><i class="bi bi-skip-backward"></i></button>
    <button id='a2-btn-fine-up' style='transform: rotate(90deg);' ><i class="bi bi-skip-start"></i></button>
    <button id='a2-btn-down'  style='transform: rotate(270deg);' ><i class="bi bi-skip-backward"></i></button> 
    <button id='a2-btn-fine-down' style='transform: rotate(270deg);'  ><i class="bi bi-skip-start"></i></button>
    
</div>
`;
let scene1;
let my_canvas1;
let my_canvas2;
let my_canvas3;
let my_context1;
let my_context2;
let my_context3;
function activity3() {
    pp.clearleftpannel();
    pp.clearrightpannel();
    pp.addoffcanvas(3);
    add_offcanvas_table(pp);
    obs_table = [];
    output_observation_table = [];
    pp.showtitle(`<p id="exp-title" style='width: 25vw;'>Note Readings in table</span><p>`, 3);
    pp.showdescription(`<div style="background-color: #f4ccccff; border-radius: 10px; border: black; padding: 5%; font-weight: 500; font-size: calc(0.5vw + 12px);">
    <p>Use the arrow shown on the simulator to zoom in, zoom out, left and right</p>
    <p>Use double arrow to do fine adjustments</p>
    <p>To take reading a certain point click "add readings" button to add directly to the table</p>
	<p>After adding a new obervation row, hide the pannel change the current and take new reading add it again.<p>
     </div>`, 3);
    pp.showtitle(`Observation Table`, 4);
    var bsOffcanvas = new bootstrap.Offcanvas(document.getElementById('offcanvasRight3'));
    bsOffcanvas.show();
    // pp.addtoleftpannel(color_dd);
    pp.addtoleftpannel(all_btns);
    pp.addtoleftpannel(readings);
    pp.addtoleftpannel(all_canvas);
    msr_show = document.getElementById('msr-inp');
    msr_show.value = '00';
    vsr_show = document.getElementById('vsr-inp');
    vsr_show.value = '00';
    my_canvas1 = document.getElementById('mycanvas1');
    my_canvas2 = document.getElementById('mycanvas2');
    my_canvas3 = document.getElementById('mycanvas3');
    my_context1 = my_canvas1.getContext('2d');
    my_context2 = my_canvas2.getContext('2d');
    my_context3 = my_canvas3.getContext('2d');
    scene1 = new Scene_Canvas(my_canvas1);
    scene1.addcanvas(my_canvas2);
    scene1.addcanvas(my_canvas3);
    // let left_panel_text = `
    //      <div id='act3-left-content' style="position: absolute; font-size: 1.6vw;">
    // 	 	<h3 style='text-align: center;' id='act1-sim-heading' ></h3>
    // 	 	<div>
    // 			<input type='button' value='Start' id='power-dsp' onclick='power_button();' class='btn btn-danger' style='width: 30%;' />
    // 		</div>
    // 		<div style='width: 80vw; display: flex; flex-direction: row; justify-content: space-evenly;'>
    // 			<div>
    // 				<input type='text' id='microa-dsp' class='btn btn-dark' />
    // 				<label style='text-align: center;'> I<sub>B</sub> (&mu;A)</label>
    // 			</div>
    // 			<div>
    // 				<input type='text' id='millia-dsp' class='btn btn-dark' />
    // 				<label style='text-align: center;'> I<sub>C</sub> (mA)</label>
    // 			</div>
    // 		</div>
    // 		<div style='width: 80vw; display: flex; flex-direction: row; justify-content: space-evenly;'>
    // 			<div>
    // 				<input type='text' id='vbe-dsp' class='btn btn-dark' />
    // 				<label style='text-align: center;'>V<sub>BE</sub></label>
    // 			</div>
    // 			<div>
    // 				<input type='text' id='vce-dsp' class='btn btn-dark' />
    // 				<label style='text-align: center;'>v<sub>CE</sub></label>
    // 			</div>
    // 		</div>
    // 		<div id='inp-control' style='display: none;' >
    // 			<p>Set the V<sub>CE</sub> value and vary the V<sub>BE</sub> keeping V<sub>CE</sub> constant and record observation </p>
    // 			V<sub>CE</sub> = <input type='text' id='extra-vce' class='form-control' style='display: inline-block; width: 120px;' disabled />
    // 			<button class='btn btn-dark' id='fbtn1' style='display: inline-block; width: 50px;' onclick='inp_ch_vce_inc();' >+</button>
    // 			<button class='btn btn-dark' id='fbtn2' style='display: inline-block; width: 50px;' onclick='inp_ch_vce_dec();' >-</button>
    // 			<button class='btn btn-success' id='qa-we' style='display: inline-block; width: 150px;' onclick='set_first_constant();' >Set V<sub>CE</sub></button> 
    // 			<br><br>
    // 			<button class='btn btn-dark' id='f-plus' style='display: inline-block; width: 140px;' onclick='inp_ch_vbe_inc();' >Increase V<sub>BE</sub></button>
    // 			<button class='btn btn-dark' id='f-minus' style='display: inline-block; width: 140px;'  onclick='inp_ch_vbe_dec();' >Decrease V<sub>BE</sub></button>
    // 		</div>
    // 		<div id='out-control' style='display: none;' >
    // 			<p>Set the I<sub>B</sub> value and vary the V<sub>CE</sub> keeping I<sub>B</sub> constant and record observation </p>
    // 			I<sub>B</sub> = <input type='text' id='extra-ib' class='form-control' style='display: inline-block; width: 140px;' disabled />
    // 			<button class='btn btn-dark' id='sbtn1' style='display: inline-block; width: 50px;' onclick='out_ch_ib_inc()' >+</button>
    // 			<button class='btn btn-dark' id='sbtn2' style='display: inline-block; width: 50px;' onclick='out_ch_ib_dec()' >-</button>
    // 			<button class='btn btn-success' id='qa-wa' style='display: inline-block; width: 150px;' onclick='set_second_constant();' >Set I<sub>B</sub></button> 
    // 			<br><br>
    // 			<button class='btn btn-dark' id='s-plus'  style='display: inline-block; width: 140px;' onclick='out_ch_vce_inc()' >Increase V<sub>CE</sub></button>
    // 			<button class='btn btn-dark' id='s-minus' style='display: inline-block; width: 140px;' onclick='out_ch_vce_dec()' >Decrease V<sub>CE</sub></button>
    // 		</div>
    // 		<div style='text-align: center;' >
    // 			<button class='btn btn-secondary' id='record-btn' disabled onclick='record_observation();' >Record Observation</button> 
    // 		</div>
    //      </div>
    //  `;
    //pp.addtoleftpannel(left_panel_text);
    //define the canvas
    //pp.addcanvas('mycanvas');
    // pp.addtorightpannel(question_div_box, 3);
    // pp.showscore(0, 3);
    // canvas = pp.canvas;
    // context = canvas.getContext('2d');
    // add rect and scene
    // canvas.style.cursor = 'crosshair';
    // rect = canvas.getBoundingClientRect();
    // add canvas sizing
    window.onload = a2_windowresize;
    window.onresize = a2_windowresize;
    //load_colors();
    setTimeout(draw_all_canvas, 500);
    //setTimeout(() => {MathJax.typeset();}, 200);
    //window.addEventListener('click', (event) => a3_mouseclick(event));
    a2_windowresize();
    record_btn = document.getElementById('rbtn');
}
function a3_mouseclick(e) {
    let x = Math.round((e.clientX - rect.x) / lscale);
    let y = Math.round((canvas.height - (e.clientY - rect.y)) / lscale);
    console.log(x, y);
}
function a2_windowresize() {
    //canvas size
    a2_canvas_size();
    //canvas mapping
    a2_canvas_mapping();
    //draw scene
    scene1.draw();
    console.log('done');
    // setTimeout(draw_img1_delay, 500);
    // setTimeout(draw_img2_delay, 500);
}
function a2_canvas_size() {
    my_canvas3.width = window.innerWidth * 0.91;
    my_canvas3.height = ((my_canvas3.width * 1080.0) / 1920) * 0.85;
    lscale = my_canvas3.width / 1920.0;
    document.getElementById('leftpannel').style.height =
        my_canvas3.height + 5 + 'px';
    document.getElementById('leftpannel').style.margin = '0';
    my_canvas2.width = window.innerWidth * 0.375;
    my_canvas2.height = window.innerWidth * 0.375;
    console.log(my_canvas2.width, my_canvas2.height);
    my_canvas2.style.borderRadius = '50%';
    my_canvas1.width = window.innerWidth * 0.91;
    my_canvas1.height = ((my_canvas1.width * 1080.0) / 1920) * 0.85;
}
function a2_canvas_mapping() {
    my_context1.translate(0, my_canvas1.height);
    my_context1.scale(1, -1);
    my_context2.translate(0, my_canvas2.height);
    my_context2.scale(1, -1);
    my_context3.translate(0, my_canvas3.height);
    my_context3.scale(1, -1);
}
function add_offcanvas_table(x) {
    x.addoffcanvas(4);
    let bsOffcanvas4 = document.getElementById('offcanvasRight4');
    let pn = document.getElementById('pannel4');
    let btn1 = document.getElementsByClassName('offcanvasbtn')[1];
    //bsOffcanvas.show();
    //bsOffcanvas4.style.position = 'relative';
    btn1.style.top = '85px';
    btn1.style.width = '100px';
    bsOffcanvas4.style.width = '50vw';
    pn.style.height = '30vh';
    let ele = document.getElementsByClassName('bi bi-arrow-bar-left offcanvasicon')[1];
    ele.className = '';
    ele.innerHTML = 'Table';
    x.showdescription(`<p id='exp-title' style='margin: auto; width: 95%;'>Output Charateristics Observation Table</span><p>`, 4);
    x.addtorightpannel(`<div id='out_obst' ><h3 style='text-align: center;'>for I<sub>B</sub> = <span id='off-ib' ></span></h3></div>`, 4);
    //add table here
    let header = [`Sr no.`, `Current (amp)`, `Magnetic field (Gauss)`, `MSR (cm)`, `VSR (cm)`];
    let parent = document.getElementById('out_obst');
    let obs_tab_data = [];
    for (let i = 0; i < current_dataset[0].length; i++) {
        obs_tab_data.push([i + 1, current_dataset[0][i], current_dataset[1][i], current_dataset[2][i], current_dataset[3][i]]);
    }
    let tab = new Show_Table(header, obs_tab_data, parent);
    tab.load_table();
}
function power_button() {
    let btn = document.getElementById('power-dsp');
    let btn1 = document.getElementById('record-btn');
    let heading = document.getElementById('act1-sim-heading');
    let inp_control = document.getElementById('inp-control');
    let out_control = document.getElementById('out-control');
    current_ele = document.getElementById('i-dsp');
    l_ele = document.getElementById('l-dsp');
    x_ele = document.getElementById('x-dsp');
    ib_dsp = document.getElementById('microa-dsp');
    ic_dsp = document.getElementById('millia-dsp');
    vbe_dsp = document.getElementById('vbe-dsp');
    vce_dsp = document.getElementById('vce-dsp');
    extra_vce_dsp = document.getElementById('extra-vce');
    extra_ib_dsp = document.getElementById('extra-ib');
}
function draw_all_canvas() {
    load_canvas3_images();
    load_canvas2_images();
    load_canvas1_images();
    let up_btn = (document.getElementById('a2-btn-up'));
    let fine_up_btn = (document.getElementById('a2-btn-fine-up'));
    let down_btn = (document.getElementById('a2-btn-down'));
    let fine_down_btn = (document.getElementById('a2-btn-fine-down'));
    let reset = (document.getElementById('re-center'));
    up_btn.addEventListener('click', move_up);
    fine_up_btn.addEventListener('click', move_fine_up);
    down_btn.addEventListener('click', move_down);
    fine_down_btn.addEventListener('click', move_fine_down);
}
function load_canvas3_images() {
    let bench_img = new Chemistry.Custome_image(bench, new Chemistry.Point(1400, 750), 600 * 1.5, 300 * 1.5, my_canvas3);
    let holder_img = new Chemistry.Custome_image(holder, new Chemistry.Point(1400, 770), 500, 250, my_canvas3);
    let lens_img = new Chemistry.Custome_image(lens, new Chemistry.Point(1400, 770), 500, 250, my_canvas3);
    scene1.add(holder_img);
    scene1.add(lens_img);
    scene1.add(bench_img);
    // my_context1.beginPath();
    // my_context1.moveTo(1, 1);
    // my_context1.lineTo(200, 200);
    // my_context1.stroke();
}
function load_canvas1_images() {
    let dark_background = new Chemistry.Custome_image(dark, new Chemistry.Point(470, 460), 860, 860, my_canvas1);
    scene1.add(dark_background);
}
function load_canvas2_images() {
    let d = [];
    // for (let i = 0; i < data.length; i++) {
    // 	d[i] = data[i][1];
    // }
    d = [ferric_chloride_data[1][4], ferric_chloride_data[2][4], ferric_chloride_data[3][4], ferric_chloride_data[4][4]];
    noise = 100 - parseInt((Math.random() * 200).toFixed(0));
    console.log(noise);
    console.log(my_canvas2.width, my_canvas2.height);
    n_rings = new Chemistry.Quinkes_Method(8, noise, 'white', new Chemistry.Point(my_canvas2.width / (2 * lscale) + 5, (my_canvas2.height + 105) / (2 * lscale)), my_canvas2);
    let mscope_img = new Chemistry.Custome_image(mscope, new Chemistry.Point(my_canvas2.width / (2 * lscale), my_canvas2.height / (2 * lscale)), 860, 860, my_canvas2);
    let x_line = new Chemistry.Line(100, my_canvas2.height / (2 * lscale), 700, my_canvas2.height / (2 * lscale), my_canvas2);
    let y_line = new Chemistry.Line(my_canvas2.width / (2 * lscale) + 5, 100, my_canvas2.width / (2 * lscale) + 5, 700, my_canvas2);
    scene1.add(n_rings);
    scene1.add(mscope_img);
    scene1.add(x_line);
    scene1.add(y_line);
    // all_left_readings = n_rings.all_left_readings;
    // console.log(all_left_readings);
    // all_right_readings = n_rings.all_right_readings;
    // console.log(all_right_readings);
}
//controls for input charateristics
function inp_ch_vbe_dec() {
    if (inp_sim_vbe > 0) {
        inp_sim_vbe = parseFloat((inp_sim_vbe - 0.1).toFixed(1));
        update_input_display();
        record_btn.disabled = false;
    }
    else if (inp_sim_vbe == 0) {
        alert('You cannot decrease Vbe further');
        record_btn.disabled = true;
    }
}
function inp_ch_vbe_inc() {
    if (inp_sim_vbe < 1) {
        inp_sim_vbe = parseFloat((inp_sim_vbe + 0.1).toFixed(1));
        update_input_display();
        record_btn.disabled = false;
    }
    else if (inp_sim_vbe == 1) {
        alert('You cannot increase Vbe further');
        record_btn.disabled = true;
    }
}
function inp_ch_vce_dec() {
    if (inp_sim_vce > 1) {
        inp_sim_vce = inp_sim_vce - 2;
        update_input_display();
    }
    else if (inp_sim_vce == 0) {
        alert('You cannot decrease Vce further');
    }
}
function inp_ch_vce_inc() {
    if (inp_sim_vce < 8) {
        inp_sim_vce = inp_sim_vce + 2;
        update_input_display();
    }
    else if (inp_sim_vce == 8) {
        alert('You cannot increase Vce further');
    }
}
function update_input_display() {
    let vbe_data = [];
    let ib_data = [];
    for (let i = 0; i < input_ch.length; i++) {
        if (input_ch[i]['vce'] == inp_sim_vce) {
            vbe_data = input_ch[i]['vbe'];
            ib_data = input_ch[i]['ib'];
            for (let j = 0; j < vbe_data.length; j++) {
                if (vbe_data[j] == inp_sim_vbe) {
                    inp_sim_ib = ib_data[j];
                    ib_dsp.value = inp_sim_ib.toString();
                    vce_dsp.value = inp_sim_vce.toString();
                    vbe_dsp.value = inp_sim_vbe.toString();
                    extra_vce_dsp.value = inp_sim_vce.toString() + ' volts';
                    break;
                }
            }
        }
    }
}
function move_up() {
    n_rings.shift_up();
    console.log(n_rings.d);
    current_vsr = current_dataset[3][i_index] + n_rings.d / 1000;
    update_vsr();
    scene1.draw();
}
function move_fine_up() {
    n_rings.shift_fine_up();
    console.log(n_rings.d);
    current_vsr = current_dataset[3][i_index] + n_rings.d / 1000;
    update_vsr();
    scene1.draw();
}
function move_down() {
    n_rings.shift_down();
    console.log(n_rings.d);
    current_vsr = current_dataset[3][i_index] + n_rings.d / 1000;
    update_vsr();
    scene1.draw();
}
function move_fine_down() {
    n_rings.shift_fine_down();
    console.log(n_rings.d);
    current_vsr = current_dataset[3][i_index] + n_rings.d / 1000;
    update_vsr();
    scene1.draw();
}
// function show_main_scale_reading() {
// 	if(n_rings.center_x <= n_rings.stpt.x) {
// 		let msr_val = 1 ;
// 		let vsr_val = ferric_chloride_data[4][4];
// 		msr_show.value = msr_val.toString();
// 		vsr_show.value = vsr_val.toString();
// 	} else if (n_rings.center_x > n_rings.stpt.x) {
// 		let msr_val = 1 ;
// 		let vsr_val = ferric_chloride_data[4][4];
// 		msr_show.value = msr_val.toString();
// 		vsr_show.value = vsr_val.toString();
// 	}
// }
function update_vsr() {
    let ele = document.getElementById('vsr-inp');
    let ele1 = document.getElementById('msr-inp');
    ele.value = current_vsr.toString();
    ele1.value = '1';
    if (vsr_error()) {
        record_btn.disabled = false;
    }
    else {
        record_btn.disabled = true;
    }
}
function vsr_error() {
    let err = (Math.abs(current_dataset[3][i_index] - current_vsr) / current_dataset[3][i_index]) * 100;
    console.log(err);
    console.log(err);
    if (err < 100) {
        return true;
    }
    return false;
}
//controls for output characteristics
function out_ch_vce_dec() {
    if (out_sim_vce > 0) {
        out_sim_vce = out_sim_vce - 1;
        record_btn.disabled = false;
        update_output_display();
    }
    else if (out_sim_vce == 0) {
        alert('You cannot decrease Vce further');
        record_btn.disabled = true;
    }
}
function out_ch_vce_inc() {
    if (out_sim_vce < 10) {
        out_sim_vce = out_sim_vce + 1;
        update_output_display();
        record_btn.disabled = false;
    }
    else if (out_sim_vce == 10) {
        alert('You cannot increase Vce further');
        record_btn.disabled = true;
    }
}
function out_ch_ib_dec() {
    if (out_sim_ib > 10) {
        out_sim_ib = out_sim_ib - 10;
        update_output_display();
    }
    else if (out_sim_ib == 0) {
        alert('You cannot decrease ib further');
    }
}
function out_ch_ib_inc() {
    if (out_sim_ib < 50) {
        out_sim_ib = out_sim_ib + 10;
        update_output_display();
    }
    else if (out_sim_ib == 50) {
        alert('You cannot increase ib further');
    }
}
function update_output_display() {
    let vce_data = [];
    let ic_data = [];
    for (let i = 0; i < output_ch.length; i++) {
        if (output_ch[i]['ib'] == out_sim_ib) {
            vce_data = output_ch[i]['vce'];
            ic_data = output_ch[i]['ic'];
            for (let j = 0; j < vce_data.length; j++) {
                if (vce_data[j] == out_sim_vce) {
                    out_sim_ic = ic_data[j];
                    ic_dsp.value = out_sim_ic.toString();
                    vce_dsp.value = out_sim_vce.toString();
                    ib_dsp.value = out_sim_ib.toString();
                    extra_ib_dsp.value = out_sim_ib.toString() + ' microAmp';
                    break;
                }
            }
        }
    }
}
function set_first_constant() {
    // to restrict invalid vce value
    if (inp_sim_vce == 0) {
        alert('choose a valid vbe value');
        return;
    }
    let t = document.getElementById('off-vce');
    let btn = document.getElementById('power-dsp');
    let btn1 = document.getElementById('fbtn1');
    let btn2 = document.getElementById('fbtn2');
    let btn3 = document.getElementById('qa-we');
    t.innerHTML = inp_sim_vce.toString() + ' V';
    btn.disabled = true;
    btn1.disabled = true;
    btn2.disabled = true;
    btn3.disabled = true;
}
function set_second_constant() {
    if (out_sim_ib == 10) {
        alert('choose a valid vce value');
        return;
    }
    let t = document.getElementById('off-ib');
    let btn = document.getElementById('power-dsp');
    let btn1 = document.getElementById('sbtn1');
    let btn2 = document.getElementById('sbtn2');
    let btn3 = document.getElementById('qa-wa');
    t.innerHTML = out_sim_ib.toString() + ` &mu;A`;
    btn.disabled = true;
    btn1.disabled = true;
    btn2.disabled = true;
    btn3.disabled = true;
}
// to record and manage input observation table
// to record input observations
function record_observation() {
    let new_row = [];
    //to avoid duplicate entries;
    for (let i = 0; i < obs_table.length; i++) {
        if (obs_table[i][1] == current_dataset[0][i_index]) {
            alert(`You have already entered observation for this current value`);
            record_btn.disabled = true;
            return;
        }
    }
    record_btn.disabled = false;
    // to only allow incremental 5 observations
    // if(obs_table.length > 5) {
    // 	if(x != (obs_table[obs_table.length - 1][1] + 10)) {
    // 		alert(`You need to take observation for x = ${obs_table[obs_table.length - 1][1] + 10}cm first.`);
    // 		return;
    // 	}
    // } else {
    // 	if(x != 10) {
    // 		alert('Start taking observation from X = 10cm');
    // 		return;
    // 	}
    // }
    //disable_buttons();
    //to add values in observation table
    let header = [`Sr no.`, `Current (amp)`, `Magnetic field (Gauss)`, `MSR (cm)`, `VSR (cm)`];
    new_row.push(obs_table.length + 1);
    new_row.push(current_dataset[0][i_index]);
    new_row.push(current_dataset[1][i_index]);
    new_row.push(current_dataset[2][i_index]);
    new_row.push(current_dataset[3][i_index]);
    obs_table.push(new_row);
    let parent = document.getElementById('out_obst');
    parent.innerHTML = ``;
    let tab = new Show_Table(header, obs_table, parent);
    tab.load_table();
    // x1 = obs_table[obs_table.length - 1][1];
    // d1 = obs_table[obs_table.length - 1][3];
    if (obs_table.length == 5) {
        activity4();
        return;
    }
    var bsOffcanvas = new bootstrap.Offcanvas(document.getElementById('offcanvasRight4'));
    bsOffcanvas.show();
}
// to verify input observations
// function verification_sucessful() {
// 	var bsOffcanvas = new bootstrap.Offcanvas(
// 		document.getElementById('offcanvasRight4')
// 	);
// 	bsOffcanvas.hide();
// 	let btn: HTMLButtonElement = <HTMLButtonElement> document.getElementById('record-btn');
// 	btn.disabled = true;
// 	btn.className = 'btn btn-secondary';
// 	if(obs_table.length == 5) {
// 		let btn3: HTMLButtonElement = <HTMLButtonElement> document.getElementById('power-dsp');
// 		let btn: HTMLButtonElement = <HTMLButtonElement> document.getElementById('record-btn');
// 		btn3.disabled = false;
// 		btn.onclick = record_out_observation;
// 		//btn.disabled = false;
// 		//modify offcampus and next steps
// 		pp.showtitle(
// 			`<p id="exp-title" style='width: 23vw;'>Output Characteristics Observations</span><p>`,
// 			3
// 		);
// 		pp.showdescription(`<div style="background-color: #f4ccccff; border-radius: 10px; border: black; padding: 5%; font-weight: 500; font-size: 17px;">- Click the Input Charatersitics button to shift to Output Charatersitics mode. <br> - Select a I<sub>B</sub> value and press set I<sub>B</sub> button  <br> - Take readings for output charateristics by varying V<sub>CE</sub> and clicking the record observation button <br> - Enter the values in table and press verify <br> - Repeat record observations 4 more times to complete the Output characteristics observation table.  </div>` , 3);
// 		var bsOffcanvas = new bootstrap.Offcanvas(
// 			document.getElementById('offcanvasRight3')
// 		);
// 		bsOffcanvas.show();
// 	} else {
// 		enable_buttons();
// 	}
// }
//function to disable buttons while adding new input observation
function disable_buttons() {
    let btn1 = document.getElementById('a2-btn-up');
    let btn2 = document.getElementById('a2-btn-fine-up');
    let btn3 = document.getElementById('a2-btn-down');
    let btn4 = document.getElementById('a2-btn-fine-down');
    let btn5 = document.getElementById('a2-btn-up');
    let btn6 = document.getElementById('a2-btn-fine-up');
    let btn = document.getElementById('rtbn');
    let btn0 = document.getElementById('dbtn');
    btn1.disabled = true;
    btn2.disabled = true;
    btn3.disabled = true;
    btn4.disabled = true;
    btn5.disabled = true;
    btn6.disabled = true;
    btn.disabled = true;
    btn0.disabled = true;
}
//function to disable buttons after adding new input observation
function enable_buttons() {
    let btn1 = document.getElementById('a2-btn-up');
    let btn2 = document.getElementById('a2-btn-fine-up');
    let btn3 = document.getElementById('a2-btn-down');
    let btn4 = document.getElementById('a2-btn-fine-down');
    let btn5 = document.getElementById('a2-btn-up');
    let btn6 = document.getElementById('a2-btn-fine-up');
    let btn = document.getElementById('rtbn');
    let btn0 = document.getElementById('dbtn');
    btn1.disabled = false;
    btn2.disabled = false;
    btn3.disabled = false;
    btn4.disabled = false;
    btn5.disabled = false;
    btn6.disabled = false;
    btn.disabled = false;
    btn0.disabled = false;
}
//to increase the current
function increase_current() {
    let idsp = document.getElementById('i-dsp');
    let bdsp = document.getElementById('b-dsp');
    if (i_index < current_dataset[0].length) {
        i_index += 1;
        i_state = current_dataset[0][i_index];
        b_index += 1;
        b_state = current_dataset[1][i_index];
        current_msr = 1;
        current_vsr = current_dataset[3][i_index];
        let variation = 100 - parseInt((Math.random() * 200).toFixed(0));
        console.log(variation);
        scene1.draw();
        n_rings.d = variation;
    }
    else {
        alert('Current cannot be increase further');
    }
    idsp.value = i_state.toString();
    bdsp.value = b_state.toString();
    current_vsr = current_dataset[3][i_index] + n_rings.d / 1000;
    update_vsr();
}
//to decrease the current 
function decrease_current() {
    let idsp = document.getElementById('i-dsp');
    let bdsp = document.getElementById('b-dsp');
    if (i_index > 0) {
        i_index -= 1;
        i_state = ferric_chloride_data[1][i_index];
        b_index -= 1;
        b_state = ferric_chloride_data[2][i_index];
        let variation = 100 - parseInt((Math.random() * 200).toFixed(0));
        console.log(variation);
        scene1.draw();
        n_rings.d = variation;
    }
    else {
        alert('Minimum current reached');
    }
    idsp.value = i_state.toString();
    bdsp.value = b_state.toString();
    current_vsr = current_dataset[3][i_index] + n_rings.d / 1000;
    update_vsr();
}
// activity3();
//# sourceMappingURL=activity3.js.map