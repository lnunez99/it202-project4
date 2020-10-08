	
    /*-------------------- FUNCTION SECTION --------------------*/

	// This modified function was provided at https://www.chartjs.org/docs/latest/developers/updates.html
    function addData(chart, label, data) {
        chart.data.labels.push(label);
        chart.data.datasets.forEach((dataset) => {
            dataset.data.push(data);
        });
        chart.update();
    }
	// This function was provided at https://www.chartjs.org/docs/latest/
	// I modified it to take two arrays, remove the default data, and then add the data from said arrays.
    const displayData = (context, numbersArray, countriesArray, label) => {
        let myChart = new Chart(context, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: label,
                    data: [],
                    backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)'],
                    borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                }
            }
        });
		// Add new data.
        for(let i = 0; i < numbersArray.length; i++) {
            addData(myChart, countriesArray[i], numbersArray[i]);
        }
    }

    /*-------------------- END FUNCTION SECTION --------------------*/
    // Declare variables.
    let canvas = document.querySelector('#myChart');
    let ctx = canvas.getContext('2d');
    let countryData; // JSON object.
    let countryList = []; // List of selected countries.
    // Data storage for first page.
    let pageOneTotalCasesList = [];
    let pageOneTotalConfirmed = 0;

	let totalDeathsArray = [];
	let totalDeaths = 0;
	
	let totalRecoveredArray = [];
	let totalRecovered = 0;
    // Data storage for second page.
    let datesList = [];
    let daysCases = [];
    let length = 0; // Length of a country's 'dates' array.
    // Section to fill the list with countries.
    let apiEndPoint = "https://pomber.github.io/covid19/timeseries.json";
    let table = document.querySelector("#table");
    let welcomeText = document.querySelector(".description");
	
	//
	let userChoice = "";
    /*-------------------- FETCH AND BUILD --------------------*/
	
	
    /*-------------------- GOOGLE --------------------*/
	// This modified function was provided at https://developers.google.com/chart/interactive/docs/gallery/linechart#creating-material-line-charts.
	// Inspiration was drawn from Professor Hayes' Panopto video, but I adapted it to the purposes of this project. 
    google.charts.load('current', {
        'packages': ['corechart']
    });
    drawChart = (rowData, countryList, header) => 
	{
        let data = new google.visualization.DataTable();
		
		// Add a 'default' string to match the # of rows.
        data.addColumn("string", "X");
		
		// Loop through the countryList and append a column to the data element where the value of the col. is a country.
        for(let i = 0; i < countryList.length; i++) {
            data.addColumn('number', countryList[i]);
        }
		
		// Since every element in the rowData array is a n-tuple (where n is the #of countries), looping through the array is sufficient.
        data.addRows(rowData);
		
		if (header == 'confirmed')
		{
			header = "confirmed cases";
		}
        let options = {
            title: 'Number of ' + header,
            curveType: 'function',
            legend: {
                position: 'bottom'
            }
        };
		
        let chart = new google.visualization.LineChart(document.querySelector('#curve_chart'));
        chart.draw(data, options);
    }
    /*-------------------- GOOGLE --------------------*/
	
	// Fetch data.
    fetch(apiEndPoint).then(response => {
        return response.json()
    }).then(json => {
        // Turn countryData = json object.
        countryData = json;
		
        // Find the node that contains the list.
        let theList = document.querySelector("#countries");
        //             console.log(theList);
        // Iterate through the json object. 'item' = country name.
        for(item in countryData) {
            
			// Clone the item inside the list.
            
			let opcione = document.createElement('option');
            
			opcione.value = item;
            
			theList.appendChild(opcione);
        }
		
		
        let topRow = document.querySelector("#TopRow");
        
		let table = document.querySelector("#Tbl");
        // Build the list that displays on the page while growing the arrays needed to store data.
         
        // Event listener for submit button.
        let submitButton = document.querySelector("#Submit");
        submitButton.addEventListener("click", event => {
			
			// Grab the selected country.
            let textBox = document.querySelector("#countryContainer");
            
			let chosenCountry = textBox.value;
            
			totalDeaths = 0;
			pageOneTotalConfirmed = 0;
			totalRecovered = 0;
			if(chosenCountry != "") 
			{
                length = countryData[chosenCountry].length;
                
				
                // Clone template
                let clone = document.querySelector("div#data li.template").cloneNode(true);
				
                // Add country to array after checking if it is there or not.
                let boolean = countryList.includes(chosenCountry);
                
				if(!boolean)
				{
                    countryList.push(chosenCountry);
					
                    // Remove template class from clone.
                    clone.classList.remove("template");
					
                    // Update the value
                    clone.querySelector(".mdc-list-item__primary-text").textContent = chosenCountry;
                    clone.querySelector(".mdc-list-item__secondary-text").textContent = chosenCountry + "'s most recent data. Emoji coming soon.";
					
                    // Append to list.
                    document.querySelector("div#data ul.mdc-list").appendChild(clone);
					
					// Tally up the total number of cases.
                    for(item of countryData[chosenCountry]) 
					{
						pageOneTotalConfirmed = item['confirmed'];
						totalDeaths = item['deaths'];
						totalRecovered = item['recovered'];
                    }					
					// Add to the list.
                    pageOneTotalCasesList.push(pageOneTotalConfirmed);
					totalDeathsArray.push(totalDeaths)
					totalRecoveredArray.push(totalRecovered);
                }
            }
        })
	/*-------------------- DISPLAY CHART --------------------*/
		
        let displayButton = document.querySelector("#displayButton");
		
		let displayDeaths = document.querySelector("#displayDeaths");
		
		let displayRec = document.querySelector("#displayRec");
		
		displayButton.addEventListener("click", event => {
			ctx.clearRect(0, 0, canvas.width, canvas.width);
			let label = "Total Cases";
			displayData(canvas, pageOneTotalCasesList, countryList, label);
			userChoice = "confirmed";
        })
		
		displayDeaths.addEventListener("click", event => {    
			let label2 = "Total Deaths";
			ctx.clearRect(0, 0, canvas.width, canvas.width);
			displayData(canvas, totalDeathsArray, countryList, label2);
			userChoice = "deaths";
        })
		
		displayRec.addEventListener("click", event => { 
			ctx.clearRect(0, 0, canvas.width, canvas.width);
			let label3 = "Total Recovered";
			displayData(canvas, totalRecoveredArray, countryList, label3);
			userChoice = "recovered";
        })
		
		
    })
    /*-------------------- NAVIGATION --------------------*/
    let pageOneControls = document.querySelector("#pageOneDisplay");
	
	let TABLE = document.querySelector(".mdc-data-table");
    
	let topPageText = document.querySelector("#topPageText");
    
	let p1Button = document.querySelector("#page1");
    
	let p2Button = document.querySelector("#page2");
    
	let p3Button = document.querySelector("#page3");
    
	let headerArray = [];
    
	let gChart = document.querySelector("#curve_chart");
    
	gChart.style.display = "none";
    
	
	p1Button.addEventListener("click", event => {
     
		gChart.style.display = "none";
        
		if (countryList.length != 0)
			canvas.style.display = "block";
        
		pageOneControls.style.display = "block";
        
		pageOneControls.style.visibility = "visible";
        
		TABLE.style.display = "none";
        
		topPageText.lastElementChild.textContent = "Select and submit a maximum of five countries. Then click/tap the display button.";
        
		topPageText.firstElementChild.textContent = "Bar Graphs"
        
		displayData(canvas, pageOneTotalCasesList, countryList);
    })
    
	p2Button.addEventListener("click", event => {
    
// 		TABLE.lastElementChild.innerHTML = "";
		console.log(TABLE.lastElementChild.lastElementChild);
		while( TABLE.lastElementChild.lastElementChild.hasChildNodes() )
		{
			TABLE.lastElementChild.lastElementChild.removeChild(TABLE.lastElementChild.lastElementChild.childNodes[0]);
			console.log("Removing " +TABLE.lastElementChild.lastElementChild.childNodes[0] )
		}
		// Clear canvas and display the table.
		canvas.style.display = "none";
        
		ctx.clearRect(0, 0, canvas.width, canvas.width);
        
		// Update screen
		gChart.style.display = "none";
        
		
		pageOneControls.style.display = "none";
        
		pageOneControls.style.visibility = "hidden";
	
        if (userChoice == 'confirmed')
			topPageText.lastElementChild.textContent = "Showing each of your countries' total " + userChoice+ " cases";
		
        topPageText.lastElementChild.textContent = "Showing each of your countries' total " + userChoice;
		topPageText.firstElementChild.textContent = "Data Table"
        
		let header = document.querySelector(".mdc-data-table__header-row");
		let tblr = document.querySelector(".mdc-data-table__content");
        
        for(country of countryList) 
		{
            let bool2 = headerArray.includes(country);
            
			if(!bool2) {
				
				let newH = document.createElement("th");
				newH.classList.add("mdc-data-table__header-cell");
                
				newH.textContent = country;
                
				header.appendChild(newH);
                
				headerArray.push(country);
            }
        }
        for(let i = length-1; i >= 0; i--) {
            
			let newR = document.createElement("tr");
			newR.classList.add("mdc-data-table__row");
            
			let newTD = document.createElement("td");
			newTD.classList.add("mdc-data-table__cell--numeric");
			newTD.textContent = countryData["Afghanistan"][i]['date'];
            
			newR.appendChild(newTD);
            
			for(country of countryList) 
			{
                
				let otherTD = document.createElement("td");
				otherTD.classList.add("mdc-data-table__cell--numeric");

                
				otherTD.textContent = countryData[country][i][userChoice];
                
				newR.appendChild(otherTD);
            }
            tblr.appendChild(newR);
        }
		
        // Show table
//         table.style.visibility = "visible";
        
		TABLE.style.display = "block";
    })
	
    p3Button.addEventListener("click", event => {
        
		// Update screen.
        canvas.style.display = "none";
        ctx.clearRect(0, 0, canvas.width, canvas.width);
        
		gChart.style.display = "block";
        
// 		table.style.display = "none";
		TABLE.style.display = "none";
        
		pageOneControls.style.display = "none";
        
		pageOneControls.style.visibility = "hidden";
        
		topPageText.lastElementChild.textContent = "Showing each of your countries' total " + userChoice + " to date";
        
		topPageText.firstElementChild.textContent = "Line Chart"
        
		let dataArray = [];
        for(let i = 0; i < length; i++) {
            
			let thisDay = [];
            
			thisDay.push(countryData['Italy'][i]['date']);
            
			for(country of countryList) {
                
				let date = countryData[country][i]['date'];
                
				let cases = countryData[country][i][userChoice];
                
                
				thisDay.push(cases);
            }
            dataArray.push(thisDay);
        }
        drawChart(dataArray, countryList, userChoice);
    })
