/* Function to get data and return array with objects. */
const getData = async () => {
  const response = await fetch("data-victim.csv")
  const data = await response.text()

  /* Split by rows and remove header. */
  const table = data.split("\n").slice(1)

  /* Create an array with crimeobjects. */
  const crimeArray = []

  table.forEach(row => {
    const columns = row.split(";")
    const crime = columns[4].slice(1, -1)
    const year = parseInt(columns[3].slice(1, -1))
    const maleVictim = parseInt(columns[5])
    const femaleVictim = parseInt(columns[6])

    const crimeObject = {
      crime,
      year,
      maleVictim,
      femaleVictim
    }

    crimeArray.push(crimeObject)
  })
  
  /* Create an array with crimeobject merged by crime name. */
  const crimeNames = []
  const crimeObjectsMerged = []

  /* Get unique crime names. */
  crimeArray.forEach(obj => {
    if (crimeNames.includes(obj.crime) == false) {
      crimeNames.push(obj.crime)
    }
  })
  
  /* Filter and merge by crime name. Push into new array. */
  crimeNames.forEach(crimeName => {
    const tempArray = crimeArray.filter(obj => obj.crime == crimeName)
    
    const tempObject = {
      crime: crimeName,
      year: [],
      maleVictim: [],
      femaleVictim: [],
    }

    tempArray.forEach(obj => {
      tempObject.year.push(obj.year)
      tempObject.maleVictim.push(obj.maleVictim)
      tempObject.femaleVictim.push(obj.femaleVictim)
    })

    crimeObjectsMerged.push(tempObject)
  })
  
  /* Return new array with merged objecst. */
  return crimeObjectsMerged
}

/* Function to plot data in bar chart. Takes crime name as parameter. */
const barchartCrimeData = async ([crime, canvas]) => {
  const crimeObjectsMerged = await getData()

  /* Create variable. */
  let crimeToChart = ""

  /* Find crime-obj with parameter and assign to variable. */
  crimeObjectsMerged.forEach(obj => {
    if (obj.crime.toLowerCase().includes(crime.toLowerCase())) {
      crimeToChart = obj
    }
  })

  const ctx = document.getElementById(canvas).getContext("2d")
  const chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: crimeToChart.year,
      datasets: [{
        label: "Miespuolinen uhri",
        data: crimeToChart.maleVictim,
        borderWidth: 0,
        backgroundColor: "rgb(66, 182, 245)"
      }, {
        label: "Naispuolinen uhri",
        data: crimeToChart.femaleVictim,
        borderWidth: 0,
        backgroundColor: "rgb(255, 155, 255)"
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        title: {
          display: true,
          text: crimeToChart.crime
        }
      }
    }
  })  
}

/* Function to populate dropdown menu on last page. */
const populateDropdown = async () => {
  const crimeObjectsMerged = await getData()

  const selector = document.getElementById("dropdown")

  crimeObjectsMerged.forEach(obj => {
    const option = document.createElement("option")
    option.value = obj.crime
    option.innerText = obj.crime
    selector.appendChild(option)
  })
}

/* Event listener listening for changes in dropdown menu on last page. */
document.getElementById("dropdown").onchange = () => {
  plotAnyChart()
}

/* Function to plot any chart on last page. */
const plotAnyChart = async () => {
  const crimeToPlot = document.getElementById("dropdown").value
  const chartStatus = Chart.getChart("canvas")
  if (chartStatus != undefined) {
    chartStatus.destroy()
  }
  barchartCrimeData([crimeToPlot, "canvas"]) 
}

/* Populate dropdown menu. */
populateDropdown()