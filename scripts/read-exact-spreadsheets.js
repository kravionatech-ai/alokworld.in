const path = require('path');
const xlsx = require('xlsx');

const file1 = path.join(process.cwd(), 'public', 'asset', 'listofmemberswithdesignation', 'Alok_India_National_Executive.xlsx');
const wb1 = xlsx.readFile(file1);
const sheet1 = wb1.Sheets[wb1.SheetNames[0]];
const data1 = xlsx.utils.sheet_to_json(sheet1, { header: 1 });

console.log('=== FILE 1: Alok_India_National_Executive.xlsx ===');
data1.forEach((row, idx) => {
  console.log(`[R${idx + 1}]`, JSON.stringify(row));
});

const file2 = path.join(process.cwd(), 'public', 'asset', 'listofmemberswithdesignation', 'ALL INDIA_Alok_Designation_List_Hindi_.xlsx');
const wb2 = xlsx.readFile(file2);
const sheet2 = wb2.Sheets[wb2.SheetNames[0]];
const data2 = xlsx.utils.sheet_to_json(sheet2, { header: 1 });

console.log('\n=== FILE 2: ALL INDIA_Alok_Designation_List_Hindi_.xlsx ===');
data2.forEach((row, idx) => {
  if (row && row.length > 0) {
    console.log(`[R${idx + 1}]`, JSON.stringify(row));
  }
});
