# CSV Kodutöö

Käivitamiseks kasuta `npm start`.

- Tervet faili sisu saab vaadata lingilt http://localhost:3000/spare-parts
- Igat lehekülge saab vaadata lingilt http://localhost:3000/spare-parts?page=1 
  - Lehekülge saab vahetada muutes ../?page={x}
- Nime järgi otsimine tervest failist käib selle lingi järgi http://localhost:3000/spare-parts?name=polt
- Nime järgi otsimine kindlalt leheküljelt käib selle lingi järgi http://localhost:3000/spare-parts?page=80&name=Mutter
- Terve faili sorteerimine käib järgnevalt:
  - Hinna järgi kasvavalt http://localhost:3000/spare-parts?sort=price
  - Hinna järgi kahanevalt http://localhost:3000/spare-parts?sort=-price
  - Nime järgi kasvavalt http://localhost:3000/spare-parts?sort=name
  - Nime järgi kahanevalt http://localhost:3000/spare-parts?sort=-name
