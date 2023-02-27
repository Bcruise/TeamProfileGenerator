const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const generateTeam = require("./src/page-template.js");

// TODO: Write Code to gather information about the development team members, and render the HTML file.


// inquirer questions for team manager details
const teamManagerQuestions = [
  {
    type: "input",
    name: "TeamManagersName",
    message: "Please enter the Team Managers name: ",
  },
  {
    type: "input",
    name: "TeamManagersId",
    message: "Please enter the Team Managers ID: ",
  },
  {
    type: "input",
    name: "TeamManagersEmailAddress",
    message: "Please enter the Team Managers email address: ",
  },
  {
    type: "input",
    name: "TeamManagersOfficeNumber",
    message: "Please enter the Team Managers office number: ",
  }
];

// select create and engineer, create intern, or finish building team
const optionQuestion = [
  {
    type: "list",
    name: "WhichOptionsNext",
    question: "Would you like to....",
    choices: ["Add an Engineer", "Add an Intern", "Finish building team"],
  },
];

// inquirer questions for engineer details
const engineerQuestions = [
  {
    type: "input",
    name: "EngineersName",
    message: "Please enter the Engineers name: ",
  },
  {
    type: "input",
    name: "EngineersId",
    message: "Please enter the Engineers ID: ",
  },
  {
    type: "input",
    name: "EngineersEmailAddress",
    message: "Please enter the Engineers email address: ",
  },
  {
    type: "input",
    name: "EngineersGitHub",
    message: "Please enter the Engineers GitHub username: ",
  },
];

// inquirer questions for intern details
const internQuestions = [
  {
    type: "input",
    name: "InternsName",
    message: "Please enter the Interns name: ",
  },
  {
    type: "input",
    name: "InternsId",
    message: "Please enter the Interns ID: ",
  },
  {
    type: "input",
    name: "InternsEmailAddress",
    message: "Please enter the Interns email address: ",
  },
  {
    type: "input",
    name: "InternsSchool",
    message: "Please enter the Interns School: ",
  },
];

// array to hold each time member class
const teamMembers = [];

// provide option questions, then ask engineer questions if selected, then intern questions if selected
async function optionsFunction() {
  while (optionQuestion.WhichOptionsNext !== "Finish building team") {
    let options = await inquirer.prompt(optionQuestion);
    // prompt to ask engineer questions
    if (options.WhichOptionsNext == "Add an Engineer") {
      await inquirer.prompt(engineerQuestions).then(async(engineerAnswers) => {
        // set engineer class
        let engineer = new Engineer(engineerAnswers.EngineersName, engineerAnswers.EngineersId, engineerAnswers.EngineersEmailAddress, engineerAnswers.EngineersGitHub, 'Engineer');
        teamMembers.push(engineer);
      });
    // prompt to ask intern questions
    } else if (options.WhichOptionsNext == "Add an Intern") {
      await inquirer.prompt(internQuestions).then(async(internAnswers) => {
        //set intern class
        let intern = new Intern(internAnswers.InternsName, internAnswers.InternsId, internAnswers.InternsEmailAddress, internAnswers.InternsSchool, 'Intern');
        teamMembers.push(intern);        
      });
    } else {
        break;
    }
  }
};

async function init() {
  try {
    // prompt for manager questions first
    inquirer.prompt(teamManagerQuestions).then(async(managerAnswers) => {
      //set manager class
      const manager = new Manager(managerAnswers.TeamManagersName, managerAnswers.TeamManagersId, managerAnswers.TeamManagersEmailAddress, managerAnswers.TeamManagersOfficeNumber, 'Manager');
      teamMembers.push(manager);
      await optionsFunction();
      //send to path-template.js to create html 
      const toGenerateHTML = generateTeam(teamMembers);
      //write file and send to output folder
      fs.writeFileSync(outputPath, toGenerateHTML);
    });     
    
  } catch (err) {
    throw err;
  }
}

init();