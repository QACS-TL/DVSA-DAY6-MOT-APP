function find_car_by_reg() {
    let reg = document.getElementById("searchText")
    console.log(reg.value)
    fetchAndFilterVehicles(reg.value, "reg")
        .then(vehicle => {
            console.log('Filtered Vehicle:', vehicle);
            populate_table(vehicle)
        });
  }

  function find_car_by_mot_number() {
    let motno = document.getElementById("searchText")
    console.log(motno.value)
    fetchAndFilterVehicles(motno.value, "motno")
        .then(vehicle => {
            console.log('Filtered Vehicle:', vehicle);
            populate_table(vehicle)
        });
  }

  function populate_table(vehicle){
    if (vehicle != null){
        let registrationNumber = document.getElementById("registrationNumber")
        registrationNumber.innerHTML = vehicle.registrationNumber

        let motTestNumber = document.getElementById("motTestNumber")
        motTestNumber.innerHTML = vehicle.motTestNumber
        
        let make = document.getElementById("make")
        make.innerHTML = vehicle.make

        let model = document.getElementById("model")
        model.innerHTML = vehicle.model

        let year = document.getElementById("year")
        year.innerHTML = vehicle.year

        let fuelType = document.getElementById("fuelType")
        fuelType.innerHTML = vehicle.fuelType
        
        let mileage = document.getElementById("mileage")
        mileage.innerHTML = vehicle.mileage
        
        let testDate = document.getElementById("testDate")
        testDate.innerHTML = vehicle.testDate
        
        let expiryDate = document.getElementById("expiryDate")
        expiryDate.innerHTML = vehicle.expiryDate
            
        let testResult = document.getElementById("testResult")
        testResult.innerHTML = vehicle.testResult.toUpperCase()
            
        let advisoryItems = document.getElementById("advisoryItems")
        if (vehicle.advisoryItems === ""){
            vehicle.advisoryItems = "None"
        }
        advisoryItems.innerHTML = vehicle.advisoryItems

        let defects = document.getElementById("defects")
        if (vehicle.defects === ""){
            vehicle.defects = "None"
        }
        defects.innerHTML = vehicle.defects

        let results = document.getElementById("results")
        results.innerHTML = ""
        results.setAttribute("hidden", "hidden");
        let table = document.getElementById("mot_results_table")
        table.removeAttribute("hidden")

    }            
    else {
        let results = document.getElementById("results")
        results.innerHTML = "Number NOT found"
        results.removeAttribute("hidden")
        let table = document.getElementById("mot_results_table")
        table.setAttribute("hidden", "hidden");
    }
  }

  // Function to fetch and filter vehicles based on registration number
async function fetchAndFilterVehicles(val, reg_or_motno) {
    try {
      // Fetch the JSON data from the server
      const response = await fetch('http://localhost:5000/vehicles');
      
      // Check if the response is successful (status code 200)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      // Parse the JSON data from the response
      const vehiclesData = await response.json();
      console.log(vehiclesData)
      filteredVehicles = "{}"
      if (reg_or_motno === "reg"){
        filteredVehicles = vehiclesData.filter(vehicle =>
            vehicle.registrationNumber === val
        );
      }
      else{
        filteredVehicles = vehiclesData.filter(vehicle =>
            vehicle.motTestNumber === val
        );
      }
      console.log(filteredVehicles[0])
      return filteredVehicles[0];
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  }

  function submitForm() {
    let currentDate = new Date();
    console.log(currentDate)
    expiryDate = new Date(currentDate.setFullYear(currentDate.getFullYear() + 1));
   
    const formData = {
        registrationNumber: document.getElementById('registrationNumber').value,
        motTestNumber: document.getElementById('motTestNumber').value,
        make: document.getElementById('make').value,
        model: document.getElementById('model').value,
        year: parseInt(document.getElementById('year').value),
        fuelType: document.getElementById('fuelType').value,
        mileage: parseInt(document.getElementById('mileage').value),
        testDate: currentDate.toDateString(),
        expiryDate: expiryDate.toDateString(),
        testResult: document.getElementById('testResult').value,
        advisoryItems: document.getElementById('advisoryItems').value,
        defects: document.getElementById('defects').value
    };
    console.log(formData)
    console.log("STRINGIFY:" + JSON.stringify( formData ))

    // Assuming your server endpoint is http://localhost:5000/vehicles
    fetch('http://127.0.0.1:5000/vehicles', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify( formData )
    })
    .then(response => response.json())
    .then(data => {
        console.log('Form submitted successfully:', data);
        if (data.startsWith('Added')){
          var frm = document.getElementById('motForm');
          frm.reset(); 
        }
        element = document.getElementById('message');
        element.innerText = data;
        // Add any additional logic or feedback here
    })
    .catch(error => {
        alert(error);
        console.error('Error submitting form:', error);
        // Handle errors or provide user feedback
    });
    return false;
}