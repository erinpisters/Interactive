function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample 
    var metaData = `/metadata/${sample}`;
    d3.json(metaData).then(function(response){

    // Use d3 to select the panel with id of `#sample-metadata`
    var panelData = d3.select('#sample-metadata');

    // Use `.html("") to clear any existing metadata
    panelData.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(response).forEach(function ([key, value]) {
      console.log(key, value);
      var row = panelData.append("panel-body");
      row.text(`${key}: ${value}`);
    });
    
    });
  }
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);


function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var sampleData = `/samples/${sample}`;
  d3.json(sampleData).then(function(response){
  
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var topTen = response.otu_ids.slice(0,10);
    var topOtuLabel = response.otu_labels.slice(0,10);
    var topTenSample = response.sample_values.slice(0,10);

    //Start building pie chart    
    var data = [{
      "values": topTen,
      "labels": topTenSample,
      "hovertext": topOtuLabel,
      "type": "pie"
    }];

    var layout = {
      height: 600,
      width: 800,
      showlegend: true,
      legend: {
        x:1,
        y:1
      }
    };

    Plotly.newPlot('pie', data, layout);
  

  //Slice to grab for Bubble Chart
 // d3.json(sampleData).then(function(response){
    var bubbleIds = response.otu_ids;
    var bubbleLabels = response.otu_labels;
    var bubbleSample = response.sample_values;

    var bubChartData = [{
      mode: 'markers',
      x: bubbleIds,
      y: bubbleSample,
      text: bubbleLabels,
      marker: {color: bubbleIds, size: bubbleSample}
    }];

    var layout = {
      showlegend: false,
      height: 600,
      width: 1200
    };

    Plotly.newPlot('bubble', bubChartData, layout);
  
}); 
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
