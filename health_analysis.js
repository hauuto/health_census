var report = document.getElementById('report');
var btnSearch = document.getElementById('btnSearch');
var patientList = [];
var addPatientButton = document.getElementById('addPatient');
if (addPatientButton) {
    addPatientButton.addEventListener('click', addPatient);
}
else {
    console.error('Element with ID "addPatient" not found.');
}
function generateReport() {
    var patientNum = patientList.length;
    var conditionCount = {
        Diabetes: 0,
        Thyroid: 0,
        "High BP": 0,
    };
    var genderConditionCount = {
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
    for (var _i = 0, patientList_1 = patientList; _i < patientList_1.length; _i++) {
        var patient = patientList_1[_i];
        conditionCount[patient.condition]++;
        genderConditionCount[patient.gender][patient.condition]++;
    }
    report.innerHTML = " Total Patients: ".concat(patientNum, " <br>");
    report.innerHTML += "Condition Breakdown: <br>";
    for (var condition in conditionCount) {
        report.innerHTML += "".concat(condition, ": ").concat(conditionCount[condition], " <br>");
    }
    report.innerHTML += "Gender Condition Breakdown: <br>";
    for (var gender in genderConditionCount) {
        report.innerHTML += "".concat(gender, ": <br>");
        for (var condition in genderConditionCount[gender]) {
            report.innerHTML += "&nbsp;&nbsp;&nbsp;&nbsp;".concat(condition, ": ").concat(genderConditionCount[gender][condition], " <br>");
        }
    }
}
function resetForm() {
    document.getElementById('name').value = '';
    document.getElementById('age').value = '';
    document.getElementById('condition').value = '';
    document.querySelector('input[name]').checked = false;
}
function addPatient() {
    var name = document.getElementById('name').value;
    var age = document.getElementById('age').value;
    var gender = document.querySelector('input[name="gender"]:checked').value;
    var condition = document.getElementById('condition').value;
    if (name && age && gender && condition) {
        patientList.push({
            name: name,
            gender: gender,
            age: age,
            condition: condition
        });
        resetForm();
        generateReport();
    }
}
function searchCondition() {
    var input = document.getElementById('conditionInput').value;
    var resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';
    fetch("health_analysis.json")
        .then(function (response) { return response.json(); })
        .then(function (data) {
        var condition = data.conditions.find(function (item) { return item.name.toLowerCase() === input.toLowerCase(); });
        if (condition) {
            var symptoms = condition.symptoms.join(', ');
            var prevention = condition.prevention.join(', ');
            var treatment = condition.treatment;
            resultDiv.innerHTML += "<h2>".concat(condition.name, "</h2>");
            resultDiv.innerHTML += "<img src = \"".concat(condition.image, "\" alt = \"").concat(condition.name, "\" width = \"200\" height = \"200\">");
            resultDiv.innerHTML += "<p><strong>Symptoms:</strong> ".concat(symptoms, "</p>");
            resultDiv.innerHTML += "<p><strong>Prevention:</strong> ".concat(prevention, "</p>");
            resultDiv.innerHTML += "<p><strong>Treatment:</strong> ".concat(treatment, "</p>");
        }
        else {
            resultDiv.innerHTML += "<p>Condition not found</p>";
        }
    })
        .catch(function (error) {
        console.error('Error:', error);
        resultDiv.innerHTML += "<p>Unable to fetch data</p>";
    });
}
btnSearch.addEventListener('click', searchCondition);
