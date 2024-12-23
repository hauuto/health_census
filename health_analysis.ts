
const report : HTMLElement = document.getElementById('report');
const btnSearch : HTMLElement = document.getElementById('btnSearch');
const patientList = [];


const addPatientButton = document.getElementById('addPatient') as HTMLButtonElement;
if (addPatientButton) {
    addPatientButton.addEventListener('click', addPatient);
} else {
    console.error('Element with ID "addPatient" not found.');
}
function generateReport() {
    const patientNum : number = patientList.length;
    const conditionCount = {
        Diabetes: 0,
        Thyroid: 0,
        "High BP": 0,
    };
    const genderConditionCount = {
        Male: {
            Diabetes: 0,
            Thyroid: 0,
            "High BP": 0,
        },
        Female: {
            Diabetes: 0,
            Thyroid: 0,
            "High BP": 0,
        },
    };

    for (let patient of patientList) {
        conditionCount[patient.condition]++;
        genderConditionCount[patient.gender][patient.condition]++;
    }

    report.innerHTML = ` Total Patients: ${patientNum} <br>`
    report.innerHTML += `Condition Breakdown: <br>`;
    for (const condition in conditionCount) {
        report.innerHTML += `${condition}: ${conditionCount[condition]} <br>`;
    }

    report.innerHTML += `Gender Condition Breakdown: <br>`;
    for (const gender in genderConditionCount) {
        report.innerHTML += `${gender}: <br>`;
        for (const condition in genderConditionCount[gender]){
            report.innerHTML += `&nbsp;&nbsp;&nbsp;&nbsp;${condition}: ${genderConditionCount[gender][condition]} <br>`;
        }
    }
}

function resetForm() {
    (document.getElementById('name') as HTMLInputElement).value = '';
    (document.getElementById('age') as HTMLInputElement).value = '';
    (document.getElementById('condition') as HTMLInputElement).value = '';
    (document.querySelector('input[name]') as HTMLInputElement).checked = false;
}

function addPatient(){
    const name  = (document.getElementById('name') as HTMLInputElement ).value;
    const age = (document.getElementById('age') as HTMLInputElement ).value;
    const gender = (document.querySelector('input[name="gender"]:checked') as HTMLInputElement).value;
    const condition = (document.getElementById('condition') as HTMLInputElement ).value;


    if (name && age && gender && condition){
        patientList.push({
            name,gender: gender,age,condition
        });

        resetForm();
        generateReport();
    }

}

function searchCondition(){
    const input = (document.getElementById('conditionInput') as HTMLInputElement).value;
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    fetch(`health_analysis.json`)
        .then(response => response.json())
        .then(data => {
            const condition = data.conditions.find(item => item.name.toLowerCase() === input.toLowerCase());

            if (condition){
                const symptoms = condition.symptoms.join(', ');
                const prevention = condition.prevention.join(', ');
                const treatment = condition.treatment;

                resultDiv.innerHTML += `<h2>${condition.name}</h2>`;
                resultDiv.innerHTML += `<img src = "${condition.image}" alt = "${condition.name}" width = "200" height = "200">`;

                resultDiv.innerHTML += `<p><strong>Symptoms:</strong> ${symptoms}</p>`;
                resultDiv.innerHTML += `<p><strong>Prevention:</strong> ${prevention}</p>`;
                resultDiv.innerHTML += `<p><strong>Treatment:</strong> ${treatment}</p>`;


            }else {
                resultDiv.innerHTML += `<p>Condition not found</p>`;
            }

        })
        .catch(error => {
            console.error('Error:', error);
            resultDiv.innerHTML += `<p>Unable to fetch data</p>`;
        });
}
btnSearch.addEventListener('click', searchCondition);
