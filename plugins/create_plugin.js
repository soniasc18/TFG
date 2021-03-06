/**
 * CLI para crear un plugin automáticamente
 * yarn run create-plugin help
 */

import path from 'path';
import fs from 'fs';
const LANGS = ["en", "es"];
const BASE = "plugins/";
let options = {
    name: "",
    displayName: "",
    category: "multimedia",
    visor: true,
    isRich: false,
};

const cats = ["text", "image", "media", "object", "evaluation"];
function p(text) {
    // eslint-disable-next-line no-console
    console.log(text);
}

function help() {
    p(`       
Uso: yarn run create-plugin \"Nombre del plugin\" <opciones>
 o bien : npm run create-plugin -- \"Nombre del plugin\"  <opciones> 
 
Opciones: 
 no-visor:              Plugin sin definir para el visor 
 rich:                  Plugin enriquecido 
 category <categoría>:  Categoría del plugin ["text", "image", "media", "object", "evaluation"]                   
`);
}
function toCamelCase(str) {
    return str.toLowerCase()
        .replace(/[-_]+/g, ' ')
        .replace(/[^\w\s]/g, '')
        .replace(/ (.)/g, function($1) { return $1.toUpperCase(); })
        .replace(/ /g, '');
}

function parseArgs(args) {
    if (!args || args.length < 3) {
        p("Es obligatorio ponerle un nombre al plugin");
        p("Escribe 'npm run create-plugin help' para más información");
        return;
    }
    if (args[2] === "help") {
        help();
        return;
    }
    let bad = false;
    args.forEach(function(val, index, array) {
        if (index === 2) {
            p("Creando plugin: " + val);
            options.name = val.split(" ").join("");
            options.camelCaseName = toCamelCase(val);
            options.displayName = val;
        } else if (index > 2) {
            switch(val) {
            case "no-visor":
                options.visor = false;
                break;
            case "category":
                if(index < args.length) {
                    options.category = args[index + 1];
                }
                if (cats.indexOf(options.category) === -1) {
                    bad = true;
                    p("La categoría '" + options.category + "' no existe. Las categorías disponibles son: text, image, media, object, evaluation"); }
                break;
            case "rich":
                options.isRich = true;
                break;
            default:
                if(index >= 1 && args[index - 1] !== 'category') {
                    p("Opción " + val + " no reconocida");
                    bad = true;
                }
                break;
            }
        }
    });
    if (bad) {
        return;
    }
    p("Opciones:");
    p(options);
    createPlugins();

}

function createPlugins() {
    let dir = BASE + options.name;
    if(!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
        fs.writeFileSync(dir + "/" + options.name + ".js", options.category === "evaluation" ? templateExercise() : template());
        fs.mkdirSync(dir + "/locales");
        for (let l in LANGS) {
            fs.writeFileSync(dir + "/locales/" + LANGS[l] + ".js", locales());
        }
        if(options.visor) {
            fs.mkdirSync(dir + "/visor");
            fs.writeFileSync(dir + "/visor/" + options.name + ".js", options.category === "evaluation" ? templateExerciseVisor() : visorTemplate());
        }
        if (options.category === "evaluation") {
            fs.writeFileSync(dir + "/_" + options.camelCaseName + ".scss", templateExerciseSCSS());
        }
        p("Plugin creado!");
        p("Accede a core/config.es6 y añade " + options.name + ' a pluginList');
    } else {
        p("Ya existe un directorio con el nombre " + options.name);
        p("Escoja otro nombre para el plugin o borre el directorio existente");
        return;
    }

}

function template() {
    return `import React from 'react';
import i18n from 'i18next';
${options.isRich ? `
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import MarkEditor from '../../_editor/components/rich_plugins/mark_editor/MarkEditor';
import Mark from '../../common/components/mark/Mark';

` : ''}

/* eslint-disable react/prop-types */
export function ${options.name}(base) {
    return {
        getConfig: function() {
            return {
                name: '${options.name}',
                displayName: i18n.t('${options.name}.PluginName'),
                category: "${options.category}",
                flavor: "react",
                needsConfigModal: false,
                needsTextEdition: false,
                initialWidth: '480px',
                initialHeight: "270px",
                initialWidthSlide: '30%',
                initialHeightSlide: '30%',
                icon: 'label',
                ${options.isRich ? "isRich: true," : ""}
                ${options.isRich ? "marksType: [{ name: 'Mark', key: 'value', format: '[x,y]', default: '50,50', defaultColor: '#222222' }]," : ""}
            };
        },
        getToolbar: function(state) {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        basic: {
                            __name: 'Config',
                            icon: 'link',
                            buttons: {
                                name: {
                                    __name: 'Config',
                                    type: 'text',
                                    value: state.name,
                                    autoManaged: false,
                                },
                            },
                        },
                    },
                },
            };
        },
        getInitialState: function() {
            return {
                name: "Ediphy",
            };
        },
        getRenderTemplate: function(state, props) {
        ${options.isRich ? `
            let marks = props.marks || {};
            let markElements = Object.keys(marks).map((id) =>{
                let value = marks[id].value;
                let title = marks[id].title;
                let color = marks[id].color;

                let position;
                if (value && value.split(',').length === 2) {
                    position = value.split(',');
                } else{
                    position = [0, 0];
                }
                return (
                    <MarkEditor key={id} style={{ position: 'absolute', top: position[0] + "%", left: position[1] + "%" }} time={1.5} onRichMarkMoved={props.onRichMarkMoved} mark={id} base={base} marks={marks} state={state}>
                        <Mark style={{ position: 'absolute', top: position[0] + "%", left: position[1] + "%" }} color={color} idKey={id} title={title} />
                    </MarkEditor>
                );
            });
           ` : ``}
            return (<div style={{ height: "100%", width: "100%" }} className="dropableRichZone">
                Hello {state.name} 
                ${options.isRich ? '{markElements}' : ''}
            </div>);

        },
         
        ${options.isRich ? `
        parseRichMarkInput: function(...value) {
            let x = (value[0] + 12) * 100 / value[2];
            let y = (value [1] + 26) * 100 / value[3];
            let finalValue = y.toFixed(2) + "," + x.toFixed(2);

            return finalValue;
        },
        getDefaultMarkValue(state) {
            return 50 + ',' + 50;
        },
        getRichMarkInput: function(state, MarkInput) {
            let div = <div><span>x,y</span><input onChange={(event)=>{MarkInput(event.target.value);}} /></div>;
            return div;
        },
        validateValueInput: function(value) {
            let regex = /(^-*\\d+(?:\\.\\d*)?),(-*\\d+(?:\\.\\d*)?$)/g;
            let match = regex.exec(value);
            if(match && match.length === 3) {
                let x = Math.round(parseFloat(match[1]) * 100) / 100;
                let y = Math.round(parseFloat(match[2]) * 100) / 100;
                if (isNaN(x) || isNaN(y)/* || x > 100 || y > 100 || x < -100 || y < -100*/) {
                    return { isWrong: true, message: "404" };
                }
                value = x + ',' + y;
            } else {
                return { isWrong: true, message: "404" };
            }
            return { isWrong: false, value: value };
        },

            ` : ``}
        
        
    };
}
/* eslint-enable react/prop-types */
`;
}
function locales() {
    return `
module.exports = {
    "${options.name}": {
        "PluginName": "${options.displayName}",
        ${options.category === "evaluation" ? (
        `"content_box_name": "Content ",
        "Statement": "This is a Multiple Choice question with a single correct answer. You can write here the question statement",
        "Question": "Question",
        "Feedback": "Feedback",
        "FeedbackMsg": "Here you can provide some feedback about the answer",
        "ShowFeedback": "Show feedback",
        "Number": "Number  of answers",
        "ShowLettersInsteadOfNumbers": "Show letters instead of numbers",
        "background_color": "Background color",
        "border_color": "Border color",
        "border_size": "Border Size",
        "border_style": "Border Style",
        "box_style": "Box style",
        "opacity": "Opacity",
        "padding": "Padding",
        "pos": "Position",
        "radius": "Radius",
        "source": "Fuente",
        "Answer": "Answer",
        "Number": "Number",`) :
        (``)}
    },
};
`;
}

function visorTemplate() {
    return `
import React from 'react';
${options.isRich ? `
import Mark from '../../../common/components/mark/Mark';

` : ''}
/* eslint-disable react/prop-types */
export function ${options.name}(base) {

    return {
        getRenderTemplate: function(state, props) {
            ${options.isRich ? `
            let marks = props.marks || {};
            let box_id = props.id;
    
            let markElements = Object.keys(marks).map((e) =>{
            let position = marks[e].value.split(',');
            let title = marks[e].title;
            let color = marks[e].color;
            let isPopUp = marks[e].connectMode === "popup";
            let isVisor = true;
            return(
                <div key={e} style={{ position: 'absolute', top: position[0] + "%", left: position[1] + "%", width: '24px', height: '26px' }}>
                    <Mark color={color}
                        idKey={e}
                        title={title}
                        isPopUp={isPopUp}
                        isVisor={isVisor}
                        markConnection={marks[e].connection}
                        markValue={marks[e].value}
                        boxID={box_id}
                        onMarkClicked={props.onMarkClicked}/></div>
            );
        });` : ''}
            return <div style={{ height: "100%", width: "100%" }} >Hello {state.name}
            ${options.isRich ? `{markElements}` : ``}
            </div>
        }
    };
}
/* eslint-enable react/prop-types */

`;
}

function templateExercise() {
    return `import React from 'react';
import PluginPlaceholder from '../../_editor/components/canvas/plugin_placeholder/PluginPlaceholder';
import './_${options.camelCaseName}.scss';
import i18n from 'i18next';
import { letterFromNumber } from '../../common/common_tools';
/* eslint-disable react/prop-types */

export function ${options.name}(base) {
    return {
        getConfig: function() {
            return {
                name: '${options.name}',
                displayName: Ediphy.i18n.t('${options.name}.PluginName'),
                category: 'evaluation',
                icon: 'school',
                initialWidth: '60%',
                flavor: 'react',
                isComplex: true,
                defaultCorrectAnswer: 0,
                defaultCurrentAnswer: false,
            };
        },
        getToolbar: function(state) {
            return {
                main: {
                    __name: "Main",
                    accordions: {
                        __score: {
                            __name: i18n.t('configuration'),
                            icon: 'build',
                            buttons: {
                                nBoxes: {
                                    __name: i18n.t("${options.name}.Number"),
                                    type: 'number',
                                    value: state.nBoxes,
                                    min: 1,
                                    autoManaged: false,
                                },
                                showFeedback: {
                                    __name: i18n.t("${options.name}.ShowFeedback"),
                                    type: 'checkbox',
                                    checked: state.showFeedback,
                                },
                                letters: {
                                    __name: i18n.t("${options.name}.ShowLettersInsteadOfNumbers"),
                                    type: 'checkbox',
                                    checked: state.letters,
                                },
                            },
                        },
                        style: {
                            __name: Ediphy.i18n.t('${options.name}.box_style'),
                            icon: 'palette',
                            buttons: {
                                padding: {
                                    __name: Ediphy.i18n.t('${options.name}.padding'),
                                    type: 'number',
                                    value: 10,
                                    min: 0,
                                    max: 100,
                                },
                                backgroundColor: {
                                    __name: Ediphy.i18n.t('${options.name}.background_color'),
                                    type: 'color',
                                    value: '#ffffff',
                                },
                                borderWidth: {
                                    __name: Ediphy.i18n.t('${options.name}.border_size'),
                                    type: 'number',
                                    value: 1,
                                    min: 0,
                                    max: 10,
                                },
                                borderStyle: {
                                    __name: Ediphy.i18n.t('${options.name}.border_style'),
                                    type: 'select',
                                    value: 'solid',
                                    options: ['none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset', 'initial', 'inherit'],
                                },
                                borderColor: {
                                    __name: Ediphy.i18n.t('${options.name}.border_color'),
                                    type: 'color',
                                    value: '#dbdbdb',
                                },
                                borderRadius: {
                                    __name: Ediphy.i18n.t('${options.name}.radius'),
                                    type: 'number',
                                    value: 0,
                                    min: 0,
                                    max: 50,
                                },
                                opacity: {
                                    __name: Ediphy.i18n.t('${options.name}.opacity'),
                                    type: 'range',
                                    value: 1,
                                    min: 0,
                                    max: 1,
                                    step: 0.01,
                                },
                            },
                        },
                    },
                },
            };
        },
        getInitialState: function() {
            return {
                nBoxes: 3,
                showFeedback: true,
                letters: true,
            };
        },
        getRenderTemplate: function(state, props = {}) {
            let answers = [];
            for (let i = 0; i < state.nBoxes; i++) {
                let clickHandler = (e)=>{
                    props.setCorrectAnswer(parseInt(e.target.value, 10));
                };
                answers.push(<div key={i + 1} className={"row answerRow"}>
                    <div className={"col-xs-2 answerPlaceholder"}>
                        <div className={"answer_letter"} >{state.letters ? letterFromNumber(i) : (i + 1)}</div>
                        <input type="radio" className="radioQuiz" name={props.id} value={i} checked={props.exercises.correctAnswer === i /* ? 'checked' : 'unchecked'*/ }
                            onChange={clickHandler} />
                    </div>
                    <div className={"col-xs-10"}>
                        <PluginPlaceholder {...props} key={i + 1} plugin-data-display-name={i18n.t("${options.name}.Answer") + " " + (i + 1)} plugin-data-default="BasicText" plugin-data-text={'<p>' + i18n.t("${options.name}.Answer") + " " + (1 + i) + '</p>'} pluginContainer={"Answer" + i} />
                    </div>
                </div>
                );
            }
            return <div className={"exercisePlugin ${options.camelCaseName}Plugin"}>
                <div className={"row"} key={0}>
                    <div className={"col-xs-12"}>
                        <PluginPlaceholder {...props} key="1" plugin-data-display-name={i18n.t("${options.name}.Question")} plugin-data-default="BasicText" plugin-data-text={'<p>' + i18n.t("${options.name}.Statement") + '</p>'} pluginContainer={"Question"} />
                    </div>
                </div>
                {answers}
                <div className={"row feedbackRow"} key={-2} style={{ display: state.showFeedback ? 'block' : 'none' }}>
                    <div className={"col-xs-12 feedback"}>
                        <PluginPlaceholder {...props} key="-2" plugin-data-display-name={i18n.t("${options.name}.Feedback")} plugin-data-default="BasicText" plugin-data-text={'<p>' + i18n.t("${options.name}.FeedbackMsg") + '</p>'} pluginContainer={"Feedback"} />
                    </div>
                </div>
            </div>;

        },
    };
}
/* eslint-enable react/prop-types */

`;
}

function templateExerciseVisor() {
    return `import React from 'react';
import VisorPluginPlaceholder from '../../../_visor/components/canvas/VisorPluginPlaceholder';
import i18n from 'i18next';
import { letterFromNumber } from '../../../common/common_tools';
import { compareNumbersLiterally } from '../../../core/visor/correction_functions';

/* eslint-disable react/prop-types */

export function ${options.name}() {
    return {
        getRenderTemplate: function(state, props) {
            let content = [];
            let attempted = props.exercises && props.exercises.attempted;
            let score = props.exercises.score || 0;
            score = Math.round(score * 100) / 100;
            score = (score) + "/" + (props.exercises.weight || 0);
            let showFeedback = attempted && state.showFeedback;
            for (let i = 0; i < state.nBoxes; i++) {
                let correct = attempted && props.exercises.correctAnswer === i; // && props.exercises.currentAnswer === i ;
                let incorrect = attempted && (/* (props.exercises.correctAnswer === i && props.exercises.currentAnswer !== i)||*/(props.exercises.correctAnswer !== i && props.exercises.currentAnswer === i));
                let checked = props.exercises.currentAnswer === i; //  (attempted && props.exercises.correctAnswer === i) || (!attempted && props.exercises.currentAnswer === i)
                content.push(
                    <div key={i + 1} className={"row answerRow " + (correct ? "correct " : " ") + (incorrect ? "incorrect " : " ")}>
                        <div className={"col-xs-2 answerPlaceholder"}>
                            <div className={"answer_letter"} >{state.letters ? letterFromNumber(i) : (i + 1)}</div>
                            <input type="radio" disabled={attempted} className="radioQuiz" name={props.id}
                                value={i} checked={ checked}
                                onChange={(e)=>{
                                    props.setAnswer(parseInt(e.target.value, 10));
                                }}/>
                        </div>
                        <div className={"col-xs-10"} onClick={(e)=>{props.setAnswer(parseInt(i, 10));}}>
                            <VisorPluginPlaceholder {...props} key={i + 1} pluginContainer={"Answer" + i} />
                        </div>
                        <i className={ "material-icons " + (correct ? "correct " : " ") + (incorrect ? "incorrect " : " ")} style={{ display: (correct || incorrect) ? "block" : "none" }}>{(correct ? "done " : "clear")}</i>
                    </div>);

            }

            return <div className={"exercisePlugin ${options.camelCaseName}Plugin" + (attempted ? " attempted " : " ") + (props.exercises.showFeedback ? "showFeedback" : "")}>
                <div className={"row"} key={0} >
                    <div className={"col-xs-12"}>
                        <VisorPluginPlaceholder {...props} key="0" pluginContainer={"Question"}/>
                    </div>
                </div>
                {content}
                <div className={"row feedbackRow"} key={-2} style={{ display: showFeedback ? 'block' : 'none' }}>
                    <div className={"col-xs-12 feedback"}>
                        <VisorPluginPlaceholder {...props} key="0" pluginContainer={"Feedback"}/>
                    </div>
                </div>
                <div className={"exerciseScore"}>{score}</div>
            </div>;
        },
        checkAnswer(current, correct) {
            return compareNumbersLiterally(current, correct);

        },             
    };
}
/* eslint-enable react/prop-types */
`;
}

function templateExerciseSCSS() {
    return `@import "../../sass/general/_variables.scss";

.${options.camelCaseName}Plugin {
   padding: 10px;
  .answerPlaceholder {
    display: flex;
    font-size: 24px;
    margin: 5px 10px;
    text-align: right;
    color: $blueprimarydark;
    padding: 0;
    width: auto;
    .answer_letter{
      color: white;
      background-color: #00ad9c;
      border-radius: 15px;
      width: 30px;
      height: 30px;
      text-align: center;
      line-height: 1.1em;
      font-weight: 100;
      text-transform: uppercase;
      padding: 4px 0px;
      font-size: 20px;
    }
    .radioQuiz {
      transform: scale(1.3);
      margin: 7px 10px 7px 15px;
    }
  }
  .answerRow {
    margin: 0;
    .col-xs-10{
      padding: 0;
      width: 75%;
    }
    i{
      margin: 7px -15px;
      &.correct{
        color: $detailgreen;
      }
      &.incorrect{
        color: $lightred;
      }
    }
  }
  .exerciseScore {
    display: none;
    text-align: right;
  }
  &.attempted  .exerciseScore{
    display: block;
    color: $blueprimary;
    font-size: 10px;
  }

  &.attempted.showFeedback .answerRow {
    margin-top: 2px;
    padding: 0;
      &.correct {
        background-color: $detailgreentransparent;
      }

      &.incorrect {
        background-color: $lightredtransparent;
      }
  }
  .feedbackRow {
    padding: 10px 0;
    margin:0;
    .feedback {
      background-color: $blueprimarytransparent;
      color: $blueprimary;
      margin:0;
      padding:0;
      border: 1px solid $blueprimary;
      border-radius: 3px;
    }
  }
}

`;

}

parseArgs(process.argv);
