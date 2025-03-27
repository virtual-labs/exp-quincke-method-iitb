function activity2() {
	pp.clearleftpannel();
	pp.clearrightpannel();

	let left_panel_text = `
         <div id='act5-left-content' style="position: absolute; font-size: 24px; text-align: center;">
		 <h2>Select the Solution and Density</h2>
			<div style='display: flex; flex-direction: column; width: 90vw; margin-top: 6vw;'>

				<div style='margin: 20px;'>
					<p style='margin: 0;'>Select Paramagnetic Material Solution</p>
					<select id='material-dd'>
						<option value=''>--Select--</option>
					</select>
				</div>


				<div style='margin: 20px;'>
					<p style='margin: 0;'>Select Density</p>
					<select id='density-dd'>
						<option value=''>--Select--</option>
					</select>
				</div>
		
			</div>

			<div>
				<button onclick='move_to_a3();' class='btn btn-primary' >Start Simulation</button>
			</div>


         </div>
     `;

	pp.addtoleftpannel(left_panel_text);

	//define the canvas
	pp.addcanvas('mycanvas');
	//pp.addtorightpannel(question_div_box, 3);
	//pp.showscore(0, 3);
	canvas = pp.canvas;
	context = canvas.getContext('2d');

	af_windowresize();

	load_drop_downs();

}



function af_windowresize() {
	//canvas size
	af_canvas_size();

	//canvas mapping
	af_canvas_mapping();

}

function af_canvas_size() {
	canvas.width = window.innerWidth * 0.91;
	canvas.height = ((canvas.width * 1080.0) / 1920) * 0.85;
	lscale = canvas.width / 1920.0;
	document.getElementById('leftpannel').style.height =
		canvas.height + 5 + 'px';
	document.getElementById('leftpannel').style.margin = '0';
}


function af_canvas_mapping() {
	context.translate(0, canvas.height);
	context.scale(1, -1);
}

function load_drop_downs() {
	let m_dd: HTMLSelectElement = <HTMLSelectElement> document.getElementById('material-dd');
	let den_dd: HTMLSelectElement = <HTMLSelectElement> document.getElementById('density-dd');
	
	let op1 = new Option();
	op1.value = 'Ferric Chloride Solution';
	op1.innerText = 'Ferric Chloride Solution';
	m_dd.add(op1);


	let op2 = new Option();
	op2.value = 'Manganese Sulphate Solution';
	op2.innerText = 'Manganese Sulphate Solution';
	m_dd.add(op2);

	let dop1 = new Option();
	dop1.value = '0.05';
	dop1.innerText = '0.05';
	den_dd.add(dop1);


	let dop2 = new Option();
	dop2.value = '0.1';
	dop2.innerText = '0.1';
	den_dd.add(dop2);

	let dop3 = new Option();
	dop3.value = '0.15';
	dop3.innerText = '0.15';
	den_dd.add(dop3);
}


function move_to_a3() {
	let m_dd: HTMLSelectElement = <HTMLSelectElement> document.getElementById('material-dd');
	let den_dd: HTMLSelectElement = <HTMLSelectElement> document.getElementById('density-dd');
	
	if((m_dd.value != '') && (den_dd.value != '')) {

		if(m_dd.value == 'Ferric Chloride Solution') {
			select_material = 'Ferric Chloride Solution';
			select_density = parseFloat(den_dd.value);

			if(den_dd.value == '0.05') {
				load_current_dataset(0, [1, 2, 3, 4]);
			}

			if(den_dd.value == '0.1') {
				load_current_dataset(0, [1, 2, 5, 6]);
			}

			if(den_dd.value == '0.1') {
				load_current_dataset(0, [1, 2, 7, 8]);
			}

		} else if (m_dd.value == 'Manganese Sulphate Solution') {
			select_material = 'Manganese Sulphate Solution';
			select_density = parseFloat(den_dd.value);

			if(den_dd.value == '0.05') {
				load_current_dataset(1, [1, 2, 3, 4]);
			}

			if(den_dd.value == '0.1') {
				load_current_dataset(1, [1, 2, 5, 6]);
			}

			if(den_dd.value == '0.1') {
				load_current_dataset(1, [1, 2, 7, 8]);
			}
		}

		activity3();

	} else {
		alert('You need to select solution and density as well');
	}
}



function load_current_dataset(sol: number, ind_arr: number[]) {
	current_dataset.push([]);
	current_dataset.push([]);
	current_dataset.push([]);
	current_dataset.push([]);
	if(sol == 0) {
		for(let i=0; i<ferric_chloride_data[0].length; i++) {
			current_dataset[0].push(ferric_chloride_data[ind_arr[0]][i]);
			current_dataset[1].push(ferric_chloride_data[ind_arr[1]][i]);
			current_dataset[2].push(ferric_chloride_data[ind_arr[2]][i]);
			current_dataset[3].push(ferric_chloride_data[ind_arr[3]][i]);
		}
	} else {
		for(let i=0; i<ferric_chloride_data[0].length; i++) {
			current_dataset[0].push(manganese_sulphate_solution[ind_arr[0]][i]);
			current_dataset[1].push(manganese_sulphate_solution[ind_arr[1]][i]);
			current_dataset[2].push(manganese_sulphate_solution[ind_arr[2]][i]);
			current_dataset[3].push(manganese_sulphate_solution[ind_arr[3]][i]);
		}
	}
	
}


// activity2();
