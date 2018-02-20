import * as React from "react";
import {
    Form,
    FormGroup,
    FormControl,
    Button
} from "react-bootstrap";
import {updateAPI, updatePicture} from "./crud";

export default class Profile extends React.Component {

    constructor() {
        super();
        this.state = {
            file: null,
            imgSrc: "/userResources/default.jpg"
        }
        this.onChange = this.onChange.bind(this)
        this.handlePictureUpdate = this.handlePictureUpdate.bind(this)
    }

    render() {
        if (!this.isUserLoggedIn()) {
            return null;
        }
        this.getProfileSrc();
        return (
            <div>
                <Form onSubmit={this.handleAgentUpdate.bind(this)}>
                    <h3>Update Profile</h3>
                    <FormGroup>
                        <FormControl type="text" inputRef={callSign => this.callSign = callSign}
                                     placeholder="enter your call sign"/>
                        <FormControl type="date" required
                                     inputRef={dateOfBirth => this.dateOfBirth = dateOfBirth}
                                     placeholder="enter date of birth"/>
                        <Button type="submit">Submit Changes</Button>
                    </FormGroup>
                </Form>
                <img src={this.state.imgSrc}/>
                <Form encType="multipart/form-data" onSubmit={this.handlePictureUpdate.bind(this)}>
                    <FormGroup>
                        <FormControl type="file" name="file" onChange={this.onChange}/>
                        <Button type="submit">Update Picture</Button>
                    </FormGroup>
                </Form>
            </div>
        );
    }

    onChange(e) {
        this.state.file = e.target.files[0];
    }

    handlePictureUpdate(e) {
        e.preventDefault();
        var userId = window.localStorage.getItem("UserId");
        const formData = new FormData();
        formData.append('file', this.state.file);

        updatePicture("/v1/api/imageUpload", userId, formData);
        this.getProfileSrc();
    }

    handleAgentUpdate(e) {
        e.preventDefault();
        var userId = window.localStorage.getItem("UserId");
        var requestBodyJSON = {
            "callSign": this.callSign.value,
            "dateOfBirth": this.dateOfBirth.value
        }

        updateAPI("/v1/api/agents", userId, JSON.stringify(requestBodyJSON));
    }

    getProfileSrc() {
        //TODO change backend so you can just ask for a picture
        var requestBodyJSON = {
            "username": "testuser1",
            "password": "badpass"
        }

        let src = this.makeAuthenticationAPICall("/v1/token", requestBodyJSON)
            .then(response => response.json())
            .then(response => {
                let binaryData = response.picture;
                let base64String = btoa(String.fromCharCode(...new Uint8Array(binaryData)));
                console.log(binaryData);
                console.log(base64String);
                this.state.imgSrc = "data:image/png;base64,"+base64String;
            })
    }

    makeAuthenticationAPICall(apiAddress, requestBodyJSON) {
        var requestBody = JSON.stringify(requestBodyJSON);
        return fetch(apiAddress, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: requestBody
        });
    }

    //TODO later change to check if user is an agent.
    isUserLoggedIn() {
        let token = window.localStorage.getItem("Token");
        return token && true;
    }
};