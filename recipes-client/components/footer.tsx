/** @jsx jsx */
import { Component } from "react";
import { jsx } from "@emotion/core";
// import {useSelector} from 'react-redux';


interface FooterProps {
    url: string|null
  }

// function sendData(){
//     const recipe = useSelector(selectAllPosts)
// }

function reset(event: React.MouseEvent<HTMLInputElement>): void{
    event.preventDefault();
    // resetForm();
    alert("Reset");
}

function submit(event: React.MouseEvent<HTMLInputElement>): void{
    event.preventDefault();
    console.log(event);
    alert("Submit");
}

class Footer extends Component<FooterProps> {
    constructor(props: FooterProps) {
      super(props);
    //   this.reset = this.reset.bind(this);
    //   this.submit = this.submit.bind(this);
    }
   
    render(): React.Component|JSX.Element{
        return (
            <form >
                <button onClick={submit}>Save</button>
                <button onClick={reset}>Reset</button>
            </form>
        )
    }
  }
  export default Footer;