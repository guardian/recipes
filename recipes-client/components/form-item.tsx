/** @jsx jsx */
import { Component } from "react";
import { jsx } from "@emotion/core";


function formatTitle(text: string){
    // Reformat title with first letter uppercase
    const title = text.replace('_', ' ');
    return title[0].toUpperCase() + title.slice(1);
  }

function renderInput(text: string, choices?: Array<string>|null){
  if (choices === null || choices === undefined){
    return <input css={{ minWidth: "500px" }} type="text" value={text} readOnly></input>
  } else {
    choices.unshift('null');
    return (
    <select css={{ minWidth: "500px" }} value={text}>
      {choices.map( (item) => {return <option key={item} value={item}>{item}</option>} )}
    </select>
    )
  }
}

interface FormItemProps {
    label: string|null,
    text: string,
    type: string|null,
    choices: Array<string>|null
    key: string|number
  }
  
  class FormItem extends Component<FormItemProps> {
    constructor(props: FormItemProps) {
      super(props);
    }
  
    render(): React.Component|JSX.Element {
        const label = this.props.label;
        const text = this.props.text;
        const choices = this.props.choices || null;
        if (label) {
            return (
                <p>
                    <label css={{ marginRight: "10px"}} key={label}>{formatTitle(label)}</label>
                    {renderInput(text, choices)}
                </p>
            )
        } else {
            return renderInput(text, choices)
        }
    }
  }
export default FormItem;