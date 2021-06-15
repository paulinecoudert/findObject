//This data could come from a CMS/editor/any nicer UI for editing game events
var scenarios = [
   {
      //No toys
      "required": [],
      "bypass": ["OneToy"],
      "text": "Reclic sur ton personnage pour continuer le jeu"
   },

   {
      //Any one toy
      "required": ["OneToy"],
      "bypass": ["TwoToys"],
      "text": "C'est un bon début, plus que 4 personnages",
   },
   {
      //Any two but no tarzan 
      "required": ["TwoToys"],
      "bypass": ["Tarzan", "ThreeToys"],
      "text": "C'est bien mais tu n'as pas vu Tarzan?",
   },
   {
      //Any two, one is rabbit
      "required": ["TwoToys"],
      "bypass": ["ThreeToys"],
      "text": "Il t'en reste 3",
   },
   {
      //Any four
      "required": ["ThreeToys"],
      "bypass": ["FourToys"],
      "text": "Plus que 2!",
   },
   {
      //Any four
      "required": ["FourToys"],
      "bypass": ["FiveToys"],
      "text": "Plus que un!",
   },
   {
      //All four!
      "required": ["FiveToys"],
      "bypass": [],
      "text": "Bravo tu as gagné!",
   },  
]
var computedStoryPoints = {
  "requires": [ "Monkey", "Tarzan", "Baloo", "Lion", "Perroquet" ],
  "quantities": [
     [1, "OneToy"],
     [2, "TwoToys"],
     [3, "ThreeToys"],
     [4, "FourToys"],
     [5, "FiveToys"]
  ]
}

//Functionality for click binding to add/remove story points
var toys = document.querySelectorAll(".toy");
toys.forEach(toy => {
  toy.addEventListener("click", () => {
     toy.classList.toggle("rescued");
     toggleStoryPoint( toy.getAttribute("story-point") )
     refreshScenario();
  })
});


//---------------------- Story Points ---------------------------

//Story point state mechanism
var storyPoints = {};

function toggleStoryPoint(incomingStoryPoint) {
  //Remove if we had it
  if (storyPoints[incomingStoryPoint]) {
     delete storyPoints[incomingStoryPoint]
  } else {
     //Otherwise, add it
     storyPoints[incomingStoryPoint] = true;
  }
}

function getAllKnownStoryPoints() { 
  
  //Figure out the computed story points we also own


  var acquiredCount = computedStoryPoints.requires.filter(sp => {
     return storyPoints[sp]
  }).length;
  
  var computed = {};
  computedStoryPoints.quantities.forEach(q => {
     if (acquiredCount >= q[0]) {
        computed[q[1]] = true;
     }
  })
  
  //Combine with all known story points
  return {
     ...storyPoints,
     ...computed
  }
}

//Update the view
function refreshScenario() {
  var known = getAllKnownStoryPoints();
  var scenario = scenarios.find(s => {
  
     //Validate that we don't have any bypassers
      for (var i=0; i<=s.bypass.length; i++) {
        if ( known[s.bypass[i]] ) {
           return false;
        }
     }
     
     //Validate that we have all of them
     return s.required.every(entry => known[entry])
  })
  
  document.querySelector(".js-text").textContent = scenario.text;
}