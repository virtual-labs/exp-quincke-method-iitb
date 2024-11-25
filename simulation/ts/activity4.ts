
declare var Chart;
declare var Verify_Rows_Cols_Custom_Fixed;
let slope  = 0;
let susceptibility = 0;

let inp_ib_y: number[] = [];
let inp_vbe_x: number[] = [];


let out_ic_y: number[] = [];
let out_vce_x: number[] = [];

let in_others = [];
let out_others = [];

let x_axis: number[] = [];
let y_axis: number[] = [];

function activity4() {
	pp.clearleftpannel();
	pp.clearrightpannel();
	pp.addoffcanvas(3);
	

    //load_chart_data();


	pp.showtitle(
		`<p id="exp-title" style='width: 23vw;'>Calculate</span><p>`,
		3
	);

	pp.showdescription(`<div style="background-color: #f4ccccff; border-radius: 10px; border: black; padding: 5%; font-weight: 500; font-size: 17px;">Fill the required values in the table shown</div>` , 3);


	var bsOffcanvas = new bootstrap.Offcanvas(
		document.getElementById('offcanvasRight3')
	);
	bsOffcanvas.show();

	let left_panel_text = `
         <div id='act4-left-content' style="position: absolute; font-size: 16px;">

            <div id='a4-1' style='position: relative; display: none;'>

                <div><br><canvas style='border: 1px solid black; height: 14vw; margin-left: 15vw;' id='my-canvas1' ></canvas></div>

                <br>

                <div style='display: inline-block; width: 40vw;'>
                    <span style='font-size: 1.8vw;'>
                        $$ \\chi = \\frac{2 \\rho h g}{H^2} = 2 \\times \\rho \\times g \\times slope $$
                    </span>
                </div>

                <div style='width: 40vw; display: inline-block; text-align: center;'>
                    
                    <div>
                        Slope = 
                        <span><input style='width: 20vw;' type='number' id='slope-inp' /></span> x 10<sup>-9</sup>
                    </div>
                    <br>

                    <div>
                        &chi; = 
                        <span><input style='width: 20vw;' type='number' id='x-inp' /></span> x 10<sup>-9</sup>
                    </div>
                    <br>

                    <div>
                        <button class='btn btn-primary' onclick='act4_verify();' style='width: 20vw;' >Verify</button>
                    </div>


                </div>
            
            </div>
            <br>

            <div id='t-4' style='position: relative; overflow: scroll; width: 90vw; height: 50vw;' ></div>

         </div>
     `;

	pp.addtoleftpannel(left_panel_text);

	//define the canvas
	pp.addcanvas('mycanvas');
	//pp.addtorightpannel(question_div_box, 3);
	//pp.showscore(0, 3);
	canvas = pp.canvas;
	context = canvas.getContext('2d');

	//add rect and scene
	// canvas.style.cursor = 'crosshair';
	// rect = canvas.getBoundingClientRect();
	//scene = new Scene();
	// assembly_image = new Chemistry.Custome_image(
	// 	assembly,
	// 	new Chemistry.Point(1050, 450),
	// 	815 * 1.3,
	// 	635 * 1.3,
	// 	canvas
	// );
	// img_slider = new Chemistry.Custome_image(
	// 	rheostat_slider,
	// 	new Chemistry.Point(1210, 800),
	// 	41,
	// 	74,
	// 	canvas
	// );
	// scene.add(assembly_image);
	// scene.add(img_slider);

	// add canvas sizing
	// window.onload = a2_windowresize;
	// window.onresize = a2_windowresize;
   
	a4_windowresize();


   // plot_input();
   // plot_output();

    load_table4();

   
	//load_colors();

	// window.addEventListener('click', (event) => a3_mouseclick(event));
}

function a4_windowresize() {
	//canvas size
	a4_canvas_size();

	//canvas mapping
	a4_canvas_mapping();

	//draw scene
	//scene.draw();

}

function a4_canvas_size() {
	canvas.width = window.innerWidth * 0.91;
	canvas.height = ((canvas.width * 1080.0) / 1920) * 0.85;
	lscale = canvas.width / 1920.0;
	document.getElementById('leftpannel').style.height =
		canvas.height + 5 + 'px';
	document.getElementById('leftpannel').style.margin = '0';
}


function a4_canvas_mapping() {
	context.translate(0, canvas.height);
	context.scale(1, -1);
}

function load_table4() {
    let header = [`Sr no.`, `Current (amp)`, `Magnetic field, H (Gauss)`, `H<sup>2</sup>`,  `MSR (cm)`, `VSR (cm)`, `Total Observed Reading, h (cm)`];

	   
	let parent: HTMLDivElement = <HTMLDivElement> document.getElementById('t-4');


    //load values in calc_table
    for(let i=0; i<obs_table.length; i++) {
        obs_table[i].splice(3, 0, obs_table[i][2]**2);
        obs_table[i].splice(6, 0, (obs_table[i][4] + obs_table[i][5])); 
    }
    

	let tab = new Verify_Rows_Cols_Custom_Fixed(
        header, 
        obs_table, 
        [0, 1, 2, 3 ,4], 
        [[3, 6], [3, 6], [3, 6], [3, 6], [3, 6]], 
        '', 
        parent, 
        true, 
        true, 
        after_table4_verification, 
        5);


	tab.load_table();
}

function after_table4_verification() {

    let ele0: HTMLDivElement = <HTMLDivElement> document.getElementById('a4-1');


    let ele1: HTMLDivElement = <HTMLDivElement> document.getElementById('t-4');

    ele0.style.display = 'block';
    ele1.style.display = 'none';

    


    pp.showtitle(
		`<p id="exp-title" style='width: 23vw;'>Calculate susceptibility</span><p>`,
		3
	);

	pp.showdescription(`<div style="background-color: #f4ccccff; border-radius: 10px; border: black; padding: 5%; font-weight: 500; font-size: 17px;"></div>` , 3);

    for(let i=0; i<obs_table.length; i++) {
        x_axis.push(obs_table[i][3]);
        y_axis.push(obs_table[i][6]);
    }

    slope = (y_axis[0] - y_axis[y_axis.length-1])/(x_axis[0] - x_axis[x_axis.length-1]);
    susceptibility = 2 * select_density * 9.81 * slope;
    console.log(slope);
    
    plot_input();


	var bsOffcanvas = new bootstrap.Offcanvas(
		document.getElementById('offcanvasRight3')
	);
	bsOffcanvas.show();
}

// activity4();


function plot_input(){

    // new_task("Answer the Question");
    // new_message("Observe Graph Deviation");
    //document.getElementById("bt-103").remove();
    //document.getElementById('a8-main-div').innerHTML = ``;
    //display_message("Answer Question");
    //document.getElementById("a8-main-div").innerHTML += "<canvas id='myChart'></canvas>";
    // root.id = "act8";
    var ctx = document.getElementById('my-canvas1');
    ctx.style.backgroundColor = "white";
    // ctx.style.marginTop = "5px";
    // ctx.style.marginLeft = "10%";
    // ctx.style.padding = "10px";
    ctx.style.borderRadius = "8px";
    if(typeof chart!='undefined')
    {
        chart.destroy();
    }
    // let labels = [0.004, 0.007, 0.010, 0.014, 0.020, 0.029, 0.039];
    // let data1=[82.28,96.86,104.07,108.28,112.48,117.68,125.35];//hi_expt
    // let data2=[146.90,183.50,204.11,230.09,256.89,290.83,323.49];//hi_st
    var chart = new Chart(ctx, {
        type: 'scatter',
        data: {
        labels: y_axis,
        datasets: [
                {
                    label: '',
                    data: x_axis,
                    fill: false,
                    borderColor: 'blue',
                    tension: 0.5,
                    showLine: true
                    // yAxisID: 'A',
                    // borderWidth: 1,
                    // borderColor: "green",
                    // backgroundColor: "rgba(34, 139, 34, 0.5)",
                },
            ]
    
        },
        options: {
            maintainAspectRatio: true,
            scales: {
              y: {
                title: {
                    display: true,
                    text: 'Rise of liquid Level (h)',
                    font:{size:14,weight:'bold'}
                  }
              },
              x: {
                title: {
                    display: true,
                    text: 'Magnetic Field Squared',
                    font:{size:14,weight:'bold'}
                  }
              }
            
            },
            plugins: {
                title: {
                  display: true,
                  text: `h vs H^2 plot`,
                  font: {size: 18},
                },
                legend:{labels:{font:{size:14,weight:'bold'}}}
            },
                   
        }
    });


    setTimeout(() => {MathJax.typeset();}, 200);
    
}


function act4_verify() {
	let val1: HTMLInputElement = <HTMLInputElement>(
		document.getElementById('slope-inp')
	);
	// let val2: HTMLInputElement = <HTMLInputElement> document.getElementById('temp-inp');
	let val3: HTMLInputElement = <HTMLInputElement>(
		document.getElementById('x-inp')
	);

    console.log(slope/1e-9, susceptibility/1e-9);
    
	

	if (!verify_values(slope/1e-9, parseFloat(val1.value))) {
		alert('Calculated slope value is incorrect, try again!!');
		return;
	}

    if (!verify_values(susceptibility/1e-9, parseFloat(val3.value))) {
		alert('Calculated susceptibility value is incorrect, try again!!');
		return;
	}


	alert('You have succefully entered the value with in 10% error margin. Well done.');

}




//activity4();