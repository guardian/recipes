/** @jsx jsx */
import { Component } from "react";
import { jsx } from "@emotion/core";


function formatTitle(text: string){
    // Reformat title with first letter uppercase
    const title = text.replace('_', ' ');
    return title[0].toUpperCase() + title.slice(1);
  }


interface FormItemProps {
    label: string|null,
    text: string,
    type: string|null,
    choices: Record<string, unknown>|null
    key: string|number
  }
  
  class FormItem extends Component<FormItemProps> {
    constructor(props: FormItemProps) {
      super(props);
    }
  
    render(): React.Component|JSX.Element {
        const label = this.props.label;
        const text = this.props.text;
        if (label) {
            return (
                <p>
                    <label css={{ marginRight: "10px"}} key={label}>{formatTitle(label)}</label>
                    <input css={{ minWidth: "500px" }} type="text" value={text} readOnly></input>
                </p>
            )
        } else {
            return <input css={{ minWidth: "500px" }} type="text" value={text} readOnly></input>
        }
    }
  }
export default FormItem;