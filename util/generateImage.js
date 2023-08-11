
const image_types = {
    0:"MachineLearning",
    1:"ArtificialIntelligence",
    2:"ComputerSecurity",
    3:"WorldInDrop",
    4:"YellowSmoke",
    5:"Summer",
    6:"Help",
    7:"Lock",
    8:"NetworkMan",
    9:"City",
    10:"Network",
    11:"Solder",
    12:"Work",
    13:"Nurse",
    14:"Can",
    15:"Comp",
    16:"Crowd",
    17:"Dock",
    18:"Icecream",
    19:"Palm",
    20:"Pineapple",
    21:"Travel",
    22:"Waterfall",
    23:"Hands",
    24:"Aussie",
    25:"ComputerCoffee",
    26:"Corg", 
    27:"DeskNight",
    28:"DeskPlant", 
    29:"DogLug",
    30:"Pood",
    31:"SunDog", 
    32:"WorkPreview",
    33:"Default"
}


const changeImage = () => {
    const randomNumber = Math.floor(Math.random() * 24);
    const image_type = image_types[randomNumber]
   
    return image_type
} 

export default changeImage;