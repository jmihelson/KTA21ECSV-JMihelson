const express = require('express')
const app = express()
const port = 3000
const fs = require("fs")

let csvFile = fs.readFileSync("LE.csv")
//Teen iga rea list elemendiks
let array = csvFile.toString().split("\n");

app.get('/spare-parts', (req, res) => {

  //Need on query parameetrid
  let page = req.query.page;
  let name = req.query.name;
  let price = req.query.price;
  let sort = req.query.sort

  if(sort)
  {
    res.send(sortItem(getDB(page,name,price),sort))
    return;
  }

  if(name)
  {
    res.send(findItem(getDB(page,name,price),name));
    return;
  }

  res.send(getDB(page,name,price));

})

//#region  Generate Csv

//Loon JSON listi kasutades antud csv faili
function getDB(page,name,price){
  
  let jsonDB = [];
  let itemsPerPage =page?10:array.length;
  let startLoop = page?page*itemsPerPage-itemsPerPage:0;
  let defaultEnd = itemsPerPage+startLoop;

  //Määran lõpp punkti. Kui pole võimalik kuvada 10 toodet siis vaadatakse mitme võrra toodete kogus üle
  //läks ning see lahutatakse
  let endLoop = defaultEnd>array.length?defaultEnd-(defaultEnd-array.length):defaultEnd;

  //Võtan csv'st saadud listi väärtuse ning teen selle omakorda listiks, kasutades "tab" asukohta 
  for(let i = startLoop; i<endLoop;i++)
  {
    let item = array[i].trim();
    let trimItem =  item.split('\t');
    jsonDB.push(makeJson(trimList(trimItem)));
  }

  return jsonDB.length==0?"Pole ühtegi toodet, mida kuvada":jsonDB;
}

//Kuna teksti sisse jäid ka jutumärgid, siis eemaldan need siin
function trimList(myList)
{
  let result = [];

  for(let i =0;i<myList.length;i++)
  {
    result.push(myList[i].slice(1,-1).trim())
  }

  return result;
}

//Võtan korrastatud listi ning lisan väärtused. Pole kindel, mida need kõik väärtused endast kujutasid, siis ei teadnud kuidas neid nimetada
//Aga "Koodi", "Nime", "Mudeli"(vist) ja "Hinna" sain paika
function makeJson(list)
{

  //Et saada komaga arv ma kasutan parseFloat'i ning asendan koma punktiga. Muidugi need võivad jääda ka tekstiks, aga mulle meeldib nii.
  let jsonResult = 
  {
    "code": "",
    "name":"",
    "idk1":0,
    "idk2":0,
    "idk3":0,
    "idk4":0,
    "idk5":0,
    "idk6":"",
    "idk7":0,
    "model":0,
    "price":0
  }
    jsonResult.code = list[0];
    jsonResult.name = list[1];
    jsonResult.idk1 = parseFloat(list[2].replace(/,/g, '.'));
    jsonResult.idk2 = parseFloat(list[3].replace(/,/g, '.'));
    jsonResult.idk3 = parseFloat(list[4].replace(/,/g, '.'));
    jsonResult.idk4 = parseFloat(list[5].replace(/,/g, '.'));
    jsonResult.idk5 = parseFloat(list[6].replace(/,/g, '.'));
    jsonResult.idk6 = list[7];
    jsonResult.idk7 = parseFloat(list[8].replace(/,/g, '.'));
    jsonResult.model = list[9];
    jsonResult.price = parseFloat(list[10].replace(/,/g, '.'));
    
    return jsonResult;
}
//#endregion

//#region Filtering and sorting
function findItem(jsonList,name)
{
  const result = jsonList.filter(x => x.name == name)
  return result.length == 0 ? `"${name}" nimega toodet ei leitud`:result
}

//Nime järgi sorteerides pole teinud kontrolli kas nimes on täht või mitte. Paljudes nimedes on arve ja sümboleid
function sortItem(jsonList,sort)
{
  switch(sort)
  {
    case "price":
      return jsonList.sort((a,b)=>a.price - b.price)

    case "name":
      let sortedListASC = jsonList.sort((a, b) => {
        if (a.name < b.name) {
            return -1;
        }
        if (a.name> b.name) {
            return 1;
        }
        return 0;
      });
      return sortedListASC

    case "-price":
      return jsonList.sort((a,b)=>b.price - a.price)

    case "-name":
      let sortedListDESC = jsonList.sort((a, b) => {
        if (a.name < b.name) {
            return 1;
        }
        if (a.name> b.name) {
            return -1;
        }
        return 0;
      });

      return sortedListDESC

    default:
      return `Pole võimalik sorteerida "${sort}" järgi`
  }
}
//#endregion

app.listen(port, () => {
  console.log(`App is listening on port ${port}.\nVisit http://localhost:3000/spare-parts?page=1`)
})