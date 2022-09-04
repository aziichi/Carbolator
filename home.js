var carbonEmissionElement;
var treesElement;

var totalCarbonEmission;

var electricity;
var gas;
var roadTravel;
var airTravel;

// $w is a namespace provided by Wix. It also lets us select elements on the website.
$w.onReady(function () {
    carbonEmissionElement = $w('#text25');
    treesElement = $w('#text24');

    totalCarbonEmission = 0;

    electricity = 0;
    gas = 0;
    roadTravel = 0;
    airTravel = 0;
});


// Function that fetches data from the Climatiq API
const fetchData = async(url, data) => {
        await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": "Bearer 5J4WKHWSWZM24WHE74ZZZECV7NCS",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
            })
            .then((response) => response.json())
            .then((json) => {
                json.results.forEach(element => totalCarbonEmission += element.co2e);

            })
            .catch((err) => console.log(`Here's the error: ${err}`));
}

// This function was attached to an onClick event listener added to the calculate button using Velo by Wix.
export async function button1_click(event) {
	
  let new_electricity = await Number.parseInt($w('#input1').value);
	let new_gas = await Number.parseInt($w('#input2').value);
	let new_roadTravel = await Number.parseInt($w('#input3').value);
	let new_airTravel = await Number.parseInt($w('#input4').value);

    if(new_electricity === electricity && new_gas === gas && new_airTravel === airTravel && new_roadTravel === roadTravel){
        return;
    }

    electricity = new_electricity;
    gas = new_gas;
    roadTravel = new_roadTravel;
    airTravel = new_airTravel;

    const electrityData = {
        emission_factor: "electricity-energy_source_grid_mix",
        parameters: {
            energy: electricity,
            energy_unit: "kWh",
        }
    }

    const gasData = {
        emission_factor: "heat-and-steam-type_cooking_natural_gas",
        parameters: {
            energy: gas,
            energy_unit: "kWh",
        }
    }

    const roadTravelData = {
            emission_factor: "passenger_vehicle-vehicle_type_black_cab-fuel_source_na-distance_na-engine_size_na",
            parameters: {
                passengers: 1,
                distance: roadTravel,
                distance_unit: "mi"
            }
    }

    const airTravelData = {
            emission_factor: "passenger_flight-route_type_domestic-aircraft_type_jet-distance_na-class_na-rf_included",
            parameters: {
                passengers: 1,
                distance: airTravel,
                distance_unit: "mi"
            }
    }
    
    await fetchData("https://beta3.api.climatiq.io/batch", [electrityData, gasData, roadTravelData, airTravelData])
    
    carbonEmissionElement.text = `${Math.round(totalCarbonEmission * 12)} Kg / Year`; 
    treesElement.text = `${Math.round(totalCarbonEmission / 21)} / Year`;

}
